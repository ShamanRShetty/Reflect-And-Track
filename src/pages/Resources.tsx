import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Phone, ThumbsUp } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export default function Resources() {
  const navigate = useNavigate();
  const { isLoading, isAuthenticated } = useAuth();
  
  const resources = useQuery(api.resources.getResources, {});
  const incrementView = useMutation(api.resources.incrementView);
  const incrementHelpful = useMutation(api.resources.incrementHelpful);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isLoading, isAuthenticated, navigate]);

  const handleView = async (id: string, url?: string) => {
    try {
      await incrementView({ id: id as any });
      if (url) {
        window.open(url, "_blank");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleHelpful = async (id: string) => {
    try {
      await incrementHelpful({ id: id as any });
      toast.success("Thanks for your feedback!");
    } catch (error) {
      toast.error("Failed to record feedback");
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-foreground border-t-transparent rounded-full" />
      </div>
    );
  }

  const helplines = resources?.filter((r) => r.category === "helpline") || [];
  const articles = resources?.filter((r) => r.category === "article") || [];
  const videos = resources?.filter((r) => r.category === "video") || [];

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
              <h1 className="text-3xl font-bold tracking-tight">Resources</h1>
              <p className="text-muted-foreground">
                Helplines, articles, and videos
              </p>
            </div>
          </div>

          {/* Helplines */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold tracking-tight mb-6">
              Crisis Helplines
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {helplines.map((resource) => (
                <Card key={resource._id} className="p-6">
                  <div className="flex items-start gap-4">
                    <Phone className="w-6 h-6 text-red-500 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="font-bold mb-2">{resource.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {resource.description}
                      </p>
                      <Button
                        onClick={() => handleView(resource._id, resource.url)}
                        className="w-full"
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Call Now
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Articles */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold tracking-tight mb-6">Articles</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {articles.map((resource) => (
                <Card key={resource._id} className="p-6">
                  <h3 className="font-bold mb-2">{resource.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {resource.description}
                  </p>
                  {resource.content && (
                    <p className="text-sm mb-4 line-clamp-3">{resource.content}</p>
                  )}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleHelpful(resource._id)}
                    >
                      <ThumbsUp className="w-4 h-4 mr-2" />
                      Helpful ({resource.helpfulCount})
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Videos */}
          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-6">Videos</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {videos.map((resource) => (
                <Card key={resource._id} className="p-6">
                  <h3 className="font-bold mb-2">{resource.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {resource.description}
                  </p>
                  <Button
                    onClick={() => handleView(resource._id, resource.url)}
                    variant="outline"
                    className="w-full"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Watch Video
                  </Button>
                </Card>
              ))}
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  );
}
