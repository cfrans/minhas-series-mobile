# Minhas Séries

Aplicativo para registrar séries assistidas ou em andamento, com Expo, TypeScript, Expo Router, NativeWind e SQLite.

## Como rodar

```sh
npm install
npx expo start -c
```

Abra o projeto no Expo Go usando o QR code exibido no terminal.

## Etapa 1 — Projeto e configuração

- Projeto criado com o template `blank-typescript`.
- Expo Router configurado com entrada `expo-router/entry` e scheme `minhas-series`.
- Dependências do Expo instaladas com `npx expo install`.
- NativeWind 4 e Tailwind CSS 3 configurados.
- Tela inicial com a mensagem **Configuração OK**.

## Validação

- TypeScript sem erros em `npx tsc --noEmit`.
- Dependências compatíveis na verificação `npx expo install --check`.
- Bundle Android gerado sem erros.
- Tela inicial conferida na prévia web, com os estilos do NativeWind.
- Verificação no Expo Go em aparelho: pendente.
