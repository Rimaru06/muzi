"use client";
import { toast } from 'react-toastify'
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button"
import { Play, Share2 } from "lucide-react"
import Link from 'next/link';
export function Appbar() {
    const session = useSession();
    return (
        <header className="bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-6">
                    <div className="flex justify-start lg:w-0 lg:flex-1">
                        <Link href="#" className="flex items-center">
                            <Play className="h-8 w-8 text-purple-400" />
                            <span className="ml-2 text-xl font-bold text-white">MuziPuzi</span>
                        </Link>
                    </div>
                    <div className='flex gap-6 items-center justify-center'>
                        <div>
                            <Button onClick={handleShare} className="bg-purple-600 hover:bg-purple-700 text-white">
                                <Share2 className="h-4 w-4 mr-2" />
                                Share
                            </Button>
                        </div>
                        <div>
                            {session.data?.user && <Button className="bg-purple-600 text-white hover:bg-purple-700" onClick={() => signOut()}>Logout</Button>}
                            {!session.data?.user && <Button className="bg-purple-600 text-white hover:bg-purple-700" onClick={() => signIn()}>Signin</Button>}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}

const handleShare = async () => {
    const shareData = {
        title: 'Join my StreamVote queue!',
        text: 'Vote for the next song to be played on my stream.',
        url: window.location.href
    }

    if (navigator.share && navigator.canShare(shareData)) {
        try {
            await navigator.share(shareData);
            toast.success('Shared successfully!');
        } catch (err) {
            console.error('Error sharing:', err);
            fallbackShare();
        }
    } else {
        fallbackShare();
    }
}

const fallbackShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
        toast.success('Link copied to clipboard!');
    }, (err) => {
        console.error('Could not copy text: ', err);
        toast.error('Failed to copy link');
    });
}


