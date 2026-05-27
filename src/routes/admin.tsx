import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast, Toaster } from "sonner";
import { Lock, Users, CheckCircle2, XCircle, Download, LogOut, ArrowLeft, Search, Filter } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

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

  // Get current session and listen to changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch RSVPs when session changes
  useEffect(() => {
    if (session) {
      fetchRSVPs();
    } else {
      setLoadingData(false);
    }
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
      console.error(err);
      toast.error("Erro ao carregar confirmações: " + err.message);
    } finally {
      setLoadingData(false);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Por favor, preencha email e senha.");
      return;
    }
    setLoadingLogin(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      toast.success("Login efetuado com sucesso!");
    } catch (err: any) {
      toast.error("Falha na autenticação: " + (err.message === "Invalid login credentials" ? "Credenciais inválidas." : err.message));
    } finally {
      setLoadingLogin(false);
    }
  }

  async function handleLogout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setRsvps([]);
      toast.success("Logout efetuado!");
    } catch (err: any) {
      toast.error("Erro ao sair: " + err.message);
    }
  }

  function exportToCSV() {
    if (rsvps.length === 0) {
      toast.error("Não há respostas para exportar.");
      return;
    }
    const headers = ["Nome", "Presença", "Acompanhantes", "Telefone", "Mensagem", "Data de Envio"];
    const rows = rsvps.map((r) => [
      r.nome,
      r.presenca === "sim" ? "Sim" : "Não",
      r.acompanhantes,
      r.telefone || "",
      (r.mensagem || "").replace(/\r?\n|\r/g, " "), // strip newlines
      new Date(r.created_at).toLocaleString("pt-BR"),
    ]);

    // Use semicolon separation and BOM for Portuguese Excel encoding
    const csvContent =
      "\uFEFF" +
      [
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

  // Filtered RSVPs list
  const filteredRsvps = rsvps.filter((r) => {
    const matchesSearch = r.nome.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (r.telefone && r.telefone.includes(searchQuery));
    const matchesPresence = filterPresence === "todos" || r.presenca === filterPresence;
    return matchesSearch && matchesPresence;
  });

  // Stats calculation
  const totalAnswers = rsvps.length;
  const totalConfirmed = rsvps.filter((r) => r.presenca === "sim").length;
  const totalDeclined = rsvps.filter((r) => r.presenca === "nao").length;
  const totalHeadcount = rsvps.reduce(
    (acc, curr) => (curr.presenca === "sim" ? acc + 1 + curr.acompanhantes : acc),
    0
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Toaster richColors position="top-center" />

      {/* Nav */}
      <nav className="backdrop-blur-md bg-background/70 border-b border-border/40 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="font-serif text-xl tracking-wide flex items-center gap-2 hover:opacity-80 transition">
            <ArrowLeft className="w-4 h-4" /> R &amp; D
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

      {/* Main Content */}
      <main className="flex-1 flex flex-col max-w-6xl w-full mx-auto p-6">
        {!session ? (
          /* Login Page */
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
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="exemplo@email.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background outline-none focus:border-ring transition text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Senha</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background outline-none focus:border-ring transition text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loadingLogin}
                  className="w-full py-3 mt-2 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 transition disabled:opacity-60 cursor-pointer"
                >
                  {loadingLogin ? "Autenticando..." : "Entrar"}
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* Dashboard Page */
          <div className="space-y-8 animate-fade-in">
            {/* Header / Stats Summary */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="font-serif text-4xl">Confirmações de Presença</h1>
                <p className="text-muted-foreground text-sm mt-1">Gerencie a lista de convidados para o grande dia.</p>
              </div>
              <button
                onClick={exportToCSV}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm hover:opacity-90 transition cursor-pointer"
              >
                <Download className="w-4 h-4" /> Exportar Planilha (CSV)
              </button>
            </div>

            {/* Stats Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-card p-5 rounded-2xl border border-border shadow-sm text-center md:text-left space-y-2">
                <div className="text-muted-foreground text-xs uppercase tracking-wider font-medium">Respostas</div>
                <div className="font-serif text-3xl md:text-4xl">{totalAnswers}</div>
                <p className="text-[10px] text-muted-foreground">Total de formulários enviados</p>
              </div>

              <div className="bg-card p-5 rounded-2xl border border-border shadow-sm text-center md:text-left space-y-2">
                <div className="text-muted-foreground text-xs uppercase tracking-wider font-medium text-emerald-600 dark:text-emerald-400">Vão Comparecer</div>
                <div className="font-serif text-3xl md:text-4xl text-emerald-600 dark:text-emerald-400 flex items-center justify-center md:justify-start gap-2">
                  <CheckCircle2 className="w-6 h-6 shrink-0" /> {totalConfirmed}
                </div>
                <p className="text-[10px] text-muted-foreground">Famílias/Contatos confirmados</p>
              </div>

              <div className="bg-card p-5 rounded-2xl border border-border shadow-sm text-center md:text-left space-y-2">
                <div className="text-muted-foreground text-xs uppercase tracking-wider font-medium text-red-600 dark:text-red-400">Não Vão</div>
                <div className="font-serif text-3xl md:text-4xl text-red-600 dark:text-red-400 flex items-center justify-center md:justify-start gap-2">
                  <XCircle className="w-6 h-6 shrink-0" /> {totalDeclined}
                </div>
                <p className="text-[10px] text-muted-foreground">Recusaram o convite</p>
              </div>

              <div className="bg-card p-5 rounded-2xl border border-border shadow-sm text-center md:text-left space-y-2 bg-accent/10 border-accent/20">
                <div className="text-accent-foreground text-xs uppercase tracking-wider font-medium">Total de Convidados</div>
                <div className="font-serif text-3xl md:text-4xl text-primary flex items-center justify-center md:justify-start gap-2">
                  <Users className="w-6 h-6 shrink-0" /> {totalHeadcount}
                </div>
                <p className="text-[10px] text-muted-foreground">Pessoas confirmadas (Titular + extras)</p>
              </div>
            </div>

            {/* Filters and List */}
            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col">
              {/* Filter bar */}
              <div className="p-4 border-b border-border flex flex-col md:flex-row gap-4 justify-between items-center bg-secondary/10">
                <div className="relative w-full md:max-w-xs">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Buscar por nome ou telefone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-border bg-background outline-none focus:border-ring transition text-sm"
                  />
                </div>

                <div className="flex gap-2 w-full md:w-auto shrink-0 justify-end">
                  <span className="text-sm text-muted-foreground flex items-center gap-1.5 hidden sm:inline-flex">
                    <Filter className="w-4 h-4" /> Filtrar por presença:
                  </span>
                  <div className="flex bg-background border border-border rounded-xl p-0.5 text-xs w-full sm:w-auto">
                    {[
                      { id: "todos", label: "Todos" },
                      { id: "sim", label: "Confirmados" },
                      { id: "nao", label: "Ausentes" },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setFilterPresence(opt.id as any)}
                        className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                          filterPresence === opt.id
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

              {/* Table / List Container */}
              <div className="overflow-x-auto">
                {loadingData ? (
                  <div className="p-12 text-center text-muted-foreground text-sm">Carregando lista de convidados...</div>
                ) : filteredRsvps.length === 0 ? (
                  <div className="p-12 text-center text-muted-foreground text-sm">Nenhum convidado encontrado.</div>
                ) : (
                  <table className="w-full border-collapse text-left text-sm">
                    <thead>
                      <tr className="border-b border-border bg-secondary/20 text-muted-foreground text-xs uppercase tracking-wider">
                        <th className="p-4 font-medium">Nome</th>
                        <th className="p-4 font-medium">Presença</th>
                        <th className="p-4 font-medium">Acompanhantes</th>
                        <th className="p-4 font-medium">Telefone</th>
                        <th className="p-4 font-medium">Mensagem</th>
                        <th className="p-4 font-medium">Data</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {filteredRsvps.map((rsvp) => (
                        <tr key={rsvp.id} className="hover:bg-secondary/10 transition">
                          <td className="p-4 font-medium text-foreground">{rsvp.nome}</td>
                          <td className="p-4">
                            {rsvp.presenca === "sim" ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                Confirmou
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                Não vai
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-center md:text-left">{rsvp.acompanhantes}</td>
                          <td className="p-4 text-muted-foreground font-mono text-xs">{rsvp.telefone || "-"}</td>
                          <td className="p-4 max-w-xs truncate text-muted-foreground" title={rsvp.mensagem || ""}>
                            {rsvp.mensagem || "-"}
                          </td>
                          <td className="p-4 text-muted-foreground text-xs">
                            {new Date(rsvp.created_at).toLocaleDateString("pt-BR")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Table Footer Stats */}
              <div className="p-4 border-t border-border bg-secondary/5 text-xs text-muted-foreground flex justify-between items-center">
                <div>
                  Mostrando <strong>{filteredRsvps.length}</strong> de <strong>{rsvps.length}</strong> respostas.
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-muted-foreground border-t border-border mt-auto">
        <p>Painel de RSVP • Raquel &amp; Daniel • Feito com 💛</p>
      </footer>
    </div>
  );
}
