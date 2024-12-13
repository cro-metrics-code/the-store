import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'react';

export const Skeleton = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('animate-pulse rounded-md bg-primary/10', className)}
    {...props}
  />
);
