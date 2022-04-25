import { redirect, type LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
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
  console.log(routeData.page);
  return routeData;
};

export default function Body() {
  const { page } = useLoaderData();
  return (
    <div>
      {page.title}
      {page.content.map((c) => {
        return <div>{c.heading}</div>;
      })}
    </div>
  );
}
