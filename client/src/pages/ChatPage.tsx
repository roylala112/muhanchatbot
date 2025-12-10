import { useState, useEffect, useRef } from "react";
import { ChatMessage, ChatMessageProps } from "@/components/ChatMessage";
import { CategoryPills } from "@/components/CategoryPills";
import { QuickSuggestions } from "@/components/QuickSuggestions";
import { ChatInput } from "@/components/ChatInput";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Home, ArrowUp } from "lucide-react";

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
  // Add font face for the title
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
     @font-face {
    font-family: 'Presentation';
    src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/2404@1.0/Freesentation-7Bold.woff2') format('woff2');
    font-weight: 700;
    font-display: swap;
}
      .chat-title {
        font-family: 'Presentation', sans-serif;
        font-size: 1.5rem; /* Increased from default */
        font-weight: 800; /* Match the font weight with the loaded font */
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const [messages, setMessages] = useState<ChatMessageProps[]>(INITIAL_MESSAGES);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isDark, setIsDark] = useState(false);
  const [hasShownGreeting, setHasShownGreeting] = useState(() => {
    // Check if greeting was shown before using localStorage
    return localStorage.getItem('hasShownGreeting') === 'true';
  });
  
  // State to track scroll position for scroll-to-top button
  const [showScrollTop, setShowScrollTop] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Handle scroll events
  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const shouldShow = messagesContainerRef.current.scrollTop > 100;
      console.log('Scroll position:', messagesContainerRef.current.scrollTop, 'Show button:', shouldShow);
      setShowScrollTop(shouldShow);
    }
  };

  // Set up scroll event listener
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Function to scroll to top
  const scrollToTop = () => {
    messagesContainerRef.current?.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Auto-scroll to bottom when new messages arrive
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
    if (!content.trim()) return;

    const userMessage: ChatMessageProps = {
      role: "user",
      content,
      timestamp: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
    };

    // If this is the first message, add greeting message first
    if (messages.length === 0) {
      const greetingMessage: ChatMessageProps = {
        role: "assistant",
        content: `안녕하세요! 가천대학교 AI 도우미입니다.\n\n#캠퍼스맵 #학사일정 #수강신청 #교내연락처 #등록금 #편의시설 #도서관\n\n어떤 것이 궁금하신가요?`,
        timestamp: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages([greetingMessage, userMessage]);
    } else {
      setMessages(prev => [...prev, userMessage]);
    }

    // Add bot's response after a short delay
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
      
      setMessages(prev => [...prev, aiMessage]);
      setSuggestions(["추가 질문 1", "추가 질문 2", "추가 질문 3"]);
    }, 500);
  };

  const handleCategorySelect = (categoryId: string) => {
    const category = CATEGORIES.find((cat) => cat.id === categoryId);
    if (!category) return;

    const categoryName = category.label;
    const categorySuggestions = CATEGORY_SUGGESTIONS[categoryId as keyof typeof CATEGORY_SUGGESTIONS] || [];

    // Add user message with category (without # prefix)
    const userMessage: ChatMessageProps = {
      role: "user",
      content: categoryName,
      timestamp: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
    };
    
    // If this is the first message, add greeting message first
    if (messages.length === 0) {
      const greetingMessage: ChatMessageProps = {
        role: "assistant",
        content: `안녕하세요! 가천대학교 AI 도우미입니다.\n\n#캠퍼스맵 #학사일정 #수강신청 #교내연락처 #등록금 #편의시설 #도서관\n\n어떤 것이 궁금하신가요?`,
        timestamp: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages([greetingMessage, userMessage]);
    } else {
      setMessages(prev => [...prev, userMessage]);
    }
    
    // Add bot's response after a short delay
    setTimeout(() => {
      const aiMessage: ChatMessageProps = {
        role: "assistant",
        content: `${categoryName}에 대해 알려드릴까요?\n아래 질문 중 선택하시거나, 직접 질문해주세요!`,
        timestamp: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setSuggestions(categorySuggestions);
    }, 500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
    setSuggestions([]);
  };

  const handleGoHome = () => {
    setMessages([]);
    setSuggestions([]);
    // Reset the greeting state when going home
    localStorage.removeItem('hasShownGreeting');
    setHasShownGreeting(false);
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
        <h1 className="chat-title text-xl font-semibold absolute left-1/2 -translate-x-1/2">무한 Assistant</h1>
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
          {/* Category Navigation - Removed from here */}

          <div className="relative flex-1 overflow-hidden flex flex-col">
            {/* Scroll to top button - outside the scrollable area */}
            {showScrollTop && (
              <button
                onClick={scrollToTop}
                className="fixed right-6 bottom-24 md:right-8 p-3 rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-600 transition-colors z-50"
                aria-label="맨 위로 스크롤"
              >
                <ArrowUp className="h-5 w-5" />
              </button>
            )}
            
            <main 
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto px-4 md:px-8 py-6 w-full"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              <div className="w-full">
                {messages.map((msg, idx) => (
                  <ChatMessage 
                    key={idx} 
                    {...msg} 
                    onCategorySelect={handleCategorySelect}
                  />
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
            <div className="flex-shrink-0">
              <ChatInput onSendMessage={handleSendMessage} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
