import Link from "next/link";
import InstagramIcon from "@mui/icons-material/Instagram";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import YouTubeIcon from "@mui/icons-material/YouTube";
import MusicNoteIcon from "@mui/icons-material/MusicNote";

export function Footer() {
  return (
    <footer className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 overflow-hidden border-t border-secondary/25 bg-gradient-to-b from-accent/70 via-primary-soft/40 to-paper text-ink">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(255,255,255,0.7),transparent_42%),radial-gradient(circle_at_88%_80%,rgba(110,99,168,0.16),transparent_44%)]" />

      <div className="relative mx-auto w-full max-w-6xl px-4 pb-8 pt-14 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="font-roboto text-xs font-semibold tracking-[0.24em] text-secondary">
            AURA ACTIVEWEAR
          </p>
          <h2 className="font-roboto mt-2 text-3xl font-black uppercase tracking-[0.16em] text-ink md:text-4xl">
            Essência em Movimento
          </h2>
          <p className="mx-auto mt-3 max-w-3xl text-sm text-muted md:text-base">
            Moda fitness com tecnologia, conforto e identidade para mulheres
            que treinam com atitude.
          </p>
        </div>

        <div className="mt-10 grid gap-8 border-y border-secondary/20 py-8 sm:grid-cols-2 lg:grid-cols-5">
          <div className="min-w-0">
            <h3 className="font-roboto text-base font-black tracking-wide text-secondary md:text-lg">
              Atendimento
            </h3>
            <ul className="mt-3 space-y-1.5 break-words text-sm text-muted">
              <li>Seg a Sex 09h às 18h</li>
              <li>WhatsApp: (22) 99895-9800</li>
              <li>contato@auraactivewear.com.br</li>
            </ul>
            <div className="mt-4 flex items-center gap-2 text-secondary">
              <Link
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="rounded-full p-2 transition-colors hover:bg-primary-soft/70"
              >
                <InstagramIcon fontSize="small" />
              </Link>
              <Link
                href="https://wa.me/5522998959800"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="rounded-full p-2 transition-colors hover:bg-primary-soft/70"
              >
                <WhatsAppIcon fontSize="small" />
              </Link>
              <Link
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="rounded-full p-2 transition-colors hover:bg-primary-soft/70"
              >
                <YouTubeIcon fontSize="small" />
              </Link>
              <Link
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="rounded-full p-2 transition-colors hover:bg-primary-soft/70"
              >
                <MusicNoteIcon fontSize="small" />
              </Link>
            </div>
          </div>

          <div className="min-w-0">
            <h3 className="font-roboto text-base font-black tracking-wide text-secondary md:text-lg">
              Pedidos e Entregas
            </h3>
            <ul className="mt-3 space-y-1.5 text-sm text-muted">
              <li>Acompanhar Pedido</li>
              <li>Trocas e Devoluções</li>
              <li>Prazos de Entrega</li>
              <li>Histórico de Pedido</li>
            </ul>
          </div>

          <div className="min-w-0">
            <h3 className="font-roboto text-base font-black tracking-wide text-secondary md:text-lg">
              Quer Ajuda?
            </h3>
            <ul className="mt-3 space-y-1.5 text-sm text-muted">
              <li>Contato por E-mail</li>
              <li>Auto Atendimento</li>
              <li>Trabalhe Conosco</li>
            </ul>
          </div>

          <div className="min-w-0">
            <h3 className="font-roboto text-base font-black tracking-wide text-secondary md:text-lg">
              Seja um Revendedor
            </h3>
            <p className="mt-3 text-sm text-muted">
              Cadastre-se para revender Aura Activewear e tenha condições
              especiais para sua loja.
            </p>
            <button
              type="button"
              className="mt-4 rounded-md bg-secondary px-4 py-2 text-sm font-bold text-paper transition-colors hover:bg-primary"
            >
              Quero Revender
            </button>
          </div>

          <div className="min-w-0">
            <h3 className="font-roboto text-base font-black tracking-wide text-secondary md:text-lg">
              Compre com Segurança
            </h3>
            <div className="mt-3 grid gap-2">
              <div className="rounded-md border border-secondary/25 bg-primary-soft/40 px-3 py-2 text-sm font-semibold text-secondary">
                SSL Ativo
              </div>
              <div className="rounded-md border border-secondary/25 bg-primary-soft/40 px-3 py-2 text-sm font-semibold text-secondary">
                Compra 100% Segura
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="rounded bg-secondary px-2 py-1 text-xs font-bold text-paper">
                  VISA
                </span>
                <span className="rounded bg-secondary px-2 py-1 text-xs font-bold text-paper">
                  MASTERCARD
                </span>
                <span className="rounded bg-secondary px-2 py-1 text-xs font-bold text-paper">
                  PIX
                </span>
                <span className="rounded bg-secondary px-2 py-1 text-xs font-bold text-paper">
                  BOLETO
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-secondary/25 pt-6 text-center text-sm text-muted">
          <p>© 2026 Aura Activewear. Todos os direitos reservados.</p>
          <p className="mt-2">
            Projeto criado por{" "}
            <a
              href="https://mypage-two-jade.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-secondary underline-offset-2 hover:underline"
            >
              CoreLayer
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
