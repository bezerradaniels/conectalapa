import { useState } from 'react'

export default function DevTokensPage() {
  const [copiedToken, setCopiedToken] = useState<string | null>(null)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedToken(text)
    setTimeout(() => setCopiedToken(null), 1500)
  }

  const colorGroups = [
    {
      title: 'Accent (Sky)',
      description: 'Used for active indicators, fills, and interactive borders. Sky-400 is not for body text.',
      tokens: [
        { name: '--color-accent', classBg: 'bg-accent', hex: '#38BDF8', usage: 'Fills, active pill indicators, borders' },
        { name: '--color-accent-hover', classBg: 'bg-accent-hover', hex: '#0284C7', usage: 'Hover state for accent controls' },
        { name: '--color-accent-text', classBg: 'bg-accent-text', hex: '#0369A1', usage: 'Text links & active text (AA compliant)', textColor: 'text-white' },
        { name: '--color-accent-subtle', classBg: 'bg-accent-subtle', hex: '#F0F9FF', usage: 'Active row/item background tint' },
        { name: '--color-accent-border', classBg: 'bg-accent-border', hex: '#BAE6FD', usage: 'Borders on active elements' },
      ],
    },
    {
      title: 'Neutrals (Slate)',
      description: 'Hairline borders and high-contrast surfaces engineered for bright sunlight.',
      tokens: [
        { name: '--color-bg-page', classBg: 'bg-bg-page', hex: '#F8FAFC', usage: 'Application background' },
        { name: '--color-bg-surface', classBg: 'bg-bg-surface', hex: '#FFFFFF', usage: 'Card and container surface' },
        { name: '--color-bg-subtle', classBg: 'bg-bg-subtle', hex: '#F1F5F9', usage: 'Input & badge backgrounds' },
        { name: '--color-bg-muted', classBg: 'bg-bg-muted', hex: '#E2E8F0', usage: 'Disabled controls, skeletons' },
        { name: '--color-border-hairline', classBg: 'bg-border-hairline', hex: '#E2E8F0', usage: '1px dividers and borders' },
        { name: '--color-border-subtle', classBg: 'bg-border-subtle', hex: '#CBD5E1', usage: 'Input borders and card hover' },
        { name: '--color-text-primary', classBg: 'bg-text-primary', hex: '#0F172A', usage: 'Headings, primary labels (16.2:1)', textColor: 'text-white' },
        { name: '--color-text-secondary', classBg: 'bg-text-secondary', hex: '#334155', usage: 'Body copy, descriptions (9.6:1)', textColor: 'text-white' },
        { name: '--color-text-muted', classBg: 'bg-text-muted', hex: '#64748B', usage: 'Secondary meta (4.6:1 AA)', textColor: 'text-white' },
      ],
    },
    {
      title: 'Semantic Statuses',
      description: 'Each status has an accessible foreground (>= 4.5:1) paired with its tinted background.',
      tokens: [
        { name: '--color-success-bg', classBg: 'bg-success-bg', hex: '#ECFDF5', usage: 'Success badge/banner fill' },
        { name: '--color-success-border', classBg: 'bg-success-border', hex: '#A7F3D0', usage: 'Success border' },
        { name: '--color-success-text', classBg: 'bg-success-text', hex: '#047857', usage: 'Aberto agora, verificado (4.8:1)', textColor: 'text-white' },
        { name: '--color-warning-bg', classBg: 'bg-warning-bg', hex: '#FFFBEB', usage: 'Warning badge fill' },
        { name: '--color-warning-border', classBg: 'bg-warning-border', hex: '#FDE68A', usage: 'Warning border' },
        { name: '--color-warning-text', classBg: 'bg-warning-text', hex: '#92400E', usage: 'Aviso, pendente (5.9:1)', textColor: 'text-white' },
        { name: '--color-danger-bg', classBg: 'bg-danger-bg', hex: '#FFF1F2', usage: 'Error badge/banner fill' },
        { name: '--color-danger-border', classBg: 'bg-danger-border', hex: '#FECDD3', usage: 'Error border' },
        { name: '--color-danger-text', classBg: 'bg-danger-text', hex: '#BE123C', usage: 'Erro, fechado (5.3:1)', textColor: 'text-white' },
        { name: '--color-danger-solid', classBg: 'bg-danger-solid', hex: '#E11D48', usage: 'Botão de exclusão (4.6:1 contra branco)', textColor: 'text-white' },
      ],
    },
  ]

  const typeScale = [
    { label: '3xl (2.441rem / 39px)', cls: 'text-3xl font-bold', sample: 'ConectaLapa — Cidade & Romaria', role: 'Hero display heading' },
    { label: '2xl (1.953rem / 31px)', cls: 'text-2xl font-bold', sample: 'Gastronomia em Bom Jesus da Lapa', role: 'PageHeader title (h1)' },
    { label: 'xl (1.5625rem / 25px)', cls: 'text-xl font-semibold', sample: 'Restaurantes Tradicionais e Culinária Ribanceira', role: 'Section headers' },
    { label: 'lg (1.25rem / 20px)', cls: 'text-lg font-semibold', sample: 'Restaurante O Casarão do Santuário', role: 'Card titles, dialog headings' },
    { label: 'base (1.0rem / 16px)', cls: 'text-base font-normal', sample: 'Especializado em moquecas e peixes do Rio São Francisco com atendimento receptivo.', role: 'Body copy, form inputs, primary list text' },
    { label: 'sm (0.875rem / 14px)', cls: 'text-sm font-normal', sample: 'Rua Monsenhor Turíbio de Vila Nova, 120 — Centro • (77) 3481-2000', role: 'Secondary metadata, helper labels, table text' },
    { label: 'xs (0.75rem / 12px)', cls: 'text-xs font-medium', sample: 'ABERTO AGORA • CATEGORIA • ATUALIZADO HOJE', role: 'Badges, tags, micro-labels' },
  ]

  return (
    <div className="min-h-screen bg-bg-page p-6 md:p-12 text-text-primary">
      <div className="max-w-5xl mx-auto space-y-12">
        <header className="border-b border-border-hairline pb-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-accent-text">
                Ambiente de Desenvolvimento
              </span>
              <h1 className="text-3xl font-bold mt-1">Galeria de Design Tokens & UI</h1>
              <p className="text-sm text-text-secondary mt-1">
                Visualização de tokens de cores, contraste, escala tipográfica Major Third (1.250) e primitivas de UI.
              </p>
            </div>
            {copiedToken && (
              <span className="text-xs px-3 py-1.5 rounded-md bg-accent-subtle text-accent-text border border-accent-border font-medium animate-fade-in">
                Copiado: {copiedToken}
              </span>
            )}
          </div>
        </header>

        {/* Color tokens */}
        <section className="space-y-8">
          <h2 className="text-2xl font-bold tracking-tight">Cores & Tokens (@theme)</h2>
          {colorGroups.map((group) => (
            <div key={group.title} className="space-y-3">
              <div>
                <h3 className="text-lg font-semibold">{group.title}</h3>
                <p className="text-xs text-text-muted">{group.description}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {group.tokens.map((token) => (
                  <button
                    key={token.name}
                    type="button"
                    onClick={() => copyToClipboard(token.name)}
                    className="flex flex-col p-3 rounded-lg border border-border-hairline bg-bg-surface text-left transition-colors hover:border-border-subtle focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-10 h-10 rounded-md border border-border-hairline shadow-none shrink-0 ${token.classBg}`}
                      />
                      <div className="min-w-0">
                        <div className="text-sm font-medium truncate">{token.name}</div>
                        <div className="text-xs text-text-muted font-mono">{token.hex}</div>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-text-secondary">{token.usage}</div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Typography */}
        <section className="space-y-6 border-t border-border-hairline pt-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Escala Tipográfica (Inter — Major Third 1.250)</h2>
            <p className="text-sm text-text-secondary mt-1">
              Fonte auto-hospedada via @fontsource/inter, otimizada para leitura sob luz solar forte e conexões móveis.
            </p>
          </div>

          <div className="space-y-6 bg-bg-surface p-6 rounded-xl border border-border-hairline">
            {typeScale.map((t) => (
              <div key={t.label} className="border-b border-border-hairline pb-4 last:border-0 last:pb-0">
                <div className="flex items-center justify-between text-xs text-text-muted mb-1 font-mono">
                  <span>{t.label}</span>
                  <span className="font-sans text-xs bg-bg-subtle px-2 py-0.5 rounded text-text-secondary">{t.role}</span>
                </div>
                <div className={`${t.cls} text-text-primary`}>{t.sample}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Placeholder for Primitive Gallery (extended in 2.2) */}
        <section id="ui-gallery" className="border-t border-border-hairline pt-8 space-y-4">
          <h2 className="text-2xl font-bold tracking-tight">Galeria de Primitivas UI</h2>
          <p className="text-sm text-text-muted">
            Será alimentada no passo 2.2 com todos os estados (hover, focus, disabled, loading, error).
          </p>
        </section>
      </div>
    </div>
  )
}
