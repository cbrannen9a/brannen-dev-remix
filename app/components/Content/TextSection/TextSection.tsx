import { PortableText } from "@portabletext/react";
import { type FC } from "react";
import { type TextSectionContent } from "~/types";

const TextSection: FC<Pick<TextSectionContent, "text">> = ({ text }) => (
  <div className="text-base text-gray-900 prose">
    <PortableText value={text} />
  </div>
);

export default TextSection;
