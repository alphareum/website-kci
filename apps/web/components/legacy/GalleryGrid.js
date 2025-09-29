'use client';

import useSWR from 'swr';
import { apiGet } from '../../lib/api';

function GalleryCard({ item }) {
  const metadata = item.metadata || {};
  const altText = metadata.alt || item.title || 'Dokumentasi KCI';
  const description = item.description || metadata.subtitle;

  return (
    <figure className="gallery-card">
      {item.asset_url ? (
        <img className="gallery-image" src={item.asset_url} alt={altText} loading="lazy" />
      ) : (
        <div className="gallery-image" aria-hidden="true" />
      )}
      <figcaption className="gallery-caption">
        <h3>{item.title || 'Dokumentasi KCI'}</h3>
        {description ? <p>{description}</p> : null}
      </figcaption>
    </figure>
  );
}

export function GalleryGrid() {
  const { data, error, isLoading } = useSWR('/media/gallery', () => apiGet('/media/gallery'));
  const items = data?.items ?? [];
  const hasItems = items.length > 0;

  return (
    <>
      <div className="gallery-grid" data-gallery-list hidden={!hasItems || isLoading}>
        {items.map((item) => (
          <GalleryCard key={item.id} item={item} />
        ))}
      </div>
      <div className="dynamic-placeholder" data-gallery-empty hidden={hasItems || error || isLoading}>
        <p>No documentation yet.</p>
        <p>Silakan kembali lagi nanti untuk melihat momen terbaru.</p>
      </div>
      <div className="dynamic-placeholder" hidden={!isLoading}>
        <p>Memuat dokumentasi…</p>
      </div>
      <div className="dynamic-error" data-gallery-error hidden={!error}>
        Gagal memuat dokumentasi.
      </div>
    </>
  );
}
