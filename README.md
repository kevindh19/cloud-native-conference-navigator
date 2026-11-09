# Cloud Native Conference Navigator

A public hackathon project to help conference attendees find talks, exhibitors, and accessible routes. The project also aims to help organizers show where and when activities occur.

## Status

The app has an Elasticsearch-backed session finder with keyword and meaning search. It contains eight public sessions from the official schedule. Each result links to the room guide. Step-free routes are not implemented or verified.

## Local setup

1. Install Node.js 20.9 or newer.
2. Run `npm ci`.
3. Set `ELASTICSEARCH_URL` and `ELASTICSEARCH_API_KEY` in a local `.env` file. Use an API key with `read` access to `conference-sessions-v1` only. See `.env.example` for the variable names.
4. Run `npm run dev` and open `http://localhost:3000`.

The `/api/health` endpoint returns a small JSON response for deployment checks. The search route uses the key only on the server. Do not put the key in a `NEXT_PUBLIC_` variable or commit it.

## Search data

`data/sessions.json` contains a small sample of Tuesday sessions at the Salt Palace. Each entry has a stable ID and a link to the [official schedule](https://events.linuxfoundation.org/kubecon-cloudnativecon-north-america/program/schedule/). Titles, speakers, times, and rooms came from that schedule. Summaries are short paraphrases. The data is partial and can change. Confirm details in the official schedule.

To create the `conference-sessions-v1` index and load the sample, run `node scripts/seed-elastic.mjs` with a temporary key that can create this index and write to it. Replace that key with the index's read-only key before running the app. The script uses fixed document IDs and can run again without making duplicate documents. The index includes a `semantic_text` field that uses Elastic's default inference endpoint. The app offers a keyword query and a meaning query against that field.

The sample marks each step-free route as unverified. The app does not give navigation instructions. Do not treat a room label as a verified accessible route.

## Planned demo

- Search conference sessions.
- Show a route that avoids stairs when required.
- Give a text route that works with screen readers and Braille displays.
- Use Elasticsearch for the conference search data.
- Add observability with Dash0 and pull request review with Gitar.

The planned deployment is Vercel. Radar is out of scope for this version.

## Data and privacy

Use only public conference data or data with permission for this project. Do not commit credentials, account details, attendee records, or private venue information.

## Hackathon

This project is for the [Cloud Native Hackathon](https://www.wemakedevs.org/hackathons/cnh). See its [rules](https://www.wemakedevs.org/hackathons/cnh/rules) before contributing. AI coding assistance is used and will be disclosed in the final submission.

## License

No license has been selected yet. Contributions require an explicit agreement on ownership and license terms.
