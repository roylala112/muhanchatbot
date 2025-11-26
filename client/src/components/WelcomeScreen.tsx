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
  const [activeMealTab, setActiveMealTab] = useState(mealTabs[0].id);
  const activeMeal = mealTabs.find((tab) => tab.id === activeMealTab);

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
    <div className="min-h-[70vh] px-4 py-8 flex justify-center">
      <div className="w-full flex flex-col items-center gap-10 lg:grid lg:grid-cols-[minmax(0,520px)_minmax(0,760px)_minmax(0,420px)] lg:items-start lg:justify-items-center">
        {/* Today's Meal Banner */}
        <div className="hidden lg:flex w-full justify-start pl-10">
          <div className="w-full max-w-[760px] bg-white border border-primary/20 rounded-3xl px-8 py-6 shadow-md flex flex-col gap-4 text-left">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-primary/70 font-semibold">캠퍼스 다이닝</p>
                <h2 className="text-3xl font-bold text-primary">오늘의 학식</h2>
              </div>
              <Badge variant="secondary" className="bg-primary/10 text-primary border-none px-3 py-1">
                업데이트 예정
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground">
              백엔드 연동 후 실시간으로 각 식당의 메뉴와 가격이 자동으로 보여집니다.
            </p>

            <div className="flex gap-2">
              {mealTabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`flex-1 rounded-2xl border px-3 py-2 text-sm font-semibold transition-colors ${
                    activeMealTab === tab.id
                      ? "bg-primary text-white border-primary shadow"
                      : "bg-muted border-muted-foreground/20 text-muted-foreground hover:border-primary/50"
                  }`}
                  onClick={() => setActiveMealTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="space-y-3" data-testid="today-meal-table">
              {activeMeal?.menus.map((menu) => (
                <div
                  key={menu.item}
                  className="p-4 rounded-2xl bg-muted/50 border border-muted-foreground/20 flex items-center justify-between"
                >
                  <span className="text-base font-semibold text-primary">{menu.item}</span>
                  <span className="text-sm font-semibold text-muted-foreground">{menu.price}</span>
                </div>
              ))}
            </div>

            <p className="text-xs text-muted-foreground text-center">
              * 실제 메뉴는 추후 시스템 연동 후 자동 갱신됩니다.
            </p>
          </div>
        </div>

        <div className="w-full max-w-2xl flex flex-col items-center text-center mx-auto">
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
          <div className="w-full mb-6">
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
          <div className="flex flex-wrap justify-center gap-3">
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

        {/* Right Placeholder */}
        <div className="hidden lg:flex w-full justify-end pr-10">
          <div className="w-full max-w-[420px] bg-white border border-primary/20 rounded-3xl p-6 shadow-md flex flex-col gap-4 text-left">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-primary/70 font-semibold">캠퍼스 캘린더</p>
                <h3 className="text-2xl font-bold text-primary">오늘의 학사일정</h3>
              </div>
              <Badge variant="secondary" className="bg-primary/10 text-primary border-none">
                업데이트 예정
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              백엔드 연동 후 오늘 진행 중인 주요 학사 일정을 자동으로 알려줄 예정입니다.
            </p>
            <div className="space-y-3">
              {[
                { title: "기말고사 D-3 안내", time: "09:00 • 공지사항" },
                { title: "비전타워 취업특강", time: "13:00 • 비전타워 202호" },
                { title: "기숙사 사생 회의", time: "18:30 • 온라인" },
              ].map((schedule) => (
                <div key={schedule.title} className="p-3 rounded-2xl bg-muted/60 border border-muted">
                  <p className="text-sm font-semibold text-primary">{schedule.title}</p>
                  <p className="text-xs text-muted-foreground">{schedule.time}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground text-center">
              * 실제 일정은 추후 시스템 연동 후 자동 갱신됩니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
