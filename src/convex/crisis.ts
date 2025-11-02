import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const logCrisisEvent = mutation({
  args: {
    sessionId: v.string(),
    severity: v.string(),
    keywords: v.array(v.string()),
    message: v.string(),
    language: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("crisisEvents", {
      sessionId: args.sessionId,
      severity: args.severity,
      keywords: args.keywords,
      message: args.message,
      language: args.language,
      timestamp: Date.now(),
    });
  },
});

export const getCrisisEvents = query({
  args: {
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("crisisEvents")
      .withIndex("by_sessionId", (q) => q.eq("sessionId", args.sessionId))
      .order("desc")
      .take(20);
  },
});
