import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  handler: async (ctx) => {
    return await ctx.db.query("patients").collect();
  },
});

export const create = mutation({
  args: {
    userId: v.id("users"),
    nombre: v.string(),
    curp: v.string(),
    tipoSangre: v.string(),
    telefono: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("patients", args);
  },
});

export const updateProfile = mutation({
  args: {
    patientId: v.id("patients"),
    curp: v.string(),
    telefono: v.string(),
    tipoSangre: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.patientId, {
      curp: args.curp,
      telefono: args.telefono,
      tipoSangre: args.tipoSangre,
    });
  },
});

export const getByUserId = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("patients")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .unique();
  },
});