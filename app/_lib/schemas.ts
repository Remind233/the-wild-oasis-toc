import { z } from "zod";

export const ProfileUpdateSchema = z.object({
  nationalID: z
    .string()
    .regex(
      /^[a-zA-Z0-9]{6,12}$/,
      "Please provide a valid national ID (6-12 alphanumeric characters)"
    ),
  nationality: z
    .string()
    .includes("%", { message: "Invalid nationality format" }),
});

export const BookingUpdateSchema = z.object({
  numGuests: z.coerce
    .number()
    .int()
    .positive("Please select a valid number of guests"),
  observations: z
    .string()
    .max(1000, "Observations must be under 1000 characters")
    .optional(),
});
