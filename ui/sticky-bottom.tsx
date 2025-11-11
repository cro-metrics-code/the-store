'use client';
import type { MappedProduct } from 'commerce-kit';
import { useEffect, useState, type ReactNode } from 'react';
import { ProductBottomStickyCard } from './product-bottom-sticky-card';

interface StickyBottomProps {
  children: ReactNode;
  product: MappedProduct;
}

export const StickyBottom = ({ children, product }: StickyBottomProps) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const button = document.getElementById('button-add-to-cart');
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry) {
          setShow(!entry.isIntersecting);
        }
      },
      { threshold: 0, rootMargin: '-100px 0px 0px 0px' },
    );

    if (button) {
      observer.observe(button);
    }

    return () => {
      if (button) {
        observer.unobserve(button);
      }
    };
  }, []);

  return (
    <>
      {children}
      <ProductBottomStickyCard product={product} show={show} />
    </>
  );
};
