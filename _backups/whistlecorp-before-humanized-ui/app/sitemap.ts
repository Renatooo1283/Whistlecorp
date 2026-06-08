import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seo";

type Route = {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
};

const routes: Route[] = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" },
  { path: "/servicios", priority: 0.9, changeFrequency: "monthly" },
  { path: "/servicios/desarrollo-software", priority: 0.9, changeFrequency: "monthly" },
  { path: "/servicios/automatizacion", priority: 0.9, changeFrequency: "monthly" },
  { path: "/servicios/infraestructura-cloud", priority: 0.8, changeFrequency: "monthly" },
  { path: "/servicios/consultoria", priority: 0.8, changeFrequency: "monthly" },
  { path: "/casos-de-uso", priority: 0.8, changeFrequency: "monthly" },
  { path: "/nosotros", priority: 0.6, changeFrequency: "yearly" },
  { path: "/contacto", priority: 0.9, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return routes.map((r) => ({
    url: `${SITE.url}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
