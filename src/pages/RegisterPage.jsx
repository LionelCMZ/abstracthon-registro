import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, GitBranch, Loader2, Send, TriangleAlert } from "lucide-react";
import { isSupabaseConfigured } from "../lib/supabase.js";
import { createTeam } from "../lib/teams.js";

const GITHUB_RE = /^https?:\/\/(www\.)?github\.com\/\S+$/i;
const createEmptyForm = () => ({ teamName: "", githubUrl: "" });

const fieldClass =
  "mt-2 w-full rounded-xl border border-line bg-ink px-4 py-3 text-sm text-white placeholder:text-muted outline-none transition focus:border-action focus:ring-2 focus:ring-action/20";
const labelClass = "block text-sm font-medium text-copy";

function validate({ teamName, githubUrl }) {
  const errors = {};

  if (teamName.length < 2 || teamName.length > 80) {
    errors.teamName = "El nombre del equipo debe tener entre 2 y 80 caracteres.";
  }
  if (!GITHUB_RE.test(githubUrl)) {
    errors.githubUrl =
      "Ingresa una URL válida de GitHub, por ejemplo https://github.com/equipo/proyecto.";
  }

  return errors;
}

export default function RegisterPage() {
  const [form, setForm] = useState(createEmptyForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [errorText, setErrorText] = useState("");

  const updateField = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  async function handleSubmit(event) {
    event.preventDefault();

    const payload = {
      teamName: form.teamName.trim(),
      githubUrl: form.githubUrl.trim(),
    };
    const nextErrors = validate(payload);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0 || !isSupabaseConfigured) return;

    setStatus("sending");
    setErrorText("");
    try {
      await createTeam(payload);
      setStatus("done");
    } catch (error) {
      setErrorText(error?.message ?? "No se pudo guardar el equipo. Intenta de nuevo.");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <main className="relative px-4 py-24 sm:px-6">
        <div aria-hidden="true" className="grid-bg pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-xl rounded-3xl border border-line bg-surface p-10 text-center">
          <Check className="mx-auto h-12 w-12 text-confirm" aria-hidden="true" />
          <h1 className="mt-6 font-display text-4xl font-bold tracking-tight text-white">
            Gracias por el llenado
          </h1>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/equipos"
              className="rounded-xl bg-action px-5 py-3 text-sm font-semibold text-ink transition hover:brightness-110"
            >
              Ver equipos registrados
            </Link>
            <button
              type="button"
              onClick={() => {
                setForm(createEmptyForm());
                setErrors({});
                setStatus("idle");
              }}
              className="rounded-xl border border-line px-5 py-3 text-sm font-semibold text-copy transition hover:border-action hover:text-action"
            >
              Registrar otro equipo
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative px-4 py-16 sm:px-6 sm:py-24">
      <div aria-hidden="true" className="grid-bg pointer-events-none absolute inset-0" />

      <div className="relative mx-auto max-w-3xl">
        <p className="flex items-center gap-2 text-sm text-copy">
          <span className="live-dot" aria-hidden="true" />
          Registro de equipos
        </p>
        <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Registra tu equipo
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-copy">
          Comparte el nombre de tu equipo y el enlace de su repositorio.
        </p>

        {!isSupabaseConfigured && (
          <div
            role="alert"
            className="mt-8 flex gap-3 rounded-2xl border border-mark/40 bg-mark/10 p-4 text-sm text-copy"
          >
            <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-mark" aria-hidden="true" />
            <p className="leading-relaxed">
              Configura <code className="text-mark">VITE_SUPABASE_URL</code> y{" "}
              <code className="text-mark">VITE_SUPABASE_ANON_KEY</code> en un archivo{" "}
              <code className="text-mark">.env</code> local para guardar los registros.
            </p>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          noValidate
          className="mt-10 rounded-3xl border border-line bg-surface p-6 sm:p-9"
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="teamName">
                Nombre del equipo <span className="text-red-400">*</span>
              </label>
              <input
                id="teamName"
                name="teamName"
                type="text"
                required
                maxLength={80}
                autoComplete="organization"
                value={form.teamName}
                onChange={(event) => updateField("teamName", event.target.value)}
                placeholder="Ej. Los Compiladores"
                aria-invalid={Boolean(errors.teamName)}
                aria-describedby={errors.teamName ? "teamName-error" : undefined}
                className={fieldClass}
              />
              {errors.teamName && (
                <p id="teamName-error" role="alert" className="mt-2 text-xs text-red-400">
                  {errors.teamName}
                </p>
              )}
            </div>

            <div>
              <label className={labelClass} htmlFor="githubUrl">
                Enlace de GitHub <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <GitBranch
                  className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                  aria-hidden="true"
                />
                <input
                  id="githubUrl"
                  name="githubUrl"
                  type="url"
                  required
                  inputMode="url"
                  value={form.githubUrl}
                  onChange={(event) => updateField("githubUrl", event.target.value)}
                  placeholder="https://github.com/equipo/proyecto"
                  aria-invalid={Boolean(errors.githubUrl)}
                  aria-describedby={errors.githubUrl ? "githubUrl-error" : undefined}
                  className={`${fieldClass} pl-10`}
                />
              </div>
              {errors.githubUrl && (
                <p id="githubUrl-error" role="alert" className="mt-2 text-xs text-red-400">
                  {errors.githubUrl}
                </p>
              )}
            </div>
          </div>

          {status === "error" && (
            <p
              role="alert"
              className="mt-7 rounded-xl border border-red-400/40 bg-red-400/10 p-4 text-sm text-red-300"
            >
              {errorText}
            </p>
          )}

          <button
            type="submit"
            disabled={!isSupabaseConfigured || status === "sending"}
            className="mt-9 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-action px-6 py-4 text-base font-semibold text-ink transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {status === "sending" ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                Guardando...
              </>
            ) : (
              <>
                <Send className="h-5 w-5" aria-hidden="true" />
                Registrar equipo
              </>
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
