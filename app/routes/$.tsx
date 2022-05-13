import { type LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { Content, SanityPreview } from "~/components";
import { filterDataToSingleItem, getSanityClient } from "~/lib";
import { type ContentPreview, type Content as ContentItem } from "~/types";

const queryHelper = (
  paramValue: string | undefined
): {
  query: string;
  queryParams: Record<string, unknown>;
  isSubpage: boolean;
} => {
  const isSubpage =
    paramValue && paramValue?.split("/").length > 1 ? true : false;
  let query = `*[_type == "route" && slug.current == $slug]
        { ..., 
          page ->{
            ...,
            content[] {
              ...,
              parentRoute ->
            }
          }
      }`;
  let queryParams = { slug: paramValue ?? "/" };
  console.log(
    paramValue?.split("/")[paramValue.split("/").length - 1],
    isSubpage
  );
  if (isSubpage) {
    query = `*[_type == "page" && slug.current == $slug]
        { ..., 
          content[] {
              ...,
              parentRoute ->
            }
      }`;
    queryParams = {
      slug: paramValue?.split("/")[paramValue.split("/").length - 1] ?? "/",
    };
  }

  return { query, queryParams, isSubpage };
};

const previewQuery = `*[_type == "page" && parentRoute -> slug.current == $slug]
        { title, 
          slug         
      }`;

const loadableContent = (
  initialData: any,
  preview: boolean,
  isSubpage: boolean
) => {
  const single = filterDataToSingleItem(initialData, preview);
  const data = isSubpage ? single.content : single.page.content;

  return data
    .filter((ci: ContentItem) => ci._type === "contentPreview")
    .map((i: ContentPreview) => {
      return { root: i.parentRoute.slug.current };
    });
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const requestUrl = new URL(request?.url);
  const preview =
    requestUrl?.searchParams?.get("preview") ===
    process.env.SANITY_PREVIEW_SECRET;

  const { query, queryParams, isSubpage } = queryHelper(params["*"]);

  const initialData = await getSanityClient(preview).fetch(query, queryParams);

  const toLoadContent = loadableContent(initialData, preview, isSubpage);

  let previewContent;
  if (toLoadContent.length > 0) {
    const previewContentData = await Promise.all(
      toLoadContent.map(async (toLoad: { root: string }) => {
        const d = await getSanityClient(preview).fetch(previewQuery, {
          slug: toLoad.root,
        });
        return { [toLoad.root]: d };
      })
    );
    previewContent = previewContentData?.reduce((a, v) => {
      return { ...a, ...v };
    }, {});
  }

  return {
    initialData,
    isSubpage,
    preview,
    query: preview ? query : null,
    queryParams: preview ? queryParams : null,
    sanityProjectId: process.env.SANITY_PROJECT_ID,
    sanityDataset: process.env.SANITY_DATASET,
    previewContent,
  };
};

export const ErrorBoundary = () => {
  return (
    <div className="flex flex-col">
      <div>Something's gone wrong</div>
      <Link to="/">Home</Link>
    </div>
  );
};

export default function Body() {
  const loaderData = useLoaderData();

  const {
    initialData,
    isSubpage,
    preview,
    query,
    queryParams,
    sanityProjectId,
    sanityDataset,
    previewContent,
  } = loaderData;

  const [data, setData] = useState(initialData);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);
  if (!data) return <div />;
  const single = filterDataToSingleItem(data, preview);

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
      <Content
        content={isSubpage ? single.content : single.page.content}
        previewContent={previewContent}
      />
    </div>
  );
}
