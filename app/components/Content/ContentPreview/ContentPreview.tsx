import { Link } from "@remix-run/react";
import { type FC } from "react";
import { type ContentPreview } from "~/types";
import { BlockContent, Image } from "../Common";

const ContentPreviewComponent: FC<
  Pick<ContentPreview, "data" | "parentRoute">
> = ({ data, parentRoute }) => {
  if (!data || !data[parentRoute.slug.current]) {
    return null;
  }
  return (
    <ul className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 xl:gap-8 p-1 sm:p-4">
      {data[parentRoute.slug.current].map(
        ({ _id, title, description, openGraphImage, slug }) => (
          <li key={_id}>
            <div className="w-full relative  overflow-hidden rounded-3xl flex shadow-lg">
              <Link
                prefetch="intent"
                to={`${parentRoute.slug.current}/${slug.current}`}
              >
                <div className={`w-full flex md:flex-col`}>
                  <div className="sm:max-w-sm sm:flex-none md:w-auto md:flex-auto flex flex-col items-start relative z-10 p-6 xl:p-8">
                    {openGraphImage ? <Image value={openGraphImage} /> : null}
                    <h2 className="text-xl font-semibold mb-2 text-shadow">
                      {title}
                    </h2>
                    <div className="font-medium text-shadow">
                      {description ? <BlockContent text={description} /> : null}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </li>
        )
      )}
    </ul>
  );
};

export default ContentPreviewComponent;
