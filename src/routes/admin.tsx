import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast, Toaster } from "sonner";
import {
  Lock, Users, CheckCircle2, XCircle, Download, LogOut,
  ArrowLeft, Search, Ticket, Trash2, RefreshCw, MessageSquare
} from "lucide-react";
import type { Database } from "@/integrations/supabase/types";
import { TicketCard, downloadTicket } from "@/components/TicketCard";

export const Route = createFileRoute("/admin")({
  component: Admin,
});

type RSVP = Database["public"]["Tables"]["rsvps"]["Row"];

function Admin() {
  const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPresence, setFilterPresence] = useState<"todos" | "sim" | "nao">("todos");
  const [filterAcompanhantes, setFilterAcompanhantes] = useState<"todos" | "com" | "sem">("todos");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [expandedMsgId, setExpandedMsgId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) fetchRSVPs();
    else setLoadingData(false);
  }, [session]);

  async function fetchRSVPs() {
    setLoadingData(true);
    try {
      const { data, error } = await supabase
        .from("rsvps")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setRsvps(data || []);
    } catch (err: any) {
      toast.error("Erro ao carregar confirmações: " + err.message);
    } finally {
      setLoadingData(false);
    }
  }

  async function handleDelete(id: string, nome: string) {
    if (confirmDeleteId !== id) {
      setConfirmDeleteId(id);
      return;
    }
    setDeletingId(id);
    try {
      const { error } = await supabase.from("rsvps").delete().eq("id", id);
      if (error) throw error;
      setRsvps((prev) => prev.filter((r) => r.id !== id));
      toast.success(`"${nome}" removido com sucesso.`);
    } catch (err: any) {
      toast.error("Erro ao remover: " + err.message);
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoadingLogin(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success("Login efetuado com sucesso!");
    } catch (err: any) {
      toast.error("Falha na autenticação: " + (err.message === "Invalid login credentials" ? "Credenciais inválidas." : err.message));
    } finally {
      setLoadingLogin(false);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setRsvps([]);
    toast.success("Logout efetuado!");
  }

  function exportToCSV() {
    if (rsvps.length === 0) { toast.error("Não há respostas para exportar."); return; }
    const headers = ["Nome", "Presença", "Acompanhantes", "Nomes dos Acompanhantes", "Telefone", "Mensagem", "Data de Envio"];
    const rows = rsvps.map((r) => [
      r.nome,
      r.presenca === "sim" ? "Sim" : "Não",
      r.acompanhantes,
      r.nomes_acompanhantes || "",
      r.telefone || "",
      (r.mensagem || "").replace(/\r?\n|\r/g, " "),
      new Date(r.created_at).toLocaleString("pt-BR"),
    ]);
    const csvContent = "\uFEFF" + [
      headers.join(";"),
      ...rows.map((e) => e.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(";")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `convidados_casamento_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Lista exportada com sucesso!");
  }

  // Filters
  const filteredRsvps = rsvps.filter((r) => {
    const matchesSearch =
      r.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.telefone && r.telefone.includes(searchQuery)) ||
      (r.nomes_acompanhantes && r.nomes_acompanhantes.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesPresence = filterPresence === "todos" || r.presenca === filterPresence;
    const matchesAcomp =
      filterAcompanhantes === "todos" ||
      (filterAcompanhantes === "com" && r.acompanhantes > 0) ||
      (filterAcompanhantes === "sem" && r.acompanhantes === 0);
    return matchesSearch && matchesPresence && matchesAcomp;
  });

  // Stats
  const totalConfirmed = rsvps.filter((r) => r.presenca === "sim").length;
  const totalDeclined = rsvps.filter((r) => r.presenca === "nao").length;
  const totalHeadcount = rsvps.reduce(
    (acc, curr) => (curr.presenca === "sim" ? acc + 1 + curr.acompanhantes : acc), 0
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Toaster richColors position="top-center" />

      {/* Nav */}
      <nav className="backdrop-blur-md bg-background/70 border-b border-border/40 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="font-serif text-xl tracking-wide flex items-center gap-2 hover:opacity-80 transition">
            <ArrowLeft className="w-4 h-4" /> R & D
          </Link>
          <div className="font-serif text-lg font-medium">Painel do Casamento</div>
          {session && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm px-4 py-2 rounded-full border border-border hover:bg-secondary transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">Sair</span>
            </button>
          )}
        </div>
      </nav>

      <main className="flex-1 flex flex-col max-w-6xl w-full mx-auto p-6">
        {!session ? (
          /* Login */
          <div className="flex-1 flex items-center justify-center py-12">
            <div className="bg-card w-full max-w-md p-8 rounded-2xl border border-border shadow-md space-y-6">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/20 text-accent-foreground">
                  <Lock className="w-6 h-6" />
                </div>
                <h1 className="font-serif text-3xl">Acesso Administrativo</h1>
                <p className="text-sm text-muted-foreground">Insira as credenciais de admin do site.</p>
              </div>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium">E-mail</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="exemplo@email.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background outline-none focus:border-ring transition text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Senha</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••"
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background outline-none focus:border-ring transition text-sm" />
                </div>
                <button type="submit" disabled={loadingLogin}
                  className="w-full py-3 mt-2 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 transition disabled:opacity-60 cursor-pointer">
                  {loadingLogin ? "Autenticando..." : "Entrar"}
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* Dashboard */
          <div className="space-y-6 animate-fade-in">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="font-serif text-4xl">Confirmações de Presença</h1>
                <p className="text-muted-foreground text-sm mt-1">Gerencie a lista de convidados para o grande dia.</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={fetchRSVPs}
                  title="Atualizar lista"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-border text-sm hover:bg-secondary transition cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span className="hidden sm:inline">Atualizar</span>
                </button>
                <button
                  onClick={exportToCSV}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm hover:opacity-90 transition cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Exportar CSV
                </button>
              </div>
            </div>

            {/* Stats - 3 cards only, cleaner */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-card p-5 rounded-2xl border border-border shadow-sm text-center space-y-1">
                <div className="text-emerald-600 text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Confirmados
                </div>
                <div className="font-serif text-4xl text-emerald-600">{totalConfirmed}</div>
              </div>
              <div className="bg-card p-5 rounded-2xl border border-border shadow-sm text-center space-y-1">
                <div className="text-red-500 text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-1.5">
                  <XCircle className="w-3.5 h-3.5" /> Não Vão
                </div>
                <div className="font-serif text-4xl text-red-500">{totalDeclined}</div>
              </div>
              <div className="bg-accent/10 border-accent/30 p-5 rounded-2xl border shadow-sm text-center space-y-1">
                <div className="text-accent-foreground text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-1.5">
                  <Users className="w-3.5 h-3.5" /> Total de Pessoas
                </div>
                <div className="font-serif text-4xl text-primary">{totalHeadcount}</div>
              </div>
            </div>

            {/* Filters + Table */}
            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">

              {/* Filter bar */}
              <div className="p-4 border-b border-border flex flex-col md:flex-row gap-3 items-center bg-secondary/10">
                {/* Search */}
                <div className="relative w-full md:max-w-sm">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Buscar por nome, telefone ou acompanhante..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-border bg-background outline-none focus:border-ring transition text-sm"
                  />
                </div>

                <div className="flex gap-2 flex-wrap justify-end flex-1">
                  {/* Presence filter */}
                  <div className="flex bg-background border border-border rounded-xl p-0.5 text-xs">
                    {[
                      { id: "todos", label: "Todos" },
                      { id: "sim", label: "✓ Confirmados" },
                      { id: "nao", label: "✕ Ausentes" },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setFilterPresence(opt.id as any)}
                        className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer whitespace-nowrap ${
                          filterPresence === opt.id
                            ? "bg-primary text-primary-foreground shadow-xs"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>

                  {/* Companions filter */}
                  <div className="flex bg-background border border-border rounded-xl p-0.5 text-xs">
                    {[
                      { id: "todos", label: "Todos" },
                      { id: "com", label: "Com acomp." },
                      { id: "sem", label: "Sem acomp." },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setFilterAcompanhantes(opt.id as any)}
                        className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer whitespace-nowrap ${
                          filterAcompanhantes === opt.id
                            ? "bg-primary text-primary-foreground shadow-xs"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                {loadingData ? (
                  <div className="p-12 text-center text-muted-foreground text-sm">Carregando lista de convidados...</div>
                ) : filteredRsvps.length === 0 ? (
                  <div className="p-12 text-center text-muted-foreground text-sm">Nenhum convidado encontrado.</div>
                ) : (
                  <table className="w-full border-collapse text-left text-sm">
                    <thead>
                      <tr className="border-b border-border bg-secondary/20 text-muted-foreground text-xs uppercase tracking-wider">
                        <th className="p-4 font-medium">Convidado</th>
                        <th className="p-4 font-medium">Presença</th>
                        <th className="p-4 font-medium">Telefone</th>
                        <th className="p-4 font-medium">Data</th>
                        <th className="p-4 font-medium text-center">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {filteredRsvps.map((rsvp) => {
                        const ticketRef = { current: null as HTMLDivElement | null };
                        const isConfirming = confirmDeleteId === rsvp.id;
                        const isDeleting = deletingId === rsvp.id;
                        const companions = rsvp.nomes_acompanhantes
                          ? rsvp.nomes_acompanhantes.split(",").map((n) => n.trim()).filter(Boolean)
                          : [];

                        return (
                          <tr
                            key={rsvp.id}
                            className={`hover:bg-secondary/10 transition ${isConfirming ? "bg-red-50/50 dark:bg-red-950/20" : ""}`}
                          >
                            {/* Name + companions */}
                            <td className="p-4 align-top max-w-xs">
                              <div className="font-semibold text-foreground">{rsvp.nome}</div>
                              {companions.length > 0 && rsvp.presenca === "sim" && (
                                <div className="mt-1.5 space-y-0.5 pl-3 border-l-2 border-accent/40">
                                  {companions.map((cName, idx) => (
                                    <div key={idx} className="text-xs text-muted-foreground flex items-center gap-1.5">
                                      <span className="w-1 h-1 rounded-full bg-accent shrink-0" />
                                      <span>{cName} <span className="italic opacity-60">(acomp.)</span></span>
                                    </div>
                                  ))}
                                </div>
                              )}
                              {/* Message expandable */}
                              {rsvp.mensagem && (
                                <button
                                  onClick={() => setExpandedMsgId(expandedMsgId === rsvp.id ? null : rsvp.id)}
                                  className="mt-1.5 flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition cursor-pointer"
                                >
                                  <MessageSquare className="w-3 h-3" />
                                  {expandedMsgId === rsvp.id ? "Ocultar mensagem" : "Ver mensagem"}
                                </button>
                              )}
                              {expandedMsgId === rsvp.id && rsvp.mensagem && (
                                <div className="mt-1.5 text-xs text-muted-foreground bg-secondary/30 rounded-lg p-2.5 italic leading-relaxed">
                                  "{rsvp.mensagem}"
                                </div>
                              )}
                            </td>

                            {/* Presence */}
                            <td className="p-4 align-top">
                              {rsvp.presenca === "sim" ? (
                                <div className="space-y-1">
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    Confirmou
                                  </span>
                                  {rsvp.acompanhantes > 0 && (
                                    <div className="text-[11px] text-muted-foreground">
                                      +{rsvp.acompanhantes} acomp.
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                  Não vai
                                </span>
                              )}
                            </td>

                            {/* Phone */}
                            <td className="p-4 align-top text-muted-foreground font-mono text-xs">
                              {rsvp.telefone || "—"}
                            </td>

                            {/* Date */}
                            <td className="p-4 align-top text-muted-foreground text-xs whitespace-nowrap">
                              {new Date(rsvp.created_at).toLocaleDateString("pt-BR")}
                              <div className="text-[10px] opacity-60">
                                {new Date(rsvp.created_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                              </div>
                            </td>

                            {/* Actions */}
                            <td className="p-4 align-top">
                              <div className="flex items-center justify-center gap-2 flex-wrap">
                                {/* Hidden ticket for download */}
                                <div style={{ position: "fixed", top: "-9999px", left: "-9999px", opacity: 0, pointerEvents: "none" }}>
                                  <div ref={(el) => { ticketRef.current = el; }}>
                                    <TicketCard data={{ nome: rsvp.nome, acompanhantes: rsvp.acompanhantes, nomes_acompanhantes: rsvp.nomes_acompanhantes }} />
                                  </div>
                                </div>

                                {/* Ticket button */}
                                <button
                                  onClick={() => ticketRef.current && downloadTicket(ticketRef.current, rsvp.nome)}
                                  title="Baixar ingresso"
                                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-accent/40 text-accent text-xs font-medium hover:bg-accent/10 transition cursor-pointer"
                                >
                                  <Ticket className="w-3.5 h-3.5" />
                                  Ingresso
                                </button>

                                {/* Delete button */}
                                {isConfirming ? (
                                  <div className="flex gap-1">
                                    <button
                                      onClick={() => handleDelete(rsvp.id, rsvp.nome)}
                                      disabled={isDeleting}
                                      className="px-2.5 py-1.5 rounded-full bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition cursor-pointer disabled:opacity-60"
                                    >
                                      {isDeleting ? "..." : "Confirmar"}
                                    </button>
                                    <button
                                      onClick={() => setConfirmDeleteId(null)}
                                      className="px-2.5 py-1.5 rounded-full border border-border text-xs text-muted-foreground hover:bg-secondary transition cursor-pointer"
                                    >
                                      Cancelar
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => handleDelete(rsvp.id, rsvp.nome)}
                                    title="Remover convidado"
                                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-red-200 text-red-500 text-xs font-medium hover:bg-red-50 dark:hover:bg-red-950/30 transition cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    Remover
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Table footer */}
              <div className="p-4 border-t border-border bg-secondary/5 text-xs text-muted-foreground flex justify-between items-center flex-wrap gap-2">
                <div>
                  Mostrando <strong>{filteredRsvps.length}</strong> de <strong>{rsvps.length}</strong> respostas.
                </div>
                {(searchQuery || filterPresence !== "todos" || filterAcompanhantes !== "todos") && (
                  <button
                    onClick={() => { setSearchQuery(""); setFilterPresence("todos"); setFilterAcompanhantes("todos"); }}
                    className="text-accent hover:underline cursor-pointer"
                  >
                    Limpar filtros
                  </button>
                )}
              </div>
            </div>

            {/* RLS warning banner for delete */}
            <p className="text-xs text-muted-foreground text-center opacity-60">
              A remoção de convidados é permanente e não pode ser desfeita.
            </p>
          </div>
        )}
      </main>

      <footer className="py-6 text-center text-xs text-muted-foreground border-t border-border mt-auto">
        <p>Painel de RSVP • Raquel & Daniel • Feito com carinho 🤍</p>
      </footer>
    </div>
  );
}
