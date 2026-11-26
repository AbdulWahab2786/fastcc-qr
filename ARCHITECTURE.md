# FastCC QR — System Architecture

FastCC QR is an AI-first CaoLiao QR Code alternative built for SMB operations (standard operating procedures, equipment checklists, and frontline inspection logging).

## Tech Stack

- **Framework**: Next.js (App Router, TypeScript, `src/` directory)
- **Styling**: Tailwind CSS v4 (`@theme` tokens in `src/app/globals.css`)
- **Backend & Auth**: Supabase (`@supabase/supabase-js`, `@supabase/ssr`)
- **Icons & QR**: `lucide-react`, `qrcode`
- **AI (Reserved)**: Google Gemini (`GEMINI_API_KEY`) via `/api/ai/*`

---

## Application Routes

| Route | Purpose | Access |
| :--- | :--- | :--- |
| `/` | Landing page & quick QR / SOP generator entry | Public |
| `/studio/[id]` | QR & SOP editor, print/export studio (accepts `short_code` or UUID) | Public preview / Owner edit |
| `/q/[id]` | Mobile-first frontline worker view (maps `[id]` to `short_code`) | Public |
| `/api/ai/*` | Reserved endpoints for AI SOP drafting & inspection summaries | Server / Authenticated |

---

## Supabase Schema & Row-Level Security (RLS)

Defined in [`supabase/migrations/001_init.sql`](supabase/migrations/001_init.sql):

### Tables

1. **`qr_codes`**
   - Primary record for each operational QR code (`id`, `short_code`, `user_id`, `title`, `description`, `category`, `show_watermark`, `created_at`, `updated_at`).
   - `short_code` is a unique URL-safe identifier used in `/q/[id]` and `/studio/[id]`.

2. **`sop_steps`**
   - Ordered instructions and checklist items belonging to a `qr_code` (`id`, `qr_code_id`, `step_order`, `title`, `instruction`, `is_critical`, `created_at`).

3. **`inspection_logs`**
   - Frontline worker execution records (`id`, `qr_code_id`, `inspector_name`, `status`, `notes`, `step_results`, `created_at`).

### RLS Policy Model

| Table | `SELECT` | `INSERT` | `UPDATE` / `DELETE` |
| :--- | :--- | :--- | :--- |
| `qr_codes` | Public (`true`) | `anon`: requires `user_id IS NULL AND show_watermark = true`<br>`authenticated`: requires `auth.uid() = user_id` | Owner only (`auth.uid() = user_id`) |
| `sop_steps` | Public (`true`) | Allowed for guest-created QR codes (`user_id IS NULL`) or owner (`auth.uid() = qr_codes.user_id`) | Owner only (`auth.uid() = qr_codes.user_id`) |
| `inspection_logs` | **Owner only** (`auth.uid() = qr_codes.user_id`) | Public (`true`) for frontline workers | Owner only (`auth.uid() = qr_codes.user_id`) |

---

## Guest vs. Owner Flow

### Guest Flow (Zero-Friction Trial)
1. A visitor creates a QR code and SOP steps from `/`.
2. The `anon` client inserts into `qr_codes` with `user_id = NULL` and `show_watermark = true`.
3. The generated `/q/[short_code]` page is immediately scannable by workers, displaying the FastCC QR watermark.
4. Frontline workers can submit `inspection_logs` without signing in.

### Owner Flow (Authenticated SMB Operator)
1. Operators sign in via Supabase Auth. Session cookies are refreshed on every request in `src/proxy.ts` using `supabase.auth.getClaims()`.
2. Owners can create watermark-free QR codes (`user_id = auth.uid()`, `show_watermark = false`), edit or delete their QR codes and `sop_steps` in `/studio/[id]`, and read private `inspection_logs` submitted by frontline workers.
