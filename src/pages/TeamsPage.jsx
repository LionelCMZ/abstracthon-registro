import { useEffect, useState } from "react";
import { ArrowUpRight, GitBranch, RefreshCw, TriangleAlert } from "lucide-react";
import { getTeams } from "../lib/teams.js";

const dateFormatter = new Intl.DateTimeFormat("es-BO", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "America/La_Paz",
});

export default function TeamsPage() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    getTeams()
      .then((data) => {
        if (!cancelled) setTeams(data);
      })
      .catch((cause) => {
        if (!cancelled) setError(cause?.message ?? "No se pudieron cargar los equipos.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const reload = () => {
    setLoading(true);
    setError("");
    setReloadKey((key) => key + 1);
  };

  return (
    <main className="relative px-4 py-16 sm:px-6 sm:py-24">
      <div aria-hidden="true" className="grid-bg pointer-events-none absolute inset-0" />

      <div className="relative mx-auto max-w-5xl">
        <p className="flex items-center gap-2 text-sm text-copy">
          <span className="live-dot" aria-hidden="true" />
          {loading ? "Cargando equipos" : `${teams.length} equipos registrados`}
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Equipos registrados
          </h1>
          {!loading && !error && teams.length > 0 && (
            <button
              type="button"
              onClick={reload}
              className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-4 py-2.5 text-sm font-semibold text-copy transition hover:border-action hover:text-action"
            >
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              Actualizar
            </button>
          )}
        </div>

        <div className="mt-12">
          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-label="Cargando equipos">
              {[0, 1, 2].map((item) => (
                <div
                  key={item}
                  className="h-44 animate-pulse rounded-2xl border border-line bg-surface"
                />
              ))}
            </div>
          ) : error ? (
            <div
              role="alert"
              className="rounded-2xl border border-red-400/40 bg-red-400/10 p-6 text-center"
            >
              <TriangleAlert className="mx-auto h-6 w-6 text-red-300" aria-hidden="true" />
              <p className="mt-3 text-sm text-red-200">{error}</p>
              <button
                type="button"
                onClick={reload}
                className="mt-5 inline-flex items-center gap-2 rounded-xl border border-red-400/40 px-4 py-2.5 text-sm font-semibold text-red-200 transition hover:bg-red-400/10"
              >
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
                Reintentar
              </button>
            </div>
          ) : teams.length === 0 ? (
            <div className="rounded-2xl border border-line bg-surface p-10 text-center">
              <GitBranch className="mx-auto h-8 w-8 text-muted" aria-hidden="true" />
              <h2 className="mt-4 font-display text-xl font-semibold text-white">
                Aún no hay equipos registrados
              </h2>
              <p className="mt-2 text-sm text-copy">
                Los equipos aparecerán aquí en cuanto se registren.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {teams.map((team) => (
                <article
                  key={team.id}
                  className="flex flex-col rounded-2xl border border-line bg-surface p-6 transition hover:border-action/50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="font-display text-xl font-semibold leading-tight text-white">
                      {team.team_name}
                    </h2>
                    <a
                      href={team.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Repositorio de ${team.team_name}`}
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line text-copy transition hover:border-action hover:text-action"
                    >
                      <GitBranch className="h-5 w-5" aria-hidden="true" />
                    </a>
                  </div>
                  <div className="mt-6 flex items-center justify-between gap-3 border-t border-line pt-4 text-xs text-muted">
                    <time dateTime={team.created_at}>
                      {dateFormatter.format(new Date(team.created_at))}
                    </time>
                    <a
                      href={team.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-copy transition hover:text-action"
                    >
                      Ver repositorio
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
