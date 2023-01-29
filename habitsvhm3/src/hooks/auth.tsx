import { createContext, ReactNode, useContext, useEffect, useState } from "react";

import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Loading } from "../components/Loading";
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

interface AuthorizationResponse {
  params: {
    access_token: string
  },
  type: string
}

const AuthContext = createContext({} as AuthContextData)

function AuthProvider({ children }: AuthProviderProps){
  const [userInfo, setUserInfo] = useState<User>({} as User)
  const [loading, setLoading] = useState(true)

  const useStorageKey = '@habits:user'

  async function signInWithGoogle() {
    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    // Get the users ID token
    const { idToken, user } = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    const userLogged = {
      id: user.id,
      name: user.name,
      email: user.email,
      photo: user.photo,
    }

    setUserInfo(userLogged);

    console.log(userLogged);

    await api.post('/user', userLogged)

    await AsyncStorage.setItem(useStorageKey, JSON.stringify(userLogged))
    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);
  }


  async function signOut() {
    await GoogleSignin.signOut()
    setUserInfo({} as User)
    await AsyncStorage.removeItem(useStorageKey)
  }

  useEffect(() => {
    async function loadUser() {
      setLoading(true)
      const userStoraged = await AsyncStorage.getItem(useStorageKey)

      if(userStoraged) {
        const userLogged = JSON.parse(userStoraged) as User
        setUserInfo(userLogged)
      }
      setLoading(false)
    }
    loadUser()
  }, [])

  if(loading) {
    return (
      <Loading />
    )
  }

  return(
    <AuthContext.Provider value={{ userInfo, signInWithGoogle, signOut }}>
      { children }
    </AuthContext.Provider>
  )
}

function useAuth() {
  const context = useContext(AuthContext)

  return context
}

export { AuthProvider, useAuth }