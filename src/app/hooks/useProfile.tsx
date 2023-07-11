import { useEffect, useState } from "react";
import useSession from "./useSession";
import useSupabase from "./useSupabase";

export default function useProfile() {
  const { user } = useSession()
  const supabase = useSupabase()
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    const getUserProfile = async () => {
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(profile)
    }
    if (!user) return
    getUserProfile();
  }, [user, supabase])

  return [profile, setProfile]
}