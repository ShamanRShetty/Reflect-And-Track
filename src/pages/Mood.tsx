import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { getSessionId } from "@/lib/session";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { motion } from "framer-motion";
import { ArrowLeft, Frown, Meh, Smile, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const MOODS = [
  { value: "happy", label: "Happy", icon: Smile, color: "text-green-500" },
  { value: "calm", label: "Calm", icon: Meh, color: "text-blue-500" },
  { value: "anxious", label: "Anxious", icon: Frown, color: "text-yellow-500" },
  { value: "sad", label: "Sad", icon: Frown, color: "text-purple-500" },
  { value: "angry", label: "Angry", icon: Frown, color: "text-red-500" },
  { value: "stressed", label: "Stressed", icon: Frown, color: "text-orange-500" },
];

const MOOD_COLORS: Record<string, string> = {
  happy: "#22c55e",
  calm: "#3b82f6",
  anxious: "#eab308",
  sad: "#a855f7",
  angry: "#ef4444",
  stressed: "#f97316",
};

export default function Mood() {
  const navigate = useNavigate();
  const { isLoading, isAuthenticated } = useAuth();
  const sessionId = getSessionId();
  
  const [selectedMood, setSelectedMood] = useState("");
  const [intensity, setIntensity] = useState([5]);
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const createMoodEntry = useMutation(api.mood.createMoodEntry);
  const moodEntries = useQuery(api.mood.getMoodEntries, { sessionId, limit: 30 });
  const moodStats = useQuery(api.mood.getMoodStats, { sessionId });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isLoading, isAuthenticated, navigate]);

  const handleSubmit = async () => {
    if (!selectedMood) {
      toast.error("Please select a mood");
      return;
    }

    setIsSaving(true);
    try {
      await createMoodEntry({
        sessionId,
        mood: selectedMood,
        intensity: intensity[0],
        notes: notes.trim() || undefined,
      });

      toast.success("Mood logged successfully");
      setSelectedMood("");
      setIntensity([5]);
      setNotes("");
    } catch (error) {
      toast.error("Failed to log mood");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-foreground border-t-transparent rounded-full" />
      </div>
    );
  }

  // Prepare chart data
  const chartData = moodEntries
    ?.slice()
    .reverse()
    .map((entry) => ({
      date: new Date(entry.timestamp).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      intensity: entry.intensity,
      mood: entry.mood,
      timestamp: entry.timestamp,
    })) || [];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-8">
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
              <h1 className="text-3xl font-bold tracking-tight">Mood Tracker</h1>
              <p className="text-muted-foreground">How are you feeling today?</p>
            </div>
          </div>

          {/* Stats Overview */}
          {moodStats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card className="p-4">
                <div className="text-sm text-muted-foreground mb-1">Total Entries</div>
                <div className="text-2xl font-bold">{moodStats.totalEntries}</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-muted-foreground mb-1">Avg Intensity</div>
                <div className="text-2xl font-bold">{moodStats.avgIntensity}/10</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-muted-foreground mb-1">Most Common</div>
                <div className="text-2xl font-bold capitalize">{moodStats.mostCommonMood}</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-muted-foreground mb-1">Trend</div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  <span className="text-xl font-bold">Tracking</span>
                </div>
              </Card>
            </div>
          )}

          {/* Mood Chart */}
          {chartData.length > 0 && (
            <Card className="p-6 mb-6">
              <h2 className="text-xl font-bold tracking-tight mb-6">Mood Intensity Over Time</h2>
              <div className="relative h-64">
                <svg className="w-full h-full" viewBox="0 0 800 200">
                  {/* Grid lines */}
                  {[0, 2, 4, 6, 8, 10].map((value) => (
                    <g key={value}>
                      <line
                        x1="40"
                        y1={180 - value * 16}
                        x2="780"
                        y2={180 - value * 16}
                        stroke="currentColor"
                        strokeOpacity="0.1"
                        strokeWidth="1"
                      />
                      <text
                        x="25"
                        y={185 - value * 16}
                        fontSize="12"
                        fill="currentColor"
                        opacity="0.5"
                      >
                        {value}
                      </text>
                    </g>
                  ))}

                  {/* Line chart */}
                  {chartData.length > 1 && (
                    <polyline
                      points={chartData
                        .map((point, idx) => {
                          const x = 60 + (idx * (720 / (chartData.length - 1)));
                          const y = 180 - point.intensity * 16;
                          return `${x},${y}`;
                        })
                        .join(" ")}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}

                  {/* Data points */}
                  {chartData.map((point, idx) => {
                    const x = 60 + (idx * (720 / Math.max(chartData.length - 1, 1)));
                    const y = 180 - point.intensity * 16;
                    return (
                      <g key={idx}>
                        <circle
                          cx={x}
                          cy={y}
                          r="5"
                          fill={MOOD_COLORS[point.mood] || "currentColor"}
                          stroke="white"
                          strokeWidth="2"
                        />
                        {idx % Math.ceil(chartData.length / 8) === 0 && (
                          <text
                            x={x}
                            y="195"
                            fontSize="10"
                            fill="currentColor"
                            opacity="0.5"
                            textAnchor="middle"
                          >
                            {point.date}
                          </text>
                        )}
                      </g>
                    );
                  })}
                </svg>
              </div>
              
              {/* Legend */}
              <div className="flex flex-wrap gap-4 mt-6 justify-center">
                {MOODS.map((mood) => (
                  <div key={mood.value} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: MOOD_COLORS[mood.value] }}
                    />
                    <span className="text-sm text-muted-foreground">{mood.label}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {/* Log Mood */}
            <Card className="p-6">
              <h2 className="text-xl font-bold tracking-tight mb-6">Log Your Mood</h2>

              <div className="space-y-6">
                <div>
                  <Label className="mb-3 block">Select Mood</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {MOODS.map((mood) => {
                      const Icon = mood.icon;
                      return (
                        <motion.button
                          key={mood.value}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedMood(mood.value)}
                          className={`p-4 rounded-lg border-2 transition-colors ${
                            selectedMood === mood.value
                              ? "border-foreground bg-muted"
                              : "border-border hover:border-muted-foreground"
                          }`}
                        >
                          <Icon className={`w-8 h-8 mx-auto mb-2 ${mood.color}`} />
                          <p className="text-sm font-medium">{mood.label}</p>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <Label className="mb-3 block">
                    Intensity: {intensity[0]}/10
                  </Label>
                  <Slider
                    value={intensity}
                    onValueChange={setIntensity}
                    min={1}
                    max={10}
                    step={1}
                  />
                </div>

                <div>
                  <Label className="mb-3 block">Notes (Optional)</Label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="What triggered this mood? What helped?"
                    rows={4}
                  />
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={!selectedMood || isSaving}
                  className="w-full"
                >
                  {isSaving ? "Saving..." : "Log Mood"}
                </Button>
              </div>
            </Card>

            {/* Recent Entries */}
            <Card className="p-6">
              <h2 className="text-xl font-bold tracking-tight mb-6">Recent Entries</h2>
              
              {!moodEntries || moodEntries.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No mood entries yet. Start tracking!
                </p>
              ) : (
                <div className="space-y-4 max-h-[500px] overflow-y-auto">
                  {moodEntries.slice(0, 7).map((entry) => {
                    const mood = MOODS.find((m) => m.value === entry.mood);
                    const Icon = mood?.icon || Meh;
                    return (
                      <div
                        key={entry._id}
                        className="p-4 border rounded-lg"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <Icon className={`w-5 h-5 ${mood?.color}`} />
                          <span className="font-medium capitalize">{entry.mood}</span>
                          <span className="text-sm text-muted-foreground ml-auto">
                            Intensity: {entry.intensity}/10
                          </span>
                        </div>
                        {entry.notes && (
                          <p className="text-sm text-muted-foreground">{entry.notes}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(entry.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}