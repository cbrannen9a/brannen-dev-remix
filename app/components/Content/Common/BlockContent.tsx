import { PortableText } from "@portabletext/react";
import { type FC } from "react";
import urlBuilder from "@sanity/image-url";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  getImageDimensions,
  type SanityImageSource,
} from "@sanity/asset-utils";
import { type SanityBlockContent } from "~/types";
import { useSanityContext } from "../SanityContext";

const FigureComponent = ({ value, isInline }: FigureComponentProps) => {
  const { sanityDataset, sanityProjectId } = useSanityContext();
  const { width, height } = getImageDimensions(value);

  return (
    <img
      src={urlBuilder({
        clientConfig: {
          dataset: sanityDataset,
          projectId: sanityProjectId,
        },
      })
        .image(value)
        .width(isInline ? 100 : 800)
        .fit("max")
        .auto("format")
        .url()}
      alt={(value as { alt?: string })?.alt || " "}
      loading="lazy"
      style={{
        // Display alongside text if image appears inside a block text span
        display: isInline ? "inline-block" : "block",

        // Avoid jumping around with aspect-ratio CSS property
        aspectRatio: `${width}/${height}`,
      }}
    />
  );
};

interface FigureComponentProps {
  value: SanityImageSource;
  isInline: boolean;
}

const CodeBlock: FC<{ value: { language: string; code: string } }> = ({
  value,
}) => {
  return (
    <SyntaxHighlighter language={value.language}>
      {value.code}
    </SyntaxHighlighter>
  );
};

const components = {
  types: {
    figure: FigureComponent,
    code: CodeBlock,
    // Any other custom types you have in your content
    // Examples: mapLocation, contactForm, code, featuredProjects, latestNews, etc.
  },
};

const BlockContent: FC<{ text: SanityBlockContent }> = ({ text }) => (
  <PortableText value={text} components={components} />
);

export default BlockContent;
