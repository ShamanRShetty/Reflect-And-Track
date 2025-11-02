import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { getSessionId } from "@/lib/session";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import {
  Activity,
  BookOpen,
  Brain,
  Heart,
  MessageCircle,
  TrendingUp,
} from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function Dashboard() {
  const navigate = useNavigate();
  const { isLoading, isAuthenticated } = useAuth();
  const sessionId = getSessionId();

  const moodEntries = useQuery(api.mood.getMoodEntries, { sessionId, limit: 30 });
  const journalEntries = useQuery(api.journal.getEntries, { sessionId });
  const session = useQuery(api.sessions.getSession, { sessionId });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-foreground border-t-transparent rounded-full" />
      </div>
    );
  }

  const messageCount = session?.conversationHistory?.length || 0;
  const moodCount = moodEntries?.length || 0;
  const journalCount = journalEntries?.length || 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold tracking-tight mb-2">Dashboard</h1>
          <p className="text-muted-foreground mb-12">
            Welcome back. How are you feeling today?
          </p>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <StatCard
              icon={<MessageCircle className="w-6 h-6" />}
              label="Chat Messages"
              value={messageCount}
            />
            <StatCard
              icon={<Heart className="w-6 h-6" />}
              label="Mood Entries"
              value={moodCount}
            />
            <StatCard
              icon={<BookOpen className="w-6 h-6" />}
              label="Journal Entries"
              value={journalCount}
            />
            <StatCard
              icon={<Activity className="w-6 h-6" />}
              label="Day Streak"
              value={0}
            />
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6">
            <ActionCard
              icon={<MessageCircle className="w-8 h-8" />}
              title="AI Chat"
              description="Talk about what's on your mind"
              onClick={() => navigate("/chat")}
            />
            <ActionCard
              icon={<Heart className="w-8 h-8" />}
              title="Track Mood"
              description="Log how you're feeling"
              onClick={() => navigate("/mood")}
            />
            <ActionCard
              icon={<Brain className="w-8 h-8" />}
              title="Wellness Tools"
              description="Breathing, meditation & more"
              onClick={() => navigate("/wellness")}
            />
            <ActionCard
              icon={<BookOpen className="w-8 h-8" />}
              title="Journal"
              description="Write your thoughts"
              onClick={() => navigate("/journal")}
            />
            <ActionCard
              icon={<TrendingUp className="w-8 h-8" />}
              title="Progress"
              description="View your insights"
              onClick={() => navigate("/progress")}
            />
            <ActionCard
              icon={<Activity className="w-8 h-8" />}
              title="Resources"
              description="Articles & helplines"
              onClick={() => navigate("/resources")}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-4">
        <div className="text-muted-foreground">{icon}</div>
        <div>
          <div className="text-3xl font-bold tracking-tight">{value}</div>
          <div className="text-sm text-muted-foreground">{label}</div>
        </div>
      </div>
    </Card>
  );
}

function ActionCard({
  icon,
  title,
  description,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <motion.div whileHover={{ y: -4 }}>
      <Card
        className="p-8 cursor-pointer border-2 hover:border-foreground transition-colors"
        onClick={onClick}
      >
        <div className="mb-4">{icon}</div>
        <h3 className="text-xl font-bold tracking-tight mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </Card>
    </motion.div>
  );
}
