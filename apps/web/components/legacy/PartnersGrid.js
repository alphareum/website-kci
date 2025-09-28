'use client';

import useSWR from 'swr';
import { apiGet } from '../../lib/api';

function PartnerCard({ partner }) {
  const metadata = partner.metadata || {};
  return (
    <article className="dynamic-card dynamic-card--partner">
      {partner.asset_url ? (
        <div className="dynamic-card__media">
          <img src={partner.asset_url} alt={metadata.alt || partner.title || 'Partner KCI'} loading="lazy" />
        </div>
      ) : null}
      <div className="dynamic-card__body">
        <h3 className="dynamic-card__title">{partner.title || 'Partner KCI'}</h3>
        {partner.description ? <p className="dynamic-card__text">{partner.description}</p> : null}
      </div>
    </article>
  );
}

export function PartnersGrid() {
  const { data, error, isLoading } = useSWR('/media/partner', () => apiGet('/media/partner'));
  const partners = data?.items ?? [];
  const hasPartners = partners.length > 0;

  return (
    <>
      <div className="dynamic-grid dynamic-grid--partners" data-partners-list hidden={!hasPartners || isLoading}>
        {partners.map((partner) => (
          <PartnerCard key={partner.id} partner={partner} />
        ))}
      </div>
      <div className="dynamic-placeholder" data-partners-empty hidden={hasPartners || error || isLoading}>
        <p>Daftar mitra akan segera diperbarui.</p>
        <p>Hubungi kami untuk berkolaborasi dengan KCI.</p>
      </div>
      <div className="dynamic-placeholder" hidden={!isLoading}>
        <p>Memuat daftar mitra…</p>
      </div>
      <div className="dynamic-error" data-partners-error hidden={!error}>
        Gagal memuat mitra.
      </div>
    </>
  );
}
