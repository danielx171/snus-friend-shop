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
  let body = {} as T;

  try {
    body = text ? (JSON.parse(text) as T) : ({} as T);
  } catch {
    body = {} as T;
  }

  return {
    ok: response.ok,
    status: response.status,
    body,
  };
};
