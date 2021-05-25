import React, {
  createContext, useCallback, useState, useContext, useEffect
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
}

interface AuthState {
  token: string;
  user: User;
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextProps {
  user: User;
  loading: boolean;
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>({} as AuthState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadingData() {
      const [token, user] = await AsyncStorage.multiGet([
        '@GoBarber:token',
        '@GoBarber:user'
      ]);

      if (token[1] && user[1]) {
        setData({
          token: token[1],
          user: JSON.parse(user[1])
        });
      }
      setLoading(false);
    }
    loadingData();
  }, []);

  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post('sessions', {
      email,
      password,
    });

    const { token, user } = response.data;

    await AsyncStorage.setItem('@GoBarber:token', token);
    await AsyncStorage.setItem('@GoBarber:user', JSON.stringify(user));

    await AsyncStorage.multiSet([
      ['@GoBarber:token', token],
      ['@GoBarber:user', JSON.stringify(user)]
    ]);

    setData({ token, user });
  }, []);

  const signOut = useCallback(async () => {
    await AsyncStorage.multiRemove([
      '@GoBarber:token',
      '@GoBarber:user'
    ]);

    setData({} as AuthState);
  }, []);

  return (
    <AuthContext.Provider value={{
      user: data.user, signIn, loading, signOut
    }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextProps {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado com um AuthProvider');
  }

  return context;
}
