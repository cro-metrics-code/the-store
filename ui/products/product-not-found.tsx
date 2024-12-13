export const ProductNotFound = async ({
  query,
}: {
  query: string | undefined;
}) => (
  <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
    <h1 className="text-3xl font-bold">{`No Results Found for ${query}`}</h1>
    <p className="max-w-md text-center text-neutral-500">
      Sorry, we couldn't find any results that match your search query. Please
      try refining your search.
    </p>
  </div>
);
