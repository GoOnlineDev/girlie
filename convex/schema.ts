import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  products: defineTable({
    name: v.string(),
    category: v.union(
      v.literal("makeup"), 
      v.literal("skincare"), 
      v.literal("haircare"), 
      v.literal("fragrance"), 
      v.literal("accessories"), 
      v.literal("bathandbody"), 
      v.literal("nails"), 
      v.literal("bags"), 
      v.literal("shoes")
    ),
    description: v.string(),
    originalPrice: v.number(),
    ordinaryPrice: v.number(),
    originalImageId: v.optional(v.id("_storage")),
    ordinaryImageId: v.optional(v.id("_storage")),
    inStock: v.boolean(),
    featured: v.optional(v.boolean()),
    newArrival: v.optional(v.boolean()),
    comingSoon: v.optional(v.boolean()),
    views: v.optional(v.number()),
    likes: v.optional(v.number()),
    rating: v.optional(v.number()),
    reviewCount: v.optional(v.number()),
  })
    .index("by_category", ["category"])
    .index("by_featured", ["featured"])
    .index("by_new_arrival", ["newArrival"])
    .index("by_coming_soon", ["comingSoon"])
    .searchIndex("search_products", {
      searchField: "name",
      filterFields: ["category"],
    }),

  cartItems: defineTable({
    userId: v.id("users"),
    productId: v.id("products"),
    version: v.union(v.literal("original"), v.literal("ordinary")),
    quantity: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_product", ["userId", "productId"]),

  orders: defineTable({
    userId: v.id("users"),
    items: v.array(v.object({
      productId: v.id("products"),
      version: v.union(v.literal("original"), v.literal("ordinary")),
      quantity: v.number(),
      price: v.number(),
    })),
    totalAmount: v.number(),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("shipped"),
      v.literal("delivered"),
      v.literal("cancelled")
    ),
    shippingAddress: v.object({
      name: v.string(),
      address: v.string(),
      city: v.string(),
      postalCode: v.string(),
      phone: v.string(),
    }),
  })
    .index("by_user", ["userId"])
    .index("by_status", ["status"]),

  productViews: defineTable({
    productId: v.id("products"),
    userId: v.optional(v.id("users")),
    sessionId: v.optional(v.string()),
  })
    .index("by_product", ["productId"])
    .index("by_user", ["userId"]),

  productLikes: defineTable({
    productId: v.id("products"),
    userId: v.id("users"),
  })
    .index("by_product", ["productId"])
    .index("by_user", ["userId"])
    .index("by_user_and_product", ["userId", "productId"]),

  reviews: defineTable({
    productId: v.id("products"),
    userId: v.id("users"),
    rating: v.number(),
    title: v.string(),
    comment: v.string(),
    verified: v.optional(v.boolean()),
  })
    .index("by_product", ["productId"])
    .index("by_user", ["userId"])
    .index("by_rating", ["rating"]),

  newsletters: defineTable({
    email: v.string(),
    subscribed: v.boolean(),
    preferences: v.optional(v.array(v.string())),
  })
    .index("by_email", ["email"])
    .index("by_subscribed", ["subscribed"]),

  userProfiles: defineTable({
    userId: v.id("users"),
    isAdmin: v.optional(v.boolean()),
    lastActive: v.optional(v.number()),
    totalOrders: v.optional(v.number()),
    totalSpent: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_admin", ["isAdmin"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
