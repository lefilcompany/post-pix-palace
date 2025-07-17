-- Remover políticas existentes que podem estar causando problemas
DROP POLICY IF EXISTS "Allow public access to Brand" ON public."Brand";
DROP POLICY IF EXISTS "Allow public access to Theme" ON public."Theme";
DROP POLICY IF EXISTS "Allow public access to Persona" ON public."Persona";
DROP POLICY IF EXISTS "Allow public access to Content" ON public."Content";
DROP POLICY IF EXISTS "Allow public access to Planning" ON public."Planning";
DROP POLICY IF EXISTS "Allow public access to Review" ON public."Review";

-- Desabilitar RLS temporariamente para permitir acesso completo
ALTER TABLE public."Brand" DISABLE ROW LEVEL SECURITY;
ALTER TABLE public."Theme" DISABLE ROW LEVEL SECURITY;
ALTER TABLE public."Persona" DISABLE ROW LEVEL SECURITY;
ALTER TABLE public."Content" DISABLE ROW LEVEL SECURITY;
ALTER TABLE public."Planning" DISABLE ROW LEVEL SECURITY;
ALTER TABLE public."Review" DISABLE ROW LEVEL SECURITY;
ALTER TABLE public."User" DISABLE ROW LEVEL SECURITY;
ALTER TABLE public."Team" DISABLE ROW LEVEL SECURITY;

-- Habilitar RLS novamente
ALTER TABLE public."Brand" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Theme" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Persona" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Content" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Planning" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Review" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Team" ENABLE ROW LEVEL SECURITY;

-- Criar políticas permissivas para todas as operações
CREATE POLICY "Enable all access for Brand" ON public."Brand"
    FOR ALL
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Enable all access for Theme" ON public."Theme"
    FOR ALL
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Enable all access for Persona" ON public."Persona"
    FOR ALL
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Enable all access for Content" ON public."Content"
    FOR ALL
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Enable all access for Planning" ON public."Planning"
    FOR ALL
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Enable all access for Review" ON public."Review"
    FOR ALL
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Enable all access for User" ON public."User"
    FOR ALL
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Enable all access for Team" ON public."Team"
    FOR ALL
    USING (true)
    WITH CHECK (true);