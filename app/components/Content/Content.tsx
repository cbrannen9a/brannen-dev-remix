import { Suspense, type FC } from "react";
import { type PreviewContent, type Content } from "~/types";
import Banner from "./Banner";
import Cards from "./Cards";
import ContentPreview from "./ContentPreview";
import Hero from "./Hero";
import Social from "./Social";
import TextSection from "./TextSection";

const ContentComponent: FC<Props> = ({ content, previewContent }) => {
  if (!content || content.length === 0) {
    return null;
  }

  return (
    <>
      {content.map((item) => {
        switch (item._type) {
          case "hero":
            return <Hero key={item._key} {...item} />;
          case "cards":
            return <Cards key={item._key} {...item} />;
          case "banner":
            return <Banner key={item._key} {...item} />;
          case "social":
            return <Social key={item._key} {...item} />;
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
    </>
  );
};

interface Props {
  content: Content[];
  previewContent: Record<string, PreviewContent[]>;
}

export default ContentComponent;
