'use client';

import { PrefetchLink } from '@/ui/prefetch-link';
import { X } from 'lucide-react';
import { useState } from 'react';

export const Banner = () => {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="bg-linear-to-r from-indigo-100 via-indigo-200 to-indigo-300 px-4 py-3 text-indigo-900">
      <div className="flex items-center justify-between gap-x-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-x-4 max-md:w-full">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 max-md:w-full max-md:justify-evenly">
            <p className="text-center text-sm font-medium md:hidden">
              Have money burning a hole in your pocket?
              <br />
              Check out our WHAT!? Headphones.
            </p>
            <p className="hidden text-center text-sm font-medium md:block">
              Have money burning a hole in your pocket? Check out our WHAT!?
              Headphones.
            </p>
            <PrefetchLink
              href="/product/what-headphones"
              className="flex-none rounded-full bg-indigo-500 px-3 py-1 text-sm font-semibold text-white shadow-sm hover:bg-indigo-600"
            >
              Check it out
            </PrefetchLink>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="flex-none justify-self-end rounded-full bg-indigo-500 p-1 text-white shadow-sm hover:bg-indigo-600"
          aria-label="Close banner"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};
