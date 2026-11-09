const index = 'conference-sessions-v1';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request) {
  const url = new URL(request.url);
  const query = url.searchParams.get('q')?.trim() ?? '';
  const mode = url.searchParams.get('mode') === 'semantic' ? 'semantic' : 'keyword';

  if (query.length > 120) {
    return Response.json({ error: 'Search text is too long.' }, { status: 400 });
  }

  const endpoint = process.env.ELASTICSEARCH_URL?.replace(/\/$/, '');
  const apiKey = process.env.ELASTICSEARCH_API_KEY;
  if (!endpoint?.startsWith('https://') || !apiKey) {
    return Response.json({ error: 'Search is not connected yet.' }, { status: 503 });
  }

  const search = query
    ? mode === 'semantic'
      ? { match: { content: { query } } }
      : { multi_match: { query, fields: ['title^4', 'speaker^2', 'summary^2', 'room', 'track', 'venue'], fuzziness: 'AUTO' } }
    : { match_all: {} };

  try {
    const response = await fetch(`${endpoint}/${index}/_search`, {
      method: 'POST',
      headers: {
        Authorization: `ApiKey ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        size: 12,
        _source: ['id', 'title', 'speaker', 'summary', 'start_time', 'end_time', 'venue', 'level', 'room', 'track', 'accessibility_status', 'source_url'],
        query: search,
        sort: query ? ['_score', { start_time: 'asc' }] : [{ start_time: 'asc' }],
      }),
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) {
      return Response.json({ error: 'Search is temporarily unavailable.' }, { status: 502 });
    }
    const data = await response.json();
    const results = data.hits?.hits?.map((hit) => hit._source) ?? [];
    return Response.json({ results, mode, count: results.length }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return Response.json({ error: 'Search is temporarily unavailable.' }, { status: 502 });
  }
}
