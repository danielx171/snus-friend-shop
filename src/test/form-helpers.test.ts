import { stringify as stringifyDevalue } from 'devalue';
import { describe, expect, it } from 'vitest';
import { parseJsonResponse } from '@/scripts/form-helpers';

describe('parseJsonResponse', () => {
  it('decodes Astro action success payloads serialized as json+devalue', async () => {
    const response = new Response(
      stringifyDevalue({
        success: true,
        message: 'Check your inbox — we sent you a login link.',
      }),
      {
        headers: {
          'Content-Type': 'application/json+devalue',
        },
      },
    );

    const result = await parseJsonResponse<{ success?: boolean; message?: string }>(response);

    expect(result.ok).toBe(true);
    expect(result.body).toEqual({
      success: true,
      message: 'Check your inbox — we sent you a login link.',
    });
  });

  it('keeps Astro action errors readable as normal JSON objects', async () => {
    const response = new Response(
      JSON.stringify({
        type: 'AstroActionError',
        code: 'BAD_REQUEST',
        status: 400,
        message: 'Please wait about a minute before trying again.',
      }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    const result = await parseJsonResponse<{ message?: string }>(response);

    expect(result.ok).toBe(false);
    expect(result.body.message).toBe('Please wait about a minute before trying again.');
  });
});
