'use client';

import { useEffect, useState } from 'react';

function toPairs(metadata) {
  if (!metadata || typeof metadata !== 'object') {
    return [];
  }
  return Object.entries(metadata).map(([key, value]) => ({ key, value }));
}

export default function MetadataEditor({ label = 'Metadata', value, onChange }) {
  // Use local state for pairs to ensure proper updates
  const [pairs, setPairs] = useState(() => {
    const current = toPairs(value);
    if (current.length === 0) {
      return [{ key: '', value: '' }];
    }
    return current;
  });

  // Sync pairs when value changes from parent
  useEffect(() => {
    const current = toPairs(value);
    if (current.length > 0) {
      setPairs(current);
    }
  }, [value]);

  function updatePair(index, field, nextValue) {
    const nextPairs = pairs.map((pair, idx) =>
      idx === index ? { ...pair, [field]: nextValue } : pair
    );
    setPairs(nextPairs);
    emit(nextPairs);
  }

  function addPair() {
    const nextPairs = [...pairs, { key: '', value: '' }];
    setPairs(nextPairs);
    // Don't emit yet, wait for user to fill in the key
  }

  function removePair(index) {
    const nextPairs = pairs.filter((_, idx) => idx !== index);
    const finalPairs = nextPairs.length ? nextPairs : [{ key: '', value: '' }];
    setPairs(finalPairs);
    emit(finalPairs);
  }

  function emit(pairsList) {
    const filtered = pairsList.filter((pair) => pair.key.trim() !== '');
    const nextMetadata = filtered.reduce((acc, pair) => {
      acc[pair.key] = pair.value;
      return acc;
    }, {});
    onChange(nextMetadata);
  }

  return (
    <div className="stack">
      <span style={{ fontWeight: 600 }}>{label}</span>
      <div className="metadata-grid">
        {pairs.map((pair, index) => (
          <div className="metadata-row" key={index}>
            <input
              type="text"
              placeholder="Key"
              value={pair.key}
              onChange={(event) => updatePair(index, 'key', event.target.value)}
            />
            <input
              type="text"
              placeholder="Value"
              value={pair.value}
              onChange={(event) => updatePair(index, 'value', event.target.value)}
            />
            <button
              type="button"
              className="button secondary"
              onClick={() => removePair(index)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <div>
        <button type="button" className="button" onClick={addPair}>
          Add metadata
        </button>
      </div>
    </div>
  );
}
