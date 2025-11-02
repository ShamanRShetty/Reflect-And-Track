import { internalMutation } from "./_generated/server";

export const seedResources = internalMutation({
  args: {},
  handler: async (ctx) => {
    // Check if resources already exist
    const existing = await ctx.db.query("resources").first();
    if (existing) {
      console.log("Resources already seeded");
      return;
    }

    // Mental health helplines
    await ctx.db.insert("resources", {
      title: "Vandrevala Foundation Helpline",
      description: "24/7 mental health support in English, Hindi, and regional languages",
      category: "helpline",
      type: "phone",
      url: "tel:18602662345",
      content: "Call 1860-2662-345 for immediate support",
      tags: ["crisis", "24/7", "multilingual"],
      language: "en",
      helpfulCount: 0,
      viewCount: 0,
    });

    await ctx.db.insert("resources", {
      title: "iCall Psychosocial Helpline",
      description: "Professional counseling service by TISS",
      category: "helpline",
      type: "phone",
      url: "tel:9152987821",
      content: "Call 9152987821 (Mon-Sat, 8 AM - 10 PM)",
      tags: ["counseling", "professional"],
      language: "en",
      helpfulCount: 0,
      viewCount: 0,
    });

    await ctx.db.insert("resources", {
      title: "AASRA Suicide Prevention",
      description: "24/7 suicide prevention helpline",
      category: "helpline",
      type: "phone",
      url: "tel:9820466726",
      content: "Call 9820466726 for crisis support",
      tags: ["crisis", "suicide-prevention", "24/7"],
      language: "en",
      helpfulCount: 0,
      viewCount: 0,
    });

    // Articles
    await ctx.db.insert("resources", {
      title: "Understanding Anxiety",
      description: "Learn about anxiety symptoms and coping strategies",
      category: "article",
      type: "article",
      content: "Anxiety is a normal response to stress, but when it becomes overwhelming, it can affect daily life. Common symptoms include racing thoughts, rapid heartbeat, and difficulty concentrating. Effective coping strategies include deep breathing, mindfulness, regular exercise, and talking to someone you trust.",
      tags: ["anxiety", "coping", "mental-health"],
      language: "en",
      helpfulCount: 0,
      viewCount: 0,
    });

    await ctx.db.insert("resources", {
      title: "Managing Depression",
      description: "Practical tips for dealing with depression",
      category: "article",
      type: "article",
      content: "Depression affects millions of people. It's important to know you're not alone. Small steps like maintaining a routine, getting sunlight, staying connected with loved ones, and seeking professional help can make a significant difference.",
      tags: ["depression", "self-care", "mental-health"],
      language: "en",
      helpfulCount: 0,
      viewCount: 0,
    });

    await ctx.db.insert("resources", {
      title: "Stress Management Techniques",
      description: "Evidence-based methods to reduce stress",
      category: "article",
      type: "article",
      content: "Effective stress management includes: 1) Regular physical activity, 2) Adequate sleep (7-9 hours), 3) Healthy eating habits, 4) Time management, 5) Relaxation techniques like meditation and yoga, 6) Social support from friends and family.",
      tags: ["stress", "wellness", "self-care"],
      language: "en",
      helpfulCount: 0,
      viewCount: 0,
    });

    // Videos
    await ctx.db.insert("resources", {
      title: "5-Minute Breathing Exercise",
      description: "Quick breathing technique to calm anxiety",
      category: "video",
      type: "video",
      url: "https://www.youtube.com/watch?v=tybOi4hjZFQ",
      content: "Box breathing: Inhale for 4 counts, hold for 4, exhale for 4, hold for 4. Repeat.",
      tags: ["breathing", "anxiety", "quick-relief"],
      language: "en",
      helpfulCount: 0,
      viewCount: 0,
    });

    await ctx.db.insert("resources", {
      title: "Guided Meditation for Beginners",
      description: "10-minute meditation session",
      category: "video",
      type: "video",
      url: "https://www.youtube.com/watch?v=inpok4MKVLM",
      content: "A gentle introduction to mindfulness meditation",
      tags: ["meditation", "mindfulness", "beginner"],
      language: "en",
      helpfulCount: 0,
      viewCount: 0,
    });

    console.log("Resources seeded successfully");
  },
});
