import { type FC } from "react";
import { type TextSectionContent } from "~/types";
import { BlockContent } from "../../Common";

const TextSection: FC<Pick<TextSectionContent, "text">> = ({ text }) => (
  <div className="w-full m-auto mt-5 text-base text-gray-900 prose">
    <BlockContent text={text} />
  </div>
);

export default TextSection;
