import { useEffect, useState } from "react";
import { MessageSquare, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchSessionsWithToken } from "../../api"; // adjust import

interface ChatSession {
  id: string;
  title: string;
  isActive?: boolean;
}

interface ChatSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  sessions?: ChatSession[];
  onSessionClick?: (sessionId: string) => void;
  onNewChat?: () => void;
}


const ChatSidebar = ({ 
  isOpen, 
  onToggle, 
  onSessionClick, 
  onNewChat 
}: ChatSidebarProps) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSessions = async () => {
      try {
        const data = await fetchSessionsWithToken(); // uses cookie session
        setSessions(data);
      } catch (err) {
        console.error("❌ Failed to load sessions", err);
      } finally {
        setLoading(false);
      }
    };

    loadSessions();
  }, []);
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
            {sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => onSessionClick?.(session.id)}
                className={`
                  w-full text-left p-3 rounded-xl text-sm
                  transition-all duration-200
                  ${session.isActive 
                    ? 'bg-[hsl(var(--category-green))]/10 border-2 border-[hsl(var(--category-green))] text-[hsl(var(--category-green))]' 
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-600 border-2 border-transparent'
                  }
                `}
              >
                <div className="truncate">
                  {session.title}
                </div>
              </button>
            ))}
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