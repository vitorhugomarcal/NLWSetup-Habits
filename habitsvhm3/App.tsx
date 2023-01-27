import './src/lib/dayjs'
import OneSignal from 'react-native-onesignal';

import { StatusBar } from 'react-native';
import {
  useFonts,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold
} from '@expo-google-fonts/inter'

import { Loading } from './src/components/Loading';
import { Routes } from './src/routes';
import { AuthProvider } from './src/hooks/auth';

const { APP_ID } = process.env

OneSignal.setAppId(`${APP_ID}`);

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold
  })

  if(!fontsLoaded){
    return (
      <Loading />
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