# FastCC QR — Design System

FastCC QR follows a **CaoLiao-inspired industrial utility UI**: high-contrast, low-chrome, and engineered for clarity on shop floors, warehouses, and mobile devices.

---

## Visual Language

- **Surfaces**: Crisp white (`#FFFFFF`) content cards over neutral slate (`#F8FAFC` / `#F1F5F9`) backgrounds with `1px` hairline borders (`#E2E8F0`).
- **Typography**: Clean sans-serif (`Inter` / system UI) for UI copy and tabular monospace (`JetBrains Mono` / system mono) for `short_code`s, timestamps, and step numbers.
- **Zero Fluff**: No decorative gradients or heavy shadows. Hierarchy relies on spacing, border contrast, and semantic color.

---

## Color Tokens

Defined in [`src/app/globals.css`](src/app/globals.css) via Tailwind v4 `@theme`:

| Token | Hex | Usage |
| :--- | :--- | :--- |
| `--color-surface` | `#FFFFFF` | Primary cards, panels, input fields |
| `--color-canvas` | `#F8FAFC` | App background canvas |
| `--color-canvas-muted` | `#F1F5F9` | Secondary panels, table headers, subtle dividers |
| `--color-border` | `#E2E8F0` | Structural 1px borders |
| `--color-ink` | `#0F172A` | Primary headings and body text |
| `--color-ink-muted` | `#475569` | Secondary labels, helper text |
| `--color-action-green` | `#16A34A` | Primary CTAs, Pass/Verified states, active publish |
| `--color-utility-blue` | `#2563EB` | Utility links, QR download/print, info badges |
| `--color-alert-red` | `#DC2626` | Critical SOP warnings, Fail/Defect states, destructive actions |

---

## Mobile Worker Ergonomics (`/q/[id]`)

Frontline workers scan QR codes in warehouses, kitchens, or factory floors—often one-handed, in poor lighting, or wearing gloves:

- **48px+ Tap Targets**: Every interactive button, checklist toggle, and form submit control on worker views must be at least `48px` tall (`min-h-12`) with generous spacing (`gap-3` / `12px+`).
- **Unambiguous States**: Pass (`#16A34A`) and Fail (`#DC2626`) actions use explicit labels alongside icons—never color alone.
- **Step Scannability**: Large step indices, bold step titles, and highlighted critical warnings (`--color-alert-red`).

---

## Studio Ergonomics (`/studio/[id]`)

- **Structured Workspace**: Clear separation between SOP step authoring, live mobile preview, and printable QR label output.
- **Instant Feedback**: Optimistic or immediate state indicators for saving, copying `/q/[id]` links, and downloading QR assets.
