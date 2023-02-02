import { Alert, Text, TouchableOpacity, View } from "react-native";
import colors from "tailwindcss/colors";
import Logo2 from '../assets/logo.svg'
import { FontAwesome } from '@expo/vector-icons'
import { useAuth } from "../hooks/auth";
import { Animated } from "../components/Animated";
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export function SignIn() {
  const { signInWithGoogle } = useAuth()

  async function schedulePushNotification() {
    const trigger = new Date()
    trigger.setHours(20)
    trigger.setMinutes(trigger.getMinutes() + 2)
    trigger.setSeconds(0)

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Oii! 🫣",
        body: 'Você já praticou seus hábitos hoje ???',
      },
      trigger,
    });
    console.log(`A próxima notificação foi agendada para: ${trigger}`);
  }

  setInterval(schedulePushNotification, 2 * 60 * 1000);

  async function handleSignInWithGoogle() {
    try {
      signInWithGoogle()
      
    } catch (error) {
      console.log(error)
      Alert.alert('Ops!', 'Não foi possível fazer o login.')
    }
  }

  const handlePress = async () => {
    try {
      await Promise.all([
        handleSignInWithGoogle(),
        schedulePushNotification()
      ])
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <View className="flex-1 bg-background px-8 pt-16 justify-center items-center">
      <View className="mb-8">
        <Logo2 />
      </View>
      <TouchableOpacity
        activeOpacity={0.7}
        className="flex-row h-14 px-4 border border-violet-500 rounded-lg items-center"
        onPress={handlePress}
      >
        <FontAwesome
          name="google"
          color={colors.violet[500]}
          size={20}
        />
        <Text className="text-white ml-3 font-bold text-base">
          Entrar com sua conta Google
        </Text>
      </TouchableOpacity>
      <Animated />
    </View>
  )
}