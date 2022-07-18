import React, { type FC } from "react";
import { type ImageSectionContent } from "../../../types";
import { BlockContent } from "../../Common";
import { Image } from "../CommonContent";

const ImageSection: FC<Pick<ImageSectionContent, "text" | "image" | "cta">> = ({
  text,
  image,
  cta,
}) => (
  <div className="m-1">
    <Image value={image.asset} alt={image?.alt || ""} />
    <div className="text-base text-gray-900 prose">
      <BlockContent text={text} />
    </div>
  </div>
);

export default ImageSection;
