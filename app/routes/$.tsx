import { redirect, type LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Content } from "~/components";
import { getSanityClient } from "~/lib";

export const loader: LoaderFunction = async ({ params }) => {
  const route = params["*"] ?? "/";

  const routeData = await getSanityClient().fetch(
    `*[_type == "route" && slug.current == $slug]
        { _id,  slug, page ->
      }[0]`,
    { slug: route }
  );

  if (!routeData) {
    return redirect("/");
  }

  return routeData;
};

export default function Body() {
  const {
    page: { content },
  } = useLoaderData();
  return (
    <div>
      <Content content={content} />
    </div>
  );
}
