import { getServerSession } from "next-auth/next";

import { authOptions } from "../../../pages/api/auth/[...nextauth]";
import prisma from '../../app/libs/Prismadb'

export async function getSession(){
  return await getServerSession(authOptions)
}

export default async function getCurrentUser(){
  try{
    const session = await getSession()

    if(!session?.user?.email){
      return null;
    }

    const currrentUser = await prisma.user.findUnique({
      where:{email: session.user.email as string}
    })

    if(!currrentUser){
      return null;
    }
console.log('6666666666666666666666666666666', currrentUser)
      return currrentUser;
  }catch(error:any){
    return null
  }
}