import type { MappedProduct } from 'commerce-kit';

const simpleSearchMatch = (query: string, value: null | undefined | string) => {
  if (!value) {
    return 0;
  }
  if (value === query) {
    return 5;
  }

  const allWords = value.split(' ').length || 1;
  const exactRegEx = new RegExp(`\\b${query}\\b`, 'ig');
  const includesRegEx = new RegExp(query, 'ig');

  const exactOccurrences = [...value.toString().matchAll(exactRegEx)].length;
  const includesOccurrences = [...value.toString().matchAll(includesRegEx)]
    .length;

  return (2 * exactOccurrences + includesOccurrences) / allWords;
};

export const simpleSearch = (products: MappedProduct[], query: string) =>
  products
    .flatMap(
      ({ description, id, metadata: { category, slug, variant }, name }) => {
        const fieldsWithWeights = [
          [name, 1.5],
          [description, 1],
          [slug, 1],
          [category, 1],
          [variant, 1],
        ] as const;

        const score = fieldsWithWeights
          .map(
            ([field, weight]) =>
              weight *
              simpleSearchMatch(
                query.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'),
                field,
              ),
          )
          .reduce((score, match) => score + match, 0);

        if (score > 0) {
          return {
            id,
            score,
          };
        }
        return [];
      },
    )
    .sort((a, b) => b.score - a.score);
