import { Link } from "@remix-run/react";
import { type FC } from "react";
import { type ContentPreview } from "~/types";

const ContentPreviewComponent: FC<
  Pick<ContentPreview, "data" | "parentRoute">
> = ({ data, parentRoute }) => {
  if (!data || !data[parentRoute.slug.current]) {
    return null;
  }
  return (
    <ul>
      {data[parentRoute.slug.current].map((d) => (
        <li key={d.title}>
          <Link to={`${parentRoute.slug.current}/${d.slug.current}`}>
            {d.title}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default ContentPreviewComponent;
