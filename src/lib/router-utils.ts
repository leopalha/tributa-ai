import { useNavigate, useLocation } from 'react-router-dom';

export const useRouter = () => {
  const navigate = useNavigate();

  return {
    push: (url: string) => navigate(url),
    replace: (url: string) => navigate(url, { replace: true }),
    back: () => navigate(-1),
    forward: () => navigate(1),
    refresh: () => window.location.reload(),
    prefetch: () => {},
  };
};

export const usePathname = () => {
  const location = useLocation();
  return location.pathname;
};

export const useSearchParams = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  return {
    get: (key: string) => searchParams.get(key),
    getAll: (key: string) => searchParams.getAll(key),
    has: (key: string) => searchParams.has(key),
    set: (key: string, value: string) => {
      searchParams.set(key, value);
      return searchParams;
    },
    delete: (key: string) => {
      searchParams.delete(key);
      return searchParams;
    },
    toString: () => searchParams.toString(),
  };
};
