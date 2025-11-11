import { env } from '@/env';
import { cookies } from 'next/headers';
import { generateId } from './genId';

const POSTHOG_COOKIE_NAME = `ph_${env.NEXT_PUBLIC_POSTHOG_KEY}_posthog`;

type FeatureFlags = Record<string, string | boolean>;

export type PosthogBootstrapData = {
  distinctID: string;
  featureFlags: FeatureFlags;
};

const parsePosthogCookie = (value?: string) => {
  if (!value) {
    return undefined;
  }

  try {
    const parsed = JSON.parse(value) as { distinct_id?: string };
    return parsed.distinct_id;
  } catch {
    return undefined;
  }
};

const getServerDistinctId = async () => {
  const cookieStore = await cookies();
  const phCookie = cookieStore.get(POSTHOG_COOKIE_NAME);
  const distinctId = parsePosthogCookie(phCookie?.value);
  return distinctId ?? generateId();
};

export const getServerBootstrapData =
  async (): Promise<PosthogBootstrapData> => {
    const distinctID = await getServerDistinctId();
    const { PostHog } = await import('posthog-node');

    const client = new PostHog(env.NEXT_PUBLIC_POSTHOG_KEY, {
      host: env.NEXT_PUBLIC_POSTHOG_HOST,
    });

    const featureFlags = (await client.getAllFlags(distinctID)) as FeatureFlags;
    await client._shutdown?.();

    return {
      distinctID,
      featureFlags,
    };
  };
