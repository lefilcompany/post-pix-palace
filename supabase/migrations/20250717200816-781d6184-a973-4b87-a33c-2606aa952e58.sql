-- Remover políticas existentes e criar novas políticas RLS mais permissivas

-- Brand
DROP POLICY IF EXISTS "Enable all access for Brand" ON public."Brand";
DROP POLICY IF EXISTS "Allow public access to Brand" ON public."Brand";

CREATE POLICY "Enable all access for Brand" ON public."Brand"
FOR ALL
USING (true)
WITH CHECK (true);

-- Content
DROP POLICY IF EXISTS "Enable all access for Content" ON public."Content";

CREATE POLICY "Enable all access for Content" ON public."Content"
FOR ALL
USING (true)
WITH CHECK (true);

-- Persona
DROP POLICY IF EXISTS "Enable all access for Persona" ON public."Persona";

CREATE POLICY "Enable all access for Persona" ON public."Persona"
FOR ALL
USING (true)
WITH CHECK (true);

-- Theme
DROP POLICY IF EXISTS "Enable all access for Theme" ON public."Theme";

CREATE POLICY "Enable all access for Theme" ON public."Theme"
FOR ALL
USING (true)
WITH CHECK (true);

-- User
DROP POLICY IF EXISTS "Enable all access for User" ON public."User";
DROP POLICY IF EXISTS "Allow public access to User" ON public."User";

CREATE POLICY "Enable all access for User" ON public."User"
FOR ALL
USING (true)
WITH CHECK (true);