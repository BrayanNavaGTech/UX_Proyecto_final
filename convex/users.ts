import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const registerPatient = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_name", (q) => q.eq("name", args.name))
      .unique();

    if (existing) throw new Error("El nombre de usuario ya está en uso");

    const userId = await ctx.db.insert("users", {
      name: args.name,
      email: args.email,
      password: args.password,
      role: "patient",
    });

    await ctx.db.insert("patients", {
      userId: userId,
      nombre: args.name,
      curp: "PENDIENTE",
      tipoSangre: "Sin definir",
      telefono: "Sin definir",
    });

    return userId;
  },
});

export const login = query({
  args: { 
    name: v.string(),
    password: v.string() 
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_name", (q) => q.eq("name", args.name))
      .unique();

    if (!user || user.password !== args.password) {
      return null;
    }

    return user;
  },
});

export const registerDoctor = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    password: v.string(),
    especialidad: v.string(),
    cedula: v.string(),
    horario: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_name", (q) => q.eq("name", args.name))
      .unique();

    if (existing) throw new Error("El nombre de usuario ya está en uso");

    const userId = await ctx.db.insert("users", {
      name: args.name,
      email: args.email,
      password: args.password,
      role: "doctor",
    });

    await ctx.db.insert("doctors", {
      userId: userId,
      especialidad: args.especialidad,
      cedula: args.cedula,
      horario: args.horario,
      disponible: true,
    });

    return userId;
  },
});

export const getAllUsers = query({
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

export const updatePassword = mutation({
  args: { 
    userId: v.id("users"), 
    newPassword: v.string() 
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, { password: args.newPassword });
    return { success: true };
  },
});