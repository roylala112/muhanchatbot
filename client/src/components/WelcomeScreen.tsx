import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { useState, KeyboardEvent } from "react";
import logoImage from "@assets/mascot.png";

export interface Category {
  id: string;
  label: string;
}

export interface WelcomeScreenProps {
  categories: Category[];
  onSearch?: (query: string) => void;
  onCategorySelect?: (categoryId: string) => void;
}

export function WelcomeScreen({ categories, onSearch, onCategorySelect }: WelcomeScreenProps) {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (query.trim()) {
      onSearch?.(query);
      console.log(`Search query: ${query}`);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    onCategorySelect?.(categoryId);
    console.log(`Category selected: ${categoryId}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 py-8">
      {/* Logo */}
      <div className="mb-6">
        <img 
          src={logoImage} 
          alt="AI 도우미" 
          className="h-48 w-48 md:h-56 md:w-56"
          data-testid="logo-mascot"
        />
      </div>

      {/* Search Input */}
      <div className="w-full max-w-2xl mb-6">
        <div className="relative">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="무엇이든 물어보세요"
            className="w-full rounded-full pl-6 pr-14 py-7 text-base border-2 border-primary/30 bg-background shadow-sm focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary"
            data-testid="input-welcome-search"
          />
          <button
            onClick={handleSearch}
            className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center hover:opacity-80 transition-opacity"
            data-testid="button-welcome-search"
          >
            <Search className="h-9 w-9 text-primary" />
          </button>
        </div>
      </div>

      {/* Category Grid */}
      <div className="flex flex-wrap justify-center gap-3 max-w-2xl">
        {categories.map((category) => (
          <button
            key={category.id}
            className="bg-[#5b6b9e] hover:bg-[#6b7bae] active:bg-[#4b5b8e] text-white rounded-lg px-6 py-3 text-base font-semibold transition-colors shadow-sm"
            onClick={() => handleCategoryClick(category.id)}
            data-testid={`welcome-category-${category.id}`}
          >
            #{category.label}
          </button>
        ))}
      </div>
    </div>
  );
}
