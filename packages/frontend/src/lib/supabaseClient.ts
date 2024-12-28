import { createClient } from '@supabase/supabase-js';

let stage = import.meta.env['PUBLIC_STAGE'];
let supabaseUrl = 'http://localhost:54323';
let supabaseKey =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

if (['dev', 'production'].includes(stage)) {
	supabaseUrl = '';
	supabaseKey = '';
}

export const supabase = createClient(supabaseUrl, supabaseKey);
