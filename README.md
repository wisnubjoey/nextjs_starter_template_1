<h1>Ikuti instruksi cara penginstall an</h1>
<h1>Atau kamu bisa generate langsung dengan npx create-bjoey-next-app@latest</h1>
<h1>Dan .env.local</h1>
<h1>npx auth secret <= untuk menambahkan auth secret</h1>
<h1>Jangan lupa migrate drizzle</h1>

<a href="https://nextjs.org">
  <h1 align="center">Onset Next.js Starter 2024</h1>
</a>

<p align="center">
  An open source Next.js starter with step-by-step instructions if required.
</p>

<p align="center">
  <a href="https://twitter.com/nrjdalal_com">
    <img src="https://img.shields.io/twitter/follow/nrjdalal_com?style=flat&label=nrjdalal_com&logo=twitter&color=0bf&logoColor=fff" alt="Follow Neeraj on Twitter" />
  </a>
</p>

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#step-by-step"><strong>Step by Step</strong></a> ·
  <a href="#roadmap"><strong>Roadmap</strong></a> ·
  <a href="#author"><strong>Author</strong></a> ·
  <a href="#credits"><strong>Credits</strong></a>
</p>

Onset is a Next.js starter that comes with step-by-step instructions to understand how everything works, easy for both beginners and experts alike and giving you the confidence to customize it to your needs. Built with Next.js 14, Drizzle (Postgres), NextAuth/Auth.js.

<!-- About: An open source Next.js bare starter with step-by-step instructions if required. Built with Next.js 14, Drizzle (Postgres), NextAuth/Auth.js. -->
<!-- Keywords: drizzle neondb nextauthjs nextjs postgres shadcn tailwindcss typescript vercel -->

## Features

### Frameworks

