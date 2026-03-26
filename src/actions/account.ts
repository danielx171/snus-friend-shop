import { defineAction, ActionError } from 'astro:actions';
import { z } from 'astro/zod';

export const account = {
  updateProfile: defineAction({
    accept: 'form',
    input: z.object({
      fullName: z.string().min(1, 'Name is required'),
      phone: z.string().optional(),
    }),
    handler: async (input, context) => {
      if (!context.locals.user) {
        throw new ActionError({ code: 'UNAUTHORIZED' });
      }

      const { error } = await context.locals.supabase.auth.updateUser({
        data: {
          full_name: input.fullName,
          phone: input.phone || undefined,
        },
      });

      if (error) {
        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update profile. Please try again.',
        });
      }

      return { success: true };
    },
  }),

  changePassword: defineAction({
    accept: 'form',
    input: z.object({
      newPassword: z.string().min(8, 'Password must be at least 8 characters'),
      confirmPassword: z.string().min(8),
    }).refine(data => data.newPassword === data.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    }),
    handler: async (input, context) => {
      if (!context.locals.user) {
        throw new ActionError({ code: 'UNAUTHORIZED' });
      }

      const { error } = await context.locals.supabase.auth.updateUser({
        password: input.newPassword,
      });

      if (error) {
        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to change password. Please try again.',
        });
      }

      return { success: true };
    },
  }),
};
