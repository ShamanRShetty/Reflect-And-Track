import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createMoodEntry = mutation({
  args: {
    sessionId: v.string(),
    mood: v.string(),
    intensity: v.number(),
    notes: v.optional(v.string()),
    triggers: v.optional(v.array(v.string())),
    activities: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("moodEntries", {
      sessionId: args.sessionId,
      mood: args.mood,
      intensity: args.intensity,
      notes: args.notes,
      triggers: args.triggers,
      activities: args.activities,
      timestamp: Date.now(),
    });
  },
});

export const getMoodEntries = query({
  args: {
    sessionId: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const entries = await ctx.db
      .query("moodEntries")
      .withIndex("by_sessionId", (q) => q.eq("sessionId", args.sessionId))
      .order("desc")
      .take(args.limit || 100);

    return entries;
  },
});

export const getMoodStats = query({
  args: {
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    const entries = await ctx.db
      .query("moodEntries")
      .withIndex("by_sessionId", (q) => q.eq("sessionId", args.sessionId))
      .collect();

    if (entries.length === 0) {
      return null;
    }

    const avgIntensity = entries.reduce((sum, e) => sum + e.intensity, 0) / entries.length;
    
    const moodCounts: Record<string, number> = {};
    entries.forEach(e => {
      moodCounts[e.mood] = (moodCounts[e.mood] || 0) + 1;
    });
    
    const mostCommonMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0];

    const allTriggers = entries.flatMap(e => e.triggers || []);
    const triggerCounts: Record<string, number> = {};
    allTriggers.forEach(t => {
      triggerCounts[t] = (triggerCounts[t] || 0) + 1;
    });
    const commonTriggers = Object.entries(triggerCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([trigger]) => trigger);

    const allActivities = entries.flatMap(e => e.activities || []);
    const activityCounts: Record<string, number> = {};
    allActivities.forEach(a => {
      activityCounts[a] = (activityCounts[a] || 0) + 1;
    });
    const helpfulActivities = Object.entries(activityCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([activity]) => activity);

    return {
      totalEntries: entries.length,
      avgIntensity: Math.round(avgIntensity * 10) / 10,
      mostCommonMood,
      commonTriggers,
      helpfulActivities,
    };
  },
});