- [Next.js](https://nextjs.org/) – React framework for building performant apps with the best developer experience
- [Auth.js](https://authjs.dev/) – Handle user authentication with ease with providers like Google, Twitter, GitHub, etc.
- [Drizzle](https://orm.drizzle.team/) – Typescript-first ORM for Node.js

### Platforms

- [Vercel](https://vercel.com/) – Easily preview & deploy changes with git
- [Neon](https://neon.tech/) – The fully managed serverless Postgres with a generous free tier

## Automatic Setup

### Installation

Clone & create this repo locally with the following command:

> Note: You can use `npx` or `pnpx` as well

```bash
bunx create-next-app onset-starter --example "https://github.com/nrjdalal/onset"
```

1. Install dependencies using pnpm:

```sh
bun install
```

2. Copy `.env.example` to `.env.local` and update the variables.

```sh
cp .env.example .env.local
```

3. Run the database migrations:

```sh
bun db:push
```

3. Start the development server:

```sh
bun dev
```

## Step by Step

> Hint: Using `bun` instead of `npm`/`pnpm` and `bunx` instead of `npx`/`pnpx`. You can use the latter if you want.

### Phase 1 (Initialization)

#### 1. Initialize the project

Refs:

- [Installation](https://nextjs.org/docs/getting-started/installation)

```sh
bunx create-next-app . --ts --eslint --tailwind --src-dir --app --import-alias "@/*"
```

#### 2. Install `prettier` and supporting plugins

Refs:

- [prettier-plugin-sort-imports](https://github.com/IanVS/prettier-plugin-sort-imports)
- [prettier](https://prettier.io/)
- [prettier-plugin-tailwindcss](https://github.com/tailwindlabs/prettier-plugin-tailwindcss)

```sh
bun add -D @ianvs/prettier-plugin-sort-imports prettier prettier-plugin-tailwindcss
```

#### 3. Create `prettier.config.js`

```js
/** @type {import('prettier').Config} */
module.exports = {
  semi: false,
  singleQuote: true,
  plugins: [
    '@ianvs/prettier-plugin-sort-imports',
    'prettier-plugin-tailwindcss',
  ],
}
```

#### 4. Create `src/lib/fonts.ts`

Refs:

- [Font Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)

```ts
import {
  JetBrains_Mono as FontMono,
  DM_Sans as FontSans,
} from 'next/font/google'

export const fontMono = FontMono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
})
```

#### 5. Install `clsx`, `tailwind-merge` and `nanoid`

Refs:

- [clsx](https://github.com/lukeed/clsx)
- [tailwind-merge](https://github.com/dcastil/tailwind-merge)

```sh
bun add clsx tailwind-merge nanoid
```

#### 6. Create `src/lib/utils.ts`

```ts
import { clsx, type ClassValue } from 'clsx'
import { customAlphabet } from 'nanoid'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

export function generateId(
  {
    chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
    length = 12,
  }: {
    chars: string
    length: number
  } = {
    chars: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
    length: 12,
  },
) {
  const nanoid = customAlphabet(chars, length)
  return nanoid()
}
```

#### 7. Update `src/app/layout.tsx`

```ts
import './globals.css'
import { fontMono, fontSans } from '@/lib/fonts'
import { cn } from '@/lib/utils'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Onset',
  description: 'The only Next.js starter you need',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          'min-h-dvh font-sans antialiased',
          fontMono.variable,
          fontSans.variable,
        )}
      >
        {children}
      </body>
    </html>
  )
}
```

### Phase 2 (Database)

#### 1. Install `drizzle` and supporting packages

Refs:

- [Drizzle Postgres](https://orm.drizzle.team/docs/quick-postgresql/postgresjs)

```sh
bun add drizzle-orm postgres
bun add -D drizzle-kit
```

#### 2. Create `src/lib/database.ts`

Refs:

- [Drizzle NextAuth Schema](https://authjs.dev/getting-started/adapters/drizzle)

```ts
import {
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from 'drizzle-orm/pg-core'
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

const queryClient = postgres(process.env.POSTGRES_URL as string)
export const db: PostgresJsDatabase = drizzle(queryClient)

export const users = pgTable('user', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  publicId: text('publicId').unique().notNull(),
  name: text('name'),
  email: text('email').notNull(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: text('image'),
})

export const accounts = pgTable(
  'account',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
)

export const sessions = pgTable('session', {
  id: text('id').notNull(),
  sessionToken: text('sessionToken').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
})

export const verificationTokens = pgTable(
  'verificationToken',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
)
```

#### 3. Create `drizzle.config.ts`

```ts
import type { Config } from 'drizzle-kit'

export default {
  schema: './src/lib/database.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.POSTGRES_URL as string,
  },
} satisfies Config
```

#### 4. Copy `.env.local.example` to `.env.local`

> Hint: You can use [`pglaunch`](https://github.com/nrjdalal/pglaunch) to generate a postgres url

```env
POSTGRES_URL="**********"
```

#### 5. Update `package.json`

```json
{
  // ...
  "scripts": {
    // ...
    "db:push": "bun --env-file=.env.local drizzle-kit push",
    "db:studio": "bun --env-file=.env.local drizzle-kit studio"
  }
  // ...
}
```

##### 6. Run `db:push` to create tables

```sh
bun db:push
```

### Phase 3 (Authentication)

#### 1. Install `next-auth`

```sh
bun add next-auth@beta @auth/drizzle-adapter
```

#### 2. Update `.env.local`

```env
# ...
AUTH_SECRET="**********"

AUTH_GITHUB_ID="**********"
AUTH_GITHUB_SECRET="**********"
```

3. Create `src/lib/auth.ts`

```ts
import { db, users } from '@/lib/database'
import { generateId } from '@/lib/utils'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { eq } from 'drizzle-orm'
import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: {
    ...DrizzleAdapter(db),
    async createUser(user) {
      return await db
        .insert(users)
        .values({
          ...user,
          publicId: generateId(),
        })
        .returning()
        .then((res) => res[0])
    },
  },
  providers: [GitHub],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.publicId = token.publicId as string
        session.user.name = token.name as string
        session.user.email = token.email as string
        session.user.image = token.image as string
      }

      return session
    },

    async jwt({ token, user }) {
      const [result] = await db
        .select()
        .from(users)
        .where(eq(users.email, token.email as string))
        .limit(1)

      if (!result) {
        if (user) {
          token.id = user.id
        }

        return token
      }

      return {
        id: result.id,
        publicId: result.publicId,
        name: result.name,
        email: result.email,
        image: result.image,
      }
    },
  },
})

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      publicId: string
      name: string
      email: string
      image: string
    }
  }
}
```

#### 3. Create `src/app/api/auth/[...nextauth]/route.ts`

```ts
import { handlers } from '@/lib/auth'

export const { GET, POST } = handlers
```

#### 4. Create `src/middleware.ts` - not supported yet

```ts
import { getToken } from 'next-auth/jwt'
import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  async function middleware(req) {
    const token = await getToken({ req })

    const isAuth = !!token
    const isAuthPage = req.nextUrl.pathname.startsWith('/access')

    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }

      return null
    }

    if (!isAuth) {
      let from = req.nextUrl.pathname
      if (req.nextUrl.search) {
        from += req.nextUrl.search
      }

      return NextResponse.redirect(
        new URL(`/access?from=${encodeURIComponent(from)}`, req.url),
      )
    }
  },
  {
    callbacks: {
      async authorized() {
        return true
      },
    },
  },
)

export const config = {
  matcher: ['/access', '/dashboard/:path*'],
}
```

#### 5. Create `src/app/(auth)/access/page.tsx`

```tsx
import { auth, signIn } from '@/lib/auth'
import { redirect } from 'next/navigation'

const Page = async () => {
  const session = await auth()
  if (session) return redirect('/dashboard')

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-8">
      <form
        action={async () => {
          'use server'
          await signIn('github')
        }}
      >
        <button className="rounded-md border px-8 py-2.5" type="submit">
          Signin with GitHub
        </button>
      </form>
    </div>
  )
}

export default Page
```

#### 6. Create `src/app/(admin)/dashboard/page.tsx`

```tsx
import { auth, signOut } from '@/lib/auth'
import { redirect } from 'next/navigation'

const Page = async () => {
  const session = await auth()
  if (!session) return redirect('/access')

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-8">
      <div className="text-center">
        {Object.entries(session.user).map(([key, value]) => (
          <p key={key}>
            <span className="font-bold">{key}</span>: {value}
          </p>
        ))}
      </div>

      <form
        action={async () => {
          'use server'
          await signOut()
        }}
      >
        <button className="rounded-md border px-8 py-2" type="submit">
          Sign Out
        </button>
      </form>
    </div>
  )
}

export default Page
```

## Roadmap

- [ ] Light and dark mode
- [ ] To added fine-grained instructions
- [ ] More features and points to be added

## Author

Created by [@nrjdalal](https://twitter.com/nrjdalal_com) in 2023, released under the [MIT license](https://github.com/nrjdalal/onset/blob/main/LICENSE.md).

## Credits

This project is inspired by [@shadcn](https://twitter.com/shadcn)'s [Taxonomy](https://github.com/shadcn-ui/taxonomy).
