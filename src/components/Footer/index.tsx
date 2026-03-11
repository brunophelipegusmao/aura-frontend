import Link from "next/link";
import InstagramIcon from "@mui/icons-material/Instagram";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import { MotionReveal } from "@/components/motion/Reveal";

export function Footer() {
  return (
    <footer className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 overflow-hidden border-t border-secondary/20 bg-paper text-ink">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_12%,rgba(199,193,230,0.2),transparent_42%)]" />

      <MotionReveal
        className="relative mx-auto w-full max-w-6xl px-4 pb-8 pt-12 sm:px-6 lg:px-8"
        amount={0.08}
      >
        <div className="mt-10 grid gap-8 border-t border-secondary/15 pt-8 sm:grid-cols-2 lg:grid-cols-5">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-secondary md:text-base">
              Atendimento
            </h3>
            <ul className="mt-3 space-y-2 break-words text-sm leading-relaxed text-muted">
              <li>Segunda a sexta, das 9h às 18h</li>
              <li>WhatsApp: (22) 99895-9800</li>
              <li>contato@auraactivewear.com.br</li>
              <li>Atendimento por ordem de chegada</li>
            </ul>
            <Link
              href="/contact"
              prefetch={false}
              className="mt-4 inline-flex aura-cta aura-cta-considerar"
            >
              Central de atendimento
            </Link>
          </div>

          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-secondary md:text-base">
              Políticas
            </h3>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted">
              <li>Condições de troca conforme política vigente</li>
              <li>Condições de envio e frete no checkout</li>
              <li>Status do pedido informado no canal de compra</li>
              <li>Pagamento via PIX, cartão e boleto</li>
            </ul>
          </div>

          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-secondary md:text-base">
              Institucional
            </h3>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted">
              <li>
                <Link
                  href="/about"
                  prefetch={false}
                  className="hover:text-secondary"
                >
                  Sobre a Aura
                </Link>
              </li>
              <li>
                <Link
                  href="/collections"
                  prefetch={false}
                  className="hover:text-secondary"
                >
                  Coleções
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  prefetch={false}
                  className="hover:text-secondary"
                >
                  Produtos
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  prefetch={false}
                  className="hover:text-secondary"
                >
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-secondary md:text-base">
              Social
            </h3>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted">
              <li className="flex items-center gap-2">
                <InstagramIcon fontSize="small" className="text-secondary" />
                <a
                  href="https://instagram.com/auraactivewear"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-secondary"
                >
                  @auraactivewear
                </a>
              </li>
              <li className="flex items-center gap-2">
                <WhatsAppIcon fontSize="small" className="text-secondary" />
                <a
                  href="https://wa.me/5522998959800"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-secondary"
                >
                  WhatsApp de atendimento
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MusicNoteIcon fontSize="small" className="text-secondary" />
                <a
                  href="https://www.tiktok.com/@auraactivewear"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-secondary"
                >
                  TikTok @auraactivewear
                </a>
              </li>
            </ul>
          </div>

          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-secondary md:text-base">
              Pagamentos
            </h3>
            <div className="mt-3 space-y-3">
              <div className="rounded-xl border border-secondary/20 bg-primary-soft/15 px-3 py-2 text-sm text-ink">
                Revise os dados do pedido antes da confirmação final.
              </div>
              <div className="flex flex-wrap gap-2">
                {["PIX", "VISA", "MASTERCARD", "ELO", "BOLETO"].map(
                  (method) => (
                    <span
                      key={method}
                      className="rounded-md border border-secondary/20 bg-white px-2 py-1 text-xs font-semibold text-secondary"
                    >
                      {method}
                    </span>
                  ),
                )}
              </div>
              <Link
                href="/products"
                prefetch={false}
                className="inline-flex aura-cta aura-cta-comprar"
              >
                Comprar agora
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-secondary/20 pt-5 text-sm text-muted">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 Aura Activewear. Todos os direitos reservados.</p>
            <p>
              Moda fitness premium com foco em conforto, caimento e performance.
            </p>
          </div>
        </div>
      </MotionReveal>
    </footer>
  );
}
