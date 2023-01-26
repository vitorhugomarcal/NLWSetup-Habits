import { Text, TouchableOpacity, View } from "react-native";
import { Feather } from '@expo/vector-icons'
import colors from 'tailwindcss/colors'

import Logo from '../assets/logo.svg'
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../hooks/auth";

export function Header() {
  const { navigate } = useNavigation()
  const { signOut } = useAuth()

  return (
    <View className="w-full flex-row items-center justify-between" >
      <Logo />

      <View className=" flex-row gap-1">
        <TouchableOpacity
          activeOpacity={0.7}
          className="flex-row h-11 px-4 border border-violet-500 rounded-lg items-center"
          onPress={() => navigate('new')}
          >
          <Feather
            name="plus"
            color={colors.violet[500]}
            size={20}
            />
          <Text className="text-white ml-3 font-semibold text-base">
            Novo
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          className="flex-row px-4 items-center"
          onPress={signOut}
          >
          <Feather
            name="log-out"
            color={colors.red[500]}
            size={20}
            />
        
        </TouchableOpacity>
      </View>
    </View>
  )
}