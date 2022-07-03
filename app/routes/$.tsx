import { toPlainText } from "@portabletext/react";
import { type MetaFunction, type LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Content } from "~/components";

import { getPageData, getSiteData, queryHelper } from "~/lib";

export const meta: MetaFunction = ({ data }: { data: any | undefined }) => {
  if (!data) {
    return {
      title: "No title",
      description: "No description found",
    };
  }
  return {
    title: `${data?.title} | ${data.pageData.title}`,
    description: `${
      data.pageData.description ? toPlainText(data.pageData.description) : ""
    }`,
    keywords: `${
      data?.pageData?.keywords ? data.pageData.keywords?.join(",") : ""
    }`,
    "og:image": `${
      data?.pageData?.openGraphImage
        ? data?.pageData?.openGraphImage.asset.url
        : ""
    }`,
  };
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const requestUrl = new URL(request?.url);
  const preview =
    requestUrl?.searchParams?.get("preview") ===
    process.env.SANITY_PREVIEW_SECRET;

  const { query, queryParams } = queryHelper(params["*"]);

  const { pageData, previewData } = await getPageData(
    query,
    queryParams,
    preview
  );

  const { title } = await getSiteData();

  return {
    pageData,
    previewData,
    title,
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
