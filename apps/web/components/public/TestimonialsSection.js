'use client';

import useSWR from 'swr';
import { apiGet } from '../../lib/api';

function TestimonialCard({ item }) {
  const description = item.description || '';
  const title = item.title || 'Anggota Komunitas';
  const role = item.metadata?.role || item.metadata?.subtitle || '';

  return (
    <article className="site-testimonial-card">
      {item.asset_url ? (
        <div className="site-testimonial-card__avatar">
          <img src={item.asset_url} alt={title} loading="lazy" />
        </div>
      ) : null}
      <div className="site-testimonial-card__body">
        <p className="site-testimonial-card__quote">“{description || 'Terima kasih telah menjadi bagian dari KCI.'}”</p>
        <div className="site-testimonial-card__author">
          <span className="site-testimonial-card__name">{title}</span>
          {role ? <span className="site-testimonial-card__role">{role}</span> : null}
        </div>
      </div>
    </article>
  );
}

export function TestimonialsSection() {
  const { data, error, isLoading } = useSWR('/media/testimonial', () => apiGet('/media/testimonial'));
  const testimonials = data?.items ?? [];

  let content = null;
  if (error) {
    content = <p className="site-status-message site-status-message--error">Gagal memuat testimoni.</p>;
  } else if (isLoading) {
    content = <p className="site-status-message">Mengambil cerita anggota…</p>;
  } else if (testimonials.length === 0) {
    content = <p className="site-status-message">Belum ada testimoni yang ditampilkan.</p>;
  } else {
    content = (
      <div className="site-testimonial-grid">
        {testimonials.map((item) => (
          <TestimonialCard key={item.id} item={item} />
        ))}
      </div>
    );
  }

  return (
    <section className="site-section site-section--muted" id="testimoni">
      <div className="site-section__inner">
        <div className="site-section-heading">
          <p className="site-eyebrow">Cerita Anggota</p>
          <h2>Testimoni Komunitas</h2>
          <p className="site-section-heading__description">
            Pengalaman para anggota dalam berkegiatan dan bertumbuh bersama Komunitas Chinese Indonesia.
          </p>
        </div>
        {content}
      </div>
    </section>
  );
}
