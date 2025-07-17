-- Drop existing tables to recreate with correct schema
DROP TABLE IF EXISTS public."Content" CASCADE;
DROP TABLE IF EXISTS public."Planning" CASCADE;
DROP TABLE IF EXISTS public."Review" CASCADE;
DROP TABLE IF EXISTS public."Persona" CASCADE;
DROP TABLE IF EXISTS public."Theme" CASCADE;
DROP TABLE IF EXISTS public."Brand" CASCADE;
DROP TABLE IF EXISTS public."TeamPlan" CASCADE;
DROP TABLE IF EXISTS public."Team" CASCADE;
DROP TABLE IF EXISTS public."User" CASCADE;
DROP TABLE IF EXISTS public."Plan" CASCADE;
DROP TABLE IF EXISTS public."Payment" CASCADE;
DROP TABLE IF EXISTS public."Invoice" CASCADE;
DROP TABLE IF EXISTS public."Subscription" CASCADE;
DROP TABLE IF EXISTS public."Refund" CASCADE;
DROP TABLE IF EXISTS public."Permission" CASCADE;

-- Create User table
CREATE TABLE public."User" (
  id SERIAL PRIMARY KEY,
  "userName" TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  "cityUser" TEXT NOT NULL,
  "stateUser" TEXT NOT NULL,
  "rolePermission" TEXT DEFAULT 'Usuário sem equipe',
  "roleValue" INTEGER DEFAULT 0,
  "teamId" INTEGER,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE,
  "isDeleted" INTEGER DEFAULT 0,
  "stripeCustomerId" TEXT UNIQUE
);

-- Create Team table
CREATE TABLE public."Team" (
  id SERIAL PRIMARY KEY,
  "nameTeam" TEXT NOT NULL,
  "accessCode" TEXT UNIQUE NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE,
  "isDeleted" INTEGER DEFAULT 0
);

-- Create Plan table
CREATE TABLE public."Plan" (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  "membersLimit" INTEGER NOT NULL,
  "brandsLimit" INTEGER NOT NULL,
  "themesLimit" INTEGER NOT NULL,
  "personasLimit" INTEGER NOT NULL,
  "contentLimit" INTEGER NOT NULL,
  "planningLimit" INTEGER NOT NULL,
  "reviewLimit" INTEGER NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE,
  "isDeleted" INTEGER DEFAULT 0
);

-- Create Brand table
CREATE TABLE public."Brand" (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  "teamId" INTEGER NOT NULL,
  "userId" INTEGER NOT NULL,
  "valueProposition" TEXT NOT NULL,
  "brandPillars" TEXT NOT NULL,
  "brandMission" TEXT NOT NULL,
  "brandInspiration" TEXT NOT NULL,
  "currentObjective" TEXT NOT NULL,
  "numericTarget" TEXT NOT NULL,
  restrictions TEXT NOT NULL,
  "brandHashtags" TEXT NOT NULL,
  "referenceContents" TEXT NOT NULL,
  "importantDates" TEXT NOT NULL,
  "relevantContent" TEXT NOT NULL,
  "brandCrisis" TEXT NOT NULL,
  "influencersAction" INTEGER NOT NULL,
  "brandManual" INTEGER NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE,
  "isDeleted" INTEGER DEFAULT 0
);

-- Create Theme table
CREATE TABLE public."Theme" (
  id SERIAL PRIMARY KEY,
  "brandId" INTEGER NOT NULL,
  "teamId" INTEGER NOT NULL,
  title TEXT NOT NULL,
  description VARCHAR(512) NOT NULL,
  colors TEXT NOT NULL,
  "voiceAI" TEXT NOT NULL,
  "universeTarget" TEXT NOT NULL,
  hashtags TEXT NOT NULL,
  objectives VARCHAR(512) NOT NULL,
  "addInfo" TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE,
  "isDeleted" INTEGER DEFAULT 0
);

