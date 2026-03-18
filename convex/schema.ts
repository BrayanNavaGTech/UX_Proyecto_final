import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    role: v.union(v.literal("admin"), v.literal("doctor"), v.literal("patient")),
    imageUrl: v.optional(v.string()),
  }).index("by_email", ["email"]),

  patients: defineTable({
    userId: v.id("users"),
    nombre: v.string(),
    fechaNacimiento: v.string(),
    tipoSangre: v.string(),
    telefono: v.string(),
  }),

  doctors: defineTable({
    userId: v.id("users"),
    especialidad: v.string(),
    cedula: v.string(),
    disponible: v.boolean(),
  }),

  appointments: defineTable({
    patientId: v.id("patients"),
    doctorId: v.id("doctors"),
    fechaHora: v.number(),
    motivo: v.string(),
    estado: v.union(v.literal("pendiente"), v.literal("completada"), v.literal("cancelada")),
  }).index("by_patient", ["patientId"]).index("by_doctor", ["doctorId"]),

  medicalRecords: defineTable({
    patientId: v.id("patients"),
    appointmentId: v.id("appointments"),
    diagnostico: v.string(),
    tratamiento: v.string(),
    fecha: v.number(),
  }),
});