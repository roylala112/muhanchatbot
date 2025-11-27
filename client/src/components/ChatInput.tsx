import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useState, KeyboardEvent } from "react";

export interface ChatInputProps {
  onSendMessage?: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function ChatInput({ onSendMessage, placeholder = "무엇이든 물어보세요", disabled = false }: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage?.(message);
      console.log(`Sending message: ${message}`);
      setMessage("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-background/80 backdrop-blur-sm px-4 py-4 md:px-8 md:pb-6">
      <div className="mx-auto max-w-4xl">
        <div 
          className="p-[1.5px] rounded-full w-full"
          style={{
            background: "linear-gradient(90deg, #2F5093, #6AB7EC, #92C157, #EAA93D)",
            boxShadow: "0 8px 25px rgba(0, 0, 0, 0.08)",
          }}
        >
          <div className="bg-white dark:bg-slate-800 rounded-full flex items-center px-4 h-12">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled}
              className="flex-1 text-base bg-transparent outline-none border-none 
                focus:outline-none focus:ring-0 focus:border-none
                dark:text-white dark:placeholder-gray-400"
              data-testid="input-message"
            />
            <button
              onClick={handleSend}
              disabled={!message.trim() || disabled}
              className="hover:opacity-80 transition disabled:opacity-40"
              data-testid="button-send"
            >
              <Send className="h-5 w-5 text-[#43609C] dark:text-blue-300" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
