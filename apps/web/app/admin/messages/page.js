'use client';

import { useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';
import { apiGet } from '../../../lib/api';

export default function MessagesPage() {
  const { data, error, isLoading } = useSWR('/messaging', () => apiGet('/messaging'));
  const messages = useMemo(() => data?.messages ?? [], [data]);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    if (messages.length === 0) {
      setSelectedId(null);
    } else if (!selectedId || !messages.find((message) => message.id === selectedId)) {
      setSelectedId(messages[0].id);
    }
  }, [messages, selectedId]);

  const active = messages.find((message) => message.id === selectedId) ?? null;

  return (
    <section>
      <header className="action-bar">
        <div>
          <h1 style={{ margin: 0 }}>Messages</h1>
          <p style={{ margin: 0, color: '#555' }}>
            Incoming enquiries from the website contact form. Messages are read-only in Phase 1.
          </p>
        </div>
      </header>

      {error ? <div className="alert">{error.message}</div> : null}

      {isLoading ? (
        <p>Loading messages…</p>
      ) : messages.length === 0 ? (
        <div className="empty-state">No messages yet. New enquiries will appear here.</div>
      ) : (
        <div className="message-list">
          <div className="message-items" role="list">
            {messages.map((message) => (
              <button
                key={message.id}
                type="button"
                role="listitem"
                className={message.id === selectedId ? 'active' : undefined}
                onClick={() => setSelectedId(message.id)}
              >
                <div style={{ fontWeight: 600 }}>{message.sender_name}</div>
                <div style={{ fontSize: '0.85rem', color: '#555' }}>{message.sender_email}</div>
                <div style={{ marginTop: '0.25rem', fontSize: '0.8rem', color: '#777' }}>
                  {new Date(message.created_at).toLocaleString('en-US', { timeZone: 'Asia/Jakarta' })}
                </div>
              </button>
            ))}
          </div>
          <div className="message-detail">
            {active ? (
              <div className="stack">
                <div>
                  <h2 style={{ margin: '0 0 0.25rem' }}>{active.subject || 'No subject'}</h2>
                  <div style={{ color: '#555' }}>
                    From <strong>{active.sender_name}</strong> ·{' '}
                    <a href={`mailto:${active.sender_email}`}>{active.sender_email}</a>
                  </div>
                  <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#666' }}>
                    Received {new Date(active.created_at).toLocaleString('en-US', { timeZone: 'Asia/Jakarta' })}
                  </div>
                </div>
                <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{active.body}</div>
              </div>
            ) : (
              <p style={{ margin: 0 }}>Select a message to read it.</p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
