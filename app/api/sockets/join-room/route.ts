import { NextRequest , NextResponse } from "next/server";
import prisma from "@/app/lib/db";
import {z} from 'zod';


const CreateRoomSchema = z.object({
    roomId : z.string(),
    userId : z.string()
})


export async function POST(req : NextRequest)
{
    try {
        const data = CreateRoomSchema.parse(await req.json())

        const space = await prisma.space.findUnique({
            where : {
                id : data.roomId
            }
        })

        if(!space)
        {
            return NextResponse.json({
                message : "Room not found"
            },{
                status : 404
            })
        }

        await prisma.user.update({
            where : {
                id : data.userId
            },
            data : {
                spaces : {
                    connect : {
                        id : data.roomId
                    }
                }
            }
        })

        return NextResponse.json({
            message : "Room joined",
            space
        },{
            status : 200
        })
    } catch (error) {
        return NextResponse.json({
            message : "Error while joining room",
            error
        },{
            status : 500
        })
    }
}