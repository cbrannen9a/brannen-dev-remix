import { Link } from "@remix-run/react";
import { type FC } from "react";
import { type ContentPreview } from "~/types";

const ContentPreviewComponent: FC<
  Pick<ContentPreview, "data" | "parentRoute">
> = ({ data, parentRoute }) => {
  console.log(data);
  return (
    <ul>
      {data.map((d) => (
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
