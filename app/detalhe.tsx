import { useCallback, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';

import {
  deleteSerie,
  getSerieById,
  toggleSerieConcluida,
} from '../src/database/serieRepository';
import type { Serie } from '../src/types/serie';

export default function DetalheScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const serieId = Number(id);
  const [serie, setSerie] = useState<Serie | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [ocupado, setOcupado] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (!Number.isInteger(serieId) || serieId <= 0) {
        Alert.alert('Erro', 'Série inválida.');
        router.back();
        return;
      }

      let ativa = true;
      setCarregando(true);
      getSerieById(serieId)
        .then((resultado) => {
          if (ativa) setSerie(resultado);
        })
        .catch(() => Alert.alert('Erro', 'Não foi possível carregar a série.'))
        .finally(() => {
          if (ativa) setCarregando(false);
        });

      return () => {
        ativa = false;
      };
    }, [serieId]),
  );

  async function alternarConclusao() {
    if (!serie || ocupado) return;
    setOcupado(true);
    try {
      await toggleSerieConcluida(serie.id);
      setSerie(await getSerieById(serie.id));
    } catch {
      Alert.alert('Erro', 'Não foi possível atualizar a série.');
    } finally {
      setOcupado(false);
    }
  }

  async function excluir() {
    if (!serie || ocupado) return;
    setOcupado(true);
    try {
      await deleteSerie(serie.id);
      router.back();
    } catch {
      Alert.alert('Erro', 'Não foi possível excluir a série.');
      setOcupado(false);
    }
  }

  function confirmarExclusao() {
    Alert.alert('Excluir série?', `Excluir "${serie?.titulo}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => void excluir() },
    ]);
  }

  if (carregando) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-100">
        <Text className="text-slate-500">Carregando...</Text>
      </View>
    );
  }

  if (serie === null) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-100 p-5">
        <Text className="text-center text-slate-600">Série não encontrada.</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-slate-100">
      <View className="gap-5 p-5">
        <View className="rounded-xl bg-white p-5">
          <Text className="text-2xl font-bold text-slate-900">{serie.titulo}</Text>
          <Text
            className={`mt-2 font-semibold ${
              serie.concluida === 1 ? 'text-emerald-700' : 'text-indigo-600'
            }`}
          >
            {serie.concluida === 1 ? 'Concluída' : 'Assistindo'}
          </Text>

          <Text className="mt-5 text-slate-500">Plataforma</Text>
          <Text className="text-base text-slate-900">{serie.plataforma}</Text>

          <Text className="mt-4 text-slate-500">Temporadas assistidas</Text>
          <Text className="text-base text-slate-900">{serie.temporadas}</Text>

          <Text className="mt-4 text-slate-500">Nota</Text>
          <Text className="text-base text-slate-900">
            {serie.nota === null ? 'Sem nota' : `${serie.nota}/5 ★`}
          </Text>

          <Text className="mt-4 text-slate-500">Cadastrada em</Text>
          <Text className="text-base text-slate-900">
            {new Date(serie.createdAt).toLocaleString('pt-BR')}
          </Text>
          <Text className="mt-4 text-sm text-slate-400">ID: {serie.id}</Text>
        </View>

        <Pressable
          disabled={ocupado}
          onPress={alternarConclusao}
          className="rounded-xl bg-emerald-600 p-4"
        >
          <Text className="text-center font-bold text-white">
            {serie.concluida === 1 ? 'Voltar para assistindo' : 'Marcar como concluída'}
          </Text>
        </Pressable>

        <Pressable
          disabled={ocupado}
          onPress={() =>
            router.push({ pathname: '/form', params: { id: String(serie.id) } })
          }
          className="rounded-xl bg-indigo-600 p-4"
        >
          <Text className="text-center font-bold text-white">Editar</Text>
        </Pressable>

        <Pressable
          disabled={ocupado}
          onPress={confirmarExclusao}
          className="rounded-xl bg-white p-4"
        >
          <Text className="text-center font-bold text-red-600">Excluir</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
