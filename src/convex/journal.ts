import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createEntry = mutation({
  args: {
    sessionId: v.string(),
    title: v.string(),
    content: v.string(),
    mood: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    prompt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("journalEntries", {
      sessionId: args.sessionId,
      title: args.title,
      content: args.content,
      mood: args.mood,
      tags: args.tags,
      prompt: args.prompt,
      timestamp: Date.now(),
    });
  },
});

export const getEntries = query({
  args: {
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("journalEntries")
      .withIndex("by_sessionId", (q) => q.eq("sessionId", args.sessionId))
      .order("desc")
      .collect();
  },
});

export const updateEntry = mutation({
  args: {
    id: v.id("journalEntries"),
    title: v.string(),
    content: v.string(),
    mood: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

export const deleteEntry = mutation({
  args: {
    id: v.id("journalEntries"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
