import { PortableText } from "@portabletext/react";
import { type FC } from "react";
import { type SanityBlockContent } from "~/types";

const TextSection: FC<Props> = ({ text }) => {
  return (
    <div className="text-base text-gray-900">
      <PortableText value={text} />
    </div>
  );
};

interface Props {
  text: SanityBlockContent;
}

export default TextSection;
