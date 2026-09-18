"use client";

import { useState, useRef } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import ChatMenu, { ChatMenuRef } from "./ChatMenu";
import { ChatMessage as ChatMessageType, ChatResponse } from "@/types/chat";

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessageType[]>([
    {
      id: "welcome",
      role: "bot",
      content: "Hola, soy MyIA ChatBot. ¿Qué deseas consultar?\n\nTe presento un menú con las opciones disponibles. Selecciona una para comenzar.",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [menuResetKey, setMenuResetKey] = useState(0);
  const chatMenuRef = useRef<ChatMenuRef>(null);

  const sendMessage = async (text: string) => {
    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      role: "user",
      content: text,
    };

    const loadingMessage: ChatMessageType = {
      id: (Date.now() + 1).toString(),
      role: "bot",
      content: "",
      loading: true,
    };

    setMessages((prev) => [...prev, userMessage, loadingMessage]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const data: ChatResponse = await res.json();

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingMessage.id
            ? {
                id: msg.id,
                role: "bot",
                content: data.message,
                alert: data.alert,
              }
            : msg
        )
      );
    } catch {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingMessage.id
            ? {
                id: msg.id,
                role: "bot",
                content: "Lo siento, ocurrió un error al procesar tu consulta.",
              }
            : msg
        )
      );
    } finally {
      setLoading(false);
      setMenuResetKey((prev) => prev + 1);
    }
  };

  const processInput = (text: string) => {
    const trimmed = text.trim();
    const num = parseInt(trimmed);

    // Si es un número válido del menú actual, ejecutar esa opción
    if (!isNaN(num) && num > 0 && chatMenuRef.current) {
      const count = chatMenuRef.current.getOptionCount();
      if (num <= count) {
        chatMenuRef.current.selectOption(num);
        return;
      }
    }

    // Si no es número de menú, procesar como mensaje normal
    sendMessage(text);
  };

  return (
    <div className="flex flex-col h-[600px] max-h-[80vh] w-full max-w-2xl mx-auto bg-gray-50 rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-blue-600 text-white px-6 py-4 text-center">
        <h1 className="text-xl font-bold">MyIA ChatBot</h1>
        <p className="text-xs text-blue-100 mt-1">Consultas de inventario y ventas</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        <ChatMenu
          ref={chatMenuRef}
          onSendMessage={sendMessage}
          disabled={loading}
          resetKey={menuResetKey}
        />
      </div>

      <ChatInput onSend={processInput} disabled={loading} />
    </div>
  );
}
