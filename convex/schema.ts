import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
  name: v.string(),
  email: v.string(),
  password: v.string(),
  role: v.union(v.literal("admin"), v.literal("doctor"), v.literal("patient")),
}).index("by_name", ["name"]),

  patients: defineTable({
    userId: v.id("users"),
    nombre: v.string(),
    curp: v.string(),
    tipoSangre: v.string(),
    telefono: v.string(),
  }).index("by_user", ["userId"]),

  doctors: defineTable({
    userId: v.optional(v.id("users")),
    especialidad: v.string(),
    cedula: v.string(),
    horario: v.string(),
    disponible: v.boolean(),
  }).index("by_user", ["userId"]),

  appointments: defineTable({
    patientId: v.id("patients"),
    doctorId: v.id("doctors"),
    fecha: v.number(),
    motivo: v.string(),
    estado: v.union(v.literal("pendiente"), v.literal("completada"), v.literal("cancelada")),
  }).index("by_patient", ["patientId"]).index("by_doctor", ["doctorId"]),

  medicalRecords: defineTable({
    patientId: v.id("patients"),
    doctorId: v.id("doctors"),
    appointmentId: v.id("appointments"),
    diagnostico: v.string(),
    tratamiento: v.string(),
    notas: v.optional(v.string()),
    fechaCreacion: v.number(),
  }).index("by_patient", ["patientId"]),
});