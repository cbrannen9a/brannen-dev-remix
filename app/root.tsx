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
import { Nav } from "./components";
import { getSanityClient } from "./lib";
import styles from "./styles/tailwind.css";
import { type NavItem } from "./types";

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
  console.log(context);
  const { title, siteSettingsQuery, pageQuery, subPageQuery } =
    await getSanityClient().fetch(
      `*[_id == "siteSettings"][0]{
          title,
          pageQuery->,
          siteSettingsQuery->,
          subPageQuery->          
        }`
    );

  const { mainNavigation, logo } = await getSanityClient().fetch(
    siteSettingsQuery.queryCode.code
  );
  const mainNav: NavItem[] = mainNavigation.map(
    (r: { page: { title: string }; slug: { current: string } }) => {
      return { name: r.page.title, to: r?.slug?.current ?? "/" };
    }
  );

  return {
    mainNavigation: mainNav,
    title,
    logo,
    ENV: {
      SANITY_PROJECT_ID: process.env.SANITY_PROJECT_ID,
      SANITY_DATASET: process.env.SANITY_DATASET,
    },
    pageQuery,
    subPageQuery,
  };
};

export default function App() {
  const { mainNavigation, ENV, logo, pageQuery, subPageQuery, title } =
    useLoaderData();

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Nav navigation={mainNavigation} logo={logo} />
        <Outlet context={{ pageQuery, subPageQuery, title }} />
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
