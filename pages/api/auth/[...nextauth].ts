import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, { AuthOptions } from "next-auth";
import prisma from '../../../src/app/libs/Prismadb'
import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcrypt'

export const authOptions :AuthOptions ={
  adapter: PrismaAdapter(prisma),
  providers:[
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),

    CredentialsProvider({
      name:'credentials',
      credentials: {
        email: {label: 'email', type: 'text'},
        password: {label:'password', type:'password'},
      },

      async authorize(credientals){
        if(!credientals?.email || !credientals?.password){
          throw new Error('Invalid credentials')
        }

        const user = await prisma.user.findUnique({
          where:{email:credientals.email}
        })

        if(!user || !user?.hashedPassword){
          throw new Error('Invalid credentials')
        }

        const isCorrectPassword = await bcrypt.compare(
          credientals.password, user.hashedPassword
        )

        if(!isCorrectPassword){
          throw new Error('Invalid credentials')
        }
        return user;
      }
    })
  ],
  pages:{
    signIn:'/',
  },
  debug: process.env.NODE_ENV =='development',
  session:{
    strategy:"jwt"
  },
  secret:process.env.NEXTAUTH_SECRET,
}
export default NextAuth(authOptions)