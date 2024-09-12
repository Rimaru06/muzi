import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export function useRedirect()
{
    const router = useRouter();
    const session = useSession();

    useEffect(()=> {
        if(session.status === 'authenticated')
        {
            router.push('/dashboard');
        }
        else
        {
            router.push('/');
        }
    },[session])
}