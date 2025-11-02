import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/use-auth";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Play, Pause, RotateCcw, Wind, Brain, Sparkles, Heart, Leaf, Smile } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

type ExerciseType = "box" | "478" | "calm" | null;
type MeditationType = "bodyscan" | "mindfulness" | "lovingkindness" | null;

export default function Wellness() {
  const navigate = useNavigate();
  const { isLoading, isAuthenticated } = useAuth();
  const [activeExercise, setActiveExercise] = useState<ExerciseType>(null);
  const [activeMeditation, setActiveMeditation] = useState<MeditationType>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [phase, setPhase] = useState<"inhale" | "hold1" | "exhale" | "hold2">("inhale");
  const [progress, setProgress] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const [meditationStep, setMeditationStep] = useState(0);
  const [meditationProgress, setMeditationProgress] = useState(0);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isLoading, isAuthenticated, navigate]);

  // Breathing exercise timer
  useEffect(() => {
    if (!isPlaying || !activeExercise) return;

    const timings = getExerciseTimings(activeExercise);
    const currentTiming = timings[phase];
    const interval = 50;
    const steps = currentTiming / interval;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      setProgress((currentStep / steps) * 100);

      if (currentStep >= steps) {
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

  // Meditation timer
  useEffect(() => {
    if (!isPlaying || !activeMeditation) return;

    const steps = getMeditationSteps(activeMeditation);
    const totalDuration = steps.reduce((sum, step) => sum + step.duration, 0);
    const currentStepData = steps[meditationStep];
    
    if (!currentStepData) return;

    const interval = 100;
    const stepDuration = currentStepData.duration;
    const totalSteps = stepDuration / interval;

    let currentProgress = 0;
    const timer = setInterval(() => {
      currentProgress++;
      const stepProgress = (currentProgress / totalSteps) * 100;
      setProgress(stepProgress);

      // Calculate overall meditation progress
      const completedDuration = steps.slice(0, meditationStep).reduce((sum, s) => sum + s.duration, 0);
      const currentStepProgress = (currentProgress / totalSteps) * stepDuration;
      const overallProgress = ((completedDuration + currentStepProgress) / totalDuration) * 100;
      setMeditationProgress(overallProgress);

      if (currentProgress >= totalSteps) {
        if (meditationStep < steps.length - 1) {
          setMeditationStep((prev) => prev + 1);
          setProgress(0);
        } else {
          // Meditation complete
          setIsPlaying(false);
          toast.success("Meditation complete! Well done.");
        }
      }
    }, interval);

    return () => clearInterval(timer);
  }, [isPlaying, activeMeditation, meditationStep]);

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

  const getMeditationSteps = (meditation: MeditationType) => {
    if (meditation === "bodyscan") {
      return [
        { text: "Find a comfortable position. Close your eyes and take three deep breaths.", duration: 30000 },
        { text: "Bring your attention to your toes. Notice any sensations without judgment.", duration: 45000 },
        { text: "Slowly move your awareness up through your feet, ankles, and calves.", duration: 60000 },
        { text: "Continue scanning through your knees, thighs, and hips.", duration: 60000 },
        { text: "Notice your abdomen, chest, and back. Feel your breath moving through your body.", duration: 60000 },
        { text: "Bring awareness to your shoulders, arms, and hands.", duration: 45000 },
        { text: "Finally, scan your neck, face, and the top of your head.", duration: 45000 },
        { text: "Take a moment to feel your whole body. When ready, gently open your eyes.", duration: 45000 },
      ];
    } else if (meditation === "mindfulness") {
      return [
        { text: "Sit comfortably with your back straight. Close your eyes.", duration: 20000 },
        { text: "Bring your attention to your breath. Notice the natural rhythm of breathing.", duration: 60000 },
        { text: "When your mind wanders, gently bring it back to your breath. This is normal.", duration: 60000 },
        { text: "Notice thoughts and feelings without judgment. Let them pass like clouds.", duration: 60000 },
        { text: "Continue to anchor yourself in the present moment with each breath.", duration: 60000 },
        { text: "Slowly bring your awareness back to your surroundings. Open your eyes when ready.", duration: 40000 },
      ];
    } else if (meditation === "lovingkindness") {
      return [
        { text: "Sit comfortably and close your eyes. Take a few deep breaths.", duration: 20000 },
        { text: "Think of yourself. Silently repeat: 'May I be happy. May I be healthy. May I be safe.'", duration: 60000 },
        { text: "Now think of someone you love. Repeat: 'May you be happy. May you be healthy. May you be safe.'", duration: 60000 },
        { text: "Think of a neutral person. Extend the same wishes to them.", duration: 60000 },
        { text: "Think of someone you find difficult. Try to extend compassion to them too.", duration: 60000 },
        { text: "Finally, extend these wishes to all beings everywhere.", duration: 60000 },
        { text: "Take a moment to notice how you feel. Gently open your eyes.", duration: 40000 },
      ];
    }
    return [];
  };

  const startExercise = (exercise: ExerciseType) => {
    setActiveExercise(exercise);
    setActiveMeditation(null);
    setIsPlaying(true);
    setPhase("inhale");
    setProgress(0);
    setCycleCount(0);
    toast.success("Exercise started");
  };

  const startMeditation = (meditation: MeditationType) => {
    setActiveMeditation(meditation);
    setActiveExercise(null);
    setIsPlaying(true);
    setMeditationStep(0);
    setProgress(0);
    setMeditationProgress(0);
    toast.success("Meditation started");
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const resetExercise = () => {
    setIsPlaying(false);
    setPhase("inhale");
    setProgress(0);
    setCycleCount(0);
    setMeditationStep(0);
    setMeditationProgress(0);
  };

  const stopExercise = () => {
    if (activeExercise) {
      toast.success(`Completed ${cycleCount} cycles`);
    } else if (activeMeditation) {
      toast.success("Meditation session ended");
    }
    setActiveExercise(null);
    setActiveMeditation(null);
    setIsPlaying(false);
    setPhase("inhale");
    setProgress(0);
    setCycleCount(0);
    setMeditationStep(0);
    setMeditationProgress(0);
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
            {!activeExercise && !activeMeditation ? (
              <motion.div
                key="selection"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-12"
              >
                {/* Breathing Exercises */}
                <section>
                  <h2 className="text-2xl font-bold tracking-tight mb-6">Breathing Exercises</h2>
                  <div className="grid md:grid-cols-3 gap-6">
                    <ExerciseCard
                      icon={<Wind className="w-8 h-8" />}
                      title="Box Breathing"
                      description="4-4-4-4 pattern. Great for stress and focus."
                      duration="4 seconds each phase"
                      onStart={() => startExercise("box")}
                    />
                    <ExerciseCard
                      icon={<Brain className="w-8 h-8" />}
                      title="4-7-8 Breathing"
                      description="Inhale 4, hold 7, exhale 8. Promotes relaxation."
                      duration="19 seconds per cycle"
                      onStart={() => startExercise("478")}
                    />
                    <ExerciseCard
                      icon={<Sparkles className="w-8 h-8" />}
                      title="Calm Breathing"
                      description="Simple inhale-exhale. Perfect for beginners."
                      duration="10 seconds per cycle"
                      onStart={() => startExercise("calm")}
                    />
                  </div>
                </section>

                {/* Meditation Guides */}
                <section>
                  <h2 className="text-2xl font-bold tracking-tight mb-6">Guided Meditations</h2>
                  <div className="grid md:grid-cols-3 gap-6">
                    <ExerciseCard
                      icon={<Heart className="w-8 h-8" />}
                      title="Body Scan"
                      description="Progressive relaxation through body awareness"
                      duration="6 minutes"
                      onStart={() => startMeditation("bodyscan")}
                    />
                    <ExerciseCard
                      icon={<Leaf className="w-8 h-8" />}
                      title="Mindfulness"
                      description="Present moment awareness practice"
                      duration="5 minutes"
                      onStart={() => startMeditation("mindfulness")}
                    />
                    <ExerciseCard
                      icon={<Smile className="w-8 h-8" />}
                      title="Loving Kindness"
                      description="Cultivate compassion and positive emotions"
                      duration="6 minutes"
                      onStart={() => startMeditation("lovingkindness")}
                    />
                  </div>
                </section>

                {/* Quick Tips */}
                <section>
                  <h2 className="text-2xl font-bold tracking-tight mb-6">Quick Relaxation Tips</h2>
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
                </section>
              </motion.div>
            ) : activeExercise ? (
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

                  <div className="text-center mb-8">
                    <p className="text-lg text-muted-foreground">
                      {phase === "inhale" && "Breathe in slowly through your nose"}
                      {phase === "hold1" && "Hold your breath"}
                      {phase === "exhale" && "Breathe out slowly through your mouth"}
                      {phase === "hold2" && "Hold your breath"}
                    </p>
                  </div>

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
            ) : (
              <motion.div
                key="meditation"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="max-w-2xl mx-auto"
              >
                <Card className="p-12">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold tracking-tight mb-2">
                      {activeMeditation === "bodyscan" && "Body Scan Meditation"}
                      {activeMeditation === "mindfulness" && "Mindfulness Meditation"}
                      {activeMeditation === "lovingkindness" && "Loving Kindness Meditation"}
                    </h2>
                    <p className="text-muted-foreground">
                      Step {meditationStep + 1} of {getMeditationSteps(activeMeditation).length}
                    </p>
                  </div>

                  <div className="mb-8">
                    <Progress value={meditationProgress} className="mb-4" />
                    <div className="min-h-[120px] flex items-center justify-center p-6 bg-muted rounded-lg">
                      <p className="text-lg text-center leading-relaxed">
                        {getMeditationSteps(activeMeditation)[meditationStep]?.text}
                      </p>
                    </div>
                  </div>

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
                      Restart
                    </Button>
                    <Button size="lg" onClick={stopExercise}>
                      End Session
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

function TipCard({ title, tip }: { title: string; tip: string }) {
  return (
    <div className="p-4 border rounded-lg">
      <h4 className="font-bold mb-2">{title}</h4>
      <p className="text-sm text-muted-foreground">{tip}</p>
    </div>
  );
}