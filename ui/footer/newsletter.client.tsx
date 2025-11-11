'use client';

import { signForNewsletter } from '@/ui/footer/actions';
import { Button } from '@/ui/shadcn/button';
import { Input } from '@/ui/shadcn/input';
import { Loader2Icon } from 'lucide-react';
import { usePostHog } from 'posthog-js/react';
import { useState } from 'react';
import { toast } from 'sonner';

export const Newsletter = () => {
  const [loading, setLoading] = useState(false);
  const posthog = usePostHog();
  return (
    <form
      className="flex gap-x-2"
      onSubmit={() => {
        setLoading(true);
      }}
      action={async (formData) => {
        const email = formData.get('email') as string;
        try {
          const result = await signForNewsletter(formData);
          if (result?.status && result.status < 400) {
            toast.info('You have successfully subscribed to our newsletter', {
              position: 'bottom-left',
            });
            // Track successful newsletter signup and identify user
            posthog?.capture('newsletter_signup_submitted', {
              email,
              success: true,
              source: 'footer',
            });
            posthog?.identify(email, { email });
          } else {
            toast.error('Failed to subscribe to our newsletter', {
              position: 'bottom-left',
            });
            // Track failed newsletter signup
            posthog?.capture('newsletter_signup_submitted', {
              email,
              success: false,
              error_status: result?.status,
              source: 'footer',
            });
          }
        } catch (error) {
          toast.error('Failed to subscribe to our newsletter', {
            position: 'bottom-left',
          });

          console.error(error);
          // Track failed newsletter signup
          posthog?.capture('newsletter_signup_submitted', {
            email,
            success: false,
            error_message:
              error instanceof Error ? error.message : 'Unknown error',
            source: 'footer',
          });
        } finally {
          setLoading(false);
        }
      }}
    >
      <Input
        className="max-w-lg flex-1"
        placeholder="Enter your email"
        type="email"
        name="email"
        required
      />
      <Button
        type="submit"
        className="w-24 rounded-full"
        variant="default"
        disabled={loading}
      >
        {loading ?
          <Loader2Icon className="h-4 w-4 animate-spin" />
        : 'Subscribe'}
      </Button>
    </form>
  );
};
