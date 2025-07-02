import type { PostgrestError } from '@supabase/supabase-js';

export function handleSupabaseError(error: PostgrestError | null): string | null {
  if (!error) return null;

  console.error('Supabase error:', error);

  switch (error.code) {
    case '42501': // permission denied
      return "You don't have permission to perform this action.";
    case '23505': // unique constraint
      return "This entry already exists.";
    case '23503': // foreign key violation
      return "Linked record not found.";
    case '23502': // not null violation
      return "Missing required fields.";
    case '22P02': // invalid input
      return "Invalid data provided.";
    default:
        console.error('Unhandled Supabase error:', error);
      return 'Unexpected error occurred.';
  }
}
