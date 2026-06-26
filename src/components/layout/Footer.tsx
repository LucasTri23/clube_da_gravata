import Link from 'next/link'

export default function Footer() {
  return (
    <footer
      className="border-t mt-auto"
      style={{ background: 'var(--footer-bg)', borderColor: 'var(--border)' }}
    >
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ border: '2px solid var(--gold)', background: 'var(--bg)' }}
              >
                <svg width="16" height="20" viewBox="0 0 18 24" fill="none">
                  <path d="M5.5 2L9 7.5" stroke="var(--gold)" strokeWidth="1.6" strokeLinecap="round" />
                  <path d="M12.5 2L9 7.5" stroke="var(--gold)" strokeWidth="1.6" strokeLinecap="round" />
                  <ellipse cx="9" cy="9.2" rx="2.3" ry="1.8" fill="var(--gold)" />
                  <path d="M6.7 10.8L5.2 23L9 25L12.8 23L11.3 10.8Z" fill="var(--gold)" />
                </svg>
              </div>
              <div className="leading-none">
                <span
                  className="font-bold tracking-[0.12em] text-xs uppercase block"
                  style={{ color: 'var(--text)' }}
                >
                  Clube da Gravata
                </span>
                <span
                  className="text-[9px] tracking-[0.2em] uppercase"
                  style={{ color: 'var(--gold)' }}
                >
                  Moda Masculina
                </span>
              </div>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Gravatas premium e estilo social para o homem moderno. Qualidade e
              elegância em cada detalhe.
            </p>
          </div>

          <div>
            <h3
              className="font-semibold mb-5 text-xs uppercase tracking-[0.2em]"
              style={{ color: 'var(--gold)' }}
            >
              Categorias
            </h3>
            <ul className="space-y-3">
              {[
                { label: 'Ternos', slug: 'ternos' },
                { label: 'Gravatas', slug: 'gravatas' },
                { label: 'Camisas', slug: 'camisas' },
                { label: 'Prendedores', slug: 'prendedores' },
              ].map(cat => (
                <li key={cat.slug}>
                  <Link
                    href={`/catalogo?categoria=${cat.slug}`}
                    className="text-sm transition-opacity hover:opacity-60"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3
              className="font-semibold mb-5 text-xs uppercase tracking-[0.2em]"
              style={{ color: 'var(--gold)' }}
            >
              Atendimento
            </h3>
            <p className="text-sm mb-1.5" style={{ color: 'var(--text-muted)' }}>
              Enviamos para todo o Brasil
            </p>
            <p className="text-sm mb-5" style={{ color: 'var(--text-muted)' }}>
              Pedidos via WhatsApp
            </p>
            <a
              href="https://wa.me/5531995463588"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-white text-sm font-semibold px-4 py-2.5 rounded transition-opacity hover:opacity-85"
              style={{ background: '#25D366' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              +55 31 99546-3588
            </a>
          </div>
        </div>

        <div className="border-t mt-10 pt-6 text-center" style={{ borderColor: 'var(--border)' }}>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} Clube da Gravata. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
