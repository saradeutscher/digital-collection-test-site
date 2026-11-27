import { defineCollection } from 'astro:content';
import { file } from 'astro/loaders';
import { z } from 'astro/zod';

// A date can be a full day, a month, or just a year: 1955-11-26, 1955-11, or 1955
const archivalDate = z
  .string()
  .regex(/^(19[0-9]\d)(-(0[1-9]|1[0-2]))?(-(0[1-9]|[12]\d|3[01]))?$/, {
    message: 'Date must look like 1952, 1952-09 or 1952-09-13, between 1900 and 1999',
  });

  const negative = z.object({
    id: z.string(),
    image: z.string(), // folder name under public/iiif
    caption: z.string().optional(),
  });

  const packets = defineCollection({
    loader: file('data/packets.json'),
    schema: z.object({
      id: z.string().regex(/^\d{4}-\d{4}$/, {message: 'Packet ID must look like 1955-1234'}),
      title: z.string().min(3),
      date: archivalDate,
      dateApproximate: z.boolean().default(false),
      place: z.string().optional(),
      subjects: z.array(z.string()).min(1, {message: 'Every packet needs at least one subject'}),
      people: z.array(z.string()).default([]),
      negatives: z.array(negative).default([]),
    }),
  });

  export const collections = { packets };