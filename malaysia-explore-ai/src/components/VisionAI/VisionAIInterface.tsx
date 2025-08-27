import { useState, useEffect, useRef } from "react";
import RobotMascot from "./RobotMascot";
import MainHeading from "./MainHeading";
import CategoryButtons from "./CategoryButtons";
import SearchInput from "./SearchInput";
import ChatSidebar from "./ChatSidebar";
import { fetchSessionsWithToken, sendMessageWithToken } from "../../api";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface VisionAIInterfaceProps {
  userName?: string;
  token?: string;
}

const VisionAIInterface = ({ userName = "Ammar", token = "" }: VisionAIInterfaceProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sessions, setSessions] = useState<{ id: string; title: string }[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Load chat sessions for sidebar
    fetchSessionsWithToken(token).then(setSessions).catch(() => {});
  }, []);

  const handleCategoryClick = (categoryId: string) => {
    console.log("Category clicked:", categoryId);
    setShowChat(true); // Show chat section
    // Send category as a message
    handleSendMessage(`I'm interested in ${categoryId}`);
  };

  const handleSearch = (query: string) => {
    console.log("Search query:", query);
    setShowChat(true); // Show chat section
    handleSendMessage(query);
  };

  const handleQuestionClick = (question: string) => {
    console.log("Question clicked:", question);
    setShowChat(true); // Show chat section
    handleSendMessage(question);
  };

  const handleAttach = () => {
    console.log("Attach clicked");
    // Handle file attachment
  };

  const handleBrowsePrompts = () => {
    console.log("Browse prompts clicked");
    // Handle browse prompts
  };

  const handleSessionClick = (sessionId: string) => {
    console.log("Session clicked:", sessionId);
    // Handle session selection
  };

  const handleNewChat = () => {
    console.log("New chat clicked");
    setMessages([]);
    setShowChat(false); // Hide chat section, show category buttons
  };

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: message,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await sendMessageWithToken(message, token);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.reply || "I'm sorry, I couldn't process your request.",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I'm having trouble connecting to the server. Please try again.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Minimal markdown formatter for assistant messages (bold, bullets, line breaks)
  const simpleMarkdownToHtml = (md: string) => {
    let html = md.trim();
    // Bold **text**
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1<\/strong>');
    // Convert lines starting with - or * to list items
    const lines = html.split(/\r?\n/);
    const converted: string[] = [];
    let inList = false;
    for (const line of lines) {
      const m = line.match(/^\s*[-*]\s+(.*)$/);
      if (m) {
        if (!inList) { converted.push('<ul>'); inList = true; }
        converted.push(`<li>${m[1]}</li>`);
      } else {
        if (inList) { converted.push('</ul>'); inList = false; }
        // Preserve paragraph breaks
        if (line.trim().length === 0) converted.push('<br/>');
        else converted.push(`<p>${line}</p>`);
      }
    }
    if (inList) converted.push('</ul>');
    return converted.join('');
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-gray-50">
      {/* Header with branding */}
      <header className="py-6 px-4 bg-white shadow-sm">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-700">
            VisionAI <span className="text-gray-400 font-normal">Assistant</span>
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 pb-12">
        <div className="max-w-6xl mx-auto">
          {/* Robot Mascot */}
          <RobotMascot userName={userName} />
          
          {/* Main Heading */}
          <MainHeading userName={userName} />
          
          {/* Category Buttons - Only show when no chat is active */}
          {!showChat && (
            <CategoryButtons onCategoryClick={handleCategoryClick} />
          )}
          
          {/* Chat Messages - Show above input when chat is active */}
          {showChat && (
            <div className="mt-8 max-w-4xl mx-auto mb-6">
              <div className="border border-gray-200 rounded-lg p-6 min-h-[400px] max-h-[600px] overflow-y-auto bg-white">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <p>Start a conversation with VisionAI Assistant!</p>
                    <p className="text-sm mt-2">Ask me anything about universities, admissions, or academic guidance.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg px-4 py-2 ${
                            message.role === "user"
                              ? "bg-blue-500 text-white"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {message.role === "assistant" ? (
                            <div className="text-sm prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: simpleMarkdownToHtml(message.content) }} />
                          ) : (
                            <p className="text-sm whitespace-pre-line">{message.content}</p>
                          )}
                          <p className="text-xs opacity-70 mt-1">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-gray-100 text-gray-800 rounded-lg px-4 py-2 flex items-center gap-2">
                          <span className="sr-only">Processing...</span>
                          <div className="flex items-end gap-1">
                            <span className="inline-block w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                            <span className="inline-block w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                            <span className="inline-block w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                          </div>
                          <p className="text-sm">Processing</p>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Search Input */}
          <div className="flex justify-center">
            <SearchInput 
              onSearch={handleSearch}
              onAttach={handleAttach}
              onBrowsePrompts={handleBrowsePrompts}
            />
          </div>
        </div>
      </main>

      {/* Chat Sidebar */}
      <ChatSidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        sessions={sessions.map((s, i) => ({ id: s.id, title: s.title, isActive: false }))}
        onSessionClick={handleSessionClick}
        onNewChat={handleNewChat}
      />
    </div>
  );
};

export default VisionAIInterface;