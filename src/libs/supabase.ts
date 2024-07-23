import type { Database } from "@customTypes/database";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL as string;
const SUPABASE_PUBLIC_ANON_KEY = process.env.SUPABASE_PUBLIC_ANON_KEY as string;
export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLIC_ANON_KEY,
);
