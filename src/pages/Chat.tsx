import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/use-auth";
import { getSessionId } from "@/lib/session";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { motion } from "framer-motion";
import { AlertCircle, ArrowLeft, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export default function Chat() {
  const navigate = useNavigate();
  const { isLoading, isAuthenticated } = useAuth();
  const sessionId = getSessionId();
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const session = useQuery(api.sessions.getSession, { sessionId });
  const updateConversation = useMutation(api.sessions.updateConversation);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [session?.conversationHistory]);

  const handleSend = async () => {
    if (!message.trim() || isSending) return;

    const userMessage = message.trim();
    setMessage("");
    setIsSending(true);

    try {
      // Add user message
      await updateConversation({
        sessionId,
        message: {
          role: "user",
          content: userMessage,
          timestamp: Date.now(),
        },
      });

      // Simple AI response (in production, this would call an AI service)
      const aiResponse = generateAIResponse(userMessage);
      
      await updateConversation({
        sessionId,
        message: {
          role: "assistant",
          content: aiResponse,
          timestamp: Date.now(),
        },
      });

      toast.success("Message sent");
    } catch (error) {
      toast.error("Failed to send message");
      console.error(error);
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-foreground border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/dashboard")}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">AI Chat</h1>
              <p className="text-muted-foreground">
                Talk about what's on your mind
              </p>
            </div>
          </div>

          {/* Crisis Warning */}
          <Card className="p-4 mb-6 border-orange-500 bg-orange-50 dark:bg-orange-950/20">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-orange-900 dark:text-orange-100 mb-1">
                  In Crisis?
                </p>
                <p className="text-orange-800 dark:text-orange-200">
                  Call{" "}
                  <a href="tel:18602662345" className="underline font-medium">
                    1860-2662-345
                  </a>{" "}
                  (Vandrevala Foundation) for immediate support
                </p>
              </div>
            </div>
          </Card>

          {/* Chat Area */}
          <Card className="h-[500px] flex flex-col">
            <ScrollArea className="flex-1 p-6" ref={scrollRef}>
              {session?.conversationHistory?.length === 0 ? (
                <div className="text-center text-muted-foreground py-12">
                  <p className="text-lg mb-2">Start a conversation</p>
                  <p className="text-sm">
                    Share what's on your mind. I'm here to listen.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {session?.conversationHistory?.map((msg, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-4 ${
                          msg.role === "user"
                            ? "bg-foreground text-background"
                            : "bg-muted"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Type your message..."
                  disabled={isSending}
                  className="flex-1"
                />
                <Button
                  onClick={handleSend}
                  disabled={!message.trim() || isSending}
                  size="icon"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

// Simple AI response generator (placeholder for actual AI integration)
function generateAIResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase();
  
  if (lowerMessage.includes("anxious") || lowerMessage.includes("anxiety")) {
    return "I hear that you're feeling anxious. That's a very common feeling, and it's okay to feel this way. Would you like to try a breathing exercise, or would you prefer to talk more about what's making you feel anxious?";
  }
  
  if (lowerMessage.includes("sad") || lowerMessage.includes("depressed")) {
    return "I'm sorry you're feeling this way. Your feelings are valid. Remember that it's okay to not be okay sometimes. Would it help to talk about what's been going on?";
  }
  
  if (lowerMessage.includes("stress")) {
    return "Stress can be overwhelming. Let's work through this together. What's been the main source of stress for you lately?";
  }
  
  if (lowerMessage.includes("help") || lowerMessage.includes("crisis")) {
    return "I'm here to support you. If you're in crisis, please call 1860-2662-345 (Vandrevala Foundation) for immediate professional help. They're available 24/7. Would you like me to share more resources?";
  }
  
  return "Thank you for sharing that with me. I'm here to listen and support you. How are you feeling right now? Would you like to explore any coping strategies or just talk more about what's on your mind?";
}
