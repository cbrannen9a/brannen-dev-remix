import { type FC } from "react";
import { type TextSectionContent } from "~/types";
import { BlockContent } from "../Common";

const TextSection: FC<Pick<TextSectionContent, "text">> = ({ text }) => (
  <div className="text-base text-gray-900 prose">
    <BlockContent text={text} />
  </div>
);

export default TextSection;
