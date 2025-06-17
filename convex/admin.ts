import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { internal, api } from "./_generated/api";

// Internal mutation to create user profile
export const createUserProfile = internalMutation({
  args: {
    userId: v.id("users"),
    isAdmin: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("userProfiles", {
      userId: args.userId,
      isAdmin: args.isAdmin,
      lastActive: Date.now(),
    });
  },
});

// Internal mutation to update user profile
export const updateUserProfile = internalMutation({
  args: {
    profileId: v.id("userProfiles"),
    isAdmin: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.profileId, { isAdmin: args.isAdmin });
  },
});

// Check if user is admin
export const isAdmin = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return false;
    
    const user = await ctx.db.get(userId);
    if (!user) return false;
    
    // Check if user is the admin email
    if (user.email === "abyesizajoel@gmail.com") {
      return true;
    }
    
    // Check if user has admin profile
    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    
    return profile?.isAdmin || false;
  },
});

// Get dashboard statistics
export const getDashboardStats = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    const isUserAdmin = await ctx.runQuery(api.admin.isAdmin);
    if (!isUserAdmin) throw new Error("Not authorized");
    
    // Get total products
    const totalProducts = (await ctx.db.query("products").collect()).length;
    
    // Get total users
    const totalUsers = (await ctx.db.query("users").collect()).length;
    
    // Get total orders
    const orders = await ctx.db.query("orders").collect();
    const totalOrders = orders.length;
    
    // Get total revenue
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    
    // Get recent orders
    const recentOrders = await ctx.db
      .query("orders")
      .order("desc")
      .take(5);
    
    // Get order status counts
    const orderStatusCounts = {
      pending: orders.filter(o => o.status === "pending").length,
      confirmed: orders.filter(o => o.status === "confirmed").length,
      shipped: orders.filter(o => o.status === "shipped").length,
      delivered: orders.filter(o => o.status === "delivered").length,
      cancelled: orders.filter(o => o.status === "cancelled").length,
    };
    
    // Get product views and likes
    const productViews = (await ctx.db.query("productViews").collect()).length;
    const productLikes = (await ctx.db.query("productLikes").collect()).length;
    
    return {
      totalProducts,
      totalUsers,
      totalOrders,
      totalRevenue,
      recentOrders,
      orderStatusCounts,
      productViews,
      productLikes,
    };
  },
});

// Get all users for user management
export const getAllUsers = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    const isUserAdmin = await ctx.runQuery(api.admin.isAdmin);
    if (!isUserAdmin) throw new Error("Not authorized");
    
    const users = await ctx.db.query("users").collect();
    
    const usersWithProfiles = await Promise.all(
      users.map(async (user) => {
        const profile = await ctx.db
          .query("userProfiles")
          .withIndex("by_user", (q) => q.eq("userId", user._id))
          .first();
        
        const orderCount = (await ctx.db
          .query("orders")
          .withIndex("by_user", (q) => q.eq("userId", user._id))
          .collect()).length;
        
        return {
          ...user,
          profile,
          orderCount,
        };
      })
    );
    
    return usersWithProfiles;
  },
});

// Get all orders for order management
export const getAllOrders = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    const isUserAdmin = await ctx.runQuery(api.admin.isAdmin);
    if (!isUserAdmin) throw new Error("Not authorized");
    
    const orders = await ctx.db.query("orders").order("desc").collect();
    
    const ordersWithUsers = await Promise.all(
      orders.map(async (order) => {
        const user = await ctx.db.get(order.userId);
        return {
          ...order,
          user,
        };
      })
    );
    
    return ordersWithUsers;
  },
});

// Update order status
export const updateOrderStatus = mutation({
  args: {
    orderId: v.id("orders"),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("shipped"),
      v.literal("delivered"),
      v.literal("cancelled")
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    const isUserAdmin = await ctx.runQuery(api.admin.isAdmin);
    if (!isUserAdmin) throw new Error("Not authorized");
    
    await ctx.db.patch(args.orderId, { status: args.status });
  },
});

// Toggle user admin status
export const toggleUserAdmin = mutation({
  args: {
    targetUserId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    const isUserAdmin = await ctx.runQuery(api.admin.isAdmin);
    if (!isUserAdmin) throw new Error("Not authorized");
    
    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", args.targetUserId))
      .first();
    
    if (profile) {
      await ctx.db.patch(profile._id, { isAdmin: !profile.isAdmin });
    } else {
      await ctx.db.insert("userProfiles", {
        userId: args.targetUserId,
        isAdmin: true,
        lastActive: Date.now(),
      });
    }
  },
});
