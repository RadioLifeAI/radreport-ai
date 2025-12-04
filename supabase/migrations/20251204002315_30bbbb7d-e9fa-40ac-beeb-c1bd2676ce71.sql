-- Create user_dictionary table for personal word lists
CREATE TABLE public.user_dictionary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  word TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  
  -- Prevent duplicates per user
  UNIQUE(user_id, word)
);

-- Enable RLS
ALTER TABLE public.user_dictionary ENABLE ROW LEVEL SECURITY;

-- Policy: users can only manage their own words
CREATE POLICY "Users can view own dictionary words" 
ON public.user_dictionary 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can add own dictionary words" 
ON public.user_dictionary 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own dictionary words" 
ON public.user_dictionary 
FOR DELETE 
USING (auth.uid() = user_id);

-- Index for fast lookups
CREATE INDEX idx_user_dictionary_user_id ON public.user_dictionary(user_id);
CREATE INDEX idx_user_dictionary_word ON public.user_dictionary(word);