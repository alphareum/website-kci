'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { clearSession, getSession } from '../../lib/session';

const NAV_ITEMS = [
  { href: '/admin/posts', label: 'Posts' },
  { href: '/admin/events', label: 'Events' },
  { href: '/admin/media', label: 'Media' },
  { href: '/admin/contacts', label: 'Contacts' },
  { href: '/admin/links', label: 'Links' },
  { href: '/admin/messages', label: 'Messages' },
  { href: '/admin/settings', label: 'Settings' },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.replace('/login');
    } else {
      setReady(true);
    }
  }, [router]);

  function signOut() {
    clearSession();
    router.replace('/login');
  }

  if (!ready) {
    return null;
  }

  return (
    <div>
      <nav className="admin-nav">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <ul>
            {NAV_ITEMS.map((item) => {
              const isActive = pathname?.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link href={item.href} className={isActive ? 'active' : undefined}>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div style={{ paddingRight: '1.5rem' }}>
            <button className="button secondary" onClick={signOut}>
              Sign out
            </button>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}
