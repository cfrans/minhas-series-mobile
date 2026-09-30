import { useCallback, useState } from 'react';
import { Alert, FlatList, Pressable, Text, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';

import { getSeries } from '../src/database/serieRepository';
import type { Serie, SerieFilter } from '../src/types/serie';

const filtros: { valor: SerieFilter; nome: string }[] = [
  { valor: 'todas', nome: 'Todas' },
  { valor: 'assistindo', nome: 'Assistindo' },
  { valor: 'concluidas', nome: 'Concluídas' },
];

export default function IndexScreen() {
  const [filtro, setFiltro] = useState<SerieFilter>('todas');
  const [series, setSeries] = useState<Serie[]>([]);
  const [carregando, setCarregando] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let ativa = true;
      setCarregando(true);

      getSeries(filtro)
        .then((lista) => {
          if (ativa) setSeries(lista);
        })
        .catch(() => Alert.alert('Erro', 'Não foi possível carregar as séries.'))
        .finally(() => {
          if (ativa) setCarregando(false);
        });

      return () => {
        ativa = false;
      };
    }, [filtro]),
  );

  return (
    <View className="flex-1 bg-slate-100">
      <FlatList
        className="flex-1 px-5"
        data={series}
        keyExtractor={(item) => String(item.id)}
        ListHeaderComponent={
          <View className="pb-4 pt-5">
            <View className="mb-5 flex-row gap-2">
              {filtros.map((opcao) => (
                <Pressable
                  key={opcao.valor}
                  onPress={() => setFiltro(opcao.valor)}
                  className={`flex-1 rounded-xl px-2 py-3 ${
                    filtro === opcao.valor ? 'bg-indigo-600' : 'bg-white'
                  }`}
                >
                  <Text
                    className={`text-center text-sm font-semibold ${
                      filtro === opcao.valor ? 'text-white' : 'text-slate-600'
                    }`}
                  >
                    {opcao.nome}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Pressable
              onPress={() => router.push('/form')}
              className="rounded-xl bg-indigo-600 px-4 py-4"
            >
              <Text className="text-center text-base font-bold text-white">
                + Nova série
              </Text>
            </Pressable>
          </View>
        }
        ListEmptyComponent={
          <Text className="py-10 text-center text-slate-500">
            {carregando ? 'Carregando...' : 'Nenhuma série neste filtro.'}
          </Text>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() =>
              router.push({ pathname: '/detalhe', params: { id: String(item.id) } })
            }
            className={`mb-3 rounded-xl p-4 ${
              item.concluida === 1 ? 'bg-emerald-50' : 'bg-white'
            }`}
          >
            <Text className="text-lg font-bold text-slate-900">{item.titulo}</Text>
            <Text className="mt-1 text-slate-600">{item.plataforma}</Text>
            <Text className="mt-1 text-slate-600">
              {item.temporadas} {item.temporadas === 1 ? 'temporada' : 'temporadas'}
              {' · '}
              {item.nota === null ? 'Sem nota' : `${item.nota}/5 ★`}
            </Text>
            <Text
              className={`mt-2 text-sm font-semibold ${
                item.concluida === 1 ? 'text-emerald-700' : 'text-indigo-600'
              }`}
            >
              {item.concluida === 1 ? 'Concluída' : 'Assistindo'}
            </Text>
          </Pressable>
        )}
      />
    </View>
  );
}