-- Create Persona table
CREATE TABLE public."Persona" (
  id SERIAL PRIMARY KEY,
  "brandId" INTEGER NOT NULL,
  "teamId" INTEGER NOT NULL,
  name TEXT NOT NULL,
  gender TEXT NOT NULL,
  age TEXT NOT NULL,
  location TEXT NOT NULL,
  "positionDegree" TEXT NOT NULL,
  beliefs TEXT NOT NULL,
  "contentHabit" TEXT NOT NULL,
  "mainObjective" TEXT NOT NULL,
  challenge TEXT NOT NULL,
  "favoriteVoice" TEXT NOT NULL,
  "buyJourney" TEXT NOT NULL,
  "interestTrigger" TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE,
  "isDeleted" INTEGER DEFAULT 0
);

-- Create Content table
CREATE TABLE public."Content" (
  id SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL,
  "teamId" INTEGER NOT NULL,
  "brandId" INTEGER NOT NULL,
  "themeId" INTEGER NOT NULL,
  "personaId" INTEGER,
  "microResult" TEXT NOT NULL,
  "mainMessage" TEXT NOT NULL,
  feeling VARCHAR(512) NOT NULL,
  format VARCHAR(512) NOT NULL,
  "nextStep" TEXT NOT NULL,
  "isPromote" INTEGER NOT NULL,
  "visualReference" INTEGER NOT NULL,
  "responseAI" TEXT NOT NULL,
  "imageUrl" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE,
  "isDeleted" INTEGER DEFAULT 0
);

-- Create Planning table
CREATE TABLE public."Planning" (
  id SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL,
  "brandId" INTEGER NOT NULL,
  "themeId" INTEGER NOT NULL,
  "teamId" INTEGER NOT NULL,
  platform VARCHAR(255) NOT NULL,
  "postsNumber" INTEGER NOT NULL,
  "addInfo" TEXT NOT NULL,
  "responseAI" TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE,
  "isDeleted" INTEGER DEFAULT 0
);

-- Create Review table
CREATE TABLE public."Review" (
  id SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL,
  "brandId" INTEGER NOT NULL,
  "teamId" INTEGER NOT NULL,
  "iaText" TEXT NOT NULL,
  "responseAI" TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE,
  "isDeleted" INTEGER DEFAULT 0
);

-- Create TeamPlan table
CREATE TABLE public."TeamPlan" (
  id SERIAL PRIMARY KEY,
  "teamId" INTEGER UNIQUE NOT NULL,
  "planId" INTEGER UNIQUE NOT NULL,
  "endDate" TIMESTAMP WITH TIME ZONE NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE,
  "isDeleted" INTEGER DEFAULT 0
);

-- Create Payment table
CREATE TABLE public."Payment" (
  id SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "paidAt" TIMESTAMP WITH TIME ZONE,
  refunded INTEGER DEFAULT 0,
  "stripePaymentIntent" TEXT NOT NULL,
  "stripeChargeId" TEXT,
  currency TEXT NOT NULL,
  status TEXT NOT NULL,
  "paymentMethod" TEXT,
  description TEXT,
  "receiptUrl" TEXT
);

-- Create Invoice table
CREATE TABLE public."Invoice" (
  id SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL,
  "paymentId" INTEGER,
  "amountDue" DECIMAL(10, 2) NOT NULL,
  "amountPaid" DECIMAL(10, 2) NOT NULL,
  "dueDate" TIMESTAMP WITH TIME ZONE,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "stripeInvoiceId" TEXT NOT NULL,
  status TEXT NOT NULL
);

-- Create Subscription table
CREATE TABLE public."Subscription" (
  id SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL,
  "startedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  "currentPeriodEnd" TIMESTAMP WITH TIME ZONE NOT NULL,
  "canceledAt" TIMESTAMP WITH TIME ZONE,
  "stripeSubscriptionId" TEXT NOT NULL,
  "planName" TEXT NOT NULL,
  status TEXT NOT NULL
);

-- Create Refund table
CREATE TABLE public."Refund" (
  id SERIAL PRIMARY KEY,
  "paymentId" INTEGER NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  "refundedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "stripeRefundId" TEXT NOT NULL,
  reason TEXT
);

-- Create Solicitation table
CREATE TABLE public."Solicitation" (
  id SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL,
  "teamId" INTEGER NOT NULL,
  status TEXT DEFAULT 'pending',
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE,
  "isDeleted" INTEGER DEFAULT 0
);

