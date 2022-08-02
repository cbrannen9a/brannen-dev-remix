import PicoSanity from "picosanity";

import { config } from "./config";

// Standard client for fetching data
export const sanityClient = new PicoSanity(config);

// Authenticated client for fetching draft documents
export const previewClient = new PicoSanity({
  ...config,
  useCdn: Deno.env.get("NODE_ENV") === "development",
  token: Deno.env.get("SANITY_API_TOKEN") ?? ``,
});

// Helper function to choose the correct client
export const getSanityClient = (usePreview = false) =>
  usePreview ? previewClient : sanityClient;
