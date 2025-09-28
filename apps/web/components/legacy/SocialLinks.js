'use client';

import useSWR from 'swr';
import { apiGet } from '../../lib/api';

const DEFAULT_LINKS = [
  {
    label: 'Instagram Komunitas Chinese Indonesia',
    url: 'https://instagram.com/komunitaschineseindonesia',
    icon: 'instagram',
  },
  {
    label: 'TikTok Komunitas Chinese Indonesia',
    url: 'https://www.tiktok.com/@single_chinese?_t=ZS-8xOJiF83v4T&_r=1',
    icon: 'tiktok',
  },
];

function getIconName(url) {
  const lower = url.toLowerCase();
  if (lower.includes('instagram')) return 'instagram';
  if (lower.includes('tiktok')) return 'tiktok';
  if (lower.includes('youtube')) return 'youtube';
  if (lower.includes('facebook')) return 'facebook';
  return 'link';
}

function renderIcon(name) {
  switch (name) {
    case 'instagram':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2" />
          <path
            d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" />
        </svg>
      );
    case 'tiktok':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path
            fill="currentColor"
            d="M12.5 0h3.1c.21 1.79 1.39 3.4 3 4.35 1.02.6 2.17.93 3.4.93V8c-1.9 0-3.72-.55-5.23-1.6v8.33A7.73 7.73 0 1 1 9.38 8.3V11.5a4.48 4.48 0 1 0 3.12 4.2V0z"
          />
        </svg>
      );
    case 'youtube':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path
            fill="currentColor"
            d="M21.6 6.2a2.7 2.7 0 0 0-1.9-1.9C17.8 4 12 4 12 4s-5.8 0-7.7.3A2.7 2.7 0 0 0 2.4 6.2 28.9 28.9 0 0 0 2 12a28.9 28.9 0 0 0 .4 5.8 2.7 2.7 0 0 0 1.9 1.9C6.2 19.9 12 19.9 12 19.9s5.8 0 7.7-.3a2.7 2.7 0 0 0 1.9-1.9 28.9 28.9 0 0 0 .4-5.8 28.9 28.9 0 0 0-.4-5.7zM10 15.5v-7l6 3.5-6 3.5z"
          />
        </svg>
      );
    case 'facebook':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path fill="currentColor" d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H7v3h3v7h3v-7h3l1-3h-4V9c0-.6.4-1 1-1z" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path fill="currentColor" d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 14.5h-2V11h2zm0-6h-2V8h2z" />
        </svg>
      );
  }
}

export function SocialLinks() {
  const { data, error } = useSWR('/links', () => apiGet('/links'));
  const apiLinks = data?.links
    ?.filter((link) => link.category === 'social' && link.is_active)
    .map((link) => ({
      label: link.label,
      url: link.url,
      icon: getIconName(link.url),
      id: link.id,
    }));

  const links = apiLinks && apiLinks.length > 0 ? apiLinks : DEFAULT_LINKS;

  return (
    <>
      <div className="social-links" data-social-links>
        {links.map((link) => (
          <a
            key={link.id || link.url}
            className="social-link"
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.label}
          >
            {renderIcon(link.icon)}
            <span className="sr-only">{link.label}</span>
          </a>
        ))}
      </div>
      <div className="dynamic-error dynamic-error--inline" data-social-error hidden={!error}>
        Tidak dapat memuat tautan sosial.
      </div>
    </>
  );
}
