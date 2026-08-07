import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
// import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/config";

export const SUPABASE_URL = "https://noetdcgiqbuuhziksxfx.supabase.co";
export const SUPABASE_ANON_KEY = "sb_publishable_BIAWu9N9M8jJ6qoqNRcUWQ_rRuUp5Tx";


export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
