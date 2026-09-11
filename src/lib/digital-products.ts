/**
 * Digital products sold through Fathom's post-result upsell.
 *
 * The Fathom tool itself (matching, scoring, apply links) is and stays
 * free — this module only describes the optional paid add-on(s) shown
 * after a person gets their results. Everything the UI needs (copy,
 * price, contents list, the file to unlock) lives in this one place, so
 * swapping or adding a product is a data change here, not a rewrite of
 * the upsell card or checkout page.
 *
 * To replace the active product: add a new entry to PRODUCTS and point
 * ACTIVE_PRODUCT_ID at it. To sell more than one at a time, have the
 * upsell card/checkout route take a product id instead of importing
 * ACTIVE_PRODUCT directly — the components are already written to take
 * a `product` prop rather than reaching into this file themselves.
 */

export interface ProductSection {
  title: string;
  items: string[];
}

export interface DigitalProduct {
  id: string;
  name: string;
  priceNaira: number;
  eyebrow: string;
  headline: string;
  subhead: string;
  description: string;
  ctaLabel: string;
  /** Served from /public. What unlocks after a verified payment. */
  fileName: string;
  fileLabel: string;
  sections: ProductSection[];
  disclaimer: string;
}

export const PRODUCTS: Record<string, DigitalProduct> = {
  "borrowing-kit": {
    id: "borrowing-kit",
    name: "Fathom Borrowing Kit",
    priceNaira: 3000,
    eyebrow: "Before you accept any loan",
    headline: "Make sure you can actually afford it.",
    subhead: "A practical guide + worksheets, not another opinion.",
    description:
      "A guide and four worksheets to help you understand the real cost of borrowing, compare offers side by side, and plan repayment before you accept a loan — built from the same categories Fathom scores on.",
    ctaLabel: "Get the Borrowing Kit",
    fileName: "fathom-borrowing-kit.zip",
    fileLabel: "Fathom Borrowing Kit (PDF bundle, ~1.5MB)",
    sections: [
      {
        title: "Borrowing Guide (PDF)",
        items: [
          "How to evaluate a loan offer",
          "Interest vs. fees vs. total repayment",
          "How to compare loan offers against each other",
          "How to tell if a repayment is actually affordable",
          "What to check before accepting a loan",
          "Common borrowing mistakes",
          "Red flags to watch for",
          "What to do when repayment becomes difficult",
        ],
      },
      {
        title: "Loan Comparison Worksheet",
        items: [
          "Amount borrowed, fees, and interest, side by side",
          "Repayment frequency and total repayment per offer",
          "One combined cost-of-borrowing figure per lender",
        ],
      },
      {
        title: "Loan Affordability Worksheet",
        items: [
          "Income and existing obligations",
          "Essential expenses vs. proposed repayment",
          "A simple affordability read before you sign",
        ],
      },
      {
        title: "Debt Reset Worksheet",
        items: [
          "Every existing loan, balance, and due date in one sheet",
          "Monthly repayment load at a glance",
          "A priority order for paying them down",
        ],
      },
      {
        title: "Pre-Loan Checklist",
        items: ["One page to run through before you accept any offer"],
      },
    ],
    disclaimer:
      "Educational content only. It does not guarantee loan approval, does not change or reduce any lender's interest rate, and is not personalized financial, legal, or credit advice.",
  },
};

export const ACTIVE_PRODUCT_ID = "borrowing-kit";
export const ACTIVE_PRODUCT: DigitalProduct = PRODUCTS[ACTIVE_PRODUCT_ID];
