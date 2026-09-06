import { useState } from 'react'
import {
  Search,
  Plus,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Info,
  Calendar,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { Dialog } from '@/components/ui/dialog'
import { Drawer } from '@/components/ui/drawer'
import { Tabs, TabsList, TabTrigger, TabPanel } from '@/components/ui/tabs'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'
import { Spinner } from '@/components/ui/spinner'
import { Divider } from '@/components/ui/divider'
import { Avatar } from '@/components/ui/avatar'

export default function DevTokensPage() {
  const [copiedToken, setCopiedToken] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [demoLoading, setDemoLoading] = useState(false)

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
        { name: '--color-accent-text', classBg: 'bg-accent-text', hex: '#0369A1', usage: 'Text links & active text (AA compliant)' },
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
        { name: '--color-text-primary', classBg: 'bg-text-primary', hex: '#0F172A', usage: 'Headings, primary labels (16.2:1)' },
        { name: '--color-text-secondary', classBg: 'bg-text-secondary', hex: '#334155', usage: 'Body copy, descriptions (9.6:1)' },
        { name: '--color-text-muted', classBg: 'bg-text-muted', hex: '#64748B', usage: 'Secondary meta (4.6:1 AA)' },
      ],
    },
    {
      title: 'Semantic Statuses',
      description: 'Each status has an accessible foreground (>= 4.5:1) paired with its tinted background.',
      tokens: [
        { name: '--color-success-bg', classBg: 'bg-success-bg', hex: '#ECFDF5', usage: 'Success badge/banner fill' },
        { name: '--color-success-border', classBg: 'bg-success-border', hex: '#A7F3D0', usage: 'Success border' },
        { name: '--color-success-text', classBg: 'bg-success-text', hex: '#047857', usage: 'Aberto agora, verificado (4.8:1)' },
        { name: '--color-warning-bg', classBg: 'bg-warning-bg', hex: '#FFFBEB', usage: 'Warning badge fill' },
        { name: '--color-warning-border', classBg: 'bg-warning-border', hex: '#FDE68A', usage: 'Warning border' },
        { name: '--color-warning-text', classBg: 'bg-warning-text', hex: '#92400E', usage: 'Aviso, pendente (5.9:1)' },
        { name: '--color-danger-bg', classBg: 'bg-danger-bg', hex: '#FFF1F2', usage: 'Error badge/banner fill' },
        { name: '--color-danger-border', classBg: 'bg-danger-border', hex: '#FECDD3', usage: 'Error border' },
        { name: '--color-danger-text', classBg: 'bg-danger-text', hex: '#BE123C', usage: 'Erro, fechado (5.3:1)' },
        { name: '--color-danger-solid', classBg: 'bg-danger-solid', hex: '#E11D48', usage: 'Botão de exclusão (4.6:1 contra branco)' },
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
      <div className="max-w-5xl mx-auto space-y-16">
        <header className="border-b border-border-hairline pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-accent-text">
                Ambiente de Desenvolvimento
              </span>
              <h1 className="text-3xl font-bold mt-1">Galeria de Design Tokens & UI</h1>
              <p className="text-sm text-text-secondary mt-1">
                Design system, contrastes validados, tipografia e todos os estados de componentes.
              </p>
            </div>
            {copiedToken && (
              <span className="text-xs px-3 py-1.5 rounded-md bg-accent-subtle text-accent-text border border-accent-border font-medium">
                Copiado: {copiedToken}
              </span>
            )}
          </div>
        </header>

        {/* Color tokens */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight">1. Cores & Tokens (@theme)</h2>
          {colorGroups.map((group) => (
            <div key={group.title} className="space-y-3">
              <div>
                <h3 className="text-base font-semibold">{group.title}</h3>
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
                        className={`w-10 h-10 rounded-md border border-border-hairline shrink-0 ${token.classBg}`}
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
            <h2 className="text-2xl font-bold tracking-tight">2. Escala Tipográfica (Inter — Major Third 1.250)</h2>
            <p className="text-sm text-text-secondary mt-1">
              Fonte auto-hospedada via @fontsource/inter, legibilidade garantida sob forte luz solar.
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

        {/* Buttons Gallery */}
        <section className="space-y-6 border-t border-border-hairline pt-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">3. Botões (Button)</h2>
            <p className="text-sm text-text-secondary mt-1">
              Variantes, tamanhos, estados (carregando, desabilitado, foco visível) e botões apenas com ícone tipados com aria-label obrigatório.
            </p>
          </div>

          <div className="space-y-4 bg-bg-surface p-6 rounded-xl border border-border-hairline">
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary">Primário (Accent)</Button>
              <Button variant="secondary">Secundário (Hairline)</Button>
              <Button variant="ghost">Ghost (Neutro)</Button>
              <Button variant="danger">Perigo (Excluir)</Button>
            </div>

            <Divider>Tamanhos & Ícones</Divider>

            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm" leadingIcon={<Plus className="w-3.5 h-3.5" />}>
                Pequeno (sm)
              </Button>
              <Button size="md" leadingIcon={<Plus className="w-4 h-4" />}>
                Médio (md)
              </Button>
              <Button size="lg" trailingIcon={<Sparkles className="w-4 h-4" />}>
                Grande (lg)
              </Button>
            </div>

            <Divider>Estados Interativos & Overflow</Divider>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="primary"
                isLoading={demoLoading}
                onClick={() => {
                  setDemoLoading(true)
                  setTimeout(() => setDemoLoading(false), 2000)
                }}
              >
                {demoLoading ? 'Carregando…' : 'Clique para Carregar'}
              </Button>
              <Button variant="secondary" disabled>
                Desabilitado
              </Button>
              <Button
                variant="secondary"
                leadingIcon={<Search className="w-4 h-4" />}
                aria-label="Buscar estabelecimentos"
              />
              <Button
                variant="danger"
                size="sm"
                leadingIcon={<Trash2 className="w-3.5 h-3.5" />}
                aria-label="Excluir cadastro"
              />
              <div className="max-w-50">
                <Button variant="secondary" className="w-full">
                  Texto extremamente longo que sofre overflow truncado com reticências
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Inputs, Textareas, Selects */}
        <section className="space-y-6 border-t border-border-hairline pt-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">4. Formulários (Input, Textarea, Select)</h2>
            <p className="text-sm text-text-secondary mt-1">
              Campos com rótulo, descrição, e erros associados via aria-describedby e aria-invalid (nunca apenas por cor).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-bg-surface p-6 rounded-xl border border-border-hairline">
            <Input
              label="Nome do Estabelecimento"
              description="Como é conhecido na cidade de Bom Jesus da Lapa."
              placeholder="Ex: Pousada do Santuário"
              required
            />
            <Input
              label="Telefone / WhatsApp"
              description="Com DDD da Bahia."
              placeholder="(77) 99999-0000"
              defaultValue="abc1234"
              error="Informe um telefone válido no formato (77) 99999-0000."
            />
            <Select
              label="Categoria"
              description="Selecione a categoria principal do seu anúncio."
              options={[
                { value: 'hospedagem', label: 'Hospedagem & Hotéis' },
                { value: 'gastronomia', label: 'Gastronomia & Restaurantes' },
                { value: 'servicos', label: 'Serviços & Comércio' },
              ]}
            />
            <Select
              label="Bairro"
              error="Por favor selecione um bairro da Lapa."
              options={[
                { value: '', label: 'Selecione…' },
                { value: 'centro', label: 'Centro' },
                { value: 'parque', label: 'Parque Verde' },
              ]}
            />
            <div className="md:col-span-2">
              <Textarea
                label="Descrição Detalhada"
                description="Informe horários, especialidades culinárias ou comodidades do hotel."
                placeholder="Descreva seu negócio para moradores e peregrinos…"
                rows={3}
              />
            </div>
            <div className="md:col-span-2">
              <Input
                label="Campo Desabilitado"
                description="Este campo não pode ser alterado."
                disabled
                defaultValue="Valor somente leitura ou desabilitado"
              />
            </div>
          </div>
        </section>

        {/* Badges, Cards, Skeleton, EmptyState */}
        <section className="space-y-6 border-t border-border-hairline pt-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">5. Badges, Cards, Skeletons & EmptyState</h2>
            <p className="text-sm text-text-secondary mt-1">
              Superfícies de informação limpas, sem poluição de sombras, e estados vazios com convite à ação.
            </p>
          </div>

          <div className="space-y-6 bg-bg-surface p-6 rounded-xl border border-border-hairline">
            <div>
              <h3 className="text-sm font-semibold text-text-muted uppercase mb-3">Badges de Categoria & Status</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="neutral">Neutro / Geral</Badge>
                <Badge variant="accent" icon={<Sparkles className="w-3 h-3" />}>Destaque da Romaria</Badge>
                <Badge variant="success" icon={<CheckCircle className="w-3 h-3" />}>Aberto Agora</Badge>
                <Badge variant="warning" icon={<AlertTriangle className="w-3 h-3" />}>Fechando em Breve</Badge>
                <Badge variant="danger">Fechado Hoje</Badge>
              </div>
            </div>

            <Divider />

            <div>
              <h3 className="text-sm font-semibold text-text-muted uppercase mb-3">Exemplo de Card & Linha de Lista</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card interactive>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge variant="success">Aberto</Badge>
                      <span className="text-xs text-text-muted font-mono">Desde 1982</span>
                    </div>
                    <CardTitle className="mt-2">Restaurante O Casarão</CardTitle>
                    <CardDescription>Culinária ribanceira e peixes do São Francisco</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-text-secondary">
                      Rua Monsenhor Turíbio, 120 — Centro. Aceita cartões e Pix.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="secondary" size="sm" className="w-full">
                      Ver Detalhes do Restaurante
                    </Button>
                  </CardFooter>
                </Card>

                {/* Skeleton Mock */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-12" />
                    </div>
                    <Skeleton className="h-6 w-3/4 mt-2" />
                    <Skeleton className="h-4 w-1/2 mt-1" />
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-8 w-full" />
                  </CardFooter>
                </Card>
              </div>
            </div>

            <Divider />

            <div>
              <h3 className="text-sm font-semibold text-text-muted uppercase mb-3">EmptyState (Convite à Ação)</h3>
              <EmptyState
                icon={<Info className="w-6 h-6 text-accent-text" />}
                headline="Nenhum hotel encontrado nesta categoria"
                explanation="Tente alterar os filtros de busca ou cadastre uma nova hospedagem na cidade."
                action={
                  <Button variant="primary" leadingIcon={<Plus className="w-4 h-4" />}>
                    Cadastrar Hospedagem
                  </Button>
                }
              />
            </div>
          </div>
        </section>

        {/* Dialog, Drawer, Tabs, Accordion */}
        <section className="space-y-6 border-t border-border-hairline pt-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">6. Diálogos, Drawer, Abas & Acordeões</h2>
            <p className="text-sm text-text-secondary mt-1">
              Controles com captura e restauração de foco acessível, fechamento via ESC e navegação via teclado WAI-ARIA.
            </p>
          </div>

          <div className="space-y-6 bg-bg-surface p-6 rounded-xl border border-border-hairline">
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" onClick={() => setIsDialogOpen(true)}>
                Abrir Diálogo de Demonstração
              </Button>
              <Button variant="secondary" onClick={() => setIsDrawerOpen(true)}>
                Abrir Gaveta Lateral (Drawer)
              </Button>
            </div>

            <Divider>Tabs Acessíveis (WAI-ARIA: Navegação com Setas e Home/End)</Divider>

            <Tabs defaultValue="horarios">
              <TabsList aria-label="Informações do comércio">
                <TabTrigger value="horarios">Horários de Funcionamento</TabTrigger>
                <TabTrigger value="localizacao">Como Chegar</TabTrigger>
                <TabTrigger value="contato">Contato & Reservas</TabTrigger>
              </TabsList>
              <TabPanel value="horarios">
                <p className="text-sm text-text-secondary">
                  Segunda a Sábado: 07:00 às 22:00 • Domingo: 06:00 às 23:00 (durante períodos de romaria).
                </p>
              </TabPanel>
              <TabPanel value="localizacao">
                <p className="text-sm text-text-secondary">
                  A 200m da Esplanada do Santuário do Bom Jesus da Lapa, com estacionamento privativo para vans e ônibus.
                </p>
              </TabPanel>
              <TabPanel value="contato">
                <p className="text-sm text-text-secondary">
                  WhatsApp: (77) 99999-1234 • Atendimento em português.
                </p>
              </TabPanel>
            </Tabs>

            <Divider>Acordeão</Divider>

            <Accordion type="single" defaultValue="faq-1">
              <AccordionItem value="faq-1">
                <AccordionTrigger>Como funcionam as romarias em Bom Jesus da Lapa?</AccordionTrigger>
                <AccordionContent>
                  As principais romarias acontecem entre julho e setembro, com destaque para a Romaria da Terra e das Águas e a Romaria do Bom Jesus. A cidade recebe centenas de milhares de romeiros.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="faq-2">
                <AccordionTrigger>Como solicitar a inclusão de um estabelecimento?</AccordionTrigger>
                <AccordionContent>
                  Basta acessar o link &quot;Solicitar cadastro&quot; no menu principal. O cadastro é gratuito e revisado pela curadoria local.
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Divider>Spinner, Avatares & Divisores</Divider>

            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-3">
                <Spinner size="sm" />
                <Spinner size="md" />
                <Spinner size="lg" />
              </div>
              <div className="flex items-center gap-3">
                <Avatar alt="Restaurante O Casarão" size="sm" />
                <Avatar alt="Pousada Morro do Chapéu" fallback="PMC" size="md" />
                <Avatar alt="Padre Lucas" size="lg" />
              </div>
            </div>
          </div>
        </section>

        {/* Dialog Instance */}
        <Dialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          title="Confirmar Ação"
          description="Este é um diálogo modal nativo e acessível com foco retido."
        >
          <div className="space-y-4">
            <p className="text-sm text-text-secondary">
              Pressione a tecla <strong>ESC</strong> ou clique fora para fechar. Ao fechar, o foco retorna automaticamente para o botão que o acionou.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button variant="primary" onClick={() => setIsDialogOpen(false)}>
                Confirmar
              </Button>
            </div>
          </div>
        </Dialog>

        {/* Drawer Instance */}
        <Drawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          title="Painel Lateral de Teste"
          description="Gaveta deslizante para mobile ou filtros."
        >
          <div className="space-y-4">
            <p className="text-sm text-text-secondary">
              Este drawer desliza da esquerda, bloqueia o scroll da página enquanto aberto e devolve o foco no fechamento.
            </p>
            <div className="space-y-2">
              <Button variant="secondary" size="sm" className="w-full" leadingIcon={<Calendar className="w-4 h-4" />}>
                Agendar Visita
              </Button>
              <Button variant="primary" size="sm" className="w-full" onClick={() => setIsDrawerOpen(false)}>
                Fechar Gaveta
              </Button>
            </div>
          </div>
        </Drawer>
      </div>
    </div>
  )
}
