import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {
    category: v.optional(v.union(
      v.literal("makeup"), 
      v.literal("skincare"), 
      v.literal("haircare"), 
      v.literal("fragrance"), 
      v.literal("accessories"), 
      v.literal("bathandbody"), 
      v.literal("nails"), 
      v.literal("bags"), 
      v.literal("shoes")
    )),
    featured: v.optional(v.boolean()),
    newArrival: v.optional(v.boolean()),
    comingSoon: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let products;
    
    if (args.category) {
      products = await ctx.db
        .query("products")
        .withIndex("by_category", (q) => q.eq("category", args.category!))
        .collect();
    } else if (args.featured) {
      products = await ctx.db
        .query("products")
        .withIndex("by_featured", (q) => q.eq("featured", true))
        .collect();
    } else if (args.newArrival) {
      products = await ctx.db
        .query("products")
        .withIndex("by_new_arrival", (q) => q.eq("newArrival", true))
        .collect();
    } else if (args.comingSoon) {
      products = await ctx.db
        .query("products")
        .withIndex("by_coming_soon", (q) => q.eq("comingSoon", true))
        .collect();
    } else {
      products = await ctx.db.query("products").collect();
    }
    
    return Promise.all(
      products.map(async (product) => ({
        ...product,
        originalImageUrl: product.originalImageId 
          ? await ctx.storage.getUrl(product.originalImageId) 
          : null,
        ordinaryImageUrl: product.ordinaryImageId 
          ? await ctx.storage.getUrl(product.ordinaryImageId) 
          : null,
      }))
    );
  },
});

export const get = query({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.id);
    if (!product) return null;
    
    return {
      ...product,
      originalImageUrl: product.originalImageId 
        ? await ctx.storage.getUrl(product.originalImageId) 
        : null,
      ordinaryImageUrl: product.ordinaryImageId 
        ? await ctx.storage.getUrl(product.ordinaryImageId) 
        : null,
    };
  },
});

export const search = query({
  args: {
    searchTerm: v.string(),
    category: v.optional(v.union(
      v.literal("makeup"), 
      v.literal("skincare"), 
      v.literal("haircare"), 
      v.literal("fragrance"), 
      v.literal("accessories"), 
      v.literal("bathandbody"), 
      v.literal("nails"), 
      v.literal("bags"), 
      v.literal("shoes")
    )),
  },
  handler: async (ctx, args) => {
    const products = await ctx.db
      .query("products")
      .withSearchIndex("search_products", (q) => {
        let searchQuery = q.search("name", args.searchTerm);
        if (args.category) {
          searchQuery = searchQuery.eq("category", args.category);
        }
        return searchQuery;
      })
      .take(20);
    
    return Promise.all(
      products.map(async (product) => ({
        ...product,
        originalImageUrl: product.originalImageId 
          ? await ctx.storage.getUrl(product.originalImageId) 
          : null,
        ordinaryImageUrl: product.ordinaryImageId 
          ? await ctx.storage.getUrl(product.ordinaryImageId) 
          : null,
      }))
    );
  },
});

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }
    return await ctx.storage.generateUploadUrl();
  },
});

export const create = mutation({
  args: {
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
    featured: v.optional(v.boolean()),
    newArrival: v.optional(v.boolean()),
    comingSoon: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }
    
    return await ctx.db.insert("products", {
      ...args,
      inStock: true,
    });
  },
});
