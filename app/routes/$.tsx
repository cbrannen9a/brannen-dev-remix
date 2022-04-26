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

  return routeData;
};

export default function Body() {
  const { page } = useLoaderData();
  return (
    <div>
      {page.title}
      {page.content.map((c) => {
        return <div key={c._key}>{c.heading}</div>;
      })}
    </div>
  );
}
