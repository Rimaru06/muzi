// import type {
//     GetServerSidePropsContext,
//     NextApiRequest,
//     NextApiResponse,
//   } from "next"
//   import type { NextAuthOptions } from "next-auth"
//   import { getServerSession } from "next-auth"
//   import prisma from "./db"
//   import GoogleProvider from "next-auth/providers/google";
//   export const config = {
//     providers: [
//         GoogleProvider({
//             clientId: process.env.GOOGLE_CLIENT_ID ?? "",
//             clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
//         })
//     ],
//     secret: process.env.NEXTAUTH_SECRET ?? "secret",
//     callbacks: {
//         async signIn(params) {
//             if (!params.user.email) {
//                 return false;
//             }

//             try {
//                 const existingUser = await prisma.user.findUnique({
//                     where: {
//                         email: params.user.email
//                     }
//                 })
//                 if (existingUser) {
//                     return true
//                 }
//                 await prisma.user.create({
//                     data: {
//                         email: params.user.email,
//                         provider: "Google"
//                     } 
//                 })
//                 return true;
//              } catch(e) {
//                 console.log(e);
//                 return false;
//              }
//         },
//         async session({session, token, user}) {
//             const dbUser = await prismaClient.user.findUnique({
//                 where: {
//                     email: session.user.email as string
//                 }
//             })
//             if (!dbUser) {
//                 return session;
//             }
//             return {
//                 ...session, 
//                 user: {
//                     id: dbUser.id
//                 }
//             }
//         }
//     }
//   } satisfies NextAuthOptions
  
//   // Use it in server contexts
//   export function auth(
//     ...args:
//       | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
//       | [NextApiRequest, NextApiResponse]
//       | []
//   ) {
//     return getServerSession(...args, config)
//   }