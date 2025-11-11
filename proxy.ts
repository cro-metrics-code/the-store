import { env } from '@/env';
import { NextResponse, type NextRequest } from 'next/server';

export const proxy = async (request: NextRequest) => {
  const POSTHOG_KEY = env.NEXT_PUBLIC_POSTHOG_KEY;
  const POSTHOG_COOKIE_KEY = `ph_${POSTHOG_KEY}_posthog`;
  const cookie = request.cookies.get(POSTHOG_COOKIE_KEY);

  let distinct_id;
  if (cookie) {
    const parsed = JSON.parse(cookie.value) as { distinct_id: string };
    distinct_id = parsed.distinct_id;
  } else {
    distinct_id = crypto.randomUUID();
  }

  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      api_key: POSTHOG_KEY,
      distinct_id,
    }),
  };

  const ph_request = await fetch(
    'https://us.i.posthog.com/flags?v=2',
    requestOptions,
  );

  const data = (await ph_request.json()) as {
    featureFlags: Record<string, string | boolean>;
  };

  const bootstrapData = {
    distinctID: distinct_id,
    featureFlags: data.featureFlags,
  };

  const response = NextResponse.next();
  response.cookies.set('bootstrapData', JSON.stringify(bootstrapData));

  return response;
};

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|_next/data|favicon.ico|robots.txt|sitemap.xml|opengraph-image|icon|apple-icon|ph-collect).*)',
  ],
};
