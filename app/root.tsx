import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { Footer, Nav } from "./components";
import { getSanityClient } from "./lib";
import styles from "./styles/tailwind.css";
import { type Colors, type NavItem } from "./types";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export const meta: MetaFunction = ({ data }) => {
  return {
    title: `${data?.title}`,
    charset: "utf-8",
    viewport: "width=device-width,initial-scale=1",
  };
};

export const loader: LoaderFunction = async ({ context }) => {
  const { title, siteSettingsQuery, pageQuery, subPageQuery } =
    await getSanityClient().fetch(
      `*[_id == "siteSettings"][0]{
          title,
          pageQuery->,
          siteSettingsQuery->,
          subPageQuery->          
        }`
    );

  const { mainNavigation, footerNavigation, footerText, logo, themes, social } =
    await getSanityClient().fetch(siteSettingsQuery.queryCode.code);

  const mainNav: NavItem[] = mainNavigation
    ? mainNavigation.map(
        (r: { page: { title: string }; slug: { current: string } }) => {
          return { name: r.page.title, to: r?.slug?.current ?? "/" };
        }
      )
    : [];

  const footerNav: NavItem[] = footerNavigation
    ? footerNavigation.map(
        (r: { page: { title: string }; slug: { current: string } }) => {
          return { name: r.page.title, to: r?.slug?.current ?? "/" };
        }
      )
    : [];

  const colors: Colors = {
    ...themes[0],
  };

  return {
    mainNavigation: mainNav,
    footerNavigation: footerNav,
    footerText,
    title,
    logo,
    ENV: {
      SANITY_PROJECT_ID: process.env.SANITY_PROJECT_ID,
      SANITY_DATASET: process.env.SANITY_DATASET,
    },
    pageQuery,
    subPageQuery,
    colors,
    social,
  };
};

export default function App() {
  const {
    mainNavigation,
    footerNavigation,
    footerText,
    ENV,
    logo,
    pageQuery,
    subPageQuery,
    title,
    colors,
    social,
  } = useLoaderData();

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Nav
          navigation={mainNavigation}
          logo={logo}
          siteTitle={title}
          colors={colors}
        />
        <Outlet context={{ pageQuery, subPageQuery, title, colors }} />
        <Footer
          navigation={footerNavigation}
          siteTitle={title}
          footerText={footerText}
          social={social}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(ENV)}`,
          }}
        />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
