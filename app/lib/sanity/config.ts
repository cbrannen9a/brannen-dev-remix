export const config = {
  apiVersion: "2021-03-25",
  // Find these in your ./studio/sanity.json file
  dataset: Deno.env.get("SANITY_DATASET") ?? "production",
  projectId: Deno.env.get("SANITY_PROJECT_ID") ?? ``,
  useCdn: false,
};
