import { NextRequest , NextResponse } from "next/server";
import prisma from "@/app/lib/db";
import {z} from 'zod';
import { getServerSession } from "next-auth";
//@ts-ignore
import youtubesearchapi from "youtube-search-api";

  const extractVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : ''
  }

const CreateStreamSchema = z.object({
    creatorId : z.string(),
    url : z.string()
})


export async function POST(req : NextRequest)
{
    const session = await getServerSession();
    try {
        const data = CreateStreamSchema.parse(await req.json())
        
        const extractedId = extractVideoId(data.url);

        if(!extractedId)
        {
            return NextResponse.json({
                message : "Wrong url format"
            },{
                status : 411
            })   
        }
        const res = await youtubesearchapi.GetVideoDetails(extractedId);
        const thumbnails = res.thumbnail.thumbnails;
      
        thumbnails.sort((a : {width: number} , b : {width:number}) => a.width < b.width ? -1 : 1);

       const stream =  await prisma.stream.create({
            data : {
                userId : data.creatorId,
                url : data.url,
                extractedId : extractedId,
                type : "Youtube",
                title : res.title ?? "Can't find video",
                smallImageUrl : (thumbnails.length > 1 ? thumbnails[thumbnails.length - 2].url : thumbnails[thumbnails.length - 1].url) ?? "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.reddit.com%2Fr%2FFortNiteBR%2Fcomments%2Fkj6e4j%2Fhonestly_this_thumbnail_for_newscapepro_is%2F&psig=AOvVaw2GsQ39ImnPP26SXuHitQR6&ust=1725802740664000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCMjvsa36sIgDFQAAAAAdAAAAABAE",
                bigImageUrl : thumbnails[thumbnails.length - 1].url ?? "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.reddit.com%2Fr%2FFortNiteBR%2Fcomments%2Fkj6e4j%2Fhonestly_this_thumbnail_for_newscapepro_is%2F&psig=AOvVaw2GsQ39ImnPP26SXuHitQR6&ust=1725802740664000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCMjvsa36sIgDFQAAAAAdAAAAABAE"

            }
        })
        return NextResponse.json({
            message : "Strema created",
            stream
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
        },
        select : {
            id : true,
            url : true,
            title : true,
            smallImageUrl : true,
            bigImageUrl : true,
            type : true,
            extractedId : true
        }
    })
    return NextResponse.json({
        streams
    })
}

export async function DELETE(req : NextRequest)
{
    const streamId = req.nextUrl.searchParams.get("streamId");
    if(!streamId)
    {
        return NextResponse.json({
            message : "Stream id is required"
        },{
            status : 411
        })
    }
    try {
        await prisma.stream.delete({
            where : {
                id : streamId
            }
        })
        return NextResponse.json({
            message : "Stream deleted"
        })
    } catch (error) {
        return NextResponse.json({
            message : "Error while deleting stream"
        },{
            status : 411
        })
    }
}