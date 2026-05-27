import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { TicketCard, downloadTicket, type TicketData } from "@/components/TicketCard";
import { supabase } from "@/integrations/supabase/client";
import { toast, Toaster } from "sonner";
import { MapPin, Clock, Calendar, Heart, UtensilsCrossed, Sparkles, Shirt, XCircle } from "lucide-react";
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
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const hasResponded = localStorage.getItem("rsvp_responded");
    const hasDismissed = sessionStorage.getItem("rsvp_modal_dismissed");
    if (!hasResponded && !hasDismissed) {
      setShowModal(true); // Abre imediatamente ao entrar no site
    }
  }, []);

  const handleClose = () => {
    setShowModal(false);
    sessionStorage.setItem("rsvp_modal_dismissed", "true");
  };

  const handleSuccess = () => {
    localStorage.setItem("rsvp_responded", "true");
    // Don't auto-close: user needs to see/download their ticket
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster richColors position="top-center" />
      <Nav />
      <Hero />
      <Story />
      <Details />
      <Celebration />
      <Menu />
      <RSVP onSuccess={() => localStorage.setItem("rsvp_responded", "true")} />
      <Footer />

      {/* Botão Flutuante de RSVP */}
      <div className="fixed bottom-5 left-5 z-40">
        <button
          onClick={() => setShowModal(true)}
          aria-label="Confirmar Presença"
          className="flex items-center gap-2 px-5 py-3 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl hover:opacity-95 transition-all duration-300 cursor-pointer border border-accent/20"
        >
          <Sparkles className="w-4 h-4 text-accent animate-pulse" />
          <span className="text-xs font-medium hidden sm:inline tracking-wide">Confirmar Presença</span>
        </button>
      </div>
      <MusicPlayer />

      {/* Popup / Modal de RSVP */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-lg p-6 md:p-8 rounded-2xl border border-border shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground text-2xl p-1 cursor-pointer"
              aria-label="Fechar"
            >
              &times;
            </button>
            <div className="text-center mb-6">
              <p className="uppercase tracking-[0.3em] text-xs text-accent mb-2 flex items-center justify-center gap-2 font-medium">
                <Sparkles className="w-4 h-4 text-accent" /> RSVP
              </p>
              <h3 className="font-serif text-3.5xl tracking-wide text-foreground">Confirme sua presença</h3>
              <p className="text-xs text-muted-foreground mt-2">
                Por favor, confirme até <strong>01 de junho</strong>.
              </p>
            </div>
            <RSVPForm onSuccess={handleSuccess} />
          </div>
        </div>
      )}
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
          <a href="#celebracao" className="hover:text-accent transition">Celebração</a>
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
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card icon={<Calendar className="w-6 h-6" />} title="Data" lines={["20 de Junho", "Sábado"]} />
          <Card icon={<Clock className="w-6 h-6" />} title="Horário" lines={["11h30", "Pontualmente"]} />
          <Card icon={<MapPin className="w-6 h-6" />} title="Local" lines={["Yellow Door Pub", "Catanduva - SP"]} />
          <Card icon={<Shirt className="w-6 h-6" />} title="Traje" lines={["Social leve / esporte fino 🤍", "Pense em um look bonito e confortável para curtir esse dia especial com a gente."]} />
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

