# Roteiro

## 1. Instalações

### 1.1. Instalação do Node.js

1. Acesse o site oficial do [Node.js](https://nodejs.org/en/).
2. Baixe a versão LTS (Long Term Support).
3. Instale o Node.js.

### 1.2. Instalação do Biomejs

1. Abra o terminal.
2. Execute o comando `npm install @biomejs/biome -D` ou `npm i -D --save-exact @biomejs/biome`.

### 1.3. Instalação do TypeScript

1. Abra o terminal.
2. Execute o comando `npm install typescript -D`.

### 1.4. Executar o TypeScript

1. Abra o terminal.
2. Execute o comando `npx tsc --init`.
3. Abra o arquivo `tsconfig.json`.

```json
// valido para a versão 20.1.0
{
  "$schema": "http://json.schemastore.org/tsconfig",
  "_version": "20.1.0",

  "compilerOptions": {
    "lib": ["ES2023"],
    "module": "Node16",
    "target": "ES2022",

    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "moduleResolution": "Node16"
  }
}
```

### 1.5. Instalação do types/node e tsx

1. Abra o terminal.
2. Execute o comando `npm install @types/node tsx -D`.

### 1.6. Instalação do Fastify

1. Abra o terminal.
2. Execute o comando `npm install fastify`.

### 1.7. Configuração do Biomejs

1. Crie um arquivo `biome.json`.

```javascript
{
  "$schema": "./node_modules/@biomejs/biome/configuration_schema.json",
  "organizeImports": {
    "enabled": true
  },
  "formatter": {
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 80
  },
  "javascript": {
    "formatter": {
      "arrowParentheses": "asNeeded",
      "jsxQuoteStyle": "double",
      "quoteStyle": "single",
      "semicolons": "asNeeded",
      "trailingCommas": "es5"
    }
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  },
  "files": {
    "ignore": [
      "node_modules"
    ]
  }
}
```


## 2. Configuração do Docker

### 2.1. Instalação do Docker

1. Acesse o site oficial do [Docker](https://www.docker.com/).
2. Baixe a versão do Docker para o seu sistema operacional.
3. Instale o Docker.

### 2.2. Configuração do Docker

1. Abra o terminal.
2. Execute o comando `docker --version` para verificar se o Docker foi instalado corretamente.
3. Execute o comando `docker run hello-world` para verificar se o Docker está funcionando corretamente.

### 2.3. Criar um arquivo Dockerfile

1. Crie um arquivo `docker-compose.yml`.

```yml
name: pocket-js-server

services:
  pg:
    image: bitnami/postgresql:13.16.0
    ports:
      - '5432:5432'
    environment:
      - POSTGRES_USER=docker
      - POSTGRES_PASSWORD=docker
      - POSTGRES_DB=inorbit
```

### 2.4. Executar o Docker

1. Abra o terminal.
2. Execute o comando `docker-compose up -d` para iniciar o Docker.
3. Execute o comando `docker ps` para verificar se o Docker está rodando corretamente.
4. Execute o comando `docker ps -a` para verificar todos os containers que estão rodando.

## 3. Instalando o Drizzle ORM

### 3.1. Instalação do Drizzle ORM

1. Abra o terminal.
2. Execute o comando `npm install drizzle-orm`.
3. Execute o comando `npm i drizzle-kit -D`.

### 3.2. Configuração do Drizzle ORM

1. Crie um arquivo `drizzle.config.ts`.

```ts
import { defineConfig } from 'drizzle-kit'
import { env } from './src/env'

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './.migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
})
```

## 4. Instalando Zod

### 4.1. Instalação do Zod

1. Abra o terminal.
2. Execute o comando `npm install zod`.

### 4.2. Configuração do Zod

1 Crie um arquivo `env.ts`.

```ts
import z from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
});

export const env = envSchema.parse(process.env);
```

## 5. Gerando as Tabelas

### 5.1. Gerando as Tabelas

1. Abra o terminal.
2. Execute o comando `npx drizzle-kit generate`.

3. Não se esqueça de instalar o `Postgres`, caso não tenha instalado.
4. Execute o comando `npm i postgres`.

5. Execute o comando `npx drizzle-kit migrate`.

6. Você pode executar o comando `npx drizzle-kit studio` para visualizar o banco de dados.

### 5.2. Configuração de Ids 

1. Abra o terminal.
2. Execute o comando `npm i @paralleldrive/cuid2`.


## 6. Usando Seed para Popular o Banco de Dados

### 6.1. Criando um Seed

1. Crie um arquivo `seed.ts`.

```ts
import { client, db } from '.'
import { goalCompletions, goals } from './schema'
import dayjs from 'dayjs'

async function seed() {
  await db.delete(goalCompletions)
  await db.delete(goals)

  const result = await db
    .insert(goals)
    .values([
      {
        title: 'Acordar cedo',
        desiredWeeklyFrequency: 5,
      },
      {
        title: 'Fazer exercícios',
        desiredWeeklyFrequency: 6,
      },
      {
        title: 'Estudar inglês',
        desiredWeeklyFrequency: 7,
      },
      {
        title: 'Ler livros',
        desiredWeeklyFrequency: 3,
      },
      {
        title: 'Fazer meditação',
        desiredWeeklyFrequency: 1,
      },
    ])
    .returning()

  const startOfWeek = dayjs().startOf('week')

  await db.insert(goalCompletions).values([
    {
      goalId: result[0].id,
      createdAt: startOfWeek.toDate(),
    },
    {
      goalId: result[0].id,
      createdAt: startOfWeek.add(1, 'day').toDate(),
    },
    {
      goalId: result[1].id,
      createdAt: startOfWeek.toDate(),
    },
    {
      goalId: result[1].id,
      createdAt: startOfWeek.add(2, 'day').toDate(),
    },
  ])
}

seed().finally(() => {
  client.end()
})

```