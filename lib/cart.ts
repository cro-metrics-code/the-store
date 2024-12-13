import { safeJsonParse } from '@/lib/utils';
import { cookies } from 'next/headers';

export const CART_COOKIE = 'yns_cart';

export type CartCookieJson = { id: string; linesCount: number };

export async function setCartCookieJson(cartCookieJson: CartCookieJson) {
  try {
    const cookieStore = await cookies();
    cookieStore.set(CART_COOKIE, JSON.stringify(cartCookieJson));
  } catch (error) {
    console.error('Failed to set cart cookie', error);
  }
}

export async function clearCartCookie() {
  try {
    const cookieStore = await cookies();
    cookieStore.set(CART_COOKIE, '', {
      maxAge: 0,
    });
  } catch (error) {
    console.error('Failed to clear cart cookie', error);
  }
}

export async function getCartCookieJson() {
  const cookieStore = await cookies();
  const cartCookieJson = safeJsonParse(cookieStore.get(CART_COOKIE)?.value);

  if (
    !cartCookieJson ||
    typeof cartCookieJson !== 'object' ||
    !('id' in cartCookieJson) ||
    !('linesCount' in cartCookieJson) ||
    typeof cartCookieJson.id !== 'string' ||
    typeof cartCookieJson.linesCount !== 'number'
  ) {
    return null;
  }
  return cartCookieJson as CartCookieJson;
}
