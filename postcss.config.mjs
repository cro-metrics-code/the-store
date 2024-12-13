import tailwindNesting from '@tailwindcss/nesting';
import autoprefixer from 'autoprefixer';
import tailwindcss from 'tailwindcss';

export default {
  plugins: [tailwindNesting, tailwindcss, autoprefixer],
};
