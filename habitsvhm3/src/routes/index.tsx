import { NavigationContainer } from "@react-navigation/native";
import { View } from "react-native";
import { useAuth } from "../hooks/auth";

import { AppRoutes } from "./app.routes";
import { AuthRoutes } from "./auth.routes";

export function Routes() {
  const { userInfo } = useAuth()

  return (
    <View className="flex-1 bg-background">
      <NavigationContainer>
        {userInfo.id ? <AppRoutes /> : <AuthRoutes />}
      </NavigationContainer>
    </View>
  )
}