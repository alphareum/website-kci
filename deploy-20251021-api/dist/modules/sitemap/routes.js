import { PostsService } from '../posts/service.js';
export async function sitemapRoutes(server) {
    const postsService = new PostsService();
    server.get('/sitemap.xml', async (request, reply) => {
        // Fetch all published posts
        const posts = await postsService.listPosts({ includeDrafts: false });
        // Get current date in YYYY-MM-DD format
        const today = new Date().toISOString().split('T')[0];
        // Build sitemap XML
        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Homepage -->
  <url>
    <loc>https://komunitaschineseindonesia.com/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- Blog List -->
  <url>
    <loc>https://komunitaschineseindonesia.com/blog</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>

  <!-- Blog Posts (Dynamic) -->
${posts
            .map((post) => {
            const lastmod = post.published_at
                ? new Date(post.published_at).toISOString().split('T')[0]
                : today;
            return `  <url>
    <loc>https://komunitaschineseindonesia.com/blog/${post.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
        })
            .join('\n')}

  <!-- Gallery -->
  <url>
    <loc>https://komunitaschineseindonesia.com/galeri</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>

  <!-- About -->
  <url>
    <loc>https://komunitaschineseindonesia.com/tentang</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>

  <!-- Organization Structure -->
  <url>
    <loc>https://komunitaschineseindonesia.com/struktur-organisasi</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>`;
        reply.header('Content-Type', 'application/xml');
        reply.send(sitemap);
    });
}
//# sourceMappingURL=routes.js.map