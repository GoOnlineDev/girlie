import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const subscribe = mutation({
  args: {
    email: v.string(),
    preferences: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("newsletters")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        subscribed: true,
        preferences: args.preferences,
      });
      return existing._id;
    } else {
      return await ctx.db.insert("newsletters", {
        email: args.email,
        subscribed: true,
        preferences: args.preferences,
      });
    }
  },
});

export const unsubscribe = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("newsletters")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { subscribed: false });
    }
  },
});

export const getSubscribers = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("newsletters")
      .withIndex("by_subscribed", (q) => q.eq("subscribed", true))
      .collect();
  },
});
