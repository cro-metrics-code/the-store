import { PrefetchLink } from '@/ui/prefetch-link';

const NotFound = async () => (
  <main className="mx-auto max-w-xl flex-1 text-center">
    <h1 className="mt-4 text-4xl font-black">Not found</h1>
    <p className="mt-4 text-lg">
      The page you were looking for does not exist.
    </p>
    <PrefetchLink href="/" className="mt-4 text-blue-600 underline">
      Go back home
    </PrefetchLink>
  </main>
);

export default NotFound;
