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
  { id: "campus_map", label: "🗺️ 캠퍼스맵" },
  { id: "schedule", label: "📆 학사일정" },
  { id: "course", label: "💻 수강신청" },
  { id: "contacts", label: "☎️ 교내연락처" },
  { id: "tuition", label: "💰 등록금" },
  { id: "facilities", label: "🏪 편의시설" },
  { id: "library", label: "📖 도서관" },
];

//todo: remove mock functionality - these are category-based suggestions
const CATEGORY_SUGGESTIONS: Record<string, string[]> = {
  campus_map: ["캠퍼스 지도", "건물 위치", "주요 시설 위치", "교내 이동 경로"],
  schedule: ["학사일정 확인", "휴일/공휴일", "시험 일정", "수강신청 기간"],
  course: ["수강신청 방법", "시간표 조회", "강의 계획서", "수강정정 기간"],
  contacts: ["학과 사무실", "교수진 연락처", "행정부서 연락처", "긴급 연락처"],
  tuition: ["등록금 납부 기간", "분할납부 안내", "등록금 환불", "장학금 안내"],
  facilities: ["식당 운영시간", "카페 위치", "편의점 위치", "주차장 안내"],
  library: ["도서 검색", "열람실 예약", "도서 대출/반납", "운영시간"],
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
      campus_map: "캠퍼스맵",
      schedule: "학사일정",
      course: "수강신청",
      contacts: "교내연락처",
      tuition: "등록금",
      facilities: "편의시설",
      library: "도서관",
    };
    
    const categoryName = categoryNames[categoryId] || categoryId;
    const categorySuggestions = CATEGORY_SUGGESTIONS[categoryId] || [];
    
    //todo: remove mock functionality - add category message to conversation
    setMessages(prev => [...prev, {
      role: "assistant",
      content: `${categoryName}에 대해 알려드릴까요?\n아래 질문 중 선택하시거나, 직접 질문해주세요!`,
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
          <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6 w-full">
            <div className="w-full">
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
