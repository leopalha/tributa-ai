export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
  image?: string;
}

export interface UserContextData {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  updateUser: (user: User) => void;
}
