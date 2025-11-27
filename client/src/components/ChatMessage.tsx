import { SourceLink } from "./SourceLink";
import mascotImage from "C:/Users/user/OneDrive/Pictures/무한이 누끼.png";

export interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  sources?: Array<{ title: string; url: string }>;
  timestamp?: string;
}

export function ChatMessage({ role, content, sources, timestamp }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"} mb-4`}
      data-testid={`message-${role}`}
    >
      {!isUser && (
        <div className="flex-shrink-0">
          <img 
            src={mascotImage} 
            alt="마스코트" 
            className="h-12 w-12 object-contain"
          />
        </div>
      )}

      <div className={`flex flex-col ${isUser ? "items-end" : "items-start"} max-w-[85%] md:max-w-3xl`}>
        {isUser ? (
          <div className="bg-[#E0E0E0] dark:bg-[#202A44] text-foreground dark:text-white rounded-3xl px-5 py-3">
            <p className="text-base leading-relaxed whitespace-pre-wrap">{content}</p>
            {sources && sources.length > 0 && (
              <div className="mt-3 pt-3 border-t border-current/10 space-y-1">
                {sources.map((source, idx) => (
                  <SourceLink key={idx} title={source.title} url={source.url} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div 
            className="p-[1.5px] rounded-3xl"
            style={{
              background: "linear-gradient(90deg, #2F5093, #6AB7EC, #92C157, #EAA93D)",
              boxShadow: "0 8px 25px rgba(0, 0, 0, 0.08)",
            }}
          >
            <div className="bg-white dark:bg-slate-800 rounded-[22px] px-5 py-3">
              <p className="text-base leading-relaxed whitespace-pre-wrap">{content}</p>
              {sources && sources.length > 0 && (
                <div className="mt-3 pt-3 border-t border-current/10 space-y-1">
                  {sources.map((source, idx) => (
                    <SourceLink key={idx} title={source.title} url={source.url} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {timestamp && (
        <span className="text-xs text-muted-foreground mt-1 px-1">
          {timestamp}
        </span>
      )}
    </div>
  );
}
