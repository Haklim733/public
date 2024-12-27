  import { createClient } from '@supabase/supabase-js'
import { Resource } from 'sst';

  export const supabase = createClient(Resource.SUPABASE_URL.value, Resource.SUPABASE_ANON_KEY.value);