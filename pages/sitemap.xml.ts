import { GetServerSideProps } from "next";

function generateSiteMap(baseUrl: string) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url>
<loc>${baseUrl}/</loc>
<changefreq>weekly</changefreq>
<priority>1.0</priority>
</url>
<url>
<loc>${baseUrl}/library</loc>
<changefreq>daily</changefreq>
<priority>0.8</priority>
</url>
<url>
<loc>${baseUrl}/login</loc>
<changefreq>yearly</changefreq>
<priority>0.3</priority>
</url>
<url>
<loc>${baseUrl}/signup</loc>
<changefreq>yearly</changefreq>
<priority>0.3</priority>
</url>
</urlset>
`;
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const proto = (req.headers["x-forwarded-proto"] as string) || "https";
  const host = req.headers["host"];
  const origin = `${proto}://${host}`;

  res.setHeader("Content-Type", "application/xml");
  res.write(generateSiteMap(origin));
  res.end();
  return { props: {} };
};

export default function Sitemap() {
  return null;
}
