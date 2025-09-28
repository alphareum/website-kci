'use client';

import useSWR from 'swr';
import { apiGet } from '../../lib/api';

function PartnerCard({ partner }) {
  const altText = partner.metadata?.alt || partner.title || 'Partner KCI';

  return (
    <article className="site-partner-card">
      {partner.asset_url ? (
        <div className="site-partner-card__logo">
          <img src={partner.asset_url} alt={altText} loading="lazy" />
        </div>
      ) : null}
      <div className="site-partner-card__body">
        <h3>{partner.title || 'Partner KCI'}</h3>
        {partner.description ? <p>{partner.description}</p> : null}
      </div>
    </article>
  );
}

export function PartnersSection() {
  const { data, error, isLoading } = useSWR('/media/partner', () => apiGet('/media/partner'));
  const partners = data?.items ?? [];

  let content = null;
  if (error) {
    content = <p className="site-status-message site-status-message--error">Tidak dapat memuat daftar mitra.</p>;
  } else if (isLoading) {
    content = <p className="site-status-message">Memuat mitra komunitas…</p>;
  } else if (partners.length === 0) {
    content = <p className="site-status-message">Belum ada mitra yang terdaftar.</p>;
  } else {
    content = (
      <div className="site-partner-grid">
        {partners.map((partner) => (
          <PartnerCard key={partner.id} partner={partner} />
        ))}
      </div>
    );
  }

  return (
    <section className="site-section" id="mitra">
      <div className="site-section__inner">
        <div className="site-section-heading">
          <p className="site-eyebrow">Kolaborasi</p>
          <h2>Mitra &amp; Pendukung</h2>
          <p className="site-section-heading__description">
            Dukungan dari organisasi dan komunitas yang bergerak bersama mewujudkan visi KCI.
          </p>
        </div>
        {content}
      </div>
    </section>
  );
}
