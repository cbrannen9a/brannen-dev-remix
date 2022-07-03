import { SanityImageAsset } from "@sanity/asset-utils";

export type ContentTypes =
  | "hero"
  | "cards"
  | "banner"
  | "textSection"
  | "contentPreview"
  | "route"
  | "tags";

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

export interface TagsContent extends BaseContent {
  _type: "tags";
  tags: Tag[];
  as?: "tags" | "chips";
  ariaLabel: string;
  title?: string;
}

export interface Tag {
  _key: string;
  title: string;
  description?: SanityBlockContent;
  link?: string;
  route?: { slug: Slug };
  media?: SanityImageAsset;
}

export interface TextSectionContent extends BaseContent {
  _type: "textSection";
  heading: string;
  text: SanityBlockContent;
}

export interface ContentPreview extends BaseContent {
  _type: "contentPreview";
  query: Query;
  params: KeyValue[];
  parentRoute: RouteReference;
  data: Record<string, PreviewContent[]>;
}

export interface RouteReference extends BaseContent {
  _type: "route";
  slug: Slug;
}

export interface PreviewContent {
  _id: string;
  title: string;
  slug: Slug;
  description?: SanityBlockContent;
  openGraphImage?: SanityImageAsset;
  keywords?: string[];
}

export type Content =
  | HeroContent
  | CardsContent
  | BannerContent
  | TagsContent
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
  link?: string;
  route?: { slug: Slug };
  type?: "primary" | "secondary";
};

export type CardType = {
  _key: string;
  title: string;
  text: SanityBlockContent;
  cta: CTA;
  enabled: boolean;
  fromColor?: string;
  toColor?: string;
};

export type Color = {
  color: string;
  hue: string;
};

export interface NavItem {
  name: string;
  to: string;
}

export interface KeyValue {
  key: string;
  value: string;
}

export interface PageData {
  page: {
    title: string;
    content: Content[];
  };
  slug: Slug;
}

export interface LoadableContent {
  root: string;
  query: Query;
  params: KeyValue[];
}

export interface Query {
  queryCode: { code: string };
  queryParams: { key: string; optional: boolean };
}
