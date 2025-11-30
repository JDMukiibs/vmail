import { query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Authenticates a friend using their unique access code.
 * @returns The friend's ID and name if the code is valid, otherwise null.
 */
export const authenticateByCode = query({
  args: {
    code: v.string(),
  },
  handler: async (ctx, args) => {
    const friend = await ctx.db
      .query("friends")
      .withIndex("by_code", (q) => q.eq("accessCode", args.code))
      .unique();

    if (friend) {
      return {
        id: friend._id,
        name: friend.name,
      };
    }

    return null;
  },
});
