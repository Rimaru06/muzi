"use client"
import { SessionProvider } from "next-auth/react";
import React from "react";
import {WebSocketProvider} from "./WebSocketContext"

export default function Providers({children}:Readonly<{children : React.ReactNode}>)
{
    return <SessionProvider>
        <WebSocketProvider>
        {children}
        </WebSocketProvider>
    </SessionProvider>

}