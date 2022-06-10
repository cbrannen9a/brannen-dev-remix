import { type LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Content } from "~/components";
import { getSanityClient } from "~/lib";
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
  let query = `*[_type == "route" && slug.current == $slug][0]
        { ..., 
          page ->{
            ...,
            content[] {
              ...,
              parentRoute ->,
              query->
            }
          }
      }`;
  let queryParams = { slug: paramValue ?? "/" };

  if (isSubpage) {
    query = `*[_type == "page" && slug.current == $slug][0]
        { ..., 
          content[] {
              ...,
              parentRoute ->,
              query->
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

const loadableContent = (content: any): { root: string }[] => {
  if (!content) {
    return [];
  }

  return content
    .filter((ci: ContentItem) => ci._type === "contentPreview")
    .map((i: ContentPreview) => {
      return {
        root: i.parentRoute.slug.current,
        query: i.query,
        params: i.params,
      };
    });
};

const getPageData = async (
  query: string,
  queryParams: Record<string, unknown>,
  isSubpage: boolean,
  preview = false
) => {
  const data = await getSanityClient(preview).fetch(query, queryParams);
  const pageData = isSubpage ? data : data.page;
  const contentToLoad = loadableContent(pageData.content);
  // console.log(contentToLoad);
  const previewData = await getPreviewContent(contentToLoad);
  return { pageData, previewData };
};

const getPreviewContent = async (
  contentToLoad: { root: string }[],
  preview = false
) => {
  let previewContent;
  if (contentToLoad.length > 0) {
    const previewContentData = await Promise.all(
      contentToLoad.map(async (toLoad: { root: string }) => {
        console.log(toLoad.params);
        const d = await getSanityClient(preview).fetch(
          toLoad.query.queryCode.code,
          {
            slug: toLoad.root,
          }
        );
        return { [toLoad.root]: d };
      })
    );

    previewContent = previewContentData?.reduce((a, v) => {
      return { ...a, ...v };
    }, {});
  }
  return previewContent;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const requestUrl = new URL(request?.url);
  const preview =
    requestUrl?.searchParams?.get("preview") ===
    process.env.SANITY_PREVIEW_SECRET;

  const { query, queryParams, isSubpage } = queryHelper(params["*"]);

  const { pageData, previewData } = await getPageData(
    query,
    queryParams,
    isSubpage,
    preview
  );

  return {
    pageData,
    previewData,
    sanityProjectId: process.env.SANITY_PROJECT_ID,
    sanityDataset: process.env.SANITY_DATASET,
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
  const { pageData, previewData, sanityDataset, sanityProjectId } =
    useLoaderData();

  return pageData ? (
    <Content
      content={pageData.content}
      previewContent={previewData}
      sanityDataset={sanityDataset}
      sanityProjectId={sanityProjectId}
    />
  ) : null;
}
