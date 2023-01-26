import { Alert, Text, TouchableOpacity, View } from "react-native";
import colors from "tailwindcss/colors";
import Logo2 from '../assets/logo.svg'
import { FontAwesome } from '@expo/vector-icons'
import { useAuth } from "../hooks/auth";

export function SignIn() {
  const { signInWithGoogle } = useAuth()

  async function handleSignInWithGoogle() {
    try {
      signInWithGoogle()
      
    } catch (error) {
      console.log(error)
      Alert.alert('Ops!', 'Não foi possível fazer o login.')
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
        onPress={handleSignInWithGoogle}
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
    </View>
  )
}