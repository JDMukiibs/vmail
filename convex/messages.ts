import { action, mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Converts a Convex storageId into a direct, playable URL.
 */
export const getDownloadUrl = action({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const url = await ctx.storage.getUrl(args.storageId);

    if (!url) {
      throw new Error(
        `Could not retrieve URL for storage ID: ${args.storageId}`
      );
    }

    return url;
  },
});

export const getMyMessages = query({
  args: {
    recipientId: v.id("friends"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_recipient", (q) => q.eq("recipientId", args.recipientId))
      .collect();
  },
});

export const markAsViewed = mutation({
  args: {
    messageId: v.id("messages"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.messageId, { isViewed: true });
  },
});
