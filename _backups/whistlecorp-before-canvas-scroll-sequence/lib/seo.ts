import type { Metadata } from "next";

const SITE_URL = "https://www.whistlecorp.com";
const SITE_NAME = "WhistleCorp";

type BuildMetaParams = {
  title: string;
  description: string;
  path?: string;
  /** If true, the title is used exactly as given (no " | WhistleCorp" suffix). */
  rawTitle?: boolean;
  /** If true, set robots: noindex. */
  noindex?: boolean;
};

export function buildMetadata({
  title,
  description,
  path = "/",
  rawTitle = false,
  noindex = false,
}: BuildMetaParams): Metadata {
  const url = `${SITE_URL}${path}`;
  const fullTitle =
    rawTitle || title === SITE_NAME || title.includes("WhistleCorp")
      ? title
      : `${title} | ${SITE_NAME}`;

  return {
    title: fullTitle,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      siteName: SITE_NAME,
      title: fullTitle,
      description,
      locale: "es_EC",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
    ...(noindex
      ? { robots: { index: false, follow: true } }
      : {}),
  };
}

export const SITE = {
  url: SITE_URL,
  name: SITE_NAME,
};
