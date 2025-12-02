-- RLS policies for admin management of frases_modelo

-- Allow admins to INSERT frases_modelo
CREATE POLICY "Admin can insert frases_modelo"
ON public.frases_modelo
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to UPDATE frases_modelo
CREATE POLICY "Admin can update frases_modelo"
ON public.frases_modelo
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to DELETE frases_modelo
CREATE POLICY "Admin can delete frases_modelo"
ON public.frases_modelo
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));