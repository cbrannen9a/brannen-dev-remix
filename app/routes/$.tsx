import { toPlainText } from "@portabletext/react";
import {
  type MetaFunction,
  type LoaderFunction,
  type ErrorBoundaryComponent,
  redirect,
} from "@remix-run/node";
import { useLoaderData, useLocation, useOutletContext } from "@remix-run/react";
import { Content, ErrorPage } from "~/components";

import { getPageData, queryHelper } from "~/lib";
import type { ContextData, Colors, PageContent, PreviewContent } from "~/types";

export const meta: MetaFunction = ({ data, parentsData }) => {
  if (!data || !data.pageData) {
    return {
      title: `${parentsData?.root.title} | No title`,
      description: "No description found",
    };
  }
  const { pageData } = data;
  return {
    title: `${parentsData?.root.title} | ${pageData.title}`,
    description: `${
      pageData.description ? toPlainText(pageData.description) : ""
    }`,
    keywords: `${pageData?.keywords ? pageData.keywords?.join(",") : ""}`,
    "og:image": `${
      pageData?.openGraphImage ? pageData?.openGraphImage.asset.url : ""
    }`,
  };
};

const queryPageData = async (path: string | undefined) => {
  const { query, queryParams } = queryHelper(path);

  const { pageData, previewData } = await getPageData(query, queryParams);
  return { pageData, previewData };
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const requestUrl = new URL(request?.url);

  let pageData = await queryPageData(params["*"]);

  if (!pageData.pageData) {
    pageData = await queryPageData(`/${params["*"]}`);
    if (pageData?.pageData) {
      return redirect(
        `${pageData?.pageData?.parentRoute?.slug.current}/${pageData.pageData.slug.current}`
      );
    }

    throw new Response("Not Found", {
      status: 404,
      statusText: `PageData missing for ${requestUrl}`,
    });
  }
  return {
    pageData: pageData.pageData,
    previewData: pageData.previewData,
    requestUrl,
  };
};

export const CatchBoundary = () => {
  const location = useLocation();
  console.error(`Page not found ${location.pathname}`);
  return (
    <ErrorPage
      message="We couldn't find that page!"
      link={{ to: "/", name: "Home", id: "home" }}
    />
  );
};

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  console.error(error);
  return (
    <ErrorPage
      message="Something's gone wrong"
      link={{ to: "/", name: "Home", id: "home" }}
    />
  );
};

export default function Body() {
  const { pageData, previewData, requestUrl } = useLoaderData<{
    pageData: PageContent | null;
    previewData: Record<string, PreviewContent[]>;
    requestUrl: string;
  }>();
  const { colors, sanityDataset, sanityProjectId } = useOutletContext<{
    colors: Colors;
    sanityDataset: string;
    sanityProjectId: string;
  }>();

  const contextData: ContextData = {
    url: requestUrl,
    title: pageData?.title ?? "",
  };

  return pageData?.content ? (
    <Content
      content={pageData.content}
      contextData={contextData}
      colors={colors}
      previewContent={previewData}
      sanityDataset={sanityDataset}
      sanityProjectId={sanityProjectId}
    />
  ) : null;
}
