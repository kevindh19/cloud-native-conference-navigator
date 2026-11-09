# Cloud Native Conference Navigator

A public hackathon project to help conference attendees find talks, exhibitors, and accessible routes. The project also aims to help organizers show where and when activities occur.

## Status

This repository has a minimal Next.js app for the first deployment. Search, routes, and service connections are not implemented yet.

## Local setup

1. Install Node.js 20.9 or newer.
2. Run `npm ci`.
3. Run `npm run dev`.
4. Open `http://localhost:3000`.

The `/api/health` endpoint returns a small JSON response for deployment checks. No credentials are needed for this first build.

## Planned demo

- Search conference sessions and places.
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
