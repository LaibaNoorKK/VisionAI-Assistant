import { useEffect, useState } from "react";
import { MessageSquare, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchSessions } from "../../services/chatservice";


interface ChatSession {
  id: string;
  title: string;
  isActive?: boolean;
  first_time?: string;
}


interface ChatSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  sessions?: ChatSession[];
  onSessionClick?: (sessionId: string) => void;
  onNewChat?: () => void;
  currentSessionId?: string | null;
}


const ChatSidebar = ({
  isOpen,
  onToggle,
  onSessionClick,
  onNewChat,
  currentSessionId,
  sessions: propSessions
}: ChatSidebarProps) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const loadSessions = async () => {
      try {
        setLoading(true);
        const data = await fetchSessions();
        setSessions(data);
      } catch (err) {
        console.error("❌ Failed to load sessions", err);
      } finally {
        setLoading(false);
      }
    };


    loadSessions();
  }, []);


  // Prefer sessions from parent if provided, else use locally fetched list
  const renderedSessions = (propSessions && propSessions.length > 0) ? propSessions : sessions;


  return (
    <>
      {/* Toggle Button */}
      <Button
        onClick={onToggle}
        className="fixed top-4 right-4 z-50 bg-white shadow-lg border border-gray-100 text-gray-600 hover:text-gray-800 w-10 h-10 rounded-full"
        size="sm"
      >
        <MessageSquare size={18} />
      </Button>


      {/* Sidebar */}
      <div className={`
        fixed top-0 right-0 h-full w-80 bg-[hsl(var(--sidebar-background))] shadow-2xl z-40
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <MessageSquare size={20} className="text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-800">Chat Sessions</h2>
            </div>
            <Button
              onClick={onToggle}
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={18} />
            </Button>
          </div>


          {/* New Chat Button */}
          <Button
            onClick={onNewChat}
            className="w-full mb-4 bg-[hsl(var(--category-green))] hover:bg-[hsl(var(--category-green))]/90 text-white rounded-full"
          >
            <Plus size={16} className="mr-2" />
            New Chat
          </Button>


          {/* Session List */}
          <div className="space-y-2">
            {loading ? (
              <div className="text-center py-4 text-gray-500">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400 mx-auto mb-2"></div>
                Loading sessions...
              </div>
            ) : sessions.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                No chat sessions yet
              </div>
            ) : (
              renderedSessions.map((session) => (
                <button
                  key={session.id}
                  onClick={() => onSessionClick?.(session.id)}
                  className={`
                    w-full text-left p-3 rounded-xl text-sm
                    transition-all duration-200
                    ${session.id === currentSessionId
                      ? 'bg-[hsl(var(--category-green))]/10 border-2 border-[hsl(var(--category-green))] text-[hsl(var(--category-green))]'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-600 border-2 border-transparent'
                    }
                  `}
                >
                  <div className="truncate font-medium">
                    {session.title || 'New Chat'}
                  </div>
                  {session.first_time && (
                    <div className="text-xs opacity-70 mt-1">
                      {new Date(session.first_time).toLocaleDateString()}
                    </div>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      </div>


      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30"
          onClick={onToggle}
        />
      )}
    </>
  );
};


export default ChatSidebar;
