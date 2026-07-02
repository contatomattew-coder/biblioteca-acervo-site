# Arquivo Privado VSCO

App estático no GitHub Pages usando Firebase Authentication + Firestore.

## Antes de usar

1. No Firebase Console, ative Authentication > Email/senha.
2. Crie dois usuários autorizados.
3. Crie o Firestore Database em modo produção.
4. Em Authentication > Settings > Authorized domains, adicione:
   - contatomattew-coder.github.io
5. Cole as regras de FIRESTORE_RULES.md em Firestore Database > Rules.

## O que o app faz

- Login real pelo Firebase Auth.
- Registros privados no Firestore.
- Abas para acervo, seguidores/conexões autorizados, biblioteca, rotina ampla, notas, favoritos, editar depois e revisados.
- Importação CSV manual/autorizada.

## Limite de segurança

Não use para endereço exato, rota, localização em tempo real, escola/sala específica ou monitoramento de terceiros. Use rotina ampla e dados com autorização.
