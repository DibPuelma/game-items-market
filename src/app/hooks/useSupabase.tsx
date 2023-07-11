import { Database } from "@/lib/database.types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function useSupabase() {
  return createClientComponentClient<Database>()
}