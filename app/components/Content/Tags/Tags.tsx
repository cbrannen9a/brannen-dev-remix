import { type FC } from "react";
import { type TagsContent } from "~/types";
import Chip from "./Chip";
import Tag from "./Tag";

const Tags: FC<
  Pick<TagsContent, "tags" | "as" | "ariaLabel" | "title"> & {
    preview: boolean;
  }
> = ({ tags, as = "tags", ariaLabel, title, preview }) => {
  switch (as) {
    case "chips":
      return (
        <section aria-label={ariaLabel}>
          <div className="max-w-7xl mx-auto relative overflow-hidden">
            <div className="relative px-8 lg:max-w-2xl lg:w-full ">
              {title ? <h2>{title}</h2> : null}
              <ul className="flex flex-row flex-wrap justify-start list-none relative overflow-hidden">
                {tags.map((chip) => (
                  <Chip key={chip._key} {...chip} />
                ))}
              </ul>
            </div>
          </div>
        </section>
      );
    case "tags":
    default:
      return (
        <ul
          className={`${
            preview ? "" : "my-8 justify-center"
          } h-8 min-h-full flex flex-row flex-wrap list-none relative overflow-hidden`}
        >
          {tags.map((tag) => (
            <Tag key={tag._key} {...tag} />
          ))}
        </ul>
      );
  }
};

export default Tags;
