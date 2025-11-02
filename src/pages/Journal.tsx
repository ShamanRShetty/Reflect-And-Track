import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { getSessionId } from "@/lib/session";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export default function Journal() {
  const navigate = useNavigate();
  const { isLoading, isAuthenticated } = useAuth();
  const sessionId = getSessionId();
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const createEntry = useMutation(api.journal.createEntry);
  const deleteEntry = useMutation(api.journal.deleteEntry);
  const entries = useQuery(api.journal.getEntries, { sessionId });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isLoading, isAuthenticated, navigate]);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error("Please fill in both title and content");
      return;
    }

    setIsSaving(true);
    try {
      await createEntry({
        sessionId,
        title: title.trim(),
        content: content.trim(),
      });

      toast.success("Journal entry saved");
      setTitle("");
      setContent("");
    } catch (error) {
      toast.error("Failed to save entry");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteEntry({ id: id as any });
      toast.success("Entry deleted");
    } catch (error) {
      toast.error("Failed to delete entry");
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
              <h1 className="text-3xl font-bold tracking-tight">Journal</h1>
              <p className="text-muted-foreground">Write your thoughts</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* New Entry */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <BookOpen className="w-5 h-5" />
                <h2 className="text-xl font-bold tracking-tight">New Entry</h2>
              </div>

              <div className="space-y-4">
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Entry title..."
                />
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="What's on your mind today?"
                  rows={12}
                />
                <Button
                  onClick={handleSubmit}
                  disabled={!title.trim() || !content.trim() || isSaving}
                  className="w-full"
                >
                  {isSaving ? "Saving..." : "Save Entry"}
                </Button>
              </div>
            </Card>

            {/* Past Entries */}
            <Card className="p-6">
              <h2 className="text-xl font-bold tracking-tight mb-6">Past Entries</h2>
              
              {!entries || entries.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No journal entries yet. Start writing!
                </p>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {entries.map((entry) => (
                    <motion.div
                      key={entry._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-4 border rounded-lg"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold">{entry.title}</h3>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(entry._id)}
                          className="h-8 w-8"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-2">
                        {entry.content}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(entry.timestamp).toLocaleDateString()}
                      </p>
                    </motion.div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
