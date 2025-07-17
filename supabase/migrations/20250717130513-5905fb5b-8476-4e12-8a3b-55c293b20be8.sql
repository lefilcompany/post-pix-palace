-- Enable Row Level Security on all tables
ALTER TABLE public."Brand" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Theme" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Persona" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Content" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Team" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."User" ENABLE ROW LEVEL SECURITY;

-- Create policies for Brand table
CREATE POLICY "Allow public access to Brand" 
ON public."Brand"
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create policies for Theme table
CREATE POLICY "Allow public access to Theme" 
ON public."Theme"
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create policies for Persona table
CREATE POLICY "Allow public access to Persona" 
ON public."Persona"
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create policies for Content table
CREATE POLICY "Allow public access to Content" 
ON public."Content"
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create policies for Team table
CREATE POLICY "Allow public access to Team" 
ON public."Team"
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create policies for User table
CREATE POLICY "Allow public access to User" 
ON public."User"
FOR ALL 
USING (true)
WITH CHECK (true);