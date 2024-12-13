import { NavMobileMenu } from '@/ui/nav/nav-mobile-menu';
import Link from 'next/link';

const links = [
  {
    label: 'Home',
    href: '/',
  },
  {
    label: 'Apparel',
    href: '/category/apparel',
  },
  {
    label: 'Accessories',
    href: '/category/accessories',
  },
];

export const NavMenu = () => {
  return (
    <>
      <div className="hidden sm:block">
        <ul className="flex flex-row items-center justify-center gap-x-1">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="group hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors focus:outline-none"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex items-center sm:hidden">
        <NavMobileMenu>
          <ul className="flex flex-col items-stretch justify-center gap-x-1 pb-8">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="group hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground inline-flex h-9 w-full items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors focus:outline-none"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </NavMobileMenu>
      </div>
    </>
  );
};
