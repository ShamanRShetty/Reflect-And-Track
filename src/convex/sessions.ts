import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createSession = mutation({
  args: {
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("sessions")
      .withIndex("by_sessionId", (q) => q.eq("sessionId", args.sessionId))
      .first();

    if (existing) {
      return existing._id;
    }

    return await ctx.db.insert("sessions", {
      sessionId: args.sessionId,
      conversationHistory: [],
      lastActive: Date.now(),
    });
  },
});

export const getSession = query({
  args: {
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("sessions")
      .withIndex("by_sessionId", (q) => q.eq("sessionId", args.sessionId))
      .first();
  },
});

export const updateConversation = mutation({
  args: {
    sessionId: v.string(),
    message: v.object({
      role: v.string(),
      content: v.string(),
      timestamp: v.number(),
      sentiment: v.optional(v.number()),
    }),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_sessionId", (q) => q.eq("sessionId", args.sessionId))
      .first();

    if (!session) {
      throw new Error("Session not found");
    }

    const history = [...session.conversationHistory, args.message];
    const recentHistory = history.slice(-10);

    await ctx.db.patch(session._id, {
      conversationHistory: recentHistory,
      lastActive: Date.now(),
    });
  },
});

export const clearSession = mutation({
  args: {
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_sessionId", (q) => q.eq("sessionId", args.sessionId))
      .first();

    if (session) {
      await ctx.db.patch(session._id, {
        conversationHistory: [],
        lastActive: Date.now(),
      });
    }
  },
});
