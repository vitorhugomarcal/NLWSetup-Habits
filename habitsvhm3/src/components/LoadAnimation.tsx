import { View } from "react-native";
import LottieView from 'lottie-react-native'

import loadLogo from '../../assets/501.json'

export function LoadAnimation() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#09090A' }}>
      <LottieView
        source={loadLogo}
        autoPlay
        style= {{
          width: 280,
        }}
        resizeMode="contain"
        loop
      />
    </View>
  )
}