function Celebration() {
  return (
    <section id="celebracao" className="py-24 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/20 text-accent-foreground mb-6">
          <Sparkles className="w-6 h-6" />
        </div>
        <p className="uppercase tracking-[0.3em] text-xs text-accent mb-3">Comemoração</p>
        <h2 className="font-serif text-5xl md:text-6xl mb-6">Um dia especial</h2>
        <p className="text-muted-foreground leading-relaxed mb-6">
          Esta celebração é a nossa forma de compartilhar a alegria do nosso casamento com quem amamos.
          Será um momento de confraternização após o casamento civil, com amor e muita festa no Yellow Door Pub!
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Atenção: cada convidado fica responsável pelo seu próprio consumo no local.
          Assim, cada um escolhe o que deseja e curte o dia do seu jeito.
        </p>
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

function RSVP({ onSuccess }: { onSuccess?: () => void }) {
  const past = new Date() > RSVP_DEADLINE;

  return (
    <section id="rsvp" className="py-24 px-6 bg-secondary/40">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <p className="uppercase tracking-[0.3em] text-xs text-accent mb-3 flex items-center justify-center gap-2 font-medium">
            <Sparkles className="w-4 h-4 text-accent" /> RSVP
          </p>
          <h2 className="font-serif text-5xl md:text-6xl tracking-wide">Confirme sua presença</h2>
          <p className="mt-4 text-muted-foreground">
            Por favor, confirme até <strong>01 de junho</strong>. Sua resposta nos ajuda na organização.
          </p>
        </div>

        {past ? (
          <div className="bg-card border border-border rounded-2xl p-10 text-center shadow-sm">
            <h3 className="font-serif text-2xl mb-2">Confirmações encerradas</h3>
            <p className="text-muted-foreground">O prazo para confirmar terminou em 01/06. Fale conosco diretamente.</p>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
            <RSVPForm onSuccess={onSuccess} />
          </div>
        )}
      </div>
    </section>
  );
}

function RSVPForm({ onSuccess }: { onSuccess?: () => void }) {
  const [loading, setLoading] = useState(false);
  const [ticketData, setTicketData] = useState<TicketData | null>(null);
  const [presenca, setPresenca] = useState<"sim" | "nao">("sim");
  const [numAcompanhantes, setNumAcompanhantes] = useState(0);
  const [nomesAcompanhantesList, setNomesAcompanhantesList] = useState<string[]>([]);
  const ticketRef = useRef<HTMLDivElement>(null);
  const past = new Date() > RSVP_DEADLINE;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (past) return;
    const fd = new FormData(e.currentTarget);

    const companionNames = nomesAcompanhantesList
      .slice(0, numAcompanhantes)
      .map(name => name.trim())
      .filter(name => name !== "")
      .join(", ");

    const payload = {
      nome: String(fd.get("nome") || "").trim(),
      presenca: presenca,
      acompanhantes: presenca === "sim" ? numAcompanhantes : 0,
      nomes_acompanhantes: presenca === "sim" && numAcompanhantes > 0 ? companionNames || null : null,
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
    if (presenca === "sim" && numAcompanhantes > 0) {
      const filledCompanionsCount = nomesAcompanhantesList
        .slice(0, numAcompanhantes)
        .filter(name => name.trim() !== "").length;
      if (filledCompanionsCount < numAcompanhantes) {
        toast.error("Por favor, preencha o nome de todos os acompanhantes.");
        return;
      }
    }

    setLoading(true);
    const { error } = await supabase.from("rsvps").insert(payload);
    setLoading(false);
    if (error) {
      toast.error("Não foi possível enviar. Tente novamente.");
      return;
    }
    setTicketData({
      nome: payload.nome,
      acompanhantes: payload.acompanhantes,
      nomes_acompanhantes: payload.nomes_acompanhantes,
    });
    toast.success("Presença confirmada! Baixe seu ingresso abaixo ✨");
    if (onSuccess) onSuccess();
  }

  if (ticketData) {
    return (
      <div className="text-center space-y-6 animate-fade-in">
        <div>
          <Sparkles className="w-10 h-10 mx-auto text-accent mb-3" />
          <h4 className="font-serif text-3xl text-foreground mb-1">Presença confirmada!</h4>
          <p className="text-muted-foreground text-sm">
            Seu ingresso está pronto para baixar. 🤍
          </p>
        </div>

        {/* Ticket Preview - hidden off-screen for image capture */}
        <div className="flex justify-center">
          <div
            ref={ticketRef}
            style={{ display: "inline-block" }}
          >
            <TicketCard data={ticketData} />
          </div>
        </div>

        <button
          onClick={() => ticketRef.current && downloadTicket(ticketRef.current, ticketData.nome)}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-95 hover:shadow-lg transition-all duration-300 cursor-pointer tracking-wider text-sm"
        >
          <Sparkles className="w-4 h-4" />
          Baixar meu ingresso
        </button>

        <p className="text-xs text-muted-foreground">
          Guarde o arquivo — é seu comprovante para o grande dia! 🤍
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Field label="Nome completo *">
        <input name="nome" required maxLength={120} className="input text-sm" placeholder="Seu nome" />
      </Field>
      <Field label="Telefone (opcional)">
        <input name="telefone" maxLength={30} className="input text-sm" placeholder="(00) 00000-0000" />
      </Field>
      
      <Field label="Você poderá comparecer? *">
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setPresenca("sim")}
            className={`flex flex-col items-center justify-center p-5 rounded-2xl border-2 transition duration-300 cursor-pointer ${
              presenca === "sim"
                ? "border-accent bg-accent/5 text-foreground shadow-sm scale-[1.02]"
                : "border-border bg-card text-muted-foreground hover:border-accent/40"
            }`}
          >
            <Sparkles className={`w-5 h-5 mb-2 transition-transform duration-300 ${presenca === "sim" ? "scale-110 text-accent" : ""}`} />
            <span className="text-sm font-semibold tracking-wide">Sim, eu vou!</span>
          </button>

          <button
            type="button"
            onClick={() => setPresenca("nao")}
            className={`flex flex-col items-center justify-center p-5 rounded-2xl border-2 transition duration-300 cursor-pointer ${
              presenca === "nao"
                ? "border-muted-foreground/60 bg-muted/20 text-foreground shadow-sm scale-[1.02]"
                : "border-border bg-card text-muted-foreground hover:border-muted-foreground/30"
            }`}
          >
            <XCircle className={`w-5 h-5 mb-2 transition-transform duration-300 ${presenca === "nao" ? "scale-110 text-muted-foreground" : ""}`} />
            <span className="text-sm font-semibold tracking-wide">Infelizmente não</span>
          </button>
        </div>
      </Field>

      {presenca === "sim" && (
        <>
          <Field label="Acompanhantes (além de você)">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setNumAcompanhantes(Math.max(0, numAcompanhantes - 1))}
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-lg hover:border-accent hover:text-accent transition font-medium cursor-pointer"
              >
                -
              </button>
              <span className="w-12 text-center font-serif text-2xl font-semibold">{numAcompanhantes}</span>
              <button
                type="button"
                onClick={() => setNumAcompanhantes(Math.min(10, numAcompanhantes + 1))}
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-lg hover:border-accent hover:text-accent transition font-medium cursor-pointer"
              >
                +
              </button>
            </div>
          </Field>

          {numAcompanhantes > 0 && (
            <div className="space-y-3 p-5 rounded-2xl bg-secondary/35 border border-border/40 animate-fade-in">
              <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase mb-1">
                Nome dos acompanhantes
              </p>
              {Array.from({ length: numAcompanhantes }).map((_, idx) => (
                <div key={idx} className="space-y-1">
                  <input
                    type="text"
                    required
                    placeholder={`Nome completo do acompanhante ${idx + 1}`}
                    value={nomesAcompanhantesList[idx] || ""}
                    onChange={(e) => {
                      const newNames = [...nomesAcompanhantesList];
                      newNames[idx] = e.target.value;
                      setNomesAcompanhantesList(newNames);
                    }}
                    className="input text-sm"
                  />
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <Field label="Mensagem (opcional)">
        <textarea name="mensagem" maxLength={500} rows={3} className="input text-sm" placeholder="Deixe um recadinho carinhoso para nós" />
      </Field>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-95 hover:shadow-lg transition-all duration-300 disabled:opacity-60 cursor-pointer tracking-wider text-sm"
      >
        {loading ? "Enviando..." : "Confirmar Presença"}
      </button>

      <style>{`
        .input{width:100%;padding:.75rem 1rem;border-radius:.75rem;border:1px solid var(--border);background:var(--background);color:var(--foreground);outline:none;transition:border .2s}
        .input:focus{border-color:var(--ring)}
      `}</style>
    </form>
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
      <p className="mt-4 opacity-70">Feito com carinho 🤍</p>
    </footer>
  );
}

function MusicPlayer() {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  function toggle() {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      a.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  }

  return (
    <>
      <div className="fixed bottom-5 right-5 z-50">
        <button
          onClick={toggle}
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
      <audio
        ref={audioRef}
        src="/background-music.mp3"
        loop
        preload="auto"
        onPause={() => setPlaying(false)}
        onPlay={() => setPlaying(true)}
      />
    </>
  );
}
