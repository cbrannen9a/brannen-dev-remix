import { redirect, type LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { Content, SanityPreview } from "~/components";
import { filterDataToSingleItem, getSanityClient } from "~/lib";

export const loader: LoaderFunction = async ({ request, params }) => {
  const requestUrl = new URL(request?.url);

  const preview =
    requestUrl?.searchParams?.get("preview") ===
    process.env.SANITY_PREVIEW_SECRET;

  const query = `*[_type == "route" && slug.current == $slug]
        { _id,  slug, page ->
      }`;
  const queryParams = { slug: params["*"] ?? "/" };

  const initialData = await getSanityClient(preview).fetch(
    `*[_type == "route" && slug.current == $slug]
        { _id,  slug, page ->
      }`,
    queryParams
  );

  if (!initialData) {
    return redirect("/");
  }

  return {
    initialData,
    preview,
    query: preview ? query : null,
    queryParams: preview ? queryParams : null,
    sanityProjectId: process.env.SANITY_PROJECT_ID,
    sanityDataset: process.env.SANITY_DATASET,
  };
};

export default function Body() {
  const {
    initialData,
    preview,
    query,
    queryParams,
    sanityProjectId,
    sanityDataset,
  } = useLoaderData();

  const [data, setData] = useState(initialData);
  const {
    page: { content },
  } = filterDataToSingleItem(data, preview);

  return (
    <div>
      {preview ? (
        <SanityPreview
          data={data}
          setData={setData}
          query={query}
          queryParams={queryParams}
          sanityProjectId={sanityProjectId}
          sanityDataset={sanityDataset}
        />
      ) : null}
      <Content content={content} />
    </div>
  );
}
