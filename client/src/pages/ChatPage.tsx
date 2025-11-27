import { useState, useEffect, useRef } from "react";
import { ChatMessage, ChatMessageProps } from "@/components/ChatMessage";
import { CategoryPills } from "@/components/CategoryPills";
import { QuickSuggestions } from "@/components/QuickSuggestions";
import { ChatInput } from "@/components/ChatInput";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Home } from "lucide-react";

//todo: remove mock functionality - these are example messages for design prototype
const INITIAL_MESSAGES: ChatMessageProps[] = [];

//todo: remove mock functionality - these are example categories
const CATEGORIES = [
  { id: "meal", label: "학식" },
  { id: "scholarship", label: "장학금" },
  { id: "schedule", label: "학사일정" },
  { id: "course", label: "수강신청" },
  { id: "seasonal", label: "계절학기" },
  { id: "leave", label: "휴학" },
  { id: "return", label: "복학" },
  { id: "tuition", label: "등록금" },
];

//todo: remove mock functionality - these are category-based suggestions
const CATEGORY_SUGGESTIONS: Record<string, string[]> = {
  course: ["일정", "방법", "우선순위", "유의사항"],
  scholarship: ["신청 방법", "자격 요건", "지급 시기", "종류"],
  leave: ["신청 기간", "필요 서류", "등록금 환불", "최대 기간"],
};

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessageProps[]>(INITIAL_MESSAGES);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isDark, setIsDark] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const handleSendMessage = (content: string) => {
    const userMessage: ChatMessageProps = {
      role: "user",
      content,
      timestamp: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);

    //todo: remove mock functionality - this simulates AI response
    setTimeout(() => {
      const aiMessage: ChatMessageProps = {
        role: "assistant",
        content: `${content}에 대한 답변입니다.\n\n현재는 프로토타입 단계로 실제 AI 응답은 백엔드 연동 후 제공됩니다.`,
        timestamp: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
        sources: [
          { title: "학사안내 공지사항", url: "#" },
          { title: "관련 PDF 문서", url: "#" },
        ],
      };
      setMessages((prev) => [...prev, aiMessage]);
      setSuggestions(["추가 질문 1", "추가 질문 2", "추가 질문 3"]);
    }, 1000);
  };

  const handleCategorySelect = (categoryId: string) => {
    //todo: remove mock functionality - category names mapping
    const categoryNames: Record<string, string> = {
      scholarship: "장학금",
      schedule: "학사일정",
      course: "수강신청",
      seasonal: "계절학기",
      leave: "휴학",
      return: "복학",
      tuition: "등록금",
    };
    
    const categoryName = categoryNames[categoryId] || categoryId;
    const categorySuggestions = CATEGORY_SUGGESTIONS[categoryId] || [];
    
    //todo: remove mock functionality - add category message to conversation
    setMessages(prev => [...prev, {
      role: "assistant",
      content: `#${categoryName}에 대해 알려드릴까요?\n아래 질문 중 선택하시거나, 직접 질문해주세요!`,
      timestamp: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
    }]);
    
    setSuggestions(categorySuggestions);
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
    setSuggestions([]);
  };

  const handleGoHome = () => {
    setMessages([]);
    setSuggestions([]);
    console.log("Returning to home screen");
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="relative h-16 border-b border-border flex items-center justify-between px-4 md:px-8 flex-shrink-0">
        <div className="flex items-center gap-3 flex-shrink-0">
          {messages.length > 0 && (
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={handleGoHome}
              data-testid="button-home"
            >
              <Home className="h-5 w-5" />
            </Button>
          )}
        </div>
        <h1 className="text-xl font-semibold absolute left-1/2 -translate-x-1/2">가천대학교 AI 도우미</h1>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setIsDark(!isDark)}
          className="flex-shrink-0"
          data-testid="button-theme-toggle"
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </header>

      {messages.length === 0 ? (
        /* Welcome Screen */
        <main className="flex-1 overflow-y-auto">
          <WelcomeScreen
            categories={CATEGORIES}
            onSearch={handleSendMessage}
            onCategorySelect={handleCategorySelect}
          />
        </main>
      ) : (
        <>
          {/* Category Navigation */}
          <div className="sticky top-0 z-10 bg-background border-b border-border py-3 flex-shrink-0 flex justify-center">
            <CategoryPills categories={CATEGORIES} onCategorySelect={handleCategorySelect} />
          </div>

          {/* Messages Container */}
          <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
            <div className="mx-auto max-w-4xl">
              {messages.map((msg, idx) => (
                <ChatMessage key={idx} {...msg} />
              ))}

              {suggestions.length > 0 && (
                <div className="mb-4 pl-11">
                  <QuickSuggestions
                    suggestions={suggestions}
                    onSuggestionClick={handleSuggestionClick}
                  />
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </main>

          {/* Input Area */}
          <ChatInput onSendMessage={handleSendMessage} />
        </>
      )}
    </div>
  );
}
