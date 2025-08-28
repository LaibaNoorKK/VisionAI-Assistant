import logging
from dotenv import load_dotenv
from langchain_core.messages import HumanMessage
from langgraph.graph import StateGraph, START, END, MessagesState
from langgraph.prebuilt import create_react_agent
from langchain_core.runnables.config import RunnableConfig

from qna_data import PREDEFINED_QAS
from tavily_agent import internet_agent_executor
from langgraph_swarm import create_handoff_tool
from chat_history import get_psycopg_connection, SimplePostgresChatMessageHistory
from psycopg2.extras import RealDictCursor
# Load env vars
load_dotenv()

# Define handoff tool
assign_to_internet = create_handoff_tool(agent_name="internet_agent")

# Supervisor agent
supervisor_agent = create_react_agent(
    model="openai:gpt-4.1",
    tools=[assign_to_internet],
    prompt=(
        "You are Malaysia's Supervisor AI Agent. Always begin with a friendly greeting. "
        "Only answer questions strictly related to studying in Malaysia, student life, or Malaysian culture in a study context. "
        "When responding, prefer concise, well-structured formatting: use bold headings, bullet points, and short paragraphs. "
        "If a user asks for CURRENT or REAL-TIME information (e.g., 'today', 'current', 'latest', 'weather', 'deadline', 'intake', 'ranking this year'), you MUST hand off to the Internet Research Agent. "
        "If you hand off to the Internet Research Agent, summarize results clearly and keep the same formatting. "
        "TOOL: Internet Research Agent: Conducts latest web-based searches to gather responses."
    ),
    name="supervisor",
)

# Build LangGraph
MAX_DEPTH = 10
supervisor = (
    StateGraph(MessagesState)
    .add_node("supervisor", supervisor_agent)
    .add_node("internet_agent", internet_agent_executor)
    .add_edge(START, "supervisor")
    .add_edge("internet_agent", END)
    .compile()
)

# Core function (this is what Flask will call)
def run_supervisor(input_text, history):
    history.add_user_message(input_text)
    messages = history.messages[-MAX_DEPTH:]
    input_state = MessagesState(messages=messages)
    config = RunnableConfig(recursion_limit=MAX_DEPTH)

    try:
        for output in supervisor.stream(input_state, config=config):
            last_output = output
    except Exception as e:
        logging.exception("Error running supervisor")
        return f"❌ Unexpected error: {e}"

    for source in ["supervisor", "internet_agent"]:
        if source in last_output:
            for msg in reversed(last_output[source].get("messages", [])):
                if hasattr(msg, "content") and msg.content:
                    history.add_ai_message(msg.content)
                    return msg.content
    return "📡 No content returned."

def create_new_chat_session(user_id):
    """
    Create a new chat session for the given user.
    Saves the session to the database using psycopg2.
    Returns the new session_id.
    """
    import uuid
    session_id = str(uuid.uuid4())
    with get_psycopg_connection() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            query = """
                INSERT INTO chat_sessions (user_id, session_id)
                VALUES (%s, %s)
            """
            cur.execute(query, (user_id, session_id))
        conn.commit()
    return session_id