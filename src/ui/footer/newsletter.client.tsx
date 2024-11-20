'use client';

import { signForNewsletter } from '@/ui/footer/actions';
import { Button } from '@/ui/shadcn/button';
import { Input } from '@/ui/shadcn/input';
import { Loader2Icon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export const Newsletter = () => {
  const [loading, setLoading] = useState(false);
  return (
    <form
      className="flex gap-x-2"
      onSubmit={() => {
        setLoading(true);
      }}
      action={async (formData) => {
        try {
          const result = await signForNewsletter(formData);
          if (result?.status && result.status < 400) {
            toast.info('You have successfully subscribed to our newsletter', {
              position: 'bottom-left',
            });
          } else {
            toast.error('Failed to subscribe to our newsletter', {
              position: 'bottom-left',
            });
          }
        } catch (error) {
          toast.error('Failed to subscribe to our newsletter', {
            position: 'bottom-left',
          });

          console.error(error);
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
