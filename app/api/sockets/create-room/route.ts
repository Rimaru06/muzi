import { NextResponse , NextRequest } from "next/server";
import prisma from "@/app/lib/db";
import {z} from 'zod';

const CreateRoomSchema = z.object({
    room : z.string(),
    userId : z.string()
})


export async function POST(req : NextRequest)
{
    
    try {
        const data = CreateRoomSchema.parse(await req.json())
        const space = await prisma.space.create({
            data : {
                name : data.room,
                users : {
                    connect : {
                        id : data.userId
                    }
                }
            }
        })
        return NextResponse.json({
            message : "Room created",
            space
        },{
            status : 200
        })
    } catch (error) {
        return NextResponse.json({
            message : "Error creating room",
            error
        },{
            status : 500
        }) 
    }
}

