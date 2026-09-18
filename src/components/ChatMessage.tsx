"use client";

import { ChatMessage as ChatMessageType } from "@/types/chat";

interface Props {
  message: ChatMessageType;
}

export default function ChatMessage({ message }: Props) {
  const isBot = message.role === "bot";

  return (
    <div className={`flex w-full ${isBot ? "justify-start" : "justify-end"} mb-4`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isBot
            ? "bg-white border border-gray-200 text-gray-800 shadow-sm"
            : "bg-blue-600 text-white shadow-sm"
        }`}
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-semibold">
            {isBot ? "🤖 MyIA" : "👤 Tú"}
          </span>
        </div>
        <div className="whitespace-pre-wrap text-sm leading-relaxed">
          {message.loading ? (
            <div className="flex items-center gap-2 text-gray-500">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
              <span>Pensando...</span>
            </div>
          ) : (
            message.content
          )}
        </div>
      </div>
    </div>
  );
}
