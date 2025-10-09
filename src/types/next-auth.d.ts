import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
      roles?: string[]
    }
  }

  interface User {
    roles?: string[]
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    roles?: string[]
  }
}