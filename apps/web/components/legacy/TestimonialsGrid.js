'use client';

import useSWR from 'swr';
import { apiGet } from '../../lib/api';

function TestimonialCard({ item }) {
  const quoteText = item.description || 'Terima kasih telah menjadi bagian dari Komunitas Chinese Indonesia.';
  const metadata = item.metadata || {};

  return (
    <article className="dynamic-card dynamic-card--testimonial">
      {item.asset_url ? (
        <div className="dynamic-card__avatar">
          <img src={item.asset_url} alt={item.title || 'Anggota KCI'} loading="lazy" />
        </div>
      ) : null}
      <div className="dynamic-card__body">
        <p className="dynamic-card__quote">“{quoteText}”</p>
        <div className="dynamic-card__author">
          <span className="dynamic-card__name">{item.title || 'Anggota Komunitas'}</span>
          {metadata.role || metadata.subtitle ? (
            <span className="dynamic-card__meta">{metadata.role || metadata.subtitle}</span>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export function TestimonialsGrid() {
  const { data, error, isLoading } = useSWR('/media/testimonial', () => apiGet('/media/testimonial'));
  const testimonials = data?.items ?? [];
  const hasTestimonials = testimonials.length > 0;

  return (
    <>
      <div className="dynamic-grid dynamic-grid--testimonials" data-testimonials-list hidden={!hasTestimonials || isLoading}>
        {testimonials.map((item) => (
          <TestimonialCard key={item.id} item={item} />
        ))}
      </div>
      <div className="dynamic-placeholder" data-testimonials-empty hidden={hasTestimonials || error || isLoading}>
        <p>Testimoni dari anggota akan segera ditampilkan</p>
        <p>Bagikan pengalaman Anda bersama KCI</p>
      </div>
      <div className="dynamic-placeholder" hidden={!isLoading}>
        <p>Memuat testimoni…</p>
      </div>
      <div className="dynamic-error" data-testimonials-error hidden={!error}>
        Gagal memuat testimoni.
      </div>
    </>
  );
}
