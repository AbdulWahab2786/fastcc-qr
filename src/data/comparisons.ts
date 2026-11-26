export interface ComparisonRow {
  feature: string;
  fastcc: string;
  competitor: string;
}

export interface CompetitorComparison {
  slug: "sopx" | "clappia" | "uniqode";
  competitorName: string;
  headline: string;
  subheadline: string;
  metaTitle: string;
  metaDescription: string;
  pricingHighlight: string;
  keyDifferentiators: string[];
  rows: ComparisonRow[];
  whoShouldSwitch: {
    title: string;
    points: string[];
  };
}

export const COMPARISONS: Record<
  CompetitorComparison["slug"],
  CompetitorComparison
> = {
  sopx: {
    slug: "sopx",
    competitorName: "SOPX",
    headline: "FastCC QR vs. SOPX",
    subheadline:
      "Get AI video-to-SOP extraction, multilingual frontline instructions, and permanent shop-floor QR codes without SOPX's $199/mo enterprise contract.",
    metaTitle: "FastCC QR vs. SOPX — Free Permanent Operational QRs & Multilingual SOPs",
    metaDescription:
      "Compare FastCC QR and SOPX. Skip $199/mo enterprise pricing with free-forever permanent QRs, AI video-to-SOP generation, and Hindi, Hinglish, Telugu & Tamil support.",
    pricingHighlight: "Free-forever permanent QRs vs. $199/mo enterprise tiers",
    keyDifferentiators: [
      "Free-forever permanent operational QR codes — no forced $199/mo enterprise plan to keep shop-floor labels active.",
      "Native Indian & regional frontline languages (English, Hindi, Hinglish, Telugu, Tamil) out of the box.",
      "Zero-login mobile worker scan page with 48px+ tap targets and instant inspection logging.",
    ],
    rows: [
      {
        feature: "Starting Price",
        fastcc: "Free-forever permanent operational QRs",
        competitor: "$199/mo enterprise pricing",
      },
      {
        feature: "AI Video-to-SOP",
        fastcc: "Upload a 60s shop-floor video → numbered SOP + QC checklist",
        competitor: "Enterprise workflow setup required",
      },
      {
        feature: "Regional Language Support",
        fastcc: "Built-in English, Hindi, Hinglish, Telugu & Tamil switcher",
        competitor: "Limited to enterprise localization add-ons",
      },
      {
        feature: "Frontline Worker Access",
        fastcc: "Zero-login, zero-app mobile web scan (/q/[id])",
        competitor: "Seat-based workspace onboarding",
      },
      {
        feature: "Paper Checklist Digitization",
        fastcc: "Snap a photo → instant mobile PASS/FAIL form",
        competitor: "Manual template configuration",
      },
      {
        feature: "Print-Ready Label Studio",
        fastcc: "A4 Wall Poster, Equipment Plate & Thermal Sticker presets",
        competitor: "Basic QR export",
      },
    ],
    whoShouldSwitch: {
      title: "Who Should Switch from SOPX to FastCC QR",
      points: [
        "SMB manufacturers, D2C fulfillment warehouses, and cloud kitchens that cannot justify $199/mo per facility.",
        "Operations teams with multilingual shop-floor staff who need instant Hindi, Hinglish, Telugu, or Tamil instructions on a single tap.",
        "Supervisors who want to print permanent machine plates and start collecting inspection logs in under 60 seconds without IT procurement.",
      ],
    },
  },
  clappia: {
    slug: "clappia",
    competitorName: "Clappia",
    headline: "FastCC QR vs. Clappia",
    subheadline:
      "Skip manual drag-and-drop form building, per-user fees, and mandatory app installs. Turn any shop-floor video or paper register into a scannable mobile web SOP in seconds.",
    metaTitle: "FastCC QR vs. Clappia — Zero-App AI SOPs Without Per-User Pricing",
    metaDescription:
      "Compare FastCC QR and Clappia. Avoid ₹450–₹600/user/mo fees and mandatory app installs with AI video/paper auto-generation and zero-login mobile web scans.",
    pricingHighlight: "Zero per-user fees vs. ₹450–₹600/user/mo",
    keyDifferentiators: [
      "AI Video-to-SOP and Paper-to-Form auto-generation replaces hours of manual drag-and-drop form building.",
      "Zero-app mobile web scan — contract workers and floor staff scan with any phone camera and submit logs with no app download or login.",
      "No per-user seat tax as your shift headcount grows, unlike Clappia's ₹450–₹600/user/mo plans.",
    ],
    rows: [
      {
        feature: "Pricing Model",
        fastcc: "Free permanent QRs — no per-worker seat tax",
        competitor: "Per-user pricing starting at ₹450–₹600/user/mo",
      },
      {
        feature: "Form & SOP Creation",
        fastcc: "AI auto-generates from a 60s video or paper photo",
        competitor: "Manual drag-and-drop no-code form builder",
      },
      {
        feature: "Worker App Requirement",
        fastcc: "Zero app install, zero login — works in any mobile browser",
        competitor: "Requires Clappia mobile app & user login",
      },
      {
        feature: "Multilingual Floor Switcher",
        fastcc: "One-tap English, Hindi, Hinglish, Telugu & Tamil",
        competitor: "Manual multi-language field setup",
      },
      {
        feature: "Industrial QR Label Printing",
        fastcc: "Built-in A4 Poster, Machine Plate & 58mm Thermal Sticker",
        competitor: "Not built for shop-floor label printing",
      },
      {
        feature: "Setup Time",
        fastcc: "Under 60 seconds from upload to printed QR",
        competitor: "Hours of app configuration & user provisioning",
      },
    ],
    whoShouldSwitch: {
      title: "Who Should Switch from Clappia to FastCC QR",
      points: [
        "Factories, warehouses, and field teams with high seasonal or contract worker turnover where paying ₹450–₹600/user/mo and forcing app installs fails.",
        "Supervisors tired of manually rebuilding paper logbooks field-by-field when a single photo can digitize the form automatically.",
        "Teams that need a physical QR sticker on every machine or packing table that any worker can scan and sign off in 10 seconds.",
      ],
    },
  },
  uniqode: {
    slug: "uniqode",
    competitorName: "Uniqode",
    headline: "FastCC QR vs. Uniqode",
    subheadline:
      "Uniqode is built for marketing campaigns with strict dynamic QR and form caps. FastCC QR is built for shop-floor operations with unlimited permanent QRs and AI SOPs.",
    metaTitle: "FastCC QR vs. Uniqode — Unlimited Operational QRs vs. 15-QR Caps",
    metaDescription:
      "Compare FastCC QR and Uniqode. Move past Uniqode's $9/mo Essential caps (15 dynamic QRs & 100 form responses/yr) with unlimited permanent operational QRs and AI SOPs.",
    pricingHighlight: "Unlimited permanent operational QRs vs. 15 QRs & 100 responses/yr at $9/mo",
    keyDifferentiators: [
      "Unlimited permanent operational QR codes — never hit Uniqode's Essential plan cap of 15 dynamic QRs.",
      "No annual 100-response ceiling on frontline checklists, unlike Uniqode's $9/mo Essential tier.",
      "Purpose-built for industrial SOPs, multilingual floor instructions, and inspection logging rather than marketing link tracking.",
    ],
    rows: [
      {
        feature: "Primary Focus",
        fastcc: "Industrial SOPs, checklists & frontline inspection logs",
        competitor: "Marketing campaigns, vCards & link analytics",
      },
      {
        feature: "Dynamic QR Limit",
        fastcc: "Unlimited permanent operational QRs",
        competitor: "Capped at 15 dynamic QRs on Essential ($9/mo)",
      },
      {
        feature: "Form Response Limit",
        fastcc: "Built for daily shift & machine inspection logs",
        competitor: "Capped at 100 form responses/year on Essential",
      },
      {
        feature: "AI Video-to-SOP & Paper OCR",
        fastcc: "Included — video & paper photo to multilingual SOP/form",
        competitor: "Not available",
      },
      {
        feature: "Multilingual Worker UI",
        fastcc: "Sticky English, Hindi, Hinglish, Telugu & Tamil switcher",
        competitor: "Standard static landing pages",
      },
      {
        feature: "Shop-Floor Print Presets",
        fastcc: "A4 Poster, Machine Plate & Thermal Sticker SVG/PNG",
        competitor: "General-purpose QR image downloads",
      },
    ],
    whoShouldSwitch: {
      title: "Who Should Switch from Uniqode to FastCC QR",
      points: [
        "Operations managers who outgrew Uniqode's 15-QR cap as soon as they labeled more than a single production line or warehouse aisle.",
        "Teams running daily or per-shift inspections that burn through Uniqode's 100 responses/year limit in the first week.",
        "Plants and D2C brands that need real SOP steps, PASS/FAIL buttons, and photo proof rather than marketing click-through metrics.",
      ],
    },
  },
};

export const COMPARISON_LIST: CompetitorComparison[] = [
  COMPARISONS.sopx,
  COMPARISONS.clappia,
  COMPARISONS.uniqode,
];
