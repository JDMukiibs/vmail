import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  friends: defineTable({
    name: v.string(),
    accessCode: v.string(),
  }).index("by_code", ["accessCode"]),

  messages: defineTable({
    recipientId: v.id("friends"),
    videoStorageId: v.id("_storage"),
    title: v.string(),
    isViewed: v.boolean(),
  }).index("by_recipient", ["recipientId"]),
});
