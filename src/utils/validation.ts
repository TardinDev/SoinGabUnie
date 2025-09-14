import { z } from 'zod';

export const bookingSchema = z.object({
  userName: z
    .string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères'),

  phone: z
    .string()
    .min(8, 'Le numéro de téléphone doit contenir au moins 8 chiffres')
    .regex(/^[0-9+\s-()]+$/, 'Format de téléphone invalide'),

  reason: z
    .string()
    .min(3, 'Veuillez préciser le motif de consultation')
    .max(200, 'Le motif ne peut pas dépasser 200 caractères'),

  date: z
    .string()
    .refine((date) => {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    }, 'La date ne peut pas être dans le passé'),

  time: z
    .string()
    .min(1, 'Veuillez sélectionner une heure'),

  notes: z
    .string()
    .max(300, 'Les notes ne peuvent pas dépasser 300 caractères')
    .optional(),
});

export type BookingFormData = z.infer<typeof bookingSchema>;