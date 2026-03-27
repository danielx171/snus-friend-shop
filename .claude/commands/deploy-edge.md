# Deploy Edge Functions

Deploy one or all Supabase edge functions to production (project: bozdnoctcszbhemdjsek).

## Usage
- `/deploy-edge` — deploy all functions
- `/deploy-edge spin-wheel` — deploy a specific function

## Steps

1. Read the function source from `supabase/functions/<name>/index.ts`
2. Read the shared CORS file from `supabase/functions/_shared/cors.ts`
3. Deploy using Supabase MCP `deploy_edge_function` tool with:
   - project_id: `bozdnoctcszbhemdjsek`
   - Include `_shared/cors.ts` as a dependency file
   - Set `verify_jwt` based on `supabase/config.toml`
4. Report version number and status

## Function Registry

| Function | verify_jwt | Notes |
|----------|-----------|-------|
| spin-wheel | false | Handles own JWT via Authorization header |
| create-nyehandel-checkout | false | Public checkout, validates inputs |
| get-order-confirmation | false | Auth via orderId + email match |
| nyehandel-delivery-callback | false | Auth via webhook secret |
| save-waitlist-email | false | Public, validates email |
| sync-nyehandel | true | Internal, cron/admin only |
| push-order-to-nyehandel | true | Internal function-to-function |
| retry-failed-nyehandel-orders | true | Cron-triggered |
| ops-b2b-queues | true | Cron-triggered |
| nyehandel-webhook | false | Auth via API key header |
| nyehandel-proxy | true | Admin/ops only |
| ops-users | true | Admin only |
| ops-set-role | true | Admin only |
| verify-admin | false | Returns isAdmin boolean |
| healthcheck | false | Public status check |
| get-shipping-methods | false | Public, cached |
| webhook-inbox | true | Admin only |
| update-quest-progress | true | Gamification quest tracking |
| check-avatar-unlocks | true | Internal function-to-function |
| generate-review-summary | true | AI review summarization |
| batch-review-summaries | true | Cron batch job |
| redeem-points | true | Points redemption |
| send-email | true | Transactional email via Resend |

If deploying all, iterate through the registry above.
If deploying a specific function, match $ARGUMENTS against function names.
