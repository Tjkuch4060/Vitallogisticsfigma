import { z } from 'zod';

export const checkoutSchema = z.object({
  // Contact Info
  name: z.string().min(2, 'Name must be at least 2 characters'),
  company: z.string().min(2, 'Company name required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional().refine((val) => !val || /^\d{10}$/.test(val), {
    message: 'Phone must be 10 digits'
  }),

  // Address
  address: z.string().min(5, 'Address required'),
  city: z.string().min(2, 'City required'),
  state: z.string().length(2, 'State must be 2 letters (e.g., MN)'),
  zip: z.string().regex(/^\d{5}$/, 'ZIP must be 5 digits'),

  // Delivery
  deliveryMethod: z.enum(['delivery', 'pickup']),

  // Payment
  paymentMethod: z.enum(['card', 'invoice', 'net30']),

  // Optional fields
  addressLine2: z.string().optional(),
  deliveryInstructions: z.string().max(500).optional(),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;
