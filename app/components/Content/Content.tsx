import { type FC } from "react";
import { type Content } from "~/types";
import Banner from "./Banner";
import Cards from "./Cards";
import Hero from "./Hero";
import Social from "./Social";
import TextSection from "./TextSection";

const ContentComponent: FC<Props> = ({ content }) => (
  <>
    {content.map((item) => {
      switch (item._type) {
        case "hero":
          return (
            <Hero
              key={item._key}
              heading={item.heading}
              subHeading={item.subHeading}
              tagline={item.tagline}
              ctas={item.ctas}
              image={item.image}
            />
          );
        case "cards":
          return <Cards key={item._key} cards={item.cards} />;
        case "banner":
          return (
            <Banner
              key={item._key}
              heading={item.heading}
              subHeading={item.subHeading}
              ctas={item.ctas}
            />
          );
        case "social":
          return <Social key={item._key} social={item.social} />;
        case "textSection":
          return <TextSection key={item._key} text={item.text} />;
        default:
          return null;
      }
    })}
  </>
);

interface Props {
  content: Content[];
}

export default ContentComponent;
