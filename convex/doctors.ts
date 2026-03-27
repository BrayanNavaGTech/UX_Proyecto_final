import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db.query("doctors").collect();
  },
});

export const create = mutation({
  args: {
    userId: v.optional(v.id("users")), 
    especialidad: v.string(),
    cedula: v.string(),
    horario: v.string(),
    disponible: v.boolean(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("doctors", args);
  },
});

export const toggleAvailability = mutation({
  args: { id: v.id("doctors"), disponible: v.boolean() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { disponible: args.disponible });
  },
});

export const remove = mutation({
  args: { id: v.id("doctors") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const getStats = query({
  handler: async (ctx) => {
    const patients = await ctx.db.query("patients").collect();
    const appointments = await ctx.db.query("appointments").collect();
    
    const pendingAppointments = appointments.filter(
      (app) => app.estado === "pendiente"
    );

    return {
      totalPatients: patients.length,
      totalAppointments: appointments.length,
      pendingCount: pendingAppointments.length,
    };
  },
});

export const getByUserId = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("doctors")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .unique();
  },
});