-- 1. Criar a tabela de RSVPs se ela ainda não existir
CREATE TABLE IF NOT EXISTS public.rsvps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  acompanhantes INTEGER NOT NULL DEFAULT 0,
  presenca TEXT NOT NULL CHECK (presenca IN ('sim','nao')),
  mensagem TEXT,
  telefone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;

-- 2. Remover políticas antigas de SELECT e INSERT para evitar conflitos
DROP POLICY IF EXISTS "Anyone can insert RSVPs" ON public.rsvps;
DROP POLICY IF EXISTS "Anyone can view RSVPs" ON public.rsvps;
DROP POLICY IF EXISTS "Only authenticated users can view RSVPs" ON public.rsvps;

-- 3. Criar política de inserção: qualquer pessoa (anon ou autenticada) pode enviar RSVPs
CREATE POLICY "Anyone can insert RSVPs" 
ON public.rsvps 
FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

-- 4. Criar política de visualização: APENAS usuários logados (como o admin) podem ver as respostas
CREATE POLICY "Only authenticated users can view RSVPs" 
ON public.rsvps 
FOR SELECT 
TO authenticated 
USING (true);

-- 5. Conceder permissões básicas para as roles
GRANT SELECT, INSERT ON public.rsvps TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.rsvps TO authenticated;
GRANT ALL ON public.rsvps TO service_role;
