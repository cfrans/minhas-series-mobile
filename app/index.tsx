import { Text, View } from 'react-native';

export default function IndexScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-slate-100 px-6">
      <View className="w-full max-w-sm rounded-2xl bg-white p-6">
        <Text className="text-center text-2xl font-bold text-indigo-600">
          Configuração OK
        </Text>
        <Text className="mt-3 text-center text-base text-slate-600">
          Expo Router e NativeWind configurados.
        </Text>
        <Text className="mt-2 text-center text-sm text-slate-500">
          Minhas Séries
        </Text>
      </View>
    </View>
  );
}
