export type ContentTypes =
  | "hero"
  | "cards"
  | "banner"
  | "social"
  | "textSection"
  | "contentPreview"
  | "route";

export interface BaseEntity {
  _id: string;
}

export interface BaseContent extends BaseEntity {
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

export interface ContentPreview extends BaseContent {
  _type: "contentPreview";
  parentRoute: RouteReference;
  data: Record<string, PreviewContent[]>;
}

export interface RouteReference extends BaseContent {
  _type: "route";
  slug: Slug;
}

export interface PreviewContent {
  title: string;
  slug: Slug;
}

export type Content =
  | HeroContent
  | CardsContent
  | BannerContent
  | SocialContent
  | TextSectionContent
  | ContentPreview
  | RouteReference;

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

export type Slug = {
  _type: "slug";
  current: string;
};

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
