export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-ink">
      {children}
      <footer className="border-t border-line px-4 py-8 text-center text-xs text-muted">
        Abstracthon · Registro de equipos
      </footer>
    </div>
  );
}
