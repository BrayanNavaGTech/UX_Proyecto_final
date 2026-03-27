import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    patientId: v.id("patients"),
    doctorId: v.id("doctors"),
    fecha: v.number(),
    motivo: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("appointments", {
      patientId: args.patientId,
      doctorId: args.doctorId,
      fecha: args.fecha,
      motivo: args.motivo,
      estado: "pendiente",
    });
  },
});

export const getDetailed = query({
  handler: async (ctx) => {
    const appointments = await ctx.db.query("appointments").collect();
    return Promise.all(
      appointments.map(async (app) => {
        const patient = await ctx.db.get(app.patientId);
        const doctor = await ctx.db.get(app.doctorId);
        const doctorUser = doctor?.userId ? await ctx.db.get(doctor.userId) : null;
        return {
          ...app,
          patientName: patient?.nombre || "Anonimo",
          doctorName: doctorUser?.name || "Especialista",
          especialidad: doctor?.especialidad || "General"
        };
      })
    );
  },
});