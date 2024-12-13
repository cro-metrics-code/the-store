import { Newsletter } from '@/ui/footer/newsletter.client';
import { PrefetchLink } from '@/ui/prefetch-link';

const sections = [
  {
    header: 'Products',
    links: [
      {
        label: 'Apparel',
        href: '/category/apparel',
      },
      {
        label: 'Accessories',
        href: '/category/accessories',
      },
    ],
  },
];

export async function Footer() {
  return (
    <footer className="w-full bg-neutral-50 p-6 text-neutral-800 md:py-12">
      <div className="container flex max-w-7xl flex-row flex-wrap justify-center gap-16 text-sm sm:justify-between">
        <nav className="grid grid-cols-2 gap-16">
          {sections.map((section) => (
            <section key={section.header}>
              <h3 className="mb-2 font-semibold">{section.header}</h3>
              <ul className="grid gap-1">
                {section.links.map((link) => {
                  return link.href.includes('/category') ?
                      <li key={link.label}>
                        <PrefetchLink
                          className="underline-offset-4 hover:underline"
                          href={link.href}
                        >
                          {link.label}
                        </PrefetchLink>
                      </li>
                    : <li key={link.label}>
                        <PrefetchLink
                          className="underline-offset-4 hover:underline"
                          href={link.href}
                        >
                          {link.label}
                        </PrefetchLink>
                      </li>;
                })}
              </ul>
            </section>
          ))}
        </nav>

        <div className="shrink-0 grow">
          <div className="flex w-full max-w-sm flex-col gap-2">
            <h3 className="font-semibold">Subscribe to our newsletter</h3>
            <Newsletter />
          </div>
        </div>
      </div>
      <div className="container mt-8 flex max-w-7xl flex-col items-center justify-between gap-4 text-sm text-neutral-500 md:flex-row">
        <div>
          <p>© 2024 The Store</p>
        </div>
      </div>
    </footer>
  );
}
