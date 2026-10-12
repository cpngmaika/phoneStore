# PhoneStore frontend

The Next.js App Router and frontend code live under `src/`. Shared UI is grouped
under `src/components`, shared TypeScript models under `src/types`, and
feature-specific state and logic under `src/modules`.

The API foundation is in `src/api`:

- `client.ts` sends credentialed JSON requests to `http://localhost:8080` by
  default.
- Set `NEXT_PUBLIC_API_URL` to override the backend base URL.
- `endpoints.ts` centralizes endpoint paths. API feature calls are not wired up
  yet; the storefront and cart continue to use local mock data.

Run the development server from this directory with `npm run dev`.
