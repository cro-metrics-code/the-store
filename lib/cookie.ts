export const getCookie = (name: string) => {
  const nameEQ = `${name}=`;
  const cookies = document.cookie.split(';');

  for (const cookie of cookies) {
    const cookieName = cookie.trim();

    if (cookieName.indexOf(nameEQ) === 0) {
      return cookieName.substring(nameEQ.length, cookieName.length);
    }
  }

  return null;
};
export const cookieExists = (param: string, value?: string) =>
  new RegExp(
    `(^|; )${param}${value !== undefined ? `=${value}` : '(=.*)?'}(;|$)`,
  ).test(document.cookie);
