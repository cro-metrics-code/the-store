import {
  SearchInput,
  SearchInputPlaceholder,
} from '@/ui/nav/search-input.client';
import { SearchIcon } from 'lucide-react';
import { Suspense } from 'react';

export const SearchNav = async () => (
  <label className="flex w-full min-w-9 items-center justify-end">
    <span className="sr-only">Search</span>
    <Suspense
      fallback={<SearchInputPlaceholder placeholder="Search for products..." />}
    >
      <SearchInput placeholder="Search for products..." />
    </Suspense>
    <SearchIcon className="block h-5 w-5 max-smb:z-10 max-smb:cursor-pointer xxs:-ml-7" />
  </label>
);
