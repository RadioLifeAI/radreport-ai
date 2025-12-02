-- RLS Policies para permitir admins gerenciarem system_templates

-- Policy para INSERT por admins
CREATE POLICY "system_templates_admin_insert" ON public.system_templates
FOR INSERT TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Policy para UPDATE por admins
CREATE POLICY "system_templates_admin_update" ON public.system_templates
FOR UPDATE TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Policy para DELETE por admins
CREATE POLICY "system_templates_admin_delete" ON public.system_templates
FOR DELETE TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));