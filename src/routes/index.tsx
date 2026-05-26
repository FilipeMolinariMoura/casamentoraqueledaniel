import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast, Toaster } from "sonner";
import { MapPin, Clock, Calendar, Heart, UtensilsCrossed } from "lucide-react";
import { Music, Volume2, VolumeX } from "lucide-react";
import couple1 from "@/assets/couple-1.jpeg";
import couple2 from "@/assets/couple-2.jpeg";
import couple3 from "@/assets/couple-3.jpeg";
import g1 from "@/assets/gallery-1.jpeg";
import g2 from "@/assets/gallery-2.jpeg";
import g3 from "@/assets/gallery-3.jpeg";
import g4 from "@/assets/gallery-4.jpeg";
import g5 from "@/assets/gallery-5.jpeg";
import g6 from "@/assets/gallery-6.jpeg";
import g7 from "@/assets/gallery-7.jpeg";
import g8 from "@/assets/gallery-8.jpeg";
import g9 from "@/assets/gallery-9.jpeg";

export const Route = createFileRoute("/")({
  component: Index,
});

const WEDDING_DATE = new Date("2026-06-20T11:30:00-03:00");
const RSVP_DEADLINE = new Date("2026-06-01T23:59:59-03:00");

function useCountdown(target: Date) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = now ? Math.max(0, target.getTime() - now.getTime()) : 0;
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff / 3600000) % 24);
  const minutes = Math.floor((diff / 60000) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
}

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster richColors position="top-center" />
      <Nav />
      <Hero />
      <Story />
      <Details />
      <Menu />
      <RSVP />
      <Footer />
      <MusicPlayer />
    </div>
  );
}

function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/70 border-b border-border/40">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#top" className="font-serif text-xl tracking-wide">R &amp; D</a>
        <div className="hidden md:flex gap-8 text-sm">
          <a href="#nossa-historia" className="hover:text-accent transition">Nossa História</a>
          <a href="#detalhes" className="hover:text-accent transition">Detalhes</a>
          <a href="#cardapio" className="hover:text-accent transition">Cardápio</a>
          <a href="#rsvp" className="hover:text-accent transition">Confirmar Presença</a>
        </div>
        <a href="#rsvp" className="md:hidden text-sm px-4 py-2 rounded-full bg-primary text-primary-foreground">RSVP</a>
      </div>
    </nav>
  );
}

function Hero() {
  const { days, hours, minutes, seconds } = useCountdown(WEDDING_DATE);
  return (
    <header id="top" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0">
        <img src={couple2} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-background" />
      </div>
      <div className="relative z-10 text-center px-6 text-white max-w-3xl">
        <p className="uppercase tracking-[0.4em] text-sm mb-6 opacity-90">Vamos nos casar</p>
          <h1 className="font-serif text-6xl md:text-8xl leading-none mb-6">
          Raquel<br />
          <span className="italic font-light text-4xl md:text-5xl">&amp;</span><br />
          Daniel
        </h1>
        <div className="flex items-center justify-center gap-4 text-sm uppercase tracking-widest mb-10">
          <span>20 de Junho</span>
          <span className="opacity-60">•</span>
          <span>Catanduva</span>
        </div>
        <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
          {[
            { v: days, l: "Dias" },
            { v: hours, l: "Horas" },
            { v: minutes, l: "Min" },
            { v: seconds, l: "Seg" },
          ].map((b) => (
            <div key={b.l} className="backdrop-blur-md bg-white/10 border border-white/20 rounded-lg py-3">
              <div className="font-serif text-3xl md:text-4xl">{String(b.v).padStart(2, "0")}</div>
              <div className="text-[10px] uppercase tracking-wider opacity-80">{b.l}</div>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}

function Story() {
  return (
    <section id="nossa-historia" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="uppercase tracking-[0.3em] text-xs text-accent mb-3">Nossa História</p>
          <h2 className="font-serif text-5xl md:text-6xl">Da escola pra vida</h2>
          <p className="mt-6 text-muted-foreground max-w-2xl mx-auto leading-relaxed whitespace-pre-line">
            Quem diria que dois adolescentes se conhecendo no último ano da escola chegariam até aqui, hein?{"\n"}
            Entre sonhos, desafios, viagens, trabalho lado a lado e tantos momentos inesquecíveis, fomos construindo a nossa história dia após dia, sempre com Deus guiando os nossos passos. Depois de 4 anos juntos, seguimos escolhendo um ao outro e agora, com o coração cheio de amor, estamos prontos para começar o nosso “para sempre”. 💍🤍
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 md:row-span-2">
            <img src={couple1} alt="Nós" className="w-full h-full object-cover rounded-2xl aspect-[4/5]" />
          </div>
          <div>
            <img src={couple3} alt="Paris" className="w-full h-full object-cover rounded-2xl aspect-square" />
          </div>
          <div>
            <img src={couple2} alt="Natal" className="w-full h-full object-cover rounded-2xl aspect-square" />
          </div>
        </div>
        <Marquee />
      </div>
    </section>
  );
}

function Marquee() {
  const imgs = [g1, g2, g3, g4, g5, g6, g7, g8, g9];
  const loop = [...imgs, ...imgs];
  return (
    <div className="mt-10 relative overflow-hidden marquee-mask">
      <div className="flex gap-4 marquee-track w-max">
        {loop.map((src, i) => (
          <div key={i} className="shrink-0 w-56 md:w-72 aspect-[3/4] rounded-2xl overflow-hidden shadow-sm">
            <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
          </div>
        ))}
      </div>
      <style>{`
        .marquee-track{animation:marquee 50s linear infinite}
        .marquee-track:hover{animation-play-state:paused}
        @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        .marquee-mask{mask-image:linear-gradient(to right,transparent,#000 8%,#000 92%,transparent);-webkit-mask-image:linear-gradient(to right,transparent,#000 8%,#000 92%,transparent)}
      `}</style>
    </div>
  );
}

function Details() {
  return (
    <section id="detalhes" className="py-24 px-6 bg-secondary/40">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="uppercase tracking-[0.3em] text-xs text-accent mb-3">Save the Date</p>
          <h2 className="font-serif text-5xl md:text-6xl">Detalhes do Grande Dia</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <Card icon={<Calendar className="w-6 h-6" />} title="Data" lines={["20 de Junho", "Sábado"]} />
          <Card icon={<Clock className="w-6 h-6" />} title="Horário" lines={["11h30", "Pontualmente"]} />
          <Card icon={<MapPin className="w-6 h-6" />} title="Local" lines={["Yellow Door Pub", "Catanduva — SP"]} />
        </div>
        <div className="mt-8 rounded-2xl overflow-hidden border border-border shadow-sm">
          <iframe
            title="Mapa Yellow Door Pub Catanduva"
            src="https://www.google.com/maps?q=Yellow+Door+Pub+Catanduva&output=embed"
            className="w-full h-80 border-0"
            loading="lazy"
          />
        </div>
        <div className="text-center mt-6">
          <a
            href="https://www.google.com/maps/search/?api=1&query=Yellow+Door+Pub+Catanduva"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm text-primary hover:text-accent"
          >
            <MapPin className="w-4 h-4" /> Como chegar
          </a>
        </div>
      </div>
    </section>
  );
}

function Card({ icon, title, lines }: { icon: React.ReactNode; title: string; lines: string[] }) {
  return (
    <div className="bg-card rounded-2xl p-8 text-center border border-border shadow-sm">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/20 text-accent-foreground mb-4">
        {icon}
      </div>
      <h3 className="font-serif text-2xl mb-2">{title}</h3>
      {lines.map((l) => (
        <p key={l} className="text-muted-foreground">{l}</p>
      ))}
    </div>
  );
}

function Menu() {
  const pages = Array.from({ length: 19 }, (_, i) => `/menu/menupage-${String(i + 1).padStart(2, "0")}.jpg`);
  const [open, setOpen] = useState<string | null>(null);
  return (
    <section id="cardapio" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="uppercase tracking-[0.3em] text-xs text-accent mb-3 flex items-center justify-center gap-2">
            <UtensilsCrossed className="w-4 h-4" /> Yellow Door
          </p>
          <h2 className="font-serif text-5xl md:text-6xl">Cardápio</h2>
          <p className="mt-4 text-muted-foreground">Dê uma olhada no que o Yellow Door tem a oferecer.</p>
          <a
            href="/cardapio-yellow-door.pdf"
            target="_blank"
            rel="noreferrer"
            className="inline-block mt-6 px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-sm hover:opacity-90 transition"
          >
            Abrir cardápio em PDF
          </a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {pages.map((src) => (
            <button
              key={src}
              onClick={() => setOpen(src)}
              className="group rounded-lg overflow-hidden border border-border bg-card hover:shadow-lg transition"
            >
              <img src={src} alt="Página do cardápio" className="w-full h-full object-cover aspect-[2/3] group-hover:scale-105 transition duration-500" loading="lazy" />
            </button>
          ))}
        </div>
        {open && (
          <div
            className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 cursor-zoom-out"
            onClick={() => setOpen(null)}
          >
            <img src={open} alt="Cardápio" className="max-h-full max-w-full rounded-lg shadow-2xl" />
          </div>
        )}
      </div>
    </section>
  );
}

function RSVP() {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const past = new Date() > RSVP_DEADLINE;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (past) return;
    const fd = new FormData(e.currentTarget);
    const payload = {
      nome: String(fd.get("nome") || "").trim(),
      presenca: String(fd.get("presenca") || "sim"),
      acompanhantes: Number(fd.get("acompanhantes") || 0),
      telefone: String(fd.get("telefone") || "").trim() || null,
      mensagem: String(fd.get("mensagem") || "").trim() || null,
    };
    if (!payload.nome) {
      toast.error("Por favor, informe seu nome.");
      return;
    }
    if (payload.nome.length > 120) {
      toast.error("Nome muito longo.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("rsvps").insert(payload);
    setLoading(false);
    if (error) {
      toast.error("Não foi possível enviar. Tente novamente.");
      return;
    }
    setDone(true);
    toast.success("Presença confirmada! Obrigado 💛");
  }

  return (
    <section id="rsvp" className="py-24 px-6 bg-secondary/40">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <p className="uppercase tracking-[0.3em] text-xs text-accent mb-3 flex items-center justify-center gap-2">
            <Heart className="w-4 h-4" /> RSVP
          </p>
          <h2 className="font-serif text-5xl md:text-6xl">Confirme sua presença</h2>
          <p className="mt-4 text-muted-foreground">
            Por favor, confirme até <strong>01 de junho</strong>. Sua resposta nos ajuda na organização.
          </p>
        </div>

        {done ? (
          <div className="bg-card border border-border rounded-2xl p-10 text-center shadow-sm">
            <Heart className="w-10 h-10 mx-auto text-accent mb-4" />
            <h3 className="font-serif text-3xl mb-2">Recebemos sua resposta!</h3>
            <p className="text-muted-foreground">Mal podemos esperar para celebrar com você.</p>
          </div>
        ) : past ? (
          <div className="bg-card border border-border rounded-2xl p-10 text-center shadow-sm">
            <h3 className="font-serif text-2xl mb-2">Confirmações encerradas</h3>
            <p className="text-muted-foreground">O prazo para confirmar terminou em 01/06. Fale conosco diretamente.</p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="bg-card border border-border rounded-2xl p-8 shadow-sm space-y-5">
            <Field label="Nome completo *">
              <input name="nome" required maxLength={120} className="input" placeholder="Seu nome" />
            </Field>
            <Field label="Telefone (opcional)">
              <input name="telefone" maxLength={30} className="input" placeholder="(00) 00000-0000" />
            </Field>
            <Field label="Você poderá comparecer? *">
              <div className="grid grid-cols-2 gap-3">
                <label className="radio">
                  <input type="radio" name="presenca" value="sim" defaultChecked className="sr-only peer" />
                  <span className="radio-box">Sim, eu vou! 💛</span>
                </label>
                <label className="radio">
                  <input type="radio" name="presenca" value="nao" className="sr-only peer" />
                  <span className="radio-box">Infelizmente não</span>
                </label>
              </div>
            </Field>
            <Field label="Acompanhantes (além de você)">
              <input type="number" name="acompanhantes" min={0} max={10} defaultValue={0} className="input" />
            </Field>
            <Field label="Mensagem (opcional)">
              <textarea name="mensagem" maxLength={500} rows={3} className="input" placeholder="Deixe um recadinho carinhoso" />
            </Field>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 transition disabled:opacity-60"
            >
              {loading ? "Enviando..." : "Confirmar Presença"}
            </button>
          </form>
        )}
      </div>
      <style>{`
        .input{width:100%;padding:.75rem 1rem;border-radius:.75rem;border:1px solid var(--border);background:var(--background);color:var(--foreground);outline:none;transition:border .2s}
        .input:focus{border-color:var(--ring)}
        .radio-box{display:flex;align-items:center;justify-content:center;padding:.85rem;border:1px solid var(--border);border-radius:.75rem;cursor:pointer;transition:all .2s;background:var(--background)}
        .radio input:checked + .radio-box, .peer:checked ~ .radio-box{border-color:var(--accent);background:color-mix(in oklab, var(--accent) 15%, transparent);font-weight:500}
      `}</style>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium mb-2">{label}</span>
      {children}
    </label>
  );
}

function Footer() {
  return (
    <footer className="py-12 text-center text-sm text-muted-foreground border-t border-border">
      <p className="font-serif text-2xl text-foreground mb-2">Raquel &amp; Daniel</p>
      <p>20 de Junho • Yellow Door Pub • Catanduva</p>
      <p className="mt-4 opacity-70">Feito com 💛</p>
    </footer>
  );
}

function MusicPlayer() {
  const [playing, setPlaying] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  const videoId = "M-AMu_iAcf8";
  const src = playing
    ? `https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&playsinline=1`
    : "";
  return (
    <>
      <div className="fixed bottom-5 right-5 z-50">
        <button
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? "Pausar música" : "Tocar música"}
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-primary text-primary-foreground shadow-lg hover:opacity-90 transition"
        >
          {playing ? <Volume2 className="w-4 h-4 animate-pulse" /> : <Music className="w-4 h-4" />}
          <span className="text-xs font-medium hidden sm:inline">
            {playing ? "Tocando" : "Tocar música"}
          </span>
          {playing && <VolumeX className="w-3 h-3 opacity-70" />}
        </button>
      </div>
      {playing && (
        <iframe
          src={src}
          allow="autoplay"
          title="Música de fundo"
          className="fixed -bottom-10 -right-10 w-1 h-1 opacity-0 pointer-events-none"
        />
      )}
    </>
  );
}
