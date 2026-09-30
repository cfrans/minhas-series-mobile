# Minhas Séries

Aplicativo para cadastrar séries, acompanhar as temporadas assistidas e marcar o que já foi concluído. Os dados ficam salvos no aparelho com SQLite.

## Funcionalidades

- Lista de séries com filtros: todas, assistindo e concluídas.
- Cadastro e edição de título, plataforma, temporadas e nota de 1 a 5 (opcional).
- Tela de detalhes para alterar o status e excluir uma série.

## Como rodar

```sh
npm install
npx expo start
```

Abra o projeto no Expo Go pelo QR code mostrado no terminal.

## Vídeo do teste:
https://youtube.com/shorts/pG5beRa46bs

## Diário do copiloto

### Registro 1 — Etapa 1
**O que eu pedi:** colei o erro `TAR_ENTRY_ERROR UNKNOWN: unknown error, write` que apareceu durante o `npm install` na pasta do Google Drive e perguntei como conseguir rodar o projeto.
**O que a IA sugeriu (resumo):** testar a instalação das dependências em uma pasta local, porque a sincronização do Google Drive pode interferir na gravação de muitos arquivos em `node_modules`.
**O que eu fiz:** mantive o código na pasta do projeto e usei uma cópia local para instalar as dependências e fazer as verificações.

### Registro 2 — Etapa 3
**O que eu pedi:** perguntei em que momento chamar `runMigrations()` para a tabela existir antes de qualquer consulta, sem recriar a conexão a cada chamada de `getDatabase()`.
**O que a IA sugeriu (resumo):** executar a migração logo depois de abrir o banco e antes de guardar a conexão para reutilização.
**O que eu fiz:** aceitei, porque as consultas passam a receber o banco com a tabela preparada.

### Registro 3 — Etapa 4
**O que eu pedi:** perguntei como `createSerie()` poderia devolver `Serie` se `getSerieById()` tem retorno `Serie | null`.
**O que a IA sugeriu (resumo):** buscar pelo `lastInsertRowId` e tratar o caso inesperado de a série não ser encontrada.
**O que eu fiz:** aceitei; assim a função devolve a série completa ou informa o erro.

### Registro 4 — Parte 3 / Etapa 5
**O que eu pedi:** perguntei por que `useFocusEffect` precisa receber uma função envolvida por `useCallback` para atualizar a lista quando volto do formulário.
**O que a IA sugeriu (resumo):** usar `useCallback` para manter a função estável e refazer a busca quando o filtro mudar ou a tela receber foco.
**O que eu fiz:** aceitei, porque a lista precisa mostrar alterações feitas em outras telas sem recarregar o aplicativo.

### Registro 5 — Etapa 5
**O que eu pedi:** perguntei se, ao fechar e reabrir o app, valia a pena mostrar novamente o último filtro escolhido em vez de começar em “Todas”.
**O que a IA sugeriu (resumo):** salvar o filtro selecionado para restaurá-lo na próxima abertura.
**O que eu fiz:** rejeitei depois de pensar melhor, porque só as séries precisam persistir, mantive “Todas” como filtro inicial. Manter o filtro talvez atrapalharia no uso.

### Registro 6 — Etapa 6
**O que eu pedi:** perguntei como validar o texto digitado em temporadas antes de convertê-lo para número.
**O que a IA sugeriu (resumo):** usar `Number()` e conferir se o resultado é maior ou igual a zero.
**O que eu fiz:** corrigi a validação para exigir dígitos antes da conversão, porque `Number('')` resulta em `0` e permitiria salvar o campo vazio.

### Registro 7 — Etapa 7
**O que eu pedi:** perguntei como executar a exclusão após o toque em “Excluir” no `Alert.alert` e só então voltar para a lista.
**O que a IA sugeriu (resumo):** chamar a função assíncrona de exclusão no `onPress`, aguardar `deleteSerie()` e depois usar `router.back()`.
**O que eu fiz:** aceitei, porque a navegação deve acontecer após a exclusão terminar.
