import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Brain, Heart, MessageCircle, Shield, Sparkles, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/use-auth";

export default function Landing() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="w-10 h-10 bg-foreground rounded-full flex items-center justify-center">
              <Brain className="w-6 h-6 text-background" />
            </div>
            <span className="text-2xl font-bold tracking-tight">Reflect&Track</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {!isLoading && (
              <Button
                onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")}
                size="lg"
                className="font-medium"
              >
                {isAuthenticated ? "Dashboard" : "Get Started"}
              </Button>
            )}
          </motion.div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h1 className="text-6xl font-bold tracking-tight mb-8">
            Your Mental Wellness,
            <br />
            <span className="text-muted-foreground">Simplified</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
            AI-powered support in your language. Track your mood. Build resilience.
            <br />
            Anonymous, free, and always available.
          </p>
          <Button
            size="lg"
            onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")}
            className="text-lg px-8 py-6 h-auto"
          >
            Start Your Journey
          </Button>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-6 py-32 border-t border-border">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-12"
        >
          <FeatureCard
            icon={<MessageCircle className="w-8 h-8" />}
            title="AI Chat Support"
            description="Talk in English, Hindi, or Tamil. Get empathetic responses that understand your context."
          />
          <FeatureCard
            icon={<TrendingUp className="w-8 h-8" />}
            title="Mood Tracking"
            description="Visualize your emotional patterns. Understand what helps and what doesn't."
          />
          <FeatureCard
            icon={<Heart className="w-8 h-8" />}
            title="Wellness Tools"
            description="Breathing exercises, meditation, journaling, and more—all in one place."
          />
          <FeatureCard
            icon={<Shield className="w-8 h-8" />}
            title="Crisis Detection"
            description="Real-time safety monitoring with instant access to helplines when you need them."
          />
          <FeatureCard
            icon={<Brain className="w-8 h-8" />}
            title="Self-Assessment"
            description="Evidence-based tools to understand your stress, anxiety, and burnout levels."
          />
          <FeatureCard
            icon={<Sparkles className="w-8 h-8" />}
            title="100% Anonymous"
            description="No personal data collected. Your privacy is our priority."
          />
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-6 py-32 border-t border-border">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-12 text-center"
        >
          <StatCard number="35" label="Complete Features" />
          <StatCard number="3" label="Languages Supported" />
          <StatCard number="24/7" label="Always Available" />
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-32 border-t border-border">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-4xl font-bold tracking-tight mb-6">
            Ready to start?
          </h2>
          <p className="text-xl text-muted-foreground mb-12">
            Join thousands taking control of their mental wellness.
          </p>
          <Button
            size="lg"
            onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")}
            className="text-lg px-8 py-6 h-auto"
          >
            Get Started Free
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-32">
        <div className="max-w-7xl mx-auto px-6 py-12 text-center text-sm text-muted-foreground">
          <p>© 2024 Reflect&Track. Built for Indian youth mental wellness.</p>
          <p className="mt-4">
            Emergency? Call{" "}
            <a href="tel:18602662345" className="underline">
              1860-2662-345
            </a>{" "}
            (Vandrevala Foundation)
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="p-8 border border-border rounded-lg"
    >
      <div className="mb-6">{icon}</div>
      <h3 className="text-xl font-bold tracking-tight mb-4">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </motion.div>
  );
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div>
      <div className="text-5xl font-bold tracking-tight mb-4">{number}</div>
      <div className="text-muted-foreground">{label}</div>
    </div>
  );
}