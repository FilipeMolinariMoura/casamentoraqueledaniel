
CREATE TABLE public.rsvps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  acompanhantes INTEGER NOT NULL DEFAULT 0,
  presenca TEXT NOT NULL CHECK (presenca IN ('sim','nao')),
  mensagem TEXT,
  telefone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.rsvps TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.rsvps TO authenticated;
GRANT ALL ON public.rsvps TO service_role;
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert RSVPs" ON public.rsvps FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Anyone can view RSVPs" ON public.rsvps FOR SELECT TO anon, authenticated USING (true);
