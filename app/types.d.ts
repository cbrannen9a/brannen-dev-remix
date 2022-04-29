export type ContentTypes =
  | "hero"
  | "cards"
  | "banner"
  | "social"
  | "textSection";

export interface BaseContent {
  _key: string;
  _type: ContentTypes;
}

export interface HeroContent extends BaseContent {
  _type: "hero";
  ctas: CTA[];
  heading: string;
  subHeading: string;
  label: string;
  tagline: SanityBlockContent;
  image: {
    alt: string;
    asset: {
      url: string;
      creditLine: string;
      description: string;
    };
  };
}

export interface CardsContent extends BaseContent {
  _type: "cards";
  cards: CardType[];
}

export interface BannerContent extends BaseContent {
  _type: "banner";
  ctas: CTA[];
  heading: string;
  subHeading: string;
}

export interface SocialContent extends BaseContent {
  _type: "social";
  social: SocialLink[];
}

export type SocialLink = {
  link: string;
  title: string;
  _key: string;
};

export interface TextSectionContent extends BaseContent {
  _type: "textSection";
  heading: string;
  text: SanityBlockContent;
}

export type Content =
  | HeroContent
  | CardsContent
  | BannerContent
  | SocialContent
  | TextSectionContent;

export type SanityBlockContent = BlockContent[];

export type BlockContent = {
  _key: string;
  _type: string;
  children: BlockContentChildren[];
  markDefs: [];
  style: string;
};

export type BlockContentChildren = {
  _key: string;
  _type: string;
  marks: [];
  text: string;
};

export interface CommonContentItem {
  _id: string;
  name: string;
  title: string;
  description: string;
  mainImage: any;
  slug: string;
}
export interface PostContentItem extends CommonContentItem {
  _type: "post";
  publishedAt: string;
}

export interface ProjectContentItem extends CommonContentItem {
  _type: "project";
  skills: SkillItem[];
}

export type SkillItem = { title: string; description: SanityBlockContent };

export type ContentItem = PostContentItem | ProjectContentItem;

export type CTA = {
  title: string;
  link: string;
  type?: "primary" | "secondary";
};

export type CardType = {
  _key: string;
  title: string;
  text: string;
  cta: CTA;
  enabled: boolean;
};

export type Color = {
  color: string;
  hue: string;
};
