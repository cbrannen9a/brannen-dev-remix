import { type FC } from "react";
import { type TagsContent } from "~/types";
import Chip from "./Chip";
import Tag from "./Tag";

const Tags: FC<Pick<TagsContent, "tags" | "as" | "ariaLabel" | "title">> = ({
  tags,
  as,
  ariaLabel,
  title,
}) => {
  switch (as) {
    case "chips":
      return (
        <section aria-label={ariaLabel}>
          <div className="max-w-7xl mx-auto relative bg-white overflow-hidden">
            <div className="relative px-8 bg-white lg:max-w-2xl lg:w-full ">
              {title ? <h2>{title}</h2> : null}
              <ul className="mx-3.5 flex flex-row flex-wrap justify-start md:mb-4 md:px-10 md:max-w-2xl lg:mb-5 list-none  relative bg-white overflow-hidden">
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
        <>
          {tags.map((tag) => (
            <Tag key={tag._key} {...tag} />
          ))}
        </>
      );
  }
};

export default Tags;
