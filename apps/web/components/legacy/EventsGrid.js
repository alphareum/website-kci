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
    return `${dateLabel} • ${startTime} - ${endTime} WIB`;
  }

  const formatter = new Intl.DateTimeFormat('id-ID', DATE_TIME_OPTIONS);
  return `${formatter.format(startDate)} - ${formatter.format(endDate)}`;
}

function EventCard({ event }) {
  const description = event.summary || event.description || '';
  const dateLabel = formatDateRange(event.starts_at, event.ends_at);

  return (
    <article className="dynamic-card dynamic-card--event">
      {event.hero_image_url ? (
        <div className="dynamic-card__media">
          <img src={event.hero_image_url} alt={event.title || 'Acara Komunitas'} loading="lazy" />
        </div>
      ) : null}
      <div className="dynamic-card__body">
        <div className="dynamic-card__meta">
          {dateLabel ? <span className="dynamic-card__date">{dateLabel}</span> : null}
          {event.location ? <span className="dynamic-card__location">{event.location}</span> : null}
        </div>
        <h3 className="dynamic-card__title">{event.title || 'Acara Komunitas'}</h3>
        {description ? <p className="dynamic-card__text">{description}</p> : null}
        <a className="dynamic-card__link" href={`#/acara/${event.slug || ''}`}>Detail acara</a>
      </div>
    </article>
  );
}

export function EventsGrid() {
  const { data, error, isLoading } = useSWR('/events', () => apiGet('/events'));
  const events = data?.events ?? [];
  const hasEvents = events.length > 0;

  return (
    <>
      <div className="dynamic-grid" data-events-list hidden={!hasEvents || isLoading}>
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
      <div className="dynamic-placeholder" data-events-empty hidden={hasEvents || error || isLoading}>
        <p>Acara dan kegiatan akan segera diperbarui</p>
        <p>Pantau terus perkembangan terbaru dari komunitas kami</p>
      </div>
      <div className="dynamic-placeholder" hidden={!isLoading}>
        <p>Memuat informasi acara…</p>
      </div>
      <div className="dynamic-error" data-events-error hidden={!error}>
        Gagal memuat data acara.
      </div>
    </>
  );
}
