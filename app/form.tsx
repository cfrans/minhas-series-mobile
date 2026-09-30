import { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';

import { createSerie, getSerieById, updateSerie } from '../src/database/serieRepository';

export default function FormScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const editando = id !== undefined;
  const serieId = Number(id);

  const [titulo, setTitulo] = useState('');
  const [plataforma, setPlataforma] = useState('');
  const [temporadas, setTemporadas] = useState('');
  const [nota, setNota] = useState<number | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [carregando, setCarregando] = useState(editando);

  useEffect(() => {
    if (!editando) return;

    if (!Number.isInteger(serieId) || serieId <= 0) {
      Alert.alert('Erro', 'Série inválida.');
      router.back();
      return;
    }

    let ativo = true;
    getSerieById(serieId)
      .then((serie) => {
        if (!ativo) return;
        if (serie === null) {
          Alert.alert('Erro', 'Série não encontrada.');
          router.back();
          return;
        }
        setTitulo(serie.titulo);
        setPlataforma(serie.plataforma);
        setTemporadas(String(serie.temporadas));
        setNota(serie.nota);
      })
      .catch(() => Alert.alert('Erro', 'Não foi possível carregar a série.'))
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, [editando, serieId]);

  async function salvar() {
    const tituloLimpo = titulo.trim();
    const plataformaLimpa = plataforma.trim();
    const temporadasTexto = temporadas.trim();
    const numeroTemporadas = Number(temporadasTexto);

    if (!tituloLimpo || !plataformaLimpa) {
      Alert.alert('Dados incompletos', 'Informe o título e a plataforma.');
      return;
    }
    if (!/^\d+$/.test(temporadasTexto) || !Number.isSafeInteger(numeroTemporadas)) {
      Alert.alert('Temporadas inválidas', 'Informe um número inteiro igual ou maior que zero.');
      return;
    }

    setSalvando(true);
    try {
      const dados = {
        titulo: tituloLimpo,
        plataforma: plataformaLimpa,
        temporadas: numeroTemporadas,
        nota,
      };
      if (editando) {
        await updateSerie(serieId, dados);
      } else {
        await createSerie(dados);
      }
      router.back();
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar a série.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-slate-100"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Stack.Screen options={{ title: editando ? 'Editar série' : 'Nova série' }} />
      <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
        <View className="gap-5 p-5">
          {carregando ? (
            <Text className="text-slate-500">Carregando...</Text>
          ) : (
            <>
              <View>
                <Text className="mb-2 font-semibold text-slate-800">Título</Text>
                <TextInput
                  className="rounded-xl bg-white px-4 py-3 text-base text-slate-900"
                  placeholder="Nome da série"
                  value={titulo}
                  onChangeText={setTitulo}
                />
              </View>

              <View>
                <Text className="mb-2 font-semibold text-slate-800">Plataforma</Text>
                <TextInput
                  className="rounded-xl bg-white px-4 py-3 text-base text-slate-900"
                  placeholder="Netflix, Max, Prime Video..."
                  value={plataforma}
                  onChangeText={setPlataforma}
                />
              </View>

              <View>
                <Text className="mb-2 font-semibold text-slate-800">Temporadas assistidas</Text>
                <TextInput
                  className="rounded-xl bg-white px-4 py-3 text-base text-slate-900"
                  placeholder="0"
                  keyboardType="numeric"
                  value={temporadas}
                  onChangeText={setTemporadas}
                />
              </View>

              <View>
                <Text className="mb-2 font-semibold text-slate-800">Nota (opcional)</Text>
                <View className="flex-row gap-2">
                  {[1, 2, 3, 4, 5].map((valor) => (
                    <Pressable
                      key={valor}
                      onPress={() => setNota(nota === valor ? null : valor)}
                      className="rounded-xl bg-white px-3 py-2"
                    >
                      <Text
                        className={`text-2xl ${
                          nota !== null && valor <= nota ? 'text-amber-500' : 'text-slate-300'
                        }`}
                      >
                        ★
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              <Pressable
                disabled={salvando}
                onPress={salvar}
                className="rounded-xl bg-indigo-600 px-4 py-4"
              >
                <Text className="text-center text-base font-bold text-white">
                  {salvando ? 'Salvando...' : 'Salvar série'}
                </Text>
              </Pressable>
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
