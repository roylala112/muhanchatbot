import { useState, KeyboardEvent, useEffect, useRef } from "react";
import { Send, ExternalLink } from "lucide-react";
import { CollapsibleBanner } from "./CollapsibleBanner";
import * as Popover from "@radix-ui/react-popover";
import { Command } from "cmdk";
import logoImage from '../../public/images/muhani nukki.png';
import gachonLogo from '../../public/images/mudangee.png';

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
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<{id: string, label: string}[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [activeMealTab, setActiveMealTab] = useState('vision');

  // 검색창에 포커스가 갈 때 자동완성 목록 표시
  const handleFocus = () => {
    setOpen(true);
    updateSuggestions();
  };

  // 검색어에 따른 추천 검색어 업데이트
  const updateSuggestions = () => {
    if (query.length > 0) {
      const filtered = [
        { id: '1', label: `${query} 메뉴` },
        { id: '2', label: `${query} 영양 정보` },
        { id: '3', label: `${query} 카테고리` },
      ];
      setSuggestions(filtered);
    } else {
      setSuggestions([
        { id: 'rec1', label: '인기 검색어 1' },
        { id: 'rec2', label: '인기 검색어 2' },
        { id: 'rec3', label: '인기 검색어 3' }
      ]);
    }
  };

  // 검색 실행
  const handleSearch = () => {
    if (query.trim() && onSearch) {
      onSearch(query);
      setOpen(false);
    }
  };

  // 키보드 이벤트 처리
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // 카테고리 선택 처리
  const handleCategoryClick = (categoryId: string) => {
    onCategorySelect?.(categoryId);
  };

  // 오늘 날짜 포맷팅
  const getFormattedDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    const dayOfWeek = weekdays[today.getDay()];
    return `${year}년 ${month}월 ${day}일 (${dayOfWeek})`;
  };

  // 폰트 스타일 추가
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: 'PresentationLight';
        src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/2404@1.0/Freesentation-3Light.woff2') format('woff2');
        font-weight: 300;
        font-display: swap;
      }
      @font-face {
        font-family: 'Presentation';
        src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/2404@1.0/Freesentation-5Medium.woff2') format('woff2');
        font-weight: 500;
        font-display: swap;
      }
      .search-input {
        font-family: 'PresentationLight', sans-serif;
        font-size: 1.125rem;
      }
      .hashtag {
        font-family: 'Presentation', sans-serif;
        font-size: 1rem;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // 학식 메뉴 데이터
  const mealTabs = [
    {
      id: "vision",
      label: "비전타워",
      menus: [
        { item: "참치마요덮밥", price: "5,200원" },
        { item: "미역국", price: "1,000원" },
      ],
    },
    {
      id: "graduate",
      label: "교육대학원",
      menus: [
        { item: "직화불고기", price: "5,500원" },
        { item: "잡곡밥", price: "1,000원" },
      ],
    },
    {
      id: "dorm",
      label: "기숙사",
      menus: [
        { item: "치즈돈가스", price: "5,700원" },
        { item: "양배추샐러드", price: "1,200원" },
      ],
    },
  ];

  const activeMeal = mealTabs.find(tab => tab.id === activeMealTab);

  return (
    <div className="relative min-h-screen px-4 py-8" style={{ fontFamily: '"Noto Sans KR", sans-serif' }}>
      {/* 메인 콘텐츠 */}
      <div className="container mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-100px)]">
        <div className="w-full max-w-3xl mx-auto text-center">
          {/* 로고 */}
          <div className="flex justify-center mb-6">
            <img
              src={logoImage}
              alt="AI 도우미"
              className="h-auto w-48 md:w-56 max-h-64 object-contain"
              style={{ minHeight: '200px' }}
              data-testid="logo-mascot"
            />
          </div>

          {/* 검색창 */}
          <div className="w-full max-w-3xl mx-auto mb-5">
            <div 
              className="p-[1.5px] rounded-full"
              style={{
                background: "linear-gradient(90deg, #2F5093, #6AB7EC, #92C157, #EAA93D)",
                boxShadow: "0 8px 25px rgba(0, 0, 0, 0.08)",
              }}
            >
              <div className="relative w-full">
                <div className="rounded-full bg-white dark:bg-slate-800 flex items-center px-4 h-12">
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      updateSuggestions();
                    }}
                    onKeyDown={handleKeyDown}
                    onFocus={handleFocus}
                    placeholder="무엇이든 물어보세요"
                    className="flex-1 bg-transparent border-none outline-none text-base placeholder-gray-400 dark:placeholder-gray-500 search-input dark:text-white"
                  />
                  <button
                    onClick={handleSearch}
                    disabled={!query.trim()}
                    className="ml-2 p-1 rounded-full text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                    aria-label="검색"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>

                {/* 추천 검색어 드롭다운 */}
                <Popover.Root open={open} onOpenChange={setOpen}>
                  <Popover.Anchor />
                  <Popover.Portal>
                    <Popover.Content
                      className="w-[var(--radix-popover-trigger-width)] mt-2 bg-white dark:bg-slate-800 rounded-lg shadow-xl overflow-hidden border border-gray-100 dark:border-slate-700 z-50"
                      align="start"
                      sideOffset={5}
                      onOpenAutoFocus={(e) => e.preventDefault()}
                    >
                      <Command className="w-full bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
                        <Command.List className="w-full max-h-[300px] overflow-y-auto">
                          {suggestions.length > 0 ? (
                            suggestions.map((suggestion) => (
                              <Command.Item
                                key={suggestion.id}
                                value={suggestion.label}
                                onSelect={() => {
                                  setQuery(suggestion.label);
                                  setOpen(false);
                                  if (onSearch) onSearch(suggestion.label);
                                }}
                                className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-slate-700 cursor-pointer flex items-center w-full text-left"
                              >
                                {suggestion.label}
                              </Command.Item>
                            ))
                          ) : query.length > 0 ? (
                            <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                              검색어와 일치하는 결과가 없습니다.
                            </div>
                          ) : null}
                        </Command.List>
                      </Command>
                    </Popover.Content>
                  </Popover.Portal>
                </Popover.Root>
              </div>
            </div>

            {/* 카테고리 버튼들 */}
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              {categories.map((category) => (
                <button
                  key={category.id}
                  className="hashtag rounded-full bg-white/40 backdrop-blur-md px-5 py-2 text-sm shadow-sm border border-[#E4E4E7] hover:bg-white/60 hover:shadow-md transition-all duration-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700"
                  onClick={() => handleCategoryClick(category.id)}
                  data-testid={`welcome-category-${category.id}`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 우측 배너 (데스크톱 전용) */}
      <div className="hidden xl:flex flex-col gap-6 w-[380px] fixed right-8 top-32">
        {/* 오늘의 학식 배너 */}
        <CollapsibleBanner
          title="오늘의 학식"
          subtitle={getFormattedDate()}
          badgeText="업데이트 예정"
          defaultExpanded={false}
        >
          <p className="text-sm text-muted-foreground dark:text-slate-300 mb-4">
            백엔드 연동 후 실시간으로 각 식당의 메뉴와 가격이 자동으로 보여집니다.
          </p>

          <div className="flex gap-2 mb-4">
            {mealTabs.map((tab) => (
              <button
                key={tab.id}
                className={`flex-1 rounded-2xl border px-3 py-2 text-sm font-medium transition-colors ${
                  activeMealTab === tab.id
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
                onClick={() => setActiveMealTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {activeMeal?.menus.map((menu, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
                <span className="font-medium text-gray-800 dark:text-gray-200">{menu.item}</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">{menu.price}</span>
              </div>
            ))}
          </div>
        </CollapsibleBanner>

        {/* 학사 일정 배너 */}
        <CollapsibleBanner
          title="오늘의 학사일정"
          subtitle={getFormattedDate()}
          badgeText="업데이트 예정"
          defaultExpanded={false}
        >
          <p className="banner-content text-sm text-muted-foreground dark:text-slate-300 mb-4">
            백엔드 연동 후 오늘 진행 중인 주요 학사 일정을 자동으로 알려줄 예정입니다.
          </p>
          <div className="space-y-3">
            {[
              { time: "09:00 - 17:00", event: "2024학년도 2학기 수강신청" },
              { time: "10:30 - 12:00", event: "캡스톤 디자인 발표회" },
              { time: "14:00 - 16:00", event: "학부 연구생 모집 설명회" },
            ].map((item, index) => (
              <div
                key={index}
                className="p-4 rounded-2xl bg-muted/50 dark:bg-slate-800 border border-muted-foreground/20 dark:border-slate-700"
              >
                <div className="flex items-start gap-3">
                  <div className="banner-content bg-primary/10 dark:bg-primary/20 text-primary dark:text-blue-300 rounded-lg px-2.5 py-1 text-xs font-medium">
                    {item.time}
                  </div>
                  <p className="banner-content text-sm font-medium text-foreground dark:text-white">
                    {item.event}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <p className="banner-content text-xs text-muted-foreground dark:text-slate-400 text-center mt-4">
            * 학사일정은 추후 시스템 연동 후 자동 갱신됩니다.
          </p>
        </CollapsibleBanner>
      </div>

      {/* 가천대학교 로고 */}
      <div className="fixed left-20 bottom-8 z-10 group">
        <div className="relative">
          {/* 무당이 로고 */}
          <a 
            href="https://www.gachon.ac.kr/kor/index.do" 
            target="_blank" 
            rel="noopener noreferrer"
            className="absolute -top-12 -left-8 z-20"
          >
            <img 
              src={gachonLogo} 
              alt="Gachon University" 
              className="h-28 w-28 object-contain transition-transform group-hover:scale-105"
            />
          </a>
          
          {/* 버튼 */}
          <a 
            href="https://www.gachon.ac.kr/kor/index.do" 
            target="_blank" 
            rel="noopener noreferrer"
            className="relative z-10 flex items-center gap-3 bg-white dark:bg-slate-800 pl-16 pr-6 py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 border border-slate-200 dark:border-slate-700 group-hover:border-blue-500 dark:group-hover:border-blue-600"
          >
            <span className="text-2xl font-bold text-gray-800 dark:text-gray-200">
              가천대학교
            </span>
            <ExternalLink className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
          </a>
        </div>
      </div>
    </div>
  );
}
