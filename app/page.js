'use client';

import { useEffect, useState } from 'react';

function timeLabel(value) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Denver',
    weekday: 'short',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));
}

export default function Home() {
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState('keyword');
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState('Loading sessions…');
  const [loading, setLoading] = useState(false);

  async function search(text, searchMode) {
    setLoading(true);
    setMessage('Searching…');
    try {
      const params = new URLSearchParams({ q: text, mode: searchMode });
      const response = await fetch(`/api/search?${params}`, { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? 'Search failed.');
      setResults(data.results);
      setMessage(`${data.count} session${data.count === 1 ? '' : 's'} found.`);
    } catch (error) {
      setResults([]);
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { search('', 'keyword'); }, []);

  return (
    <main>
      <header>
        <p className="eyebrow">KubeCon + CloudNativeCon North America 2026</p>
        <h1>Find a session</h1>
        <p>Search a small set of public Salt Palace sessions. Times are in Mountain Standard Time.</p>
      </header>

      <form onSubmit={(event) => { event.preventDefault(); search(query, mode); }} role="search">
        <label htmlFor="session-query">Talk, speaker, topic, or room</label>
        <div className="search-row">
          <input id="session-query" name="q" value={query} maxLength={120} onChange={(event) => setQuery(event.target.value)} placeholder="Try Kubernetes security" />
          <button type="submit" disabled={loading}>Search</button>
        </div>
        <fieldset>
          <legend>Search type</legend>
          <label><input type="radio" name="mode" value="keyword" checked={mode === 'keyword'} onChange={() => setMode('keyword')} /> Keywords</label>
          <label><input type="radio" name="mode" value="semantic" checked={mode === 'semantic'} onChange={() => setMode('semantic')} /> Meaning</label>
        </fieldset>
      </form>

      <p className="status" role="status" aria-live="polite">{message}</p>
      <ul className="results">
        {results.map((session) => (
          <li key={session.id} className="session">
            <p className="session-time">{timeLabel(session.start_time)} · {session.venue}, Level {session.level}</p>
            <p className="session-room">Room: <a href={`/venue?room=${encodeURIComponent(session.room)}`}>{session.room}</a></p>
            <h2>{session.title}</h2>
            <p>{Array.isArray(session.speaker) ? session.speaker.join(', ') : ''}</p>
            <p>{session.summary}</p>
            <p className="route-note">Step-free route to this room has not been verified.</p>
            <a href={session.source_url} target="_blank" rel="noreferrer">Official schedule</a>
          </li>
        ))}
      </ul>
      <p className="source-note">This is a partial demo data set. Confirm session details in the official schedule before travel.</p>
    </main>
  );
}
