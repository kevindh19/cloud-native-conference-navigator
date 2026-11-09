import { readFile } from 'node:fs/promises';

const endpoint = process.env.ELASTICSEARCH_URL?.replace(/\/$/, '');
const apiKey = process.env.ELASTICSEARCH_API_KEY;
const index = 'conference-sessions-v1';

if (!endpoint || !apiKey || !endpoint.startsWith('https://')) {
  console.error('Set ELASTICSEARCH_URL and ELASTICSEARCH_API_KEY before seeding.');
  process.exit(1);
}

async function request(path, method, body, contentType = 'application/json') {
  const response = await fetch(`${endpoint}${path}`, {
    method,
    headers: {
      Authorization: `ApiKey ${apiKey}`,
      'Content-Type': contentType,
    },
    body,
    signal: AbortSignal.timeout(30000),
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(`${method} ${path} failed (${response.status}): ${result.error?.type ?? 'unknown error'}`);
  }
  return result;
}

const mapping = {
  mappings: {
    properties: {
      id: { type: 'keyword' },
      title: { type: 'text' },
      speaker: { type: 'text' },
      summary: { type: 'text' },
      content: { type: 'semantic_text' },
      start_time: { type: 'date' },
      end_time: { type: 'date' },
      venue: { type: 'text' },
      level: { type: 'integer' },
      room: { type: 'text' },
      track: { type: 'text' },
      accessibility_status: { type: 'keyword' },
      source_url: { type: 'keyword' },
    },
  },
};

try {
  const check = await fetch(`${endpoint}/${index}`, {
    method: 'HEAD',
    headers: { Authorization: `ApiKey ${apiKey}` },
    signal: AbortSignal.timeout(10000),
  });
  if (check.status === 404) {
    await request(`/${index}`, 'PUT', JSON.stringify(mapping));
    console.log(`Created ${index}.`);
  } else if (!check.ok) {
    throw new Error(`Cannot inspect ${index} (${check.status}).`);
  }

  const sessions = JSON.parse(await readFile(new URL('../data/sessions.json', import.meta.url), 'utf8'));
  const bulk = sessions.flatMap((session) => [
    JSON.stringify({ index: { _index: index, _id: session.id } }),
    JSON.stringify(session),
  ]).join('\n') + '\n';
  const result = await request('/_bulk?refresh=wait_for', 'POST', bulk, 'application/x-ndjson');
  if (result.errors) {
    const failed = result.items.filter((item) => item.index?.error).map((item) => ({
      id: item.index._id,
      error: item.index.error.type,
    }));
    throw new Error(`Indexing failed: ${JSON.stringify(failed)}`);
  }
  console.log(`Indexed ${sessions.length} public sessions in ${index}.`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