-- Add foreign key constraints
ALTER TABLE public."User" ADD CONSTRAINT "User_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES public."Team"(id);
ALTER TABLE public."Brand" ADD CONSTRAINT "Brand_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES public."Team"(id);
ALTER TABLE public."Brand" ADD CONSTRAINT "Brand_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id);
ALTER TABLE public."Theme" ADD CONSTRAINT "Theme_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES public."Brand"(id);
ALTER TABLE public."Theme" ADD CONSTRAINT "Theme_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES public."Team"(id);
ALTER TABLE public."Persona" ADD CONSTRAINT "Persona_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES public."Brand"(id);
ALTER TABLE public."Persona" ADD CONSTRAINT "Persona_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES public."Team"(id);
ALTER TABLE public."Content" ADD CONSTRAINT "Content_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id);
ALTER TABLE public."Content" ADD CONSTRAINT "Content_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES public."Team"(id);
ALTER TABLE public."Content" ADD CONSTRAINT "Content_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES public."Brand"(id);
ALTER TABLE public."Content" ADD CONSTRAINT "Content_themeId_fkey" FOREIGN KEY ("themeId") REFERENCES public."Theme"(id);
ALTER TABLE public."Content" ADD CONSTRAINT "Content_personaId_fkey" FOREIGN KEY ("personaId") REFERENCES public."Persona"(id);
ALTER TABLE public."Planning" ADD CONSTRAINT "Planning_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id);
ALTER TABLE public."Planning" ADD CONSTRAINT "Planning_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES public."Team"(id);
ALTER TABLE public."Planning" ADD CONSTRAINT "Planning_themeId_fkey" FOREIGN KEY ("themeId") REFERENCES public."Theme"(id);
ALTER TABLE public."Planning" ADD CONSTRAINT "Planning_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES public."Team"(id);
ALTER TABLE public."Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id);
ALTER TABLE public."Review" ADD CONSTRAINT "Review_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES public."Brand"(id);
ALTER TABLE public."Review" ADD CONSTRAINT "Review_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES public."Team"(id);
ALTER TABLE public."TeamPlan" ADD CONSTRAINT "TeamPlan_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES public."Team"(id);
ALTER TABLE public."TeamPlan" ADD CONSTRAINT "TeamPlan_planId_fkey" FOREIGN KEY ("planId") REFERENCES public."Plan"(id);
ALTER TABLE public."Solicitation" ADD CONSTRAINT "Solicitation_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id);
ALTER TABLE public."Solicitation" ADD CONSTRAINT "Solicitation_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES public."Team"(id);

-- Enable RLS on all tables
ALTER TABLE public."User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Team" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Plan" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Brand" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Theme" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Persona" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Content" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Planning" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Review" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."TeamPlan" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Payment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Invoice" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Subscription" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Refund" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Solicitation" ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public access (temporary - you should implement proper user-based policies later)
CREATE POLICY "Allow public access to User" ON public."User" FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access to Team" ON public."Team" FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access to Plan" ON public."Plan" FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access to Brand" ON public."Brand" FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access to Theme" ON public."Theme" FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access to Persona" ON public."Persona" FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access to Content" ON public."Content" FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access to Planning" ON public."Planning" FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access to Review" ON public."Review" FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access to TeamPlan" ON public."TeamPlan" FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access to Payment" ON public."Payment" FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access to Invoice" ON public."Invoice" FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access to Subscription" ON public."Subscription" FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access to Refund" ON public."Refund" FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access to Solicitation" ON public."Solicitation" FOR ALL USING (true) WITH CHECK (true);

-- Insert sample data for development
INSERT INTO public."User" ("userName", email, password, "cityUser", "stateUser") VALUES 
('Usuário Teste', 'teste@teste.com', 'senha123', 'São Paulo', 'SP');

INSERT INTO public."Team" ("nameTeam", "accessCode") VALUES 
('Equipe Teste', 'TESTE123');

-- Update user with team
UPDATE public."User" SET "teamId" = 1 WHERE id = 1;