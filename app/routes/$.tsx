import { toPlainText } from "@portabletext/react";
import { type MetaFunction, type LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Content } from "~/components";
import { getSanityClient } from "~/lib";
import type {
  ContentPreview,
  Content as ContentItem,
  PageData,
  LoadableContent,
} from "~/types";

export const meta: MetaFunction = ({ data }: { data: any | undefined }) => {
  if (!data) {
    return {
      title: "No title",
      description: "No description found",
    };
  }
  return {
    title: `${data.pageData.title}`,
    description: `${
      data.pageData.description ? toPlainText(data.pageData.description) : ""
    }`,
  };
};

const contentQuery = ` ...,
            content[] {
              ...,
              parentRoute->,
              query->,
              cards[] {
                ...,
                cta {
                  ...,
                  route->
                }
              },
              tags[] {
                ...,
                route->,
                media {
                  asset->
                }
              }

            }
`;

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
          page->{
            ${contentQuery}
          }
      }`;
  let queryParams = { slug: paramValue ?? "/" };

  if (isSubpage) {
    query = `*[_type == "page" && slug.current == $slug][0]
        {  ${contentQuery}
      }`;
    queryParams = {
      slug: paramValue?.split("/")[paramValue.split("/").length - 1] ?? "/",
    };
  }

  return { query, queryParams, isSubpage };
};

const isContentPreview = (item: unknown): item is ContentPreview => {
  return (item as ContentPreview)._type === "contentPreview";
};

const loadableContent = (content: ContentItem[]) => {
  if (!content) {
    return [];
  }

  return content
    .filter((ci: ContentItem): ci is ContentPreview => isContentPreview(ci))
    .map((i) => {
      return {
        root: i.parentRoute.slug.current,
        query: i.query,
        params: i.params,
      };
    });
};

const isPage = (data: unknown): data is PageData => {
  return (data as PageData).page !== undefined;
};

const getPageData = async (
  query: string,
  queryParams: Record<string, unknown>,
  isSubpage: boolean,
  preview = false
) => {
  const data = await getSanityClient(preview).fetch<
    PageData | { content: ContentItem[] }
  >(query, queryParams);

  const pageData = isPage(data) ? data.page : data;

  const contentToLoad = loadableContent(pageData.content);
  const previewData = await getPreviewContent(contentToLoad);
  return { pageData, previewData };
};

const getPreviewContent = async (
  contentToLoad: LoadableContent[],
  preview = false
) => {
  let previewContent;
  if (contentToLoad.length > 0) {
    const previewContentData = await Promise.all(
      contentToLoad.map(async (toLoad: LoadableContent) => {
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
