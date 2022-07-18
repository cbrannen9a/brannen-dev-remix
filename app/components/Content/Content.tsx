import { type FC } from "react";
import { SanityContextProvider } from "~/contexts";
import { type PreviewContent, type Content } from "~/types";
import Banner from "./Banner";
import Cards from "./Cards";
import ContentPreview from "./ContentPreview";
import Hero from "./Hero";

import Tags from "./Tags";
import TextSection from "./TextSection";

const ContentComponent: FC<Props> = ({
  content,
  previewContent,
  sanityDataset,
  sanityProjectId,
}) => {
  if (!content || content.length === 0) {
    return null;
  }

  return (
    <SanityContextProvider
      sanityDataset={sanityDataset}
      sanityProjectId={sanityProjectId}
    >
      {content.map((item) => {
        switch (item._type) {
          case "hero":
            return <Hero key={item._key} {...item} />;
          case "cards":
            return <Cards key={item._key} {...item} />;
          case "banner":
            return <Banner key={item._key} {...item} />;
          case "tags":
            return <Tags key={item._key} {...item} />;
          case "textSection":
            return <TextSection key={item._key} {...item} />;
          case "contentPreview":
            return (
              <ContentPreview key={item._key} {...item} data={previewContent} />
            );
          default:
            return null;
        }
      })}
    </SanityContextProvider>
  );
};

interface Props {
  content: Content[];
  previewContent: Record<string, PreviewContent[]>;
  sanityDataset: string;
  sanityProjectId: string;
}

export default ContentComponent;
