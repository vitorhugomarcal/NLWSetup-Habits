import './src/lib/dayjs'

import { StatusBar } from 'react-native';
import {
  useFonts,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold
} from '@expo-google-fonts/inter'

import { LoadAnimation } from './src/components/LoadAnimation';
import { Routes } from './src/routes';
import { AuthProvider } from './src/hooks/auth';

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold
  })

  if(!fontsLoaded){
    return (
      <LoadAnimation />
    )
  }

  return (
    <>
      <AuthProvider>
        <Routes />
      </AuthProvider>
      <StatusBar barStyle='light-content' backgroundColor='transparent' translucent />
    </>
  );
}