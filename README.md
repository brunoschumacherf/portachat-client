# PortaChat Client

Frontend da aplicação de chat interno, construído com **React**, **TypeScript** e **Vite**.  
Esta Single Page Application (SPA) consome a **Nexus API** para fornecer uma interface de usuário moderna e reativa para a troca de mensagens em tempo real.

---

## ✨ Funcionalidades

- Interface reativa e moderna com Tailwind CSS
- Comunicação em tempo real via **WebSockets** (Action Cable)
- Autenticação de usuário e gerenciamento de sessão
- Rotas protegidas (apenas usuários autenticados)
- Criação de salas de chat e envio de mensagens
- Lista de usuários com opção de iniciar conversas diretas

---

## 🧰 Tecnologias

- **React 18+**
- **Vite**
- **TypeScript**
- **Tailwind CSS**
- **Axios** (requisições HTTP)
- **Action Cable JS** (WebSockets)
- **React Router**

---

## ⚙️ Configuração do Ambiente Local

### 📦 Pré-requisitos

- Node.js (v18 ou superior)
- npm ou yarn

### 🛠️ Passos para Configuração

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/portachat-client.git
cd portachat-client
```

2. Instale as dependências:

```bash
npm install
# ou
yarn install
```

3. Crie o arquivo `.env.local` na raiz do projeto:

```env
# .env.local
VITE_API_URL=http://localhost:3000
```

> ⚠️ Esse arquivo **não deve ser versionado** no Git.

---

## 💻 Comandos Essenciais

### Iniciar o servidor de desenvolvimento:

```bash
npm run dev
```

A aplicação estará disponível em: [http://localhost:5173](http://localhost:5173)

### Build para produção:

```bash
npm run build
```

Gera os arquivos otimizados em `dist/`.

### Pré-visualizar o build de produção:

```bash
npm run preview
```

---

## 🔌 Conexão com o Backend

Para funcionar corretamente, o backend (**PortaChat API**) deve estar rodando.
O cliente se conectará à URL definida em `VITE_API_URL` no arquivo `.env.local`.

---

## 🚀 Deploy

A aplicação está disponível em produção na Vercel:

🔗 **[https://portachat-client.vercel.app/](https://portachat-client.vercel.app/)**

## 📝 Licença

Este projeto está licenciado sob os termos da [MIT License](LICENSE).

