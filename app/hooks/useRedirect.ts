import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";

export function useRedirect() {
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    const checkUserSpace = async () => {
      if (session.status === 'authenticated') {
        try {
          const response = await axios.get(`http://localhost:3000/api/auth/user/space?userId=${session.data.user.id}`);
          if (response.data.hasSpace) {
            router.push('/dashboard');
          } else {
            router.push('/Room');
          }
        } catch (error) {
          console.error('Error checking user space:', error);
          router.push('/Room');
        }
      } else {
        router.push('/');
      }
    };
    checkUserSpace();
  }, [session, router]);
}