import { Database } from "@/lib/database.types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState, useEffect } from "react";

export default function useSession() {
  const supabase = createClientComponentClient<Database>()
  const [user, setUser] = useState<null | any>(null);
  const [userLoading, setUserLoading] = useState<boolean>(true);

  useEffect(() => {
    const getSession = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setUserLoading(false)
    }
    getSession()
  }, [supabase])

  return { user, userLoading }
}