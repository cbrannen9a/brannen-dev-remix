import { toPlainText } from "@portabletext/react";
import { type MetaFunction, type LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData, useOutletContext } from "@remix-run/react";
import { Content } from "~/components";

import { getPageData, queryHelper } from "~/lib";
import type { ContextData, Colors } from "~/types";

export const meta: MetaFunction = ({ data, parentsData }) => {
  const { pageData } = data;
  if (!pageData) {
    return {
      title: `${parentsData?.root.title} | No title`,
      description: "No description found",
    };
  }
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

export const loader: LoaderFunction = async ({ request, params }) => {
  const requestUrl = new URL(request?.url);

  const { query, queryParams } = queryHelper(params["*"]);

  const { pageData, previewData } = await getPageData(query, queryParams);

  return {
    pageData,
    previewData,
    requestUrl,
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
  const { pageData, previewData, requestUrl } = useLoaderData();
  const { colors, sanityDataset, sanityProjectId } = useOutletContext<{
    colors: Colors;
    sanityDataset: string;
    sanityProjectId: string;
  }>();

  const contextData: ContextData = {
    url: requestUrl,
    title: pageData.title,
  };

  return pageData ? (
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
