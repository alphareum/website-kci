'use client';

import Link from 'next/link';
import useSWR from 'swr';
import { LegacyShell } from '../../../components/legacy/LegacyShell';
import { apiGet } from '../../../lib/api';

const NAV_LINKS = [
  { href: '/#beranda', label: 'Beranda' },
  { href: '/#visi-misi', label: 'Visi Misi' },
  { href: '/tentang_kci', label: 'Tentang' },
  { href: '/#acara', label: 'Acara' },
  { href: '/galeri', label: 'Galeri' },
  { href: '/blog', label: 'Blog' },
  { href: '/#testimoni', label: 'Testimoni' },
  { href: '/#kontak', label: 'Kontak' },
  { href: '/#sponsor', label: 'Partner' },
];

function formatDate(isoString) {
  if (!isoString) {
    return null;
  }
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  });
}

function PostCard({ post }) {
  const publishedDate = formatDate(post.published_at);
  return (
    <article className="blog-card">
      {post.cover_image_url ? (
        <Link href={`/blog/${post.slug}`} className="blog-card__image">
          <img src={post.cover_image_url} alt={post.title} loading="lazy" />
        </Link>
      ) : null}
      <div className="blog-card__content">
        {publishedDate ? <span className="blog-card__date">{publishedDate}</span> : null}
        <h3>
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>
        {post.summary ? <p>{post.summary}</p> : null}
        <Link className="blog-card__cta" href={`/blog/${post.slug}`}>
          Baca selengkapnya →
        </Link>
      </div>
    </article>
  );
}

export function BlogPageClient() {
  const { data, error, isLoading } = useSWR('/posts', () => apiGet('/posts'));
  const posts = data?.posts ?? [];

  return (
    <LegacyShell navLinks={NAV_LINKS} variant="home">
      <style>{`
        .blog-hero {
          background: linear-gradient(135deg, rgba(143, 29, 29, 0.92), rgba(192, 46, 46, 0.85)), url('/assets/texture.png');
          color: white;
          padding: 120px 0 80px;
          text-align: center;
        }
        .blog-hero h1 {
          font-size: clamp(2rem, 4vw, 3rem);
          margin-bottom: 1rem;
        }
        .blog-hero p {
          max-width: 640px;
          margin: 0 auto;
          font-size: 1.1rem;
          color: rgba(255, 255, 255, 0.9);
        }
        .blog-grid {
          display: grid;
          gap: 32px;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        }
        .blog-card {
          background: white;
          border-radius: 18px;
          border: 1px solid var(--border-color);
          overflow: hidden;
          box-shadow: var(--shadow);
          display: flex;
          flex-direction: column;
        }
        .blog-card__image {
          display: block;
          width: 100%;
          aspect-ratio: 16 / 9;
          overflow: hidden;
          background: var(--light-gray);
        }
        .blog-card__image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .blog-card__content {
          padding: 20px 22px 24px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .blog-card__content h3 {
          font-size: 1.35rem;
          margin: 0;
        }
        .blog-card__content h3 a {
          text-decoration: none;
          color: inherit;
        }
        .blog-card__content h3 a:hover {
          color: var(--primary-red);
        }
        .blog-card__date {
          font-size: 0.9rem;
          color: var(--gray);
          letter-spacing: 0.02em;
        }
        .blog-card__cta {
          align-self: flex-start;
          color: var(--primary-red);
          font-weight: 600;
          text-decoration: none;
        }
        .blog-card__cta:hover {
          text-decoration: underline;
        }
        .blog-empty {
          text-align: center;
          padding: 80px 0;
          color: var(--gray);
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.75);
          border: 1px dashed var(--border-color);
        }
      `}</style>

      <section className="blog-hero">
        <div className="container">
          <h1>Blog Komunitas Chinese Indonesia</h1>
          <p>
            Jelajahi cerita, pembaruan, dan wawasan terbaru dari komunitas kami. Temukan kisah inspiratif dan kegiatan
            terbaru KCI.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: '48px' }}>
        <div className="container" style={{ color: 'var(--gray)', fontSize: '0.95rem' }}>
          <span>
            <a className="nav-link" href="/" style={{ padding: 0, fontWeight: 600 }}>
              Beranda
            </a>{' '}
            › Blog
          </span>
        </div>
      </section>

      <section className="section section-alt" style={{ paddingTop: '36px' }}>
        <div className="container">
          {error ? (
            <div className="alert">{error.message}</div>
          ) : isLoading ? (
            <p>Memuat artikel…</p>
          ) : posts.length === 0 ? (
            <div className="blog-empty">Belum ada artikel yang dipublikasikan.</div>
          ) : (
            <div className="blog-grid">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>

      <footer>
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>Komunitas Chinese Indonesia</h3>
              <p>文化连心，共创未来</p>
            </div>
            <div className="footer-section">
              <h3>Tautan Cepat</h3>
              <p>
                <a href="/#visi-misi">Visi &amp; Misi</a>
              </p>
              <p>
                <a href="/#acara">Acara</a>
              </p>
              <p>
                <a href="/galeri">Galeri</a>
              </p>
              <p>
                <a href="/blog">Blog</a>
              </p>
              <p>
                <a href="/#kontak">Kontak</a>
              </p>
            </div>
            <div className="footer-section">
              <h3>Hubungi Kami</h3>
              <p>Founder: 0878-8492-4385</p>
              <p>Admin: 0856-4187-7775</p>
              <p>Instagram: @komunitaschineseindonesia</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} Komunitas Chinese Indonesia. All rights reserved.</p>
            <p>Unity in Diversity - Bhinneka Tunggal Ika</p>
          </div>
        </div>
      </footer>
    </LegacyShell>
  );
}
