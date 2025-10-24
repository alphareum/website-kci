'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import useSWR from 'swr';
import { LegacyShell } from '../../../../components/legacy/LegacyShell';
import { apiGet } from '../../../../lib/api';

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

function renderBody(body = '') {
  const paragraphs = body.split(/\n{2,}/).map((chunk) => chunk.trim()).filter(Boolean);
  if (paragraphs.length === 0) {
    return <p>Tidak ada konten untuk ditampilkan.</p>;
  }
  return paragraphs.map((paragraph, index) => (
    <p key={index}>{paragraph}</p>
  ));
}

export function BlogPostPageClient({ slug }) {
  const { data, error, isLoading } = useSWR(`/posts/${slug}`, () => apiGet(`/posts/${slug}`));
  const post = data?.post;
  const publishedDate = useMemo(() => formatDate(post?.published_at), [post?.published_at]);
  const isNotFound = error?.message?.toLowerCase().includes('not found');

  return (
    <LegacyShell navLinks={NAV_LINKS} variant="home">
      <style>{`
        .blog-post-hero {
          background: linear-gradient(135deg, rgba(143, 29, 29, 0.92), rgba(192, 46, 46, 0.85));
          color: white;
          padding: 120px 0 60px;
        }
        .blog-post-hero .breadcrumbs {
          color: rgba(255, 255, 255, 0.9);
          font-size: 0.95rem;
          margin-bottom: 12px;
        }
        .blog-post-hero h1 {
          margin: 0;
          font-size: clamp(2.2rem, 5vw, 3.2rem);
          line-height: 1.1;
        }
        .blog-post-hero .meta {
          margin-top: 1.5rem;
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.85);
        }
        .blog-post-content {
          background: white;
          border-radius: 22px;
          box-shadow: var(--shadow);
          padding: clamp(24px, 4vw, 48px);
          margin-top: -60px;
          position: relative;
          z-index: 2;
        }
        .blog-post-content img {
          width: 100%;
          max-height: 480px;
          object-fit: cover;
          border-radius: 18px;
          margin-bottom: 2rem;
        }
        .blog-post-body {
          display: grid;
          gap: 1.5rem;
          font-size: 1.05rem;
          line-height: 1.8;
          color: #2c2c2c;
        }
        .blog-post-empty {
          padding: 80px 0;
          text-align: center;
          color: var(--gray);
        }
      `}</style>

      {error && !isNotFound ? (
        <section className="section">
          <div className="container">
            <div className="alert">{error.message}</div>
          </div>
        </section>
      ) : isLoading ? (
        <section className="section">
          <div className="container">
            <p>Memuat artikel…</p>
          </div>
        </section>
      ) : !post ? (
        <section className="section">
          <div className="container">
            <div className="blog-post-empty">
              Artikel tidak ditemukan atau belum dipublikasikan.
            </div>
          </div>
        </section>
      ) : (
        <>
          <section className="blog-post-hero">
            <div className="container">
              <div className="breadcrumbs">
                <Link href="/">Beranda</Link> › <Link href="/blog">Blog</Link> › <span>{post.title}</span>
              </div>
              <h1>{post.title}</h1>
              {post.summary ? <p style={{ marginTop: '1rem', maxWidth: '720px' }}>{post.summary}</p> : null}
              {publishedDate ? <div className="meta">Diterbitkan pada {publishedDate}</div> : null}
            </div>
          </section>

          <section className="section">
            <div className="container">
              <article className="blog-post-content">
                {post.cover_image_url ? (
                  <img src={post.cover_image_url} alt={post.title} loading="lazy" />
                ) : null}
                <div className="blog-post-body">{renderBody(post.body)}</div>
              </article>
            </div>
          </section>
        </>
      )}

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
