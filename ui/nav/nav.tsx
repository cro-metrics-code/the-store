import { CartSummaryNav } from '@/ui/nav/cart-summary-nav';
import { NavMenu } from '@/ui/nav/nav-menu';
import { SearchNav } from '@/ui/nav/search-nav';
import { PrefetchLink } from '@/ui/prefetch-link';
import { SeoH1 } from '@/ui/seo-h1';

export const Nav = async () => {
  return (
    <header className="nav-border-reveal after:bg-neutral after:animate-nav-border-reveal sticky top-0 z-50 bg-white/90 py-4 backdrop-blur-sm after:absolute after:bottom-0 after:h-0.25 after:w-full after:content-[''] after:[animation-range:0_100px] after:[animation-timeline:scroll()]">
      <div className="mx-auto flex max-w-7xl flex-row items-center gap-2 px-4 sm:px-6 lg:px-8">
        <PrefetchLink href="/">
          <SeoH1 className="-mt-0.5 text-xl font-bold whitespace-nowrap">
            The Store
          </SeoH1>
        </PrefetchLink>

        <div className="flex w-auto max-w-full shrink overflow-auto max-sm:order-2 sm:mr-auto">
          <NavMenu />
        </div>
        <div className="mr-3 ml-auto sm:ml-0">
          <SearchNav />
        </div>
        <CartSummaryNav />
      </div>
    </header>
  );
};
