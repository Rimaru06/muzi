import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/db";
import { z } from 'zod';



const CreateRoomSchema = z.object({
    roomId: z.string(),
    id: z.string()
})


export async function POST(req: NextRequest) {

    try {
        const data = CreateRoomSchema.parse(await req.json());
        const space = await prisma.space.findUnique({
            where: {
                id: data.roomId
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
            where: {
                id: data.id
            },
            data: {
                spaces: {
                    disconnect: {
                        id: data.roomId
                    }
                }
            }
        })
        return NextResponse.json({
            message: "Room left",
            space
        }, {
            status: 200
        })
    } catch (error) {
        return NextResponse.json({
            message: "Error while leaving room",
            error
        }, {
            status: 500
        })
        
    }
}
