import { parse as parseDevalue } from 'devalue';

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface JsonResponse<T extends object> {
  ok: boolean;
  status: number;
  body: T;
}

export const parseJsonResponse = async <T extends object>(
  response: Response,
): Promise<JsonResponse<T>> => {
  const text = await response.text();
  const contentType = response.headers.get('content-type') ?? '';
  let body = {} as T;

  try {
    if (!text) {
      body = {} as T;
    } else if (contentType.includes('application/json+devalue')) {
      body = parseDevalue(text) as T;
    } else {
      body = JSON.parse(text) as T;
    }
  } catch {
    body = {} as T;
  }

  return {
    ok: response.ok,
    status: response.status,
    body,
  };
};
