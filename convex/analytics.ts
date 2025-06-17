import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Track product view
export const trackProductView = mutation({
  args: {
    productId: v.id("products"),
    sessionId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    
    // Check if this user/session already viewed this product recently (within 1 hour)
    const recentView = await ctx.db
      .query("productViews")
      .withIndex("by_product", (q) => q.eq("productId", args.productId))
      .filter((q) => {
        if (userId) {
          return q.eq(q.field("userId"), userId);
        } else if (args.sessionId) {
          return q.eq(q.field("sessionId"), args.sessionId);
        }
        return q.eq(q.field("userId"), null);
      })
      .order("desc")
      .first();
    
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    if (recentView && recentView._creationTime > oneHourAgo) {
      return; // Don't track duplicate views within an hour
    }
    
    // Track the view
    await ctx.db.insert("productViews", {
      productId: args.productId,
      userId: userId || undefined,
      sessionId: args.sessionId,
    });
    
    // Update product view count
    const product = await ctx.db.get(args.productId);
    if (product) {
      await ctx.db.patch(args.productId, {
        views: (product.views || 0) + 1,
      });
    }
  },
});

// Toggle product like
export const toggleProductLike = mutation({
  args: {
    productId: v.id("products"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    const existingLike = await ctx.db
      .query("productLikes")
      .withIndex("by_user_and_product", (q) => 
        q.eq("userId", userId).eq("productId", args.productId)
      )
      .first();
    
    const product = await ctx.db.get(args.productId);
    if (!product) throw new Error("Product not found");
    
    if (existingLike) {
      // Remove like
      await ctx.db.delete(existingLike._id);
      await ctx.db.patch(args.productId, {
        likes: Math.max(0, (product.likes || 0) - 1),
      });
      return false;
    } else {
      // Add like
      await ctx.db.insert("productLikes", {
        productId: args.productId,
        userId,
      });
      await ctx.db.patch(args.productId, {
        likes: (product.likes || 0) + 1,
      });
      return true;
    }
  },
});

// Check if user liked a product
export const isProductLiked = query({
  args: {
    productId: v.id("products"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return false;
    
    const like = await ctx.db
      .query("productLikes")
      .withIndex("by_user_and_product", (q) => 
        q.eq("userId", userId).eq("productId", args.productId)
      )
      .first();
    
    return !!like;
  },
});
