import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const addContact = mutation({
  args: {
    sessionId: v.string(),
    name: v.string(),
    phone: v.string(),
    relationship: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("trustedContacts", {
      sessionId: args.sessionId,
      name: args.name,
      phone: args.phone,
      relationship: args.relationship,
    });
  },
});

export const getContacts = query({
  args: {
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("trustedContacts")
      .withIndex("by_sessionId", (q) => q.eq("sessionId", args.sessionId))
      .collect();
  },
});

export const deleteContact = mutation({
  args: {
    id: v.id("trustedContacts"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
