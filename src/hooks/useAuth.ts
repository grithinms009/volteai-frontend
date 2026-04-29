export interface AuthState {
  token: string | null;
  userId: string | null;
  name: string | null;
  isAuthenticated: boolean;
}

export const useAuth = () => {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const name = localStorage.getItem('userName');
  const isAuthenticated = !!token;

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    window.location.href = '/';
  };

  const setAuth = (token: string, userId: string, name: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('userName', name);
  };

  return { token, userId, name, isAuthenticated, logout, setAuth };
};

export default useAuth;
