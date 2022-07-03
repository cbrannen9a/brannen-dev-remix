import { Link } from "@remix-run/react";
import { type FC } from "react";
import { type ContentPreview } from "~/types";
import { BlockContent, Image } from "../Common";
import Tags from "../Tags";

const ContentPreviewComponent: FC<
  Pick<ContentPreview, "data" | "parentRoute">
> = ({ data, parentRoute }) => {
  if (!data || !data[parentRoute.slug.current]) {
    return null;
  }
  return (
    <ul className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 md:mx-0 lg:mx-3 gap-4 xl:grid-cols-2 xl:gap-8 sm:p-4">
      {data[parentRoute.slug.current].map(
        ({ _id, title, description, openGraphImage, slug, keywords }) => (
          <li key={_id}>
            <div className="m-1 max-w-sm w-96 h-[400px] rounded overflow-hidden shadow-lg">
              <Link
                prefetch="intent"
                to={`${parentRoute.slug.current}/${slug.current}`}
              >
                <div className="sm:max-w-sm sm:flex-none md:w-auto md:flex-auto flex flex-col items-start relative z-10 p-6 xl:p-8">
                  {openGraphImage ? (
                    <Image
                      className="max-w-sm m-auto"
                      value={openGraphImage}
                      alt={title}
                      width={300}
                      height={168}
                      fit={"clip"}
                    />
                  ) : (
                    <div className="h-[168px]" />
                  )}
                  <h2 className="font-bold text-xl mb-2">{title}</h2>
                  <div className="text-gray-700 text-base mb-2">
                    {description ? <BlockContent text={description} /> : null}
                  </div>
                  <div className="h-24">
                    {keywords ? (
                      <Tags
                        ariaLabel="keywords"
                        tags={keywords.map((k, idx) => {
                          return {
                            _key: `${k}-${idx}`,
                            title: k,
                          };
                        })}
                      />
                    ) : null}
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
