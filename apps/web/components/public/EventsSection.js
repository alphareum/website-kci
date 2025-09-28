'use client';

import useSWR from 'swr';
import { apiGet } from '../../lib/api';

const DATE_FORMAT_OPTIONS = { dateStyle: 'long', timeZone: 'Asia/Jakarta' };
const TIME_FORMAT_OPTIONS = { timeStyle: 'short', timeZone: 'Asia/Jakarta' };
const DATE_TIME_OPTIONS = { dateStyle: 'long', timeStyle: 'short', timeZone: 'Asia/Jakarta' };

function getJakartaDateKey(isoString) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta' }).format(new Date(isoString));
}

function formatDateRange(startsAt, endsAt) {
  if (!startsAt) {
    return '';
  }

  const startDate = new Date(startsAt);
  if (!endsAt) {
    return new Intl.DateTimeFormat('id-ID', DATE_TIME_OPTIONS).format(startDate);
  }

  const endDate = new Date(endsAt);
  const startKey = getJakartaDateKey(startsAt);
  const endKey = getJakartaDateKey(endsAt);

  if (startKey === endKey) {
    const dateLabel = new Intl.DateTimeFormat('id-ID', DATE_FORMAT_OPTIONS).format(startDate);
    const startTime = new Intl.DateTimeFormat('id-ID', TIME_FORMAT_OPTIONS).format(startDate);
    const endTime = new Intl.DateTimeFormat('id-ID', TIME_FORMAT_OPTIONS).format(endDate);
    return `${dateLabel} • ${startTime} – ${endTime} WIB`;
  }

  const formatter = new Intl.DateTimeFormat('id-ID', DATE_TIME_OPTIONS);
  return `${formatter.format(startDate)} – ${formatter.format(endDate)}`;
}

function EventCard({ event }) {
  const description = event.summary || event.description || '';
  const dateLabel = formatDateRange(event.starts_at, event.ends_at);

  return (
    <article className="site-event-card">
      {event.hero_image_url ? (
        <div className="site-event-card__media">
          <img src={event.hero_image_url} alt={event.title} loading="lazy" />
        </div>
      ) : null}
      <div className="site-event-card__body">
        <div className="site-event-card__meta">
          {dateLabel ? <span className="site-event-card__date">{dateLabel}</span> : null}
          {event.location ? <span className="site-event-card__location">{event.location}</span> : null}
        </div>
        <h3 className="site-event-card__title">{event.title}</h3>
        {description ? <p className="site-event-card__description">{description}</p> : null}
        <a className="site-event-card__link" href={`#/acara/${event.slug}`}>Detail acara</a>
      </div>
    </article>
  );
}

export function EventsSection() {
  const { data, error, isLoading } = useSWR('/events', () => apiGet('/events'));
  const events = data?.events ?? [];

  let content = null;

  if (error) {
    content = <p className="site-status-message site-status-message--error">Gagal memuat acara. Silakan coba lagi.</p>;
  } else if (isLoading) {
    content = <p className="site-status-message">Memuat jadwal acara…</p>;
  } else if (events.length === 0) {
    content = <p className="site-status-message">Belum ada acara yang dipublikasikan.</p>;
  } else {
    content = (
      <div className="site-events-grid">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    );
  }

  return (
    <section className="site-section" id="acara">
      <div className="site-section__inner">
        <div className="site-section-heading">
          <p className="site-eyebrow">Agenda Terbaru</p>
          <h2>Acara &amp; Kegiatan</h2>
          <p className="site-section-heading__description">
            Kegiatan komunitas yang memperkuat jejaring, budaya, dan kontribusi sosial KCI.
          </p>
        </div>
        {content}
      </div>
    </section>
  );
}
