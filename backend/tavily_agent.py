from langchain_tavily import TavilySearch
from langchain_openai import ChatOpenAI
from langgraph.prebuilt import create_react_agent
import os
from dotenv import load_dotenv
from langchain_core.messages import ToolMessage
from langgraph.graph import MessagesState
from typing import Optional
from langchain_core.runnables import RunnableConfig
from datetime import date
import logging
today = date.today().strftime("%B %d, %Y")
# Load environment variables
load_dotenv()
tavily_key = os.getenv("TAVILY_API_KEY")

# Set Tavily key as an environment variable for the tool to work
if tavily_key:
    os.environ["TAVILY_API_KEY"] = tavily_key

# Create the Tavily Search Tool (guard when key missing or network errors)
try:
    # You can tweak these defaults as needed
    search_tool = TavilySearch(max_results=3, search_depth="basic")
except Exception as e:
    logging.warning("Tavily tool not available: %s", e)
    search_tool = None

# Define LLM

llm = ChatOpenAI(model="gpt-4.1", temperature=0.7)

if search_tool is not None:
    internet_agent_system_prompt = f"""
You are an AI assistant that uses a search engine to provide up-to-date and accurate information from the internet.

CRITICAL DATE CONTEXT: Today is {today}.

IMPORTANT RULES:
- ONLY provide admission deadlines, application dates, or academic calendar information that are CURRENT and in the future relative to {today}
- If you find information about past dates (like 2024 deadlines), explicitly state that this information is outdated and search for current information
- For university admissions, always verify the most recent intake dates and application deadlines
- If you cannot find current information, clearly state that the information may be outdated and recommend contacting the university directly

MUST USE THE Tavily search tool to get the latest results for any query that concerns real-time or current information (e.g., weather, deadlines, news, rankings, intake dates). Do not answer from memory for such queries. Call the tool at least once and base the answer on the results, citing the source URLs you used.
If the user's request does not require current information (general guidance, definitions), you may answer directly, but prefer confirming facts with at least one tool call when in doubt.

Be detailed and cite relevant details from the links (include the source URLs).
Provide concise, well-structured responses with bold headings and bullet points where useful.
Always end responses with helpful tips for international students and a follow-up question.
"""
else:
    # Fallback prompt when internet tool is unavailable
    internet_agent_system_prompt = f"""
You are an AI assistant without live web access right now (the internet tool is unavailable).
Answer based on reliable background knowledge and clearly state that web lookups are temporarily unavailable.
Use concise, well-structured formatting with bold headings and bullet points. Avoid fabricating current deadlines; suggest contacting the university directly for verification.
Date context: {today}.
"""

# Wrap with LangGraph ReAct agent
tools_list = [t for t in [search_tool] if t is not None]

internet_agent_executor = create_react_agent(
    model=llm,
    tools=tools_list,
    name="internet_agent",
    prompt=internet_agent_system_prompt
)

def internet_agent_node(state: MessagesState, config: Optional[RunnableConfig] = None) -> ToolMessage:
    tool_call_id = None
    for msg in state["messages"]:
        tool_calls = getattr(msg, "tool_calls", None)
        if tool_calls and len(tool_calls) > 0:
            tool_call_id = tool_calls[0]["id"]
            break

    if not tool_call_id:
        tool_call_id = "unknown"
    # Add a conservative recursion/time limit to avoid hanging streams in LangSmith
    safe_config = config or RunnableConfig(max_concurrency=1)
    result_message = internet_agent_executor.invoke(state, config=safe_config)
    content = getattr(result_message, "content", str(result_message))
    return ToolMessage(tool_call_id=tool_call_id, content=content)