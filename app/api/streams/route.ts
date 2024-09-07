import { NextRequest , NextResponse } from "next/server";
import prisma from "@/app/lib/db";
import {z} from 'zod';
import { getServerSession } from "next-auth";

const YT_REGEX = /^(?:(?:https?:)?\/\/)?(?:www\.)?(?:m\.)?(?:youtu(?:be)?\.com\/(?:v\/|embed\/|watch(?:\/|\?v=))|youtu\.be\/)((?:\w|-){11})(?:\S+)?$/;


const CreateStreamSchema = z.object({
    creatorId : z.string(),
    url : z.string()
})


export async function POST(req : NextRequest)
{
    const session = await getServerSession();
    console.log(session)
    try {
        const data = CreateStreamSchema.parse(await req.json())
        
        const isYt = data.url.match(YT_REGEX);

        if(!isYt)
        {
            return NextResponse.json({
                message : "Wrong url format"
            },{
                status : 411
            })   
        }

        const extracterId = data.url.split("?v=")[1];

        await prisma.stream.create({
            data : {
                userId : data.creatorId,
                url : data.url,
                extractedId : extracterId,
                type : "Youtube"
            }
        })
        return NextResponse.json({
            message : "Strema created"
        },{
            status : 200
        })

    } catch (error) {
        console.log(error)
        return NextResponse.json({
            message : "Error while adding a stream"
        },{
            status : 411
        })
    }
}


export async function GET(req : NextRequest)
{
    const createrId = req.nextUrl.searchParams.get("createrId");
    const streams = await prisma.stream.findMany({
        where : {
            userId : createrId ?? ""
        }
    })
    return NextResponse.json({
        streams
    })
}