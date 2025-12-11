-- Remove unnecessary RPC that had INET type issue
DROP FUNCTION IF EXISTS prepare_mobile_session_auth(uuid, text, inet, text);

-- Ensure RLS policy exists for UPDATE on mobile_audio_sessions
DO $$
BEGIN
  -- Check if policy exists, create if not
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'mobile_audio_sessions' 
    AND policyname = 'Users can update own sessions'
  ) THEN
    CREATE POLICY "Users can update own sessions"
      ON mobile_audio_sessions FOR UPDATE
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;