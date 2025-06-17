import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const createOrder = mutation({
  args: {
    shippingAddress: v.object({
      name: v.string(),
      address: v.string(),
      city: v.string(),
      postalCode: v.string(),
      phone: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    // Get cart items
    const cartItems = await ctx.db
      .query("cartItems")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    
    if (cartItems.length === 0) {
      throw new Error("Cart is empty");
    }
    
    // Calculate total and prepare order items
    let totalAmount = 0;
    const orderItems = await Promise.all(
      cartItems.map(async (item) => {
        const product = await ctx.db.get(item.productId);
        if (!product) throw new Error("Product not found");
        
        const price = item.version === "original" 
          ? product.originalPrice 
          : product.ordinaryPrice;
        
        totalAmount += price * item.quantity;
        
        return {
          productId: item.productId,
          version: item.version,
          quantity: item.quantity,
          price,
        };
      })
    );
    
    // Create order
    const orderId = await ctx.db.insert("orders", {
      userId,
      items: orderItems,
      totalAmount,
      status: "pending",
      shippingAddress: args.shippingAddress,
    });
    
    // Clear cart
    for (const item of cartItems) {
      await ctx.db.delete(item._id);
    }
    
    return orderId;
  },
});

export const getUserOrders = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    
    const orders = await ctx.db
      .query("orders")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
    
    return orders;
  },
});
