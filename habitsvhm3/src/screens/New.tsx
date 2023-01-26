import { useState } from "react";
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { BackButton } from "../components/BackButton";
import { Checkbox } from "../components/Checkbox";
import { Feather } from '@expo/vector-icons'
import colors from "tailwindcss/colors";
import { api } from "../lib/axios";
import { Loading } from "../components/Loading";
import { useAuth } from "../hooks/auth";


const availableWeekDays = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'] 

export function New() {
  
  const [ title, setTitle ] = useState('')
  const [weekDays, setWeekDays] = useState<number[]>([])
  const [ isLoading, setIsLoading ] = useState(false)

  function handleToggleWeekDay(weekDayIndex: number){
    if(weekDays.includes(weekDayIndex)){
      setWeekDays(prevState => prevState.filter(weekDay => weekDay !== weekDayIndex))
    } else {
      setWeekDays(prevState => [...prevState, weekDayIndex])
    }
  }
  
  const { userInfo } = useAuth()
  
  async function handleCreateNewHabit() {
    setIsLoading(true)
    try {
      if(!title.trim() || weekDays.length === 0){
        return Alert.alert('Novo hábito.', 'Informe o nome do hábito e escolha a recorrência.')
      }
      const userId = userInfo.id
      await api.post('/habits', { userId, title, weekDays })

      setTitle('')
      setWeekDays([])

      Alert.alert('Novo hábito.', 'Cadastro realizado com sucesso!')
    } catch (error) {
      console.log(error)
      Alert.alert('Ops!', 'Não foi possivel criar o novo hábito.')
    } finally {
      setIsLoading(false)
    }
  }

  if(isLoading) {
    return (
      <Loading />
    )
  }


  return(
    <View className="flex-1 bg-background px-8 pt-16">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
        <BackButton />
        
        <Text className="mt-6 text-white font-extrabold text-3xl">
          Criar hábito
        </Text>

        <Text className="mt-6 text-white font-semibold text-base">
          Qual o seu comprometimento?
        </Text>

        <TextInput
          className="h-12 pl-4 rounded-lg mt-3 bg-zinc-900 text-white border-2 border-zinc-800 focus:border-green-600"
          placeholder="Exercícios, dormir bem, etc..."
          placeholderTextColor={colors.zinc[400]}
          onChangeText={setTitle}
          value={title}
        />
        
        <Text className="font-semibold mt-4 mb-3 text-white text-base">
          Qual a recorrência?
        </Text>

        {
          availableWeekDays.map((weekDay, i) => (
            <Checkbox
              key={weekDay}
              title={weekDay}
              checked={weekDays.includes(i)}
              onPress={() => handleToggleWeekDay(i)}
            />
          ))
        }

        <TouchableOpacity 
          className="w-full h-14 flex-row items-center justify-center bg-green-600 rounded-md mt-6"
          activeOpacity={0.7}
          onPress={handleCreateNewHabit}
        >
          <Feather
            name='check'
            size={20}
            color={colors.white}
          />

          <Text className="font-semibold text-base text-white ml-2">
            Confirmar
          </Text>

        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}