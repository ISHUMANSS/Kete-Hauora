//create the client instance
import {createClient} from '@supabase/supabase-js';

//information found in the ENV if its not there for you let me know

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;