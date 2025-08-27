import { useState } from "react";
import { Search, Paperclip, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchInputProps {
  onSearch?: (query: string) => void;
  onAttach?: () => void;
  onBrowsePrompts?: () => void;
}

const SearchInput = ({ onSearch, onAttach, onBrowsePrompts }: SearchInputProps) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch?.(query);
      setQuery("");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <form onSubmit={handleSubmit} className="relative">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 flex items-center gap-4">
          <div className="flex-1 flex items-center gap-3">
            <Search className="text-gray-400" size={20} />
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What are you looking for?"
              className="border-0 shadow-none bg-transparent text-lg placeholder:text-gray-400 focus:ring-0 focus:outline-none"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onAttach}
              className="text-gray-500 hover:text-gray-700 flex items-center gap-2"
            >
              <Paperclip size={16} />
              Attach
            </Button>
            
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onBrowsePrompts}
              className="text-gray-500 hover:text-gray-700 flex items-center gap-2"
            >
              <FolderOpen size={16} />
              Browse Prompts
            </Button>
            
            <Button
              type="submit"
              className="bg-[hsl(var(--submit-button))] hover:bg-[hsl(var(--submit-button))]/90 text-white px-6 py-2 rounded-full font-medium shadow-lg hover-glow"
            >
              Submit
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SearchInput;