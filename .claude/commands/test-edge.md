# Test Supabase Edge Function

Test a Supabase edge function by making a curl request with proper headers.

## Usage
- `/test-edge` — list all available edge functions
- `/test-edge spin-wheel` — test a specific function
- `/test-edge create-nyehandel-checkout` — test with POST body

## Steps

1. If no argument provided (`$ARGUMENTS` is empty), list all 14 known edge functions and exit:

   | Function | Auth | Method |
   |----------|------|--------|
   | create-nyehandel-checkout | anon | POST |
   | delivery-callback | webhook-secret | POST |
   | get-order-confirmation | anon | POST |
   | nyehandel-webhook | api-key | POST |
   | ops-b2b-queues | cron-secret | POST |
   | push-order-to-nyehandel | internal | POST |
   | retry-failed-nyehandel-orders | cron-secret | POST |
   | save-waitlist-email | anon | POST |
   | spin-wheel | anon (JWT in body) | POST |
   | check-avatar-unlocks | anon | POST |
   | update-quest-progress | anon | POST |
   | subscribe-newsletter | anon | POST |
   | product-search | anon | GET |
   | get-shipping-methods | anon | GET |

2. Read the anon key from `.env.local` — look for `VITE_SUPABASE_PUBLISHABLE_KEY`

3. Build the curl command:
   ```bash
   curl -w "\n\nHTTP Status: %{http_code}\nTime: %{time_total}s\n" \
     -X POST \
     "https://bozdnoctcszbhemdjsek.supabase.co/functions/v1/<function-name>" \
     -H "Authorization: Bearer <anon-key>" \
     -H "Content-Type: application/json" \
     -d '{}'
   ```

4. For **internal functions** (push-order-to-nyehandel, retry-failed-nyehandel-orders, ops-b2b-queues), also add:
   ```
   -H "x-internal-function-secret: <from INTERNAL_FUNCTION_SECRET in .env.local or warn if missing>"
   ```

5. For **cron-triggered functions** (ops-b2b-queues, retry-failed-nyehandel-orders), also add:
   ```
   -H "x-cron-secret: <from CRON_SECRET in .env.local or warn if missing>"
   ```

6. For **GET functions** (product-search, get-shipping-methods), use `-X GET` and omit `-d`

7. Run the curl command and report:
   - HTTP status code
   - Response time
   - Response body (truncated to 500 chars if very long)
   - Whether the response contains an `error` key (failure) or expected data (success)

## Notes
- Base URL: `https://bozdnoctcszbhemdjsek.supabase.co/functions/v1/`
- Never log secrets in output — mask all but last 4 characters
- If the function returns 401/403, suggest checking auth headers
- If the function returns 500, suggest checking Supabase logs with `/check-site`
