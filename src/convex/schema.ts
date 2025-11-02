import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
);
export type Role = Infer<typeof roleValidator>;

const schema = defineSchema(
  {
    ...authTables,

    users: defineTable({
      name: v.optional(v.string()),
      image: v.optional(v.string()),
      email: v.optional(v.string()),
      emailVerificationTime: v.optional(v.number()),
      isAnonymous: v.optional(v.boolean()),
      role: v.optional(roleValidator),
      sessionId: v.optional(v.string()),
    }).index("email", ["email"])
      .index("by_sessionId", ["sessionId"]),

    sessions: defineTable({
      sessionId: v.string(),
      userId: v.optional(v.id("users")),
      conversationHistory: v.array(v.object({
        role: v.string(),
        content: v.string(),
        timestamp: v.number(),
        sentiment: v.optional(v.number()),
      })),
      language: v.optional(v.string()),
      lastActive: v.number(),
    }).index("by_sessionId", ["sessionId"])
      .index("by_userId", ["userId"]),

    moodEntries: defineTable({
      sessionId: v.string(),
      userId: v.optional(v.id("users")),
      mood: v.string(),
      intensity: v.number(),
      notes: v.optional(v.string()),
      triggers: v.optional(v.array(v.string())),
      activities: v.optional(v.array(v.string())),
      timestamp: v.number(),
    }).index("by_sessionId", ["sessionId"])
      .index("by_userId", ["userId"])
      .index("by_timestamp", ["timestamp"]),

    journalEntries: defineTable({
      sessionId: v.string(),
      userId: v.optional(v.id("users")),
      title: v.string(),
      content: v.string(),
      mood: v.optional(v.string()),
      tags: v.optional(v.array(v.string())),
      prompt: v.optional(v.string()),
      timestamp: v.number(),
    }).index("by_sessionId", ["sessionId"])
      .index("by_userId", ["userId"])
      .index("by_timestamp", ["timestamp"]),

    crisisEvents: defineTable({
      sessionId: v.string(),
      userId: v.optional(v.id("users")),
      severity: v.string(),
      keywords: v.array(v.string()),
      message: v.string(),
      language: v.string(),
      timestamp: v.number(),
    }).index("by_sessionId", ["sessionId"])
      .index("by_severity", ["severity"])
      .index("by_timestamp", ["timestamp"]),

    resources: defineTable({
      title: v.string(),
      description: v.string(),
      category: v.string(),
      type: v.string(),
      url: v.optional(v.string()),
      content: v.optional(v.string()),
      tags: v.array(v.string()),
      language: v.string(),
      helpfulCount: v.number(),
      viewCount: v.number(),
    }).index("by_category", ["category"])
      .index("by_type", ["type"])
      .index("by_language", ["language"]),

    assessments: defineTable({
      sessionId: v.string(),
      userId: v.optional(v.id("users")),
      type: v.string(),
      score: v.number(),
      severity: v.string(),
      answers: v.array(v.number()),
      timestamp: v.number(),
    }).index("by_sessionId", ["sessionId"])
      .index("by_type", ["type"])
      .index("by_timestamp", ["timestamp"]),

    trustedContacts: defineTable({
      sessionId: v.string(),
      userId: v.optional(v.id("users")),
      name: v.string(),
      phone: v.string(),
      relationship: v.string(),
    }).index("by_sessionId", ["sessionId"])
      .index("by_userId", ["userId"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;