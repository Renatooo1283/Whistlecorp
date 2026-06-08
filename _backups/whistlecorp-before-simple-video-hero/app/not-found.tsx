import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">
        Error 404
      </p>
      <h1 className="mt-3 text-4xl font-bold text-[var(--color-text-strong)] sm:text-5xl">
        Página no encontrada
      </h1>
      <p className="mt-4 max-w-md text-[var(--color-text)]">
        La página que buscas fue movida o ya no existe. Puedes volver al inicio o
        explorar nuestros servicios.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button href="/" variant="primary">
          Volver al inicio
        </Button>
        <Button href="/servicios" variant="secondary">
          Ver servicios
        </Button>
      </div>
    </Container>
  );
}
