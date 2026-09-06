import { createClient } from '@supabase/supabase-js'
import type { Database } from '../src/types/database'

const SUPABASE_URL = 'https://vydymabffpgfrigkbtax.supabase.co'
// Service role key used ONLY in this administrative seed script
const SERVICE_ROLE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5ZHltYWJmZnBnZnJpZ2tidGF4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODYyNzgyOCwiZXhwIjoyMTA0MjAzODI4fQ.gn9SPwuDbigZPNTaW7QOprSdj4cLFg2juqR89WjSgEA'

const supabase = createClient<Database>(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
})

async function seed() {
  console.log('--- SEEDING REALISTIC BOM JESUS DA LAPA DATA ---')

  // 1. Categories
  console.log('Seeding categories...')
  const categoriesData = [
    // Business
    { name: 'Saúde e Odontologia', slug: 'saude-e-odontologia', domain: 'business', icon: 'stethoscope' },
    { name: 'Oficinas e Autopeças', slug: 'oficinas-e-autopecas', domain: 'business', icon: 'wrench' },
    { name: 'Vestuário e Calçados', slug: 'vestuario-e-calcados', domain: 'business', icon: 'shirt' },
    { name: 'Serviços Profissionais', slug: 'servicos-profissionais', domain: 'business', icon: 'briefcase' },
    { name: 'Artigos Religiosos e Lembranças', slug: 'artigos-religiosos', domain: 'business', icon: 'cross' },
    // Events
    { name: 'Romaria e Religioso', slug: 'romaria-e-religioso', domain: 'event', icon: 'church' },
    { name: 'Festivais e Shows', slug: 'festivais-e-shows', domain: 'event', icon: 'music' },
    { name: 'Cultural e Gastronômico', slug: 'cultural-e-gastronomico', domain: 'event', icon: 'utensils' },
    // Packages
    { name: 'Litoral Baiano', slug: 'litoral-baiano', domain: 'package', icon: 'palmtree' },
    { name: 'Ecoturismo e Chapada', slug: 'ecoturismo-e-chapada', domain: 'package', icon: 'mountain' },
    { name: 'Termas e Lazer', slug: 'termas-e-lazer', domain: 'package', icon: 'waves' },
    // Lodging
    { name: 'Hotéis', slug: 'hoteis', domain: 'lodging', icon: 'hotel' },
    { name: 'Pousadas', slug: 'pousadas', domain: 'lodging', icon: 'bed' },
    { name: 'Casas de Temporada', slug: 'casas-de-temporada', domain: 'lodging', icon: 'home' },
    // Dining
    { name: 'Churrascarias', slug: 'churrascarias', domain: 'dining', icon: 'flame' },
    { name: 'Peixarias e Frutos do Rio', slug: 'peixarias', domain: 'dining', icon: 'fish' },
    { name: 'Pizzarias e Lanchonetes', slug: 'pizzarias-e-lanchonetes', domain: 'dining', icon: 'pizza' },
    { name: 'Cafés e Docerias', slug: 'cafes-e-docerias', domain: 'dining', icon: 'coffee' },
  ]

  const { data: insertedCategories, error: catError } = await supabase
    .from('categories')
    .upsert(categoriesData, { onConflict: 'slug' })
    .select()

  if (catError) throw catError
  console.log(`✓ Inserted ${insertedCategories?.length} categories.`)

  const catMap = new Map(insertedCategories?.map((c) => [c.slug, c.id]))

  // 2. Amenities
  console.log('Seeding amenities...')
  const amenitiesData = [
    { name: 'Wi-Fi Gratuito', slug: 'wifi-gratuito' },
    { name: 'Ar-condicionado', slug: 'ar-condicionado' },
    { name: 'Estacionamento Próprio', slug: 'estacionamento' },
    { name: 'Aceita Cartão', slug: 'aceita-cartao' },
    { name: 'Acessibilidade / Rampa', slug: 'acessibilidade' },
    { name: 'Café da Manhã Incluso', slug: 'cafe-da-manha', domain: 'lodging' },
    { name: 'Piscina', slug: 'piscina', domain: 'lodging' },
    { name: 'Vista para o Rio', slug: 'vista-para-o-rio' },
    { name: 'Área VIP / Camarote', slug: 'area-vip', domain: 'event' },
    { name: 'Open Bar', slug: 'open-bar', domain: 'event' },
    { name: 'Espaço Kids', slug: 'espaco-kids' },
    { name: 'Música ao Vivo', slug: 'musica-ao-vivo', domain: 'dining' },
  ]

  const { data: insertedAmenities, error: amenError } = await supabase
    .from('amenities')
    .upsert(amenitiesData, { onConflict: 'slug,domain' })
    .select()

  if (amenError) throw amenError
  console.log(`✓ Inserted ${insertedAmenities?.length} amenities.`)
  const amenMap = new Map(insertedAmenities?.map((a) => [a.slug, a.id]))

  // 3. Businesses (12 entries with edge cases)
  console.log('Seeding businesses...')
  const businessesData = [
    {
      name: 'Líder Turismo e Fretamentos',
      slug: 'lider-turismo',
      status: 'published',
      logo_url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=200&h=200&fit=crop',
      category_id: catMap.get('servicos-profissionais'),
      address: 'Av. Manoel Novaes, 840 - Centro, Bom Jesus da Lapa - BA',
      whatsapp: '77999881122',
      instagram: '@liderturismolapa',
      description: 'Agência especializada em viagens rodoviárias para todo o Brasil, translados para romeiros e excursões turísticas saindo da Lapa.',
      services: ['Passagens Rodoviárias', 'Excursões', 'Translados para o Santuário'],
      opening_hours: [
        { day: 1, open: '08:00', close: '18:00', closed: false },
        { day: 2, open: '08:00', close: '18:00', closed: false },
        { day: 3, open: '08:00', close: '18:00', closed: false },
        { day: 4, open: '08:00', close: '18:00', closed: false },
        { day: 5, open: '08:00', close: '18:00', closed: false },
        { day: 6, open: '08:00', close: '12:00', closed: false },
        { day: 0, open: '', close: '', closed: true },
      ],
      additional_links: [{ label: 'Site Oficial', url: 'https://liderturismolapa.com.br' }],
    },
    // EDGE CASE 1: Very long name
    {
      name: 'Associação Comercial, Industrial, Agropecuária e de Serviços do Vale do São Francisco e Região da Lapa — ACISLAPA',
      slug: 'acislapa-associacao-comercial',
      status: 'published',
      logo_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&h=200&fit=crop',
      category_id: catMap.get('servicos-profissionais'),
      address: 'Rua Barão do Rio Branco, 142 - Centro, Bom Jesus da Lapa - BA',
      whatsapp: '77998123456',
      instagram: '@acislapalapa',
      description: 'Entidade de representação do empresariado lapense, promovendo o desenvolvimento econômico, cursos de capacitação e fortalecimento do comércio local.',
      services: ['Consultoria Jurídica', 'Certificado Digital', 'Auditório para Eventos'],
      opening_hours: [{ day: 1, open: '08:00', close: '17:00', closed: false }],
      additional_links: [],
    },
    // EDGE CASE 2: No logo (null)
    {
      name: 'Oficina Mecânica Irmãos Souza',
      slug: 'mecanica-irmaos-souza',
      status: 'published',
      logo_url: null,
      category_id: catMap.get('oficinas-e-autopecas'),
      address: 'Rodovia BA-160, Km 2 - São Gotardo, Bom Jesus da Lapa - BA',
      whatsapp: '77988334455',
      instagram: null,
      description: 'Manutenção preventiva, injeção eletrônica, freios e suspensão para veículos leves e utilitários.',
      services: ['Troca de Óleo', 'Alinhamento e Balanceamento', 'Socorro 24h'],
      opening_hours: [{ day: 1, open: '07:30', close: '18:00', closed: false }],
      additional_links: [],
    },
    // EDGE CASE 3: Empty gallery (will have no gallery rows)
    {
      name: 'Drogaria do Santuário',
      slug: 'drogaria-do-santuario',
      status: 'published',
      logo_url: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?w=200&h=200&fit=crop',
      category_id: catMap.get('saude-e-odontologia'),
      address: 'Praça Monsenhor Turíbio Vilanova, 45 - Centro, Bom Jesus da Lapa - BA',
      whatsapp: '77991223344',
      instagram: '@drogariadosantuario',
      description: 'Medicamentos com descontos especiais, perfumaria e atendimento farmacêutico 7 dias por semana.',
      services: ['Aferição de Pressão', 'Teste de Glicemia', 'Entrega em Domicílio'],
      opening_hours: [{ day: 1, open: '07:00', close: '22:00', closed: false }],
      additional_links: [],
    },
    {
      name: 'Clínica Odontológica Sorriso da Lapa',
      slug: 'clinica-sorriso-da-lapa',
      status: 'published',
      logo_url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=200&h=200&fit=crop',
      category_id: catMap.get('saude-e-odontologia'),
      address: 'Av. Santa Catarina, 310 - Amaralina, Bom Jesus da Lapa - BA',
      whatsapp: '77999445566',
      instagram: '@sorrisodalapa',
      description: 'Tratamentos ortodônticos, implantes dentários, clareamento a laser e odontopediatria.',
      services: ['Implantes', 'Ortodontia', 'Clareamento Dental'],
      opening_hours: [{ day: 1, open: '08:00', close: '18:00', closed: false }],
      additional_links: [],
    },
    {
      name: 'Livraria e Artigos Religiosos Bom Pastor',
      slug: 'livraria-bom-pastor',
      status: 'published',
      logo_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=200&fit=crop',
      category_id: catMap.get('artigos-religiosos'),
      address: 'Esplanada do Santuário, Loja 12 - Centro, Bom Jesus da Lapa - BA',
      whatsapp: '77998887766',
      instagram: '@bompastorreligiosos',
      description: 'Terços, imagens sacras, medalhas do Bom Jesus e de Nossa Senhora da Soledade, fitas e livros católicos.',
      services: ['Venda no Varejo', 'Lembranças Personalizadas'],
      opening_hours: [{ day: 0, open: '06:00', close: '20:00', closed: false }],
      additional_links: [],
    },
    {
      name: 'Auto Elétrica São Geraldo',
      slug: 'auto-eletrica-sao-geraldo',
      status: 'published',
      logo_url: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=200&h=200&fit=crop',
      category_id: catMap.get('oficinas-e-autopecas'),
      address: 'Av. Agenor Magalhães, 512 - Parque Verde, Bom Jesus da Lapa - BA',
      whatsapp: '77981112233',
      instagram: null,
      description: 'Baterias, alternadores, motores de partida, travas elétricas e instalação de som automotivo.',
      services: ['Carga de Bateria', 'Instalação de Ar Condicionado Automotivo'],
      opening_hours: [{ day: 1, open: '07:30', close: '18:00', closed: false }],
      additional_links: [],
    },
    {
      name: 'Moda Lapa Boutique',
      slug: 'moda-lapa-boutique',
      status: 'published',
      logo_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=200&fit=crop',
      category_id: catMap.get('vestuario-e-calcados'),
      address: 'Rua Floriano Peixoto, 88 - Centro, Bom Jesus da Lapa - BA',
      whatsapp: '77991334488',
      instagram: '@modalapaboutique',
      description: 'Moda feminina e masculina, roupas leves e confortáveis ideais para o clima do semiárido baiano.',
      services: ['Moda Casual', 'Acessórios e Bolsas'],
      opening_hours: [{ day: 1, open: '08:30', close: '18:30', closed: false }],
      additional_links: [],
    },
    {
      name: 'Contabilidade Velho Chico',
      slug: 'contabilidade-velho-chico',
      status: 'published',
      logo_url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=200&h=200&fit=crop',
      category_id: catMap.get('servicos-profissionais'),
      address: 'Av. Duque de Caxias, 220, Sala 04 - Centro, Bom Jesus da Lapa - BA',
      whatsapp: '77998765432',
      instagram: '@contabilidadevelhochico',
      description: 'Abertura de empresas, assessoria contábil para o MEI, produtores rurais e empresas do comércio e serviços.',
      services: ['Abertura de Empresas', 'Imposto de Renda', 'Assessoria Fiscal'],
      opening_hours: [{ day: 1, open: '08:00', close: '17:30', closed: false }],
      additional_links: [],
    },
    {
      name: 'Ótica e Relojoaria Visão da Fé',
      slug: 'otica-visao-da-fe',
      status: 'published',
      logo_url: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=200&h=200&fit=crop',
      category_id: catMap.get('vestuario-e-calcados'),
      address: 'Praça Marechal Deodoro da Fonseca, 90 - Centro, Bom Jesus da Lapa - BA',
      whatsapp: '77999551133',
      instagram: '@oticavisaodafe',
      description: 'Exames de vista computadorizados, armações nacionais e importadas, óculos solares e conserto de relógios.',
      services: ['Exame de Refração', 'Montagem Rápida em 1 Hora'],
      opening_hours: [{ day: 1, open: '08:00', close: '18:00', closed: false }],
      additional_links: [],
    },
    {
      name: 'Supermercado Rio Branco',
      slug: 'supermercado-rio-branco',
      status: 'published',
      logo_url: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=200&h=200&fit=crop',
      category_id: catMap.get('servicos-profissionais'),
      address: 'Rua Rio Branco, 400 - Maravilha, Bom Jesus da Lapa - BA',
      whatsapp: '77988119900',
      instagram: '@superriobranco',
      description: 'Padaria completa, açougue com carnes selecionadas, hortifruti fresco direto dos produtores do Projeto Formoso.',
      services: ['Entrega em Domicílio', 'Padaria Própria', 'Açougue'],
      opening_hours: [{ day: 1, open: '07:00', close: '20:00', closed: false }],
      additional_links: [],
    },
    {
      name: 'Academia Corpo e Saúde',
      slug: 'academia-corpo-e-saude',
      status: 'published',
      logo_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop',
      category_id: catMap.get('saude-e-odontologia'),
      address: 'Av. Dr. Nelson Viana, 180 - João Paulo II, Bom Jesus da Lapa - BA',
      whatsapp: '77999002211',
      instagram: '@corposaudelapa',
      description: 'Musculação, treinamento funcional, spinning e acompanhamento com nutricionista e personal trainer.',
      services: ['Musculação', 'Spinning', 'Cross Training'],
      opening_hours: [{ day: 1, open: '06:00', close: '22:00', closed: false }],
      additional_links: [],
    },
  ]

  const { data: insertedBusinesses, error: bizError } = await supabase
    .from('businesses')
    .upsert(businessesData, { onConflict: 'slug' })
    .select()

  if (bizError) throw bizError
  console.log(`✓ Inserted ${insertedBusinesses?.length} businesses.`)

  const bizMap = new Map(insertedBusinesses?.map((b) => [b.slug, b.id]))

  // 4. Events (8 entries with edge cases)
  console.log('Seeding events...')
  const now = new Date()
  const pastDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()
  const ongoingStart = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString()
  const ongoingEnd = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString()
  const future1 = new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000).toISOString()
  const future2 = new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000).toISOString()
  const future3 = new Date(now.getTime() + 70 * 24 * 60 * 60 * 1000).toISOString()
  const future4 = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000).toISOString()

  const eventsData = [
    // Free event (ticket_price: null, explicit description)
    {
      name: 'Romaria do Bom Jesus da Lapa 2026',
      slug: 'romaria-bom-jesus-da-lapa-2026',
      status: 'published',
      whatsapp: '77999880011',
      instagram: '@santuariodalapaoficial',
      promotional_image_url: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=1080&h=1080&fit=crop',
      image_aspect_ratio: '1:1',
      ticket_price: null,
      ticket_price_description: 'Entrada Gratuita',
      start_datetime: ongoingStart,
      end_datetime: ongoingEnd,
      address: 'Praça Monsenhor Turíbio Vilanova, S/N - Centro, Bom Jesus da Lapa - BA',
      // EDGE CASE: Two-line venue name
      venue_name: 'Santuário do Bom Jesus da Lapa e de Nossa Senhora da Soledade — Esplanada das Romarias',
      description: 'A terceira maior romaria do Brasil, reunindo mais de 2 milhões de romeiros e visitantes em momentos de profunda fé e celebração cultural.',
      restrictions: ['Proibida a entrada de coolers', 'Proibido som automotivo na Esplanada'],
      category_id: catMap.get('romaria-e-religioso'),
    },
    // Unannounced price event
    {
      name: 'Lapa Sunset Festival 2026',
      slug: 'lapa-sunset-festival-2026',
      status: 'published',
      whatsapp: '77991887766',
      instagram: '@lapasunset',
      promotional_image_url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1080&h=1350&fit=crop',
      image_aspect_ratio: '4:5',
      ticket_price: null,
      ticket_price_description: 'Preço a confirmar (Vendas em Breve)',
      start_datetime: future1,
      end_datetime: null,
      address: 'Orla do Rio São Francisco - Barranceira, Bom Jesus da Lapa - BA',
      venue_name: 'Espaço Maravilha Náutico Club',
      description: 'O maior festival de música pop e eletrônica à beira do Velho Chico com atrações regionais e nacionais.',
      restrictions: ['Classificação indicativa: 18 anos', 'Obrigatório apresentação de documento com foto'],
      category_id: catMap.get('festivais-e-shows'),
    },
    // Paid event
    {
      name: 'Micareta da Lapa — Carnalapa 2026',
      slug: 'carnalapa-2026',
      status: 'published',
      whatsapp: '77998991122',
      instagram: '@carnalapaoficial',
      promotional_image_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1080&h=1080&fit=crop',
      image_aspect_ratio: '1:1',
      ticket_price: 180.0,
      ticket_price_description: 'Abadá 1º Lote (Pista)',
      start_datetime: future2,
      end_datetime: null,
      address: 'Circuito Central - Av. Manoel Novaes, Bom Jesus da Lapa - BA',
      venue_name: 'Circuito Cultural Manoel Novaes',
      description: 'Três dias de trio elétrico com os maiores nomes do axé e do pagode baiano animando a maior micareta do oeste.',
      restrictions: ['Entrada somente com abadá oficial do bloco'],
      category_id: catMap.get('festivais-e-shows'),
    },
    // Past event
    {
      name: 'Festa da Soledade 2025',
      slug: 'festa-da-soledade-2025',
      status: 'published',
      whatsapp: '77999880011',
      instagram: '@santuariodalapaoficial',
      promotional_image_url: 'https://images.unsplash.com/photo-1519750157634-b6d493a0f77c?w=1080&h=1080&fit=crop',
      image_aspect_ratio: '1:1',
      ticket_price: null,
      ticket_price_description: 'Entrada Franca',
      start_datetime: pastDate,
      end_datetime: pastDate,
      address: 'Morro da Lapa, Bom Jesus da Lapa - BA',
      venue_name: 'Gruta da Soledade',
      description: 'Tradicional novena e procissão solene em honra a Nossa Senhora da Soledade.',
      restrictions: [],
      category_id: catMap.get('romaria-e-religioso'),
    },
    {
      name: 'Festival Gastronômico da Tilápia e Sabores do Chico',
      slug: 'festival-da-tilapia-2026',
      status: 'published',
      whatsapp: '77999112233',
      instagram: '@saboresdochicolapa',
      promotional_image_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1080&h=1080&fit=crop',
      image_aspect_ratio: '1:1',
      ticket_price: null,
      ticket_price_description: 'Acesso Livre aos Estandes',
      start_datetime: future3,
      end_datetime: null,
      address: 'Praça Marechal Deodoro, Bom Jesus da Lapa - BA',
      venue_name: 'Vila Gastronômica da Praça',
      description: 'Apresentação de pratos exclusivos criados pelos principais chefs da cidade tendo peixes do Rio São Francisco como protagonistas.',
      restrictions: [],
      category_id: catMap.get('cultural-e-gastronomico'),
    },
    {
      name: 'Encontro de Motoqueiros e Mototriciclos do Velho Chico',
      slug: 'moto-encontro-velho-chico-2026',
      status: 'published',
      whatsapp: '77998332211',
      instagram: '@motolapaba',
      promotional_image_url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=1080&h=1350&fit=crop',
      image_aspect_ratio: '4:5',
      ticket_price: 50.0,
      ticket_price_description: 'Inscrição + Camiseta Oficial',
      start_datetime: future4,
      end_datetime: null,
      address: 'Parque de Exposições da Lapa, Bom Jesus da Lapa - BA',
      venue_name: 'Pavilhão Central de Exposições',
      description: 'Show de rock, exibição de motos customizadas e passeio guiado pela ponte Gercino Coelho.',
      restrictions: ['Proibido manobras perigosas na área do camping'],
      category_id: catMap.get('festivais-e-shows'),
    },
    {
      name: 'Cavalgada da Fé e Tradição Lapense',
      slug: 'cavalgada-da-fe-2026',
      status: 'published',
      whatsapp: '77999443322',
      instagram: '@cavalgadadafelapa',
      promotional_image_url: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=1080&h=1080&fit=crop',
      image_aspect_ratio: '1:1',
      ticket_price: 30.0,
      ticket_price_description: 'Almoço Tropeiro Incluso',
      start_datetime: future1,
      end_datetime: null,
      address: 'Concentração no Bairro Maravilha, Bom Jesus da Lapa - BA',
      venue_name: 'Rancho do Vaqueiro',
      description: 'Concentração com missa dos vaqueiros, percurso pela zona rural e encerramento com forró pé de serra.',
      restrictions: ['Cuidado e respeito aos animais fiscalizado'],
      category_id: catMap.get('cultural-e-gastronomico'),
    },
    {
      name: 'Virada Cultural Universitária da Lapa',
      slug: 'virada-cultural-universitaria-2026',
      status: 'published',
      whatsapp: '77991998877',
      instagram: '@viradaculturallapa',
      promotional_image_url: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1080&h=1080&fit=crop',
      image_aspect_ratio: '1:1',
      ticket_price: null,
      ticket_price_description: 'Gratuito',
      start_datetime: future3,
      end_datetime: null,
      address: 'Campus da UFOB - Bom Jesus da Lapa - BA',
      venue_name: 'Anfiteatro Universitário',
      description: '24 horas de teatro, dança, exibição de curtas-metragens e debates acadêmicos.',
      restrictions: [],
      category_id: catMap.get('cultural-e-gastronomico'),
    },
  ]

  const { data: insertedEvents, error: evError } = await supabase
    .from('events')
    .upsert(eventsData, { onConflict: 'slug' })
    .select()

  if (evError) throw evError
  console.log(`✓ Inserted ${insertedEvents?.length} events.`)

  // 5. Packages (6 entries departing from Bom Jesus da Lapa)
  console.log('Seeding packages...')
  const liderId = bizMap.get('lider-turismo')

  const packagesData = [
    {
      destination: 'Porto Seguro e Arraial d’Ajuda',
      slug: 'porto-seguro-arraial-d-ajuda',
      status: 'published',
      departure_location: 'Bom Jesus da Lapa (Em frente à Agência Líder)',
      departure_date: '2026-10-10',
      return_date: '2026-10-15',
      agency_id: liderId,
      agency_name: 'Líder Turismo',
      agency_whatsapp: '77999881122',
      information: 'Viagem em ônibus leito total com serviço de bordo, hospedagem em hotel com piscina próximo à Passarela do Descobrimento e passeios às praias de Trancoso e Pitinga.',
      price: 1350.0,
      image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=500&fit=crop',
      category_id: catMap.get('litoral-baiano'),
    },
    {
      destination: 'Salvador Histórico e Pelourinho',
      slug: 'salvador-historico-e-pelourinho',
      status: 'published',
      departure_location: 'Terminal Rodoviário de Bom Jesus da Lapa',
      departure_date: '2026-11-05',
      return_date: '2026-11-09',
      agency_id: liderId,
      agency_name: 'Líder Turismo',
      agency_whatsapp: '77999881122',
      information: 'Roteiro cultural visitando a Igreja do Bonfim, Farol da Barra, Mercado Modelo e Pelourinho, com guia credenciado pela Embratur.',
      price: 890.0,
      image_url: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=800&h=500&fit=crop',
      category_id: catMap.get('litoral-baiano'),
    },
    {
      destination: 'Morro de São Paulo — Paraíso Tropical',
      slug: 'morro-de-sao-paulo-paraiso-tropical',
      status: 'published',
      departure_location: 'Bom Jesus da Lapa',
      departure_date: '2026-11-20',
      return_date: '2026-11-25',
      agency_id: liderId,
      agency_name: 'Líder Turismo',
      agency_whatsapp: '77999881122',
      information: 'Translado até Valença e travessia rápida de catamarã. Hospedagem na Segunda Praia com café da manhã incluso.',
      price: 1580.0,
      image_url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&h=500&fit=crop',
      category_id: catMap.get('litoral-baiano'),
    },
    {
      destination: 'Chapada Diamantina (Lençóis e Grutas)',
      slug: 'chapada-diamantina-lencois-e-grutas',
      status: 'published',
      departure_location: 'Praça Marechal Deodoro - Bom Jesus da Lapa',
      departure_date: '2026-12-02',
      return_date: '2026-12-06',
      agency_id: liderId,
      agency_name: 'Líder Turismo',
      agency_whatsapp: '77999881122',
      information: 'Passeios ao Morro do Pai Inácio, Poço Azul, Poço do Diabo e Gruta da Pratinha com condutores ambientais autorizados.',
      price: 1420.0,
      image_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=500&fit=crop',
      category_id: catMap.get('ecoturismo-e-chapada'),
    },
    {
      destination: 'Caldas Novas e Rio Quente — Águas Termais',
      slug: 'caldas-novas-aguas-termais',
      status: 'published',
      departure_location: 'Bom Jesus da Lapa',
      departure_date: '2026-12-15',
      return_date: '2026-12-20',
      agency_id: null,
      agency_name: 'Excursões da Serra',
      agency_whatsapp: '77988776655',
      information: 'Hospedagem em resort com parque aquático privativo 24h, café da manhã e jantar inclusos, além de transporte climatizado.',
      price: 1850.0,
      image_url: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&h=500&fit=crop',
      category_id: catMap.get('termas-e-lazer'),
    },
    {
      destination: 'Maceió e Maragogi — Galés Alagoanas',
      slug: 'maceio-maragogi-gales',
      status: 'published',
      departure_location: 'Bom Jesus da Lapa',
      departure_date: '2027-01-08',
      return_date: '2027-01-14',
      agency_id: liderId,
      agency_name: 'Líder Turismo',
      agency_whatsapp: '77999881122',
      information: '6 noites em Maceió com passeio de lancha pelas piscinas naturais de Maragogi e visita à Praia do Francês.',
      price: 2190.0,
      image_url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&h=500&fit=crop',
      category_id: catMap.get('litoral-baiano'),
    },
  ]

  const { data: insertedPackages, error: pkgError } = await supabase
    .from('packages')
    .upsert(packagesData, { onConflict: 'slug' })
    .select()

  if (pkgError) throw pkgError
  console.log(`✓ Inserted ${insertedPackages?.length} packages.`)

  // 6. Lodging (8 entries)
  console.log('Seeding lodging...')
  const lodgingData = [
    {
      name: 'Hotel Santana Palace',
      slug: 'hotel-santana-palace',
      status: 'published',
      lodging_type: 'hotel',
      address: 'Praça Monsenhor Turíbio Vilanova, 110 - Centro, Bom Jesus da Lapa - BA',
      description: 'Localização privilegiada a apenas 100 metros do Santuário. Apartamentos amplos com ar-condicionado, TV a cabo, elevador e farto café da manhã baiano.',
      whatsapp: '77999114477',
      instagram: '@hotelsantanapalace',
      price_range: '$$$',
      category_id: catMap.get('hoteis'),
    },
    {
      name: 'Pousada da Gruta',
      slug: 'pousada-da-gruta',
      status: 'published',
      lodging_type: 'pousada',
      address: 'Rua São José, 42 - Centro, Bom Jesus da Lapa - BA',
      description: 'Ambiente familiar e acolhedor para peregrinos e turistas. Quartos limpos, recepção 24 horas e estacionamento com segurança.',
      whatsapp: '77998223344',
      instagram: '@pousadadagrutalapa',
      price_range: '$$',
      category_id: catMap.get('pousadas'),
    },
    {
      name: 'Hotel Lapa Real Executive',
      slug: 'hotel-lapa-real-executive',
      status: 'published',
      lodging_type: 'hotel',
      address: 'Av. Agenor Magalhães, 890 - Amaralina, Bom Jesus da Lapa - BA',
      description: 'Padrão executivo com piscina, academia, restaurante internacional e auditório para convenções e reuniões de negócios.',
      whatsapp: '77999884433',
      instagram: '@laparealhotel',
      price_range: '$$$$',
      category_id: catMap.get('hoteis'),
    },
    {
      name: 'Pousada Rio São Francisco',
      slug: 'pousada-rio-sao-francisco',
      status: 'published',
      lodging_type: 'pousada',
      address: 'Rua da Barranceira, 18 - Maravilha, Bom Jesus da Lapa - BA',
      description: 'Com vista deslumbrante para o Velho Chico e o pôr do sol na ponte. Área verde, redes na varanda e clima de fazenda.',
      whatsapp: '77991445566',
      instagram: '@pousadariolapa',
      price_range: '$$',
      category_id: catMap.get('pousadas'),
    },
    {
      name: 'Pousada Renascer do Vale',
      slug: 'pousada-renascer-do-vale',
      status: 'published',
      lodging_type: 'pousada',
      address: 'Rua Barão do Rio Branco, 305 - Centro, Bom Jesus da Lapa - BA',
      description: 'Excelente custo-benefício para grupos e caravanas de romeiros. Espaço para ônibus e refeitório coletivo.',
      whatsapp: '77988225577',
      instagram: null,
      price_range: '$',
      category_id: catMap.get('pousadas'),
    },
    {
      name: 'Hotel Gruta da Lapa',
      slug: 'hotel-gruta-da-lapa',
      status: 'published',
      lodging_type: 'hotel',
      address: 'Praça Marechal Deodoro, 15 - Centro, Bom Jesus da Lapa - BA',
      description: 'Tradição em hospitalidade no coração do centro comercial, a poucos passos dos principais restaurantes e farmácias.',
      whatsapp: '77999331188',
      instagram: '@hotelgrutadalapa',
      price_range: '$$',
      category_id: catMap.get('hoteis'),
    },
    {
      name: 'Pousada Recanto dos Romeiros',
      slug: 'pousada-recanto-dos-romeiros',
      status: 'published',
      lodging_type: 'pousada',
      address: 'Travessa Santa Luzia, 28 - Centro, Bom Jesus da Lapa - BA',
      description: 'Quartos privativos com frigobar, ventilador e ar-condicionado. Café da manhã com frutas da região e tapiocas feitas na hora.',
      whatsapp: '77998112299',
      instagram: null,
      price_range: '$',
      category_id: catMap.get('pousadas'),
    },
    {
      name: 'Mirante do Morro Eco Resort',
      slug: 'mirante-do-morro-eco-resort',
      status: 'published',
      lodging_type: 'resort',
      address: 'Estrada da Barriguda, Km 4 - Zona Rural, Bom Jesus da Lapa - BA',
      description: 'Chalés privativos com vista panorâmica para o morro calcário e a mata ciliar. Piscina com borda infinita e gastronomia de autor.',
      whatsapp: '77999009900',
      instagram: '@mirantedomorroresort',
      price_range: '$$$$',
      category_id: catMap.get('hoteis'),
    },
  ]

  const { data: insertedLodging, error: lodgError } = await supabase
    .from('lodging')
    .upsert(lodgingData, { onConflict: 'slug' })
    .select()

  if (lodgError) throw lodgError
  console.log(`✓ Inserted ${insertedLodging?.length} lodging entries.`)

  // 7. Dining (10 entries)
  console.log('Seeding dining...')
  const diningData = [
    {
      name: 'Churrascaria e Restaurante Boi na Brasa',
      slug: 'churrascaria-boi-na-brasa',
      status: 'published',
      restaurant_type: 'churrascaria',
      address: 'Av. Agenor Magalhães, 450 - Centro, Bom Jesus da Lapa - BA',
      whatsapp: '77999223388',
      instagram: '@boinabrasalapa',
      price_range: '$$$',
      description: 'Rodízio completo com mais de 20 cortes nobres de carne, buffet de saladas e pratos quentes sertanejos.',
      opening_hours: [{ day: 1, open: '11:00', close: '23:00', closed: false }],
      category_id: catMap.get('churrascarias'),
    },
    {
      name: 'Peixaria e Restaurante do Velho Chico',
      slug: 'peixaria-do-velho-chico',
      status: 'published',
      restaurant_type: 'peixaria',
      address: 'Orla Ribeirinha do Rio São Francisco, Barraca 05 - Maravilha, Bom Jesus da Lapa - BA',
      whatsapp: '77998334411',
      instagram: '@peixariadovelhochico',
      price_range: '$$',
      description: 'Especialista em peixes do Rio São Francisco: moqueca de surubim, dourado assado na brasa e pirão de peixe tradicional.',
      opening_hours: [{ day: 1, open: '10:00', close: '21:00', closed: false }],
      category_id: catMap.get('peixarias'),
    },
    {
      name: 'Pizzaria Bella Massa',
      slug: 'pizzaria-bella-massa',
      status: 'published',
      restaurant_type: 'pizzeria',
      address: 'Rua Santa Luzia, 190 - Centro, Bom Jesus da Lapa - BA',
      whatsapp: '77991556677',
      instagram: '@bellamassalapa',
      price_range: '$$',
      description: 'Pizzas artesanais assadas em forno a lenha, massas frescas italianas e calzones recheados.',
      opening_hours: [{ day: 2, open: '18:00', close: '23:30', closed: false }],
      category_id: catMap.get('pizzarias-e-lanchonetes'),
    },
    {
      name: 'Café do Santuário & Confeitaria',
      slug: 'cafe-do-santuario',
      status: 'published',
      restaurant_type: 'cafeteria',
      address: 'Praça Monsenhor Turíbio Vilanova, 20 - Centro, Bom Jesus da Lapa - BA',
      whatsapp: '77999887722',
      instagram: '@cafedosantuario',
      price_range: '$$',
      description: 'Cafés especiais coados e expressos, bolos caseiros, tapiocas recheadas e pães de queijo assados a toda hora.',
      opening_hours: [{ day: 0, open: '06:30', close: '20:00', closed: false }],
      category_id: catMap.get('cafes-e-docerias'),
    },
    {
      name: 'Lanchonete e Hamburgueria Lapa Burguer',
      slug: 'lapa-burguer',
      status: 'published',
      restaurant_type: 'lanchonete',
      address: 'Av. Manoel Novaes, 615 - Centro, Bom Jesus da Lapa - BA',
      whatsapp: '77991118844',
      instagram: '@lapaburgueroficial',
      price_range: '$',
      description: 'Burgers artesanais com blend de carne bovina, molhos especiais da casa e milk-shakes cremosos.',
      opening_hours: [{ day: 1, open: '17:30', close: '00:00', closed: false }],
      category_id: catMap.get('pizzarias-e-lanchonetes'),
    },
    {
      name: 'Restaurante Sabor da Terra (Self-Service)',
      slug: 'restaurante-sabor-da-terra',
      status: 'published',
      restaurant_type: 'self-service',
      address: 'Rua Floriano Peixoto, 140 - Centro, Bom Jesus da Lapa - BA',
      whatsapp: '77998229911',
      instagram: null,
      price_range: '$',
      description: 'Comida caseira típica baiana e mineira no quilo ou prato feito. Feijão tropeiro, carne de sol e galinha caipira.',
      opening_hours: [{ day: 1, open: '11:00', close: '15:00', closed: false }],
      category_id: catMap.get('churrascarias'),
    },
    {
      name: 'Sorveteria e Açaí Tropical do Chico',
      slug: 'sorveteria-tropical-do-chico',
      status: 'published',
      restaurant_type: 'sorveteria',
      address: 'Praça Marechal Deodoro, 70 - Centro, Bom Jesus da Lapa - BA',
      whatsapp: '77991448822',
      instagram: '@acaitropicaldochico',
      price_range: '$',
      description: 'Açaí na tigela com mais de 30 opções de complementos e sorvetes com frutas do cerrado e do sertão: umbu, mangaba e cajá.',
      opening_hours: [{ day: 0, open: '13:00', close: '22:30', closed: false }],
      category_id: catMap.get('cafes-e-docerias'),
    },
    {
      name: 'Bar e Restaurante da Ponte',
      slug: 'bar-e-restaurante-da-ponte',
      status: 'published',
      restaurant_type: 'bar',
      address: 'Acesso à Ponte Gercino Coelho - Orla Nova, Bom Jesus da Lapa - BA',
      whatsapp: '77999553311',
      instagram: '@restaurantedaponte',
      price_range: '$$',
      description: 'Petiscos de boteco, porções de tilápia frita, cerveja gelada e música ao vivo com pôr do sol no Rio São Francisco.',
      opening_hours: [{ day: 4, open: '16:00', close: '01:00', closed: false }],
      category_id: catMap.get('peixarias'),
    },
    {
      name: 'Cantina Italiana Don Vito',
      slug: 'cantina-don-vito',
      status: 'published',
      restaurant_type: 'restaurante italiano',
      address: 'Rua Santa Lúcia, 85 - Amaralina, Bom Jesus da Lapa - BA',
      whatsapp: '77998664422',
      instagram: '@cantinadonvitolapa',
      price_range: '$$$',
      description: 'Vinho selecionado, lasanhas, risotos e filés em ambiente intimista climatizado.',
      opening_hours: [{ day: 3, open: '19:00', close: '23:30', closed: false }],
      category_id: catMap.get('pizzarias-e-lanchonetes'),
    },
    {
      name: 'Tapiocaria e Pastelaria da Esplanada',
      slug: 'tapiocaria-da-esplanada',
      status: 'published',
      restaurant_type: 'lanchonete',
      address: 'Esplanada do Santuário, Quiosque 03, Bom Jesus da Lapa - BA',
      whatsapp: '77991337744',
      instagram: null,
      price_range: '$',
      description: 'Tapiocas salgadas e doces feitas com goma fresca da região, pastéis crocantes fritos na hora e caldo de cana gelado.',
      opening_hours: [{ day: 0, open: '06:00', close: '19:00', closed: false }],
      category_id: catMap.get('cafes-e-docerias'),
    },
  ]

  const { data: insertedDining, error: dinError } = await supabase
    .from('dining')
    .upsert(diningData, { onConflict: 'slug' })
    .select()

  if (dinError) throw dinError
  console.log(`✓ Inserted ${insertedDining?.length} dining entries.`)

  // 8. Associate Amenities and Galleries for businesses, events, lodging, dining
  console.log('Associating amenities & galleries...')
  const wifiId = amenMap.get('wifi-gratuito')
  const arId = amenMap.get('ar-condicionado')
  const cartaoId = amenMap.get('aceita-cartao')
  const estacId = amenMap.get('estacionamento')

  if (liderId && wifiId && arId && cartaoId) {
    await supabase.from('business_amenities').upsert([
      { business_id: liderId, amenity_id: wifiId },
      { business_id: liderId, amenity_id: arId },
      { business_id: liderId, amenity_id: cartaoId },
    ])

    // Galleries for Lider Turismo
    await supabase.from('galleries').insert([
      {
        business_id: liderId,
        image_url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&h=800&fit=crop',
        caption: 'Frota moderna de ônibus leito para turismo e romarias',
        display_order: 1,
      },
      {
        business_id: liderId,
        image_url: 'https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?w=1200&h=800&fit=crop',
        caption: 'Atendimento ao cliente e emissão de passagens',
        display_order: 2,
      },
    ])
  }

  // Amenities for santana palace hotel
  const santanaId = insertedLodging?.find((l) => l.slug === 'hotel-santana-palace')?.id
  if (santanaId && wifiId && arId && cartaoId && estacId) {
    await supabase.from('lodging_amenities').upsert([
      { lodging_id: santanaId, amenity_id: wifiId },
      { lodging_id: santanaId, amenity_id: arId },
      { lodging_id: santanaId, amenity_id: cartaoId },
      { lodging_id: santanaId, amenity_id: estacId },
    ])

    await supabase.from('galleries').insert([
      {
        lodging_id: santanaId,
        image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=800&fit=crop',
        caption: 'Fachada do Hotel Santana Palace em frente ao Santuário',
        display_order: 1,
      },
      {
        lodging_id: santanaId,
        image_url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&h=800&fit=crop',
        caption: 'Suíte Casal com ar condicionado e sacada',
        display_order: 2,
      },
    ])
  }

  console.log('\n--- SEED COMPLETE SUCCESSFULLY ---')
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
