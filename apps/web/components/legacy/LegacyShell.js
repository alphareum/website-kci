'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import useSWR from 'swr';
import { apiGet } from '../../lib/api';

const SCROLL_TOP_THRESHOLD = 500;
const HEADER_HIDE_THRESHOLD = 100;
const LOADER_DELAY_MS = 500;

const EMPTY_GROUPS = Object.freeze({
  primary: [],
  secondary: [],
  social: [],
});

function normalizeLink(link) {
  const href = link?.url ?? link?.href ?? '';
  const label = link?.label ?? link?.title ?? link?.name ?? href;

  return {
    id: link?.id,
    label,
    href,
    url: href,
    icon: typeof link?.icon === 'string' && link.icon ? link.icon : undefined,
    original: link,
  };
}

function groupLinks(links) {
  if (!Array.isArray(links)) {
    return EMPTY_GROUPS;
  }

  const grouped = {
    primary: [],
    secondary: [],
    social: [],
  };

  links.forEach((link) => {
    if (!link?.is_active) return;

    const category = link?.category;

    if (!category || !(category in grouped)) return;

    const normalized = normalizeLink(link);

    if (!normalized.href || !normalized.label) return;

    grouped[category].push(normalized);
  });

  return grouped;
}

export function useLegacyLinkGroups() {
  const { data, error, isLoading } = useSWR('/links', () => apiGet('/links'));

  const groups = useMemo(() => {
    if (!data?.links) {
      return EMPTY_GROUPS;
    }
    return groupLinks(data.links);
  }, [data]);

  return {
    groups,
    error,
    isLoading,
  };
}

function isExternalHref(href) {
  return /^https?:/i.test(href);
}

function isHashHref(href) {
  return href.startsWith('#');
}

function LegacyNavLink({ href, children, onClick }) {
  const className = 'nav-link';

  if (isExternalHref(href)) {
    return (
      <a href={href} className={className} target="_blank" rel="noopener noreferrer" onClick={onClick}>
        {children}
      </a>
    );
  }

  if (isHashHref(href)) {
    return (
      <a href={href} className={className} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}

export function LegacyShell({ children, navLinks = [], variant = 'home' }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [headerTransform, setHeaderTransform] = useState('translateY(0)');
  const [loading, setLoading] = useState(true);
  const lastScrollRef = useRef(0);
  const headerRef = useRef(null);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem('legacy-theme');
    if (savedTheme === 'dark' || savedTheme === 'light') {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setLoading(false);
    }, LOADER_DELAY_MS);
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    function handleScroll() {
      const currentY = window.scrollY;

      if (currentY > HEADER_HIDE_THRESHOLD) {
        if (currentY > lastScrollRef.current) {
          setHeaderTransform('translateY(-100%)');
        } else {
          setHeaderTransform('translateY(0)');
        }
      } else {
        setHeaderTransform('translateY(0)');
      }

      setShowScrollTop(currentY > SCROLL_TOP_THRESHOLD);
      lastScrollRef.current = currentY;
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  useEffect(() => {
    window.localStorage.setItem('legacy-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleNavClick = (href) => (event) => {
    if (isHashHref(href)) {
      event.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const offsetTop = target.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
      }
    }
    setMenuOpen(false);
  };

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const themeButtonLabel = useMemo(() => (theme === 'dark' ? '🌙' : '☀️'), [theme]);

  const shellClassName = `legacy-shell${menuOpen ? ' legacy-shell--menu-open' : ''}`;

  const resolvedNavLinks = useMemo(
    () => (Array.isArray(navLinks) ? navLinks.filter((link) => link?.href && link?.label) : []),
    [navLinks],
  );

  return (
    <div className={shellClassName} data-theme={theme}>
      <div className="pattern-overlay" aria-hidden="true" />
      <div className={`loader${loading ? '' : ' hidden'}`} id="loader" aria-hidden={loading ? 'false' : 'true'}>
        <div className="loader-spinner" />
      </div>

      <header id="header" ref={headerRef} style={{ transform: headerTransform }}>
        <nav className="container nav-container">
          <div className="logo-section">
            <div className="logo-text">
              <span className="logo-main">KCI</span>
              <span className="logo-sub">Komunitas Chinese Indonesia</span>
            </div>
          </div>
          <ul className={`nav-menu${menuOpen ? ' active' : ''}`} id="navMenu">
            {resolvedNavLinks.map((link) => (
              <li key={link.href}>
                <LegacyNavLink href={link.href} onClick={handleNavClick(link.href)}>
                  {link.label}
                </LegacyNavLink>
              </li>
            ))}
            <li>
              <button type="button" className="theme-toggle" id="themeToggle" onClick={toggleTheme} aria-label="Toggle tema">
                {themeButtonLabel}
              </button>
            </li>
          </ul>
          <button
            type="button"
            className={`menu-toggle${menuOpen ? ' active' : ''}`}
            id="menuToggle"
            aria-expanded={menuOpen}
            aria-label="Toggle navigasi"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
        </nav>
      </header>

      <div className={`legacy-content legacy-content--${variant}`}>{children}</div>

      <button
        type="button"
        className={`scroll-top${showScrollTop ? ' visible' : ''}`}
        id="scrollTop"
        onClick={handleScrollTop}
        aria-label="Kembali ke atas"
      >
        ↑
      </button>
    </div>
  );
}
