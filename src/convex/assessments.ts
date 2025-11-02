import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const saveAssessment = mutation({
  args: {
    sessionId: v.string(),
    type: v.string(),
    score: v.number(),
    severity: v.string(),
    answers: v.array(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("assessments", {
      sessionId: args.sessionId,
      type: args.type,
      score: args.score,
      severity: args.severity,
      answers: args.answers,
      timestamp: Date.now(),
    });
  },
});

export const getAssessments = query({
  args: {
    sessionId: v.string(),
    type: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("assessments")
      .withIndex("by_sessionId", (q) => q.eq("sessionId", args.sessionId));

    const assessments = await query.collect();

    if (args.type) {
      return assessments.filter(a => a.type === args.type);
    }

    return assessments;
  },
});
