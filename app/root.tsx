import { toPlainText } from "@portabletext/react";
import type {
  ErrorBoundaryComponent,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/server-runtime";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useLoaderData,
} from "@remix-run/react";
import { ErrorPage, Footer, Nav } from "./components";
import { getSanityClient } from "./lib";
import styles from "./styles/tailwind.css";
import { type RawNavItem, type Colors, type NavItem } from "./types";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export const meta: MetaFunction = ({ data }) => {
  return {
    title: `${data?.title}`,
    description: `${data.description ? toPlainText(data.description) : ""}`,
    charset: "utf-8",
    viewport: "width=device-width,initial-scale=1",
  };
};

export const loader: LoaderFunction = async () => {
  const { title, siteSettingsQuery, pageQuery, subPageQuery } =
    await getSanityClient().fetch(
      `*[_id == "siteSettings"][0]{
          title,
          pageQuery->,
          siteSettingsQuery->,
          subPageQuery->          
        }`
    );

  const {
    mainNavigation,
    footerNavigation,
    footerText,
    logo,
    themes,
    social,
    frontpage,
  } = await getSanityClient().fetch(siteSettingsQuery.queryCode.code);

  const mainNav: NavItem[] = mainNavigation
    ? mainNavigation.map((r: RawNavItem) => {
        return { id: r._id, name: r.page.title, to: r?.slug?.current ?? "/" };
      })
    : [];

  const footerNav: NavItem[] = footerNavigation
    ? footerNavigation.map((r: RawNavItem) => {
        return { id: r._id, name: r.page.title, to: r?.slug?.current ?? "/" };
      })
    : [];

  const colors: Colors = {
    ...themes[0],
  };

  return {
    mainNavigation: mainNav,
    footerNavigation: footerNav,
    footerText,
    title,
    description: frontpage.description,
    logo,
    sanityDataset: Deno.env.get("SANITY_DATASET"),
    sanityProjectId: Deno.env.get("SANITY_PROJECT_ID"),
    pageQuery,
    subPageQuery,
    colors,
    social,
  };
};

export const unstable_shouldReload = () => false;

export function CatchBoundary() {
  const caught = useCatch();
  return (
    <html>
      <head>
        <title>Oops!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <h1>
          {caught.status} {caught.statusText}
        </h1>
        <Scripts />
      </body>
    </html>
  );
}

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  console.error(error);
  return (
    <html>
      <head>
        <title>Oops!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <ErrorPage
          message="Something's gone wrong"
          link={{ to: "/", name: "Home", id: "home" }}
        />
        <Scripts />
      </body>
    </html>
  );
};

export default function App() {
  const {
    sanityDataset,
    sanityProjectId,
    mainNavigation,
    footerNavigation,
    footerText,
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
        <Nav navigation={mainNavigation} siteTitle={title} colors={colors} />
        <Outlet
          context={{
            pageQuery,
            subPageQuery,
            title,
            colors,
            sanityDataset,
            sanityProjectId,
          }}
        />
        <Footer
          navigation={footerNavigation}
          siteTitle={title}
          footerText={footerText}
          social={social}
        />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
