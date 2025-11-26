import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sparkles, User } from "lucide-react";
import { SourceLink } from "./SourceLink";

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
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarFallback className="bg-primary text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}

      <div className={`flex flex-col ${isUser ? "items-end" : "items-start"} max-w-[85%] md:max-w-3xl`}>
        <div
          className={`rounded-2xl px-4 py-3 ${
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-card border border-card-border"
          }`}
          data-testid={`bubble-${role}`}
        >
          <p className="text-base leading-relaxed whitespace-pre-wrap">{content}</p>

          {sources && sources.length > 0 && (
            <div className="mt-3 pt-3 border-t border-current/10 space-y-1">
              {sources.map((source, idx) => (
                <SourceLink key={idx} title={source.title} url={source.url} />
              ))}
            </div>
          )}
        </div>

        {timestamp && (
          <span className="text-xs text-muted-foreground mt-1 px-1">
            {timestamp}
          </span>
        )}
      </div>

      {isUser && (
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarFallback className="bg-secondary text-secondary-foreground">
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
