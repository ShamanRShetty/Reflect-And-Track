import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/use-auth";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Play, Pause, RotateCcw, Wind, Brain, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

type ExerciseType = "box" | "478" | "calm" | null;

export default function Wellness() {
  const navigate = useNavigate();
  const { isLoading, isAuthenticated } = useAuth();
  const [activeExercise, setActiveExercise] = useState<ExerciseType>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [phase, setPhase] = useState<"inhale" | "hold1" | "exhale" | "hold2">("inhale");
  const [progress, setProgress] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (!isPlaying || !activeExercise) return;

    const timings = getExerciseTimings(activeExercise);
    const currentTiming = timings[phase];
    const interval = 50; // Update every 50ms
    const steps = currentTiming / interval;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      setProgress((currentStep / steps) * 100);

      if (currentStep >= steps) {
        // Move to next phase
        if (phase === "inhale") {
          setPhase(activeExercise === "box" ? "hold1" : "exhale");
        } else if (phase === "hold1") {
          setPhase("exhale");
        } else if (phase === "exhale") {
          setPhase(activeExercise === "box" ? "hold2" : "inhale");
          if (activeExercise === "478") {
            setCycleCount((prev) => prev + 1);
          }
        } else if (phase === "hold2") {
          setPhase("inhale");
          setCycleCount((prev) => prev + 1);
        }
        setProgress(0);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [isPlaying, phase, activeExercise]);

  const getExerciseTimings = (exercise: ExerciseType) => {
    if (exercise === "box") {
      return { inhale: 4000, hold1: 4000, exhale: 4000, hold2: 4000 };
    } else if (exercise === "478") {
      return { inhale: 4000, hold1: 7000, exhale: 8000, hold2: 0 };
    } else if (exercise === "calm") {
      return { inhale: 4000, hold1: 0, exhale: 6000, hold2: 0 };
    }
    return { inhale: 4000, hold1: 0, exhale: 4000, hold2: 0 };
  };

  const startExercise = (exercise: ExerciseType) => {
    setActiveExercise(exercise);
    setIsPlaying(true);
    setPhase("inhale");
    setProgress(0);
    setCycleCount(0);
    toast.success("Exercise started");
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const resetExercise = () => {
    setIsPlaying(false);
    setPhase("inhale");
    setProgress(0);
    setCycleCount(0);
  };

  const stopExercise = () => {
    setActiveExercise(null);
    setIsPlaying(false);
    setPhase("inhale");
    setProgress(0);
    setCycleCount(0);
    toast.success(`Completed ${cycleCount} cycles`);
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
              <h1 className="text-3xl font-bold tracking-tight">Wellness Tools</h1>
              <p className="text-muted-foreground">
                Breathing exercises and relaxation techniques
              </p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!activeExercise ? (
              <motion.div
                key="selection"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid md:grid-cols-3 gap-6"
              >
                {/* Box Breathing */}
                <ExerciseCard
                  icon={<Wind className="w-8 h-8" />}
                  title="Box Breathing"
                  description="4-4-4-4 pattern. Great for stress and focus."
                  duration="4 seconds each phase"
                  onStart={() => startExercise("box")}
                />

                {/* 4-7-8 Breathing */}
                <ExerciseCard
                  icon={<Brain className="w-8 h-8" />}
                  title="4-7-8 Breathing"
                  description="Inhale 4, hold 7, exhale 8. Promotes relaxation."
                  duration="19 seconds per cycle"
                  onStart={() => startExercise("478")}
                />

                {/* Calm Breathing */}
                <ExerciseCard
                  icon={<Sparkles className="w-8 h-8" />}
                  title="Calm Breathing"
                  description="Simple inhale-exhale. Perfect for beginners."
                  duration="10 seconds per cycle"
                  onStart={() => startExercise("calm")}
                />

                {/* Meditation Guides */}
                <Card className="p-6 md:col-span-3">
                  <h2 className="text-xl font-bold tracking-tight mb-4">
                    Meditation Guides
                  </h2>
                  <div className="grid md:grid-cols-3 gap-4">
                    <MeditationCard
                      title="Body Scan"
                      duration="10 min"
                      description="Progressive relaxation through body awareness"
                    />
                    <MeditationCard
                      title="Mindfulness"
                      duration="5 min"
                      description="Present moment awareness practice"
                    />
                    <MeditationCard
                      title="Loving Kindness"
                      duration="8 min"
                      description="Cultivate compassion and positive emotions"
                    />
                  </div>
                </Card>

                {/* Quick Tips */}
                <Card className="p-6 md:col-span-3">
                  <h2 className="text-xl font-bold tracking-tight mb-4">
                    Quick Relaxation Tips
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <TipCard
                      title="Progressive Muscle Relaxation"
                      tip="Tense and release each muscle group, starting from your toes to your head."
                    />
                    <TipCard
                      title="5-4-3-2-1 Grounding"
                      tip="Name 5 things you see, 4 you hear, 3 you feel, 2 you smell, 1 you taste."
                    />
                    <TipCard
                      title="Visualization"
                      tip="Imagine a peaceful place in detail - sights, sounds, smells, and feelings."
                    />
                    <TipCard
                      title="Gentle Movement"
                      tip="Stretch, walk, or do light yoga to release tension and boost mood."
                    />
                  </div>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="exercise"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="max-w-2xl mx-auto"
              >
                <Card className="p-12">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold tracking-tight mb-2">
                      {activeExercise === "box" && "Box Breathing"}
                      {activeExercise === "478" && "4-7-8 Breathing"}
                      {activeExercise === "calm" && "Calm Breathing"}
                    </h2>
                    <p className="text-muted-foreground">
                      Cycles completed: {cycleCount}
                    </p>
                  </div>

                  {/* Breathing Circle */}
                  <div className="flex justify-center mb-8">
                    <motion.div
                      animate={{
                        scale: phase === "inhale" ? 1.5 : phase === "exhale" ? 0.8 : 1.2,
                      }}
                      transition={{
                        duration:
                          phase === "inhale"
                            ? getExerciseTimings(activeExercise).inhale / 1000
                            : phase === "exhale"
                            ? getExerciseTimings(activeExercise).exhale / 1000
                            : phase === "hold1"
                            ? getExerciseTimings(activeExercise).hold1 / 1000
                            : getExerciseTimings(activeExercise).hold2 / 1000,
                        ease: "easeInOut",
                      }}
                      className="w-48 h-48 rounded-full bg-primary/20 flex items-center justify-center"
                    >
                      <div className="text-center">
                        <p className="text-3xl font-bold capitalize mb-2">
                          {phase === "hold1" || phase === "hold2" ? "Hold" : phase}
                        </p>
                        <Progress value={progress} className="w-32" />
                      </div>
                    </motion.div>
                  </div>

                  {/* Instructions */}
                  <div className="text-center mb-8">
                    <p className="text-lg text-muted-foreground">
                      {phase === "inhale" && "Breathe in slowly through your nose"}
                      {phase === "hold1" && "Hold your breath"}
                      {phase === "exhale" && "Breathe out slowly through your mouth"}
                      {phase === "hold2" && "Hold your breath"}
                    </p>
                  </div>

                  {/* Controls */}
                  <div className="flex justify-center gap-4">
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={togglePlayPause}
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="w-5 h-5 mr-2" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="w-5 h-5 mr-2" />
                          Resume
                        </>
                      )}
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={resetExercise}
                    >
                      <RotateCcw className="w-5 h-5 mr-2" />
                      Reset
                    </Button>
                    <Button size="lg" onClick={stopExercise}>
                      Finish
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

function ExerciseCard({
  icon,
  title,
  description,
  duration,
  onStart,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  duration: string;
  onStart: () => void;
}) {
  return (
    <motion.div whileHover={{ y: -4 }}>
      <Card className="p-6 cursor-pointer h-full" onClick={onStart}>
        <div className="mb-4">{icon}</div>
        <h3 className="text-xl font-bold tracking-tight mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        <p className="text-xs text-muted-foreground">{duration}</p>
      </Card>
    </motion.div>
  );
}

function MeditationCard({
  title,
  duration,
  description,
}: {
  title: string;
  duration: string;
  description: string;
}) {
  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-bold">{title}</h4>
        <span className="text-xs text-muted-foreground">{duration}</span>
      </div>
      <p className="text-sm text-muted-foreground mb-3">{description}</p>
      <Button size="sm" variant="outline" className="w-full">
        <Play className="w-3 h-3 mr-2" />
        Start
      </Button>
    </div>
  );
}

function TipCard({ title, tip }: { title: string; tip: string }) {
  return (
    <div className="p-4 border rounded-lg">
      <h4 className="font-bold mb-2">{title}</h4>
      <p className="text-sm text-muted-foreground">{tip}</p>
    </div>
  );
}
