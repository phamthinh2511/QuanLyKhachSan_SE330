"use client";

import { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Bot, User, Trash2, Loader2, Sparkles } from "lucide-react";
import { askChatbot } from "@/lib/api/ai";
import clsx from "clsx";

interface MessageType {
  sender: "user" | "ai";
  text: string;
  time: string;
}

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("hotel_ai_chat_history");
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        console.error("Lỗi parse lịch sử chat", e);
      }
    } else {
      // Tin nhắn chào mừng mặc định
      setMessages([
        {
          sender: "ai",
          text: "Xin chào! Tôi là Trợ lý ảo AI của Khách sạn. Tôi nắm rõ thông tin phòng trống và dịch vụ theo thời gian thực. Tôi có thể giúp gì cho bạn hôm nay?",
          time: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }
  }, []);

  // Save to localStorage when messages change
  const saveMessages = (newMessages: MessageType[]) => {
    setMessages(newMessages);
    localStorage.setItem("hotel_ai_chat_history", JSON.stringify(newMessages));
  };

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput("");

    const now = new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
    const userMsg: MessageType = { sender: "user", text: userText, time: now };
    const updatedMessages = [...messages, userMsg];
    saveMessages(updatedMessages);

    setLoading(true);
    try {
      const reply = await askChatbot(userText);
      const aiMsg: MessageType = { sender: "ai", text: reply, time: now };
      saveMessages([...updatedMessages, aiMsg]);
    } catch (err: any) {
      const errorMsg: MessageType = {
        sender: "ai",
        text: err.message || "Xin lỗi, đã xảy ra lỗi khi kết nối tới máy chủ.",
        time: now,
      };
      saveMessages([...updatedMessages, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    if (confirm("Bạn có chắc muốn xóa lịch sử cuộc trò chuyện này?")) {
      const now = new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
      const initial: MessageType[] = [
        {
          sender: "ai",
          text: "Lịch sử đã được dọn sạch. Tôi có thể giúp gì thêm cho bạn?",
          time: now,
        },
      ];
      saveMessages(initial);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Cửa sổ chat */}
      {isOpen && (
        <div className="w-[380px] h-[500px] bg-white border border-gray-100 rounded-2xl shadow-2xl flex flex-col mb-4 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-blue-600 text-white px-5 py-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="bg-white/20 p-1.5 rounded-lg">
                <Sparkles className="w-5 h-5 text-white animate-pulse" />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-wide">Trợ lý ảo Khách Sạn</h3>
                <p className="text-[10px] text-blue-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-ping" />
                  Đang trực tuyến
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleClear}
                className="p-1.5 hover:bg-white/20 rounded-lg transition text-white/80 hover:text-white"
                title="Xóa lịch sử"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/20 rounded-lg transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages container */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50 space-y-3.5">
            {messages.map((msg, index) => {
              const isAi = msg.sender === "ai";
              return (
                <div
                  key={index}
                  className={clsx(
                    "flex gap-2.5 max-w-[85%]",
                    isAi ? "mr-auto" : "ml-auto flex-row-reverse"
                  )}
                >
                  <div
                    className={clsx(
                      "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-white shadow-sm",
                      isAi ? "bg-blue-500" : "bg-gray-600"
                    )}
                  >
                    {isAi ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>
                  <div className="space-y-1">
                    <div
                      className={clsx(
                        "p-3 rounded-2xl text-xs leading-relaxed shadow-sm whitespace-pre-line",
                        isAi
                          ? "bg-white text-gray-800 rounded-tl-none border border-gray-100"
                          : "bg-blue-600 text-white rounded-tr-none"
                      )}
                    >
                      {msg.text}
                    </div>
                    <p
                      className={clsx(
                        "text-[9px] text-gray-400",
                        isAi ? "text-left" : "text-right"
                      )}
                    >
                      {msg.time}
                    </p>
                  </div>
                </div>
              );
            })}
            
            {/* Loading typing indicator */}
            {loading && (
              <div className="flex gap-2.5 max-w-[85%] mr-auto">
                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 bg-blue-500 text-white shadow-sm">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <div className="p-3 bg-white border border-gray-100 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 text-blue-500 animate-spin" />
                    <span className="text-xs text-gray-500 italic">Đang phân tích dữ liệu phòng...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Form input */}
          <form onSubmit={handleSend} className="p-3 border-t border-gray-100 bg-white flex gap-2">
            <input
              type="text"
              placeholder="Hỏi về phòng trống, loại phòng Deluxe, giá cả..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-xl transition flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Action Button (FAB) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          "w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl transition-all duration-300 hover:scale-105 active:scale-95",
          isOpen ? "bg-red-500 hover:bg-red-600" : "bg-blue-600 hover:bg-blue-700"
        )}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6 animate-bounce" />}
      </button>
    </div>
  );
}
