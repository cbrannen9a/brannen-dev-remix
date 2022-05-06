import { type LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
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

  const initialData = await getSanityClient(preview).fetch(query, queryParams);

  return {
    initialData,
    preview,
    query: preview ? query : null,
    queryParams: preview ? queryParams : null,
    sanityProjectId: process.env.SANITY_PROJECT_ID,
    sanityDataset: process.env.SANITY_DATASET,
  };
};

export const ErrorBoundary = () => {
  return (
    <div>
      Something's gone wrong
      <Link to="/">Home</Link>
    </div>
  );
};

export default function Body() {
  const loaderData = useLoaderData();

  const {
    initialData,
    preview,
    query,
    queryParams,
    sanityProjectId,
    sanityDataset,
  } = loaderData;

  const [data, setData] = useState(initialData);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);
  if (!data) return <div />;
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
