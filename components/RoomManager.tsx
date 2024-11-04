'use client'

import { use, useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { AlertCircle, CloudCog } from "lucide-react"
import { useWebSocket } from '@/app/WebSocketContext'
import { useSession } from 'next-auth/react'
import { useRouter } from "next/navigation";
import { Appbar } from './Appbar'

interface ServerResponse {
    message: string;
    space?: any;
    error?: any;
  }

export default function RoomManager() {
  const socket = useWebSocket();
  const session = useSession();
  const router = useRouter();
  const [roomName, setRoomName] = useState('')
  const [joinCode, setJoinCode] = useState('')
  const [error, setError] = useState('')
  const [serverResponse, setServerResponse] = useState<ServerResponse | null>(null)
 

  useEffect(() => {
    if(socket)
    {
        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log("Received data from server: ", data);
            setServerResponse(data);
        }  
    }
  },[socket])
  useEffect(()=> {
    if(serverResponse && serverResponse.message === "Room created")
    {
        router.push('/dashboard');
    }
    else if(serverResponse && serverResponse.message === "Room joined")
        {
            router.push('/dashboard');
        }
    else if (serverResponse?.error)
    {
        setError(serverResponse.error.message);
    }
  }, [serverResponse , router])
  useEffect(() => {
    if (session.status === 'unauthenticated') {
      router.push('/');
    }
  },[session.status, router])
  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault()
    if (roomName.trim() === '') {
      setError('Room name cannot be empty')
      return
    }
    console.log(`Creating room: ${roomName}`)
   socket?.send(JSON.stringify({type : 'CreateRoom' , room : roomName , userId : session.data?.user.id}));
    setRoomName('')
    setError('')
  }

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault()
    if (joinCode.trim() === '') {
      setError('Join code cannot be empty')
      return
    }
    console.log(`Joining room with code: ${joinCode}`)
    socket?.send(JSON.stringify({type : 'JoinRoom' , room : joinCode , userId : session.data?.user.id}));
    setJoinCode('')
    setError('')
  }

  return (
    <div>
    <Appbar />
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-800 shadow-xl border border-purple-500">
        <CardHeader className="border-b border-purple-500">
          <CardTitle className="text-2xl font-bold text-purple-300">Room Manager</CardTitle>
          <CardDescription className="text-gray-400">Create or join a room</CardDescription>
        </CardHeader>
        <CardContent className="mt-6">
          <form onSubmit={handleCreateRoom} className="space-y-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="roomName" className="text-purple-300">Create a Room</Label>
              <Input
                id="roomName"
                type="text"
                placeholder="Enter room name"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white">
              Create Room
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-gray-800 px-2 text-gray-400">Or</span>
            </div>
          </div>

          <form onSubmit={handleJoinRoom} className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label htmlFor="joinCode" className="text-purple-300">Join a Room</Label>
              <Input
                id="joinCode"
                type="text"
                placeholder="Enter join code"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white">
              Join Room
            </Button>
          </form>

          {error && (
            <div className="flex items-center gap-2 mt-4 text-red-400" role="alert">
              <AlertCircle className="h-5 w-5" />
              <p>{error}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
    </div>
  )
}