"use client";

import { useState, useRef, useEffect } from "react";
import { aiService } from "@/services";
import { ChatSession, ChatMessage } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import {
  Send,
  Plus,
  MessageSquare,
  Bot,
  User,
  Sparkles,
  Loader2,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ChatPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadSessions();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadSessions = async () => {
    try {
      const res = await aiService.getChatSessions();
      if (res.data.data) {
        setSessions(res.data.data.sessions);
      }
    } catch {
      console.error("Failed to load sessions");
    } finally {
      setIsLoadingSessions(false);
    }
  };

  const loadMessages = async (sessionId: string) => {
    setIsLoadingMessages(true);
    setActiveSession(sessionId);
    try {
      const res = await aiService.getChatMessages(sessionId);
      if (res.data.data) {
        setMessages(res.data.data.session.messages);
      }
    } catch {
      toast("Gagal memuat pesan.", "error");
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const startNewChat = () => {
    setActiveSession(null);
    setMessages([]);
    inputRef.current?.focus();
  };

  const handleSend = async () => {
    if (!inputMessage.trim() || isSending) return;

    const userMsg = inputMessage.trim();
    setInputMessage("");
    setIsSending(true);

    // Optimistic UI: add user message immediately
    const tempUserMsg: ChatMessage = {
      id: `temp-${Date.now()}`,
      sessionId: activeSession || "",
      role: "USER",
      content: userMsg,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const res = await aiService.chat(userMsg, activeSession || undefined);
      if (res.data.data) {
        const { sessionId, message } = res.data.data;

        if (!activeSession) {
          setActiveSession(sessionId);
          loadSessions(); // refresh session list
        }

        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          sessionId,
          role: "ASSISTANT",
          content: message,
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, aiMsg]);
      }
    } catch {
      toast("Gagal mengirim pesan. Coba lagi.", "error");
      // Remove optimistic message on error
      setMessages((prev) => prev.filter((m) => m.id !== tempUserMsg.id));
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatMessageContent = (content: string) => {
    // Simple markdown-like formatting
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br/>');
  };

  return (
    <div className="h-[calc(100vh-4rem)] lg:h-[calc(100vh-4rem)] flex gap-4 animate-fade-in">
      {/* Session Sidebar */}
      <Card
        className={cn(
          "glass-card flex-shrink-0 flex flex-col overflow-hidden transition-all duration-300",
          showSidebar ? "w-72" : "w-0 border-0 p-0",
          "hidden lg:flex"
        )}
      >
        <div className="p-4 border-b border-white/[0.06]">
          <Button onClick={startNewChat} className="w-full" variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" /> Percakapan Baru
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {isLoadingSessions ? (
            <div className="space-y-2 p-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 rounded-lg" />
              ))}
            </div>
          ) : sessions.length > 0 ? (
            <div className="space-y-1">
              {sessions.map((session) => (
                <button
                  key={session.id}
                  onClick={() => loadMessages(session.id)}
                  className={cn(
                    "w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group",
                    activeSession === session.id
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04]"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{session.title}</span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-40" />
              <p className="text-xs">Belum ada percakapan</p>
            </div>
          )}
        </div>
      </Card>

      {/* Chat Area */}
      <Card className="glass-card flex-1 flex flex-col overflow-hidden">
        {/* Chat Header */}
        <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-3">
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-white/[0.06] transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-violet-500 to-purple-400 flex items-center justify-center">
            <Bot className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-semibold">FinAI Assistant</h2>
            <p className="text-xs text-muted-foreground">
              Asisten keuangan pribadi Anda
            </p>
          </div>
          <div className="ml-auto lg:hidden">
            <Button onClick={startNewChat} variant="ghost" size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {isLoadingMessages ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 rounded-xl" />
              ))}
            </div>
          ) : messages.length > 0 ? (
            <>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex gap-3 animate-fade-in",
                    msg.role === "USER" ? "justify-end" : "justify-start"
                  )}
                >
                  {msg.role === "ASSISTANT" && (
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-violet-500 to-purple-400 flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                      msg.role === "USER"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-white/[0.05] border border-white/[0.06] rounded-bl-md"
                    )}
                  >
                    <div
                      dangerouslySetInnerHTML={{
                        __html: formatMessageContent(msg.content),
                      }}
                    />
                  </div>
                  {msg.role === "USER" && (
                    <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                  )}
                </div>
              ))}
              {isSending && (
                <div className="flex gap-3 justify-start animate-fade-in">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-violet-500 to-purple-400 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-white/[0.05] border border-white/[0.06] rounded-2xl rounded-bl-md px-4 py-3">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-r from-violet-500/20 to-purple-400/20 flex items-center justify-center mb-4">
                <Sparkles className="h-8 w-8 text-violet-400" />
              </div>
              <h3 className="font-semibold mb-2">Halo! Saya FinAI 👋</h3>
              <p className="text-sm text-muted-foreground max-w-sm mb-8">
                Saya asisten keuangan pribadi Anda. Tanyakan apa saja tentang
                keuangan Anda dan saya siap membantu!
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md">
                {[
                  "Analisis pengeluaran saya bulan ini",
                  "Berapa sisa saldo saya?",
                  "Tips menghemat pengeluaran",
                  "Kategori terbesar pengeluaran saya",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => {
                      setInputMessage(suggestion);
                      inputRef.current?.focus();
                    }}
                    className="text-left text-sm px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-colors text-muted-foreground hover:text-foreground"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="px-6 py-4 border-t border-white/[0.06]">
          <div className="flex items-center gap-3">
            <Input
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ketik pesan Anda..."
              disabled={isSending}
              className="flex-1"
              id="chat-input"
            />
            <Button
              onClick={handleSend}
              disabled={!inputMessage.trim() || isSending}
              size="icon"
              id="send-message-btn"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground mt-2 text-center">
            FinAI dapat memberikan saran umum. Konsultasi ke ahli keuangan untuk keputusan besar.
          </p>
        </div>
      </Card>
    </div>
  );
}
