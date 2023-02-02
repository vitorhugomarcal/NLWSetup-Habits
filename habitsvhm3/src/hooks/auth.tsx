import { createContext, ReactNode, useContext, useEffect, useState } from "react";

import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from "../lib/axios";

const { CLIENT_ID } = process.env

console.log(CLIENT_ID)

GoogleSignin.configure({
  webClientId: CLIENT_ID
});

interface AuthProviderProps {
  children: ReactNode
}

interface User {
  id: string;
  name: string | null;
  email: string;
  photo?: string | null;
}

interface AuthContextData {
  userInfo: User
  signInWithGoogle: () => void;
  signOut: () => void;
}

const AuthContext = createContext({} as AuthContextData)

function AuthProvider({ children }: AuthProviderProps){
  const [userInfo, setUserInfo] = useState<User>({} as User)
  const storageKey = '@habits:user'

  useEffect(() => {
    async function loadUser() {
      const userStoraged = await AsyncStorage.getItem(storageKey)
      if(userStoraged) {
        const user = JSON.parse(userStoraged) as User
        setUserInfo(user)
      }
    }
    loadUser()
  }, [])

  async function signInWithGoogle() {
    try {
      await GoogleSignin.hasPlayServices();
      const { idToken, user } = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      const userLogged = {
        id: user.id,
        name: user.name,
        email: user.email,
        photo: user.photo,
      }

      setUserInfo(userLogged);
      await api.post('/user', userLogged)
      await AsyncStorage.setItem(storageKey, JSON.stringify(userLogged))
      return auth().signInWithCredential(googleCredential);
    } catch (error) {
      console.log(error)
    }
  }

  async function signOut() {
    await GoogleSignin.signOut()
    setUserInfo({} as User)
    await AsyncStorage.removeItem(storageKey)
  }

  return (
    <AuthContext.Provider value={{ userInfo, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

function useAuth() {
  const context = useContext(AuthContext)

  return context
}

export { AuthProvider, useAuth }