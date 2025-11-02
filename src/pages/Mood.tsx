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
import { ArrowLeft, Frown, Meh, Smile } from "lucide-react";
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

export default function Mood() {
  const navigate = useNavigate();
  const { isLoading, isAuthenticated } = useAuth();
  const sessionId = getSessionId();
  
  const [selectedMood, setSelectedMood] = useState("");
  const [intensity, setIntensity] = useState([5]);
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const createMoodEntry = useMutation(api.mood.createMoodEntry);
  const moodEntries = useQuery(api.mood.getMoodEntries, { sessionId, limit: 7 });

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
              <h1 className="text-3xl font-bold tracking-tight">Mood Tracker</h1>
              <p className="text-muted-foreground">How are you feeling today?</p>
            </div>
          </div>

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
                <div className="space-y-4">
                  {moodEntries.map((entry) => {
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
