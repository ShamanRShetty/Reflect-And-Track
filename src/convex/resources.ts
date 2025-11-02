import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getResources = query({
  args: {
    category: v.optional(v.string()),
    language: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let resources;

    if (args.category !== undefined) {
      const category = args.category;
      resources = await ctx.db
        .query("resources")
        .withIndex("by_category", (q) => q.eq("category", category))
        .collect();
    } else {
      resources = await ctx.db.query("resources").collect();
    }

    if (args.language) {
      return resources.filter(r => r.language === args.language);
    }

    return resources;
  },
});

export const incrementView = mutation({
  args: {
    id: v.id("resources"),
  },
  handler: async (ctx, args) => {
    const resource = await ctx.db.get(args.id);
    if (resource) {
      await ctx.db.patch(args.id, {
        viewCount: resource.viewCount + 1,
      });
    }
  },
});

export const incrementHelpful = mutation({
  args: {
    id: v.id("resources"),
  },
  handler: async (ctx, args) => {
    const resource = await ctx.db.get(args.id);
    if (resource) {
      await ctx.db.patch(args.id, {
        helpfulCount: resource.helpfulCount + 1,
      });
    }
  },
});
