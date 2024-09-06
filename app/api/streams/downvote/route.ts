import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import {z} from 'zod';
import prisma from "@/app/lib/db";

const downVoteSchema = z.object({
    streamId : z.string()
})

export async function POST(req : NextRequest)
{
    const session = await getServerSession();
// Todo : can get rid of the db call
    const user  = await prisma.user.findFirst({
        where : {
            email : session?.user?.email ?? ""
        }
    })

    if(!user)
    {
        return NextResponse.json({
            message : "unauthenticated"
        },{
            status : 403
        })
    }

    try {
        const data = downVoteSchema.parse(await req.json());
        await prisma.upvote.delete({
            where : {
                userId_streamId : {
                    userId : user.id,
                    streamId : data.streamId
                }
            }
        })
        NextResponse.json({
            message : "downvoted succesfully"
        })
    } catch (error) {
        return NextResponse.json({
            message : "Error while downvoting"
        },{
            status : 403
        })
        
    }
}