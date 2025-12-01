import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useAuth } from '../contexts/AuthContext';

export const Home: React.FC = () => {
    const { profile } = useAuth();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        { id: 1, title: 'Destaque 1', image: 'https://via.placeholder.com/800x400/00A82D/FFFFFF?text=Destaque+1' },
        { id: 2, title: 'Destaque 2', image: 'https://via.placeholder.com/800x400/0A7A27/FFFFFF?text=Destaque+2' },
        { id: 3, title: 'Destaque 3', image: 'https://via.placeholder.com/800x400/00A82D/FFFFFF?text=Destaque+3' },
    ];

    const companies = [
        { id: 1, name: 'Empresa Exemplo 1', category: 'Tecnologia', image: 'https://via.placeholder.com/300x200/FAF8F5/00A82D?text=Empresa+1' },
        { id: 2, name: 'Empresa Exemplo 2', category: 'Comércio', image: 'https://via.placeholder.com/300x200/FAF8F5/00A82D?text=Empresa+2' },
        { id: 3, name: 'Empresa Exemplo 3', category: 'Serviços', image: 'https://via.placeholder.com/300x200/FAF8F5/00A82D?text=Empresa+3' },
    ];

    const jobs = [
        { id: 1, title: 'Desenvolvedor React', company: 'Tech Solutions', salary: 'R$ 5.000,00' },
        { id: 2, title: 'Designer UI/UX', company: 'Creative Agency', salary: 'A combinar' },
        { id: 3, title: 'Gerente de Vendas', company: 'Comércio Local', salary: 'R$ 3.500,00' },
    ];

    const packages = [
        { id: 1, destination: 'Salvador', date: '15/12/2025', agency: 'LapaTur', image: 'https://via.placeholder.com/300x200/FAF8F5/00A82D?text=Salvador' },
        { id: 2, destination: 'Chapada Diamantina', date: '20/12/2025', agency: 'Aventura Tours', image: 'https://via.placeholder.com/300x200/FAF8F5/00A82D?text=Chapada' },
        { id: 3, destination: 'Porto Seguro', date: '01/01/2026', agency: 'Viagens BJL', image: 'https://via.placeholder.com/300x200/FAF8F5/00A82D?text=Porto+Seguro' },
    ];

    const events = [
        { id: 1, name: 'Show Sertanejo ao Vivo', date: '05/12/2025', location: 'Praça da Basílica', type: 'show', isFree: false },
        { id: 2, name: 'Corrida da Fé', date: '10/12/2025', location: 'Centro', type: 'esportivo', isFree: true },
        { id: 3, name: 'Festa Junina Tradicional', date: '24/12/2025', location: 'Clube Recreativo', type: 'festa', isFree: false },
    ];

    const foods = [
        { id: 1, name: 'Restaurante Sabor da Terra', types: ['restaurante', 'comida regional'], image: 'https://via.placeholder.com/300x200/FAF8F5/00A82D?text=Restaurante' },
        { id: 2, name: 'Lanchonete do Centro', types: ['lanchonete'], image: 'https://via.placeholder.com/300x200/FAF8F5/00A82D?text=Lanchonete' },
        { id: 3, name: 'Pizzaria Bella Massa', types: ['pizzaria'], image: 'https://via.placeholder.com/300x200/FAF8F5/00A82D?text=Pizzaria' },
    ];

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

    return (
        <div className="max-w-[1140px] mx-auto py-8 px-6">
            {/* Header */}
            <div className="mb-12">
                {/* Logo - Mobile Only */}
                <div className="flex items-center gap-2 mb-4 md:hidden">
                    <div className="w-10 h-10 bg-[var(--color-primary)] rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold text-xl">C</span>
                    </div>
                    <span className="font-bold text-xl text-[var(--color-neutral-900)]">
                        Central BJL
                    </span>
                </div>
                
                <p className="text-base md:text-lg text-[var(--color-neutral-600)] mb-3">
                    👋 Olá, <span className="font-semibold text-[var(--color-neutral-900)]">
                        {profile ? profile.name : 'visitante'}
                    </span>
                </p>
                <h1 className="text-2xl md:text-4xl font-bold text-[var(--color-neutral-900)] mb-2">
                    Descubra empresas em Bom Jesus da Lapa
                </h1>
                <p className="text-sm md:text-base text-[var(--color-neutral-500)] mb-6">
                    Encontre empresas, vagas de emprego e pacotes de viagem
                </p>

                {/* Search */}
                <div className="relative max-w-2xl">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-neutral-500)]" size={20} />
                    <Input
                        type="text"
                        placeholder="Buscar empresas, vagas ou pacotes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-12"
                    />
                </div>
            </div>

            {/* Carousel */}
            <section className="mb-16">
                <div className="relative rounded-2xl overflow-hidden bg-white border border-[var(--color-neutral-200)] aspect-[16/10] md:aspect-auto">
                    <img
                        src={slides[currentSlide].image}
                        alt={slides[currentSlide].title}
                        className="w-full h-full md:h-[400px] object-cover"
                    />
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full transition-all cursor-pointer"
                    >
                        <ChevronLeft size={24} className="text-[var(--color-neutral-900)]" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full transition-all cursor-pointer"
                    >
                        <ChevronRight size={24} className="text-[var(--color-neutral-900)]" />
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`w-2 h-2 rounded-full transition-all cursor-pointer ${index === currentSlide ? 'bg-white w-8' : 'bg-white/50'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Companies Section */}
            <section className="mb-16">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-[var(--color-neutral-900)]">Empresas Cadastradas</h2>
                    <Button variant="ghost" onClick={() => navigate('/empresas')} className="cursor-pointer">Ver mais →</Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {companies.map((company) => (
                        <Card key={company.id} className="p-0 overflow-hidden">
                            <img src={company.image} alt={company.name} className="w-full h-40 object-cover" />
                            <div className="p-4">
                                <h3 className="font-semibold text-[var(--color-neutral-900)] mb-1">{company.name}</h3>
                                <span className="inline-block px-3 py-1 bg-[var(--color-primary-light)] text-[var(--color-primary-dark)] text-sm rounded-full">
                                    {company.category}
                                </span>
                            </div>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Jobs Section */}
            <section className="mb-16">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-[var(--color-neutral-900)]">Vagas Disponíveis</h2>
                    <Button variant="ghost" onClick={() => navigate('/vagas')} className="cursor-pointer">Ver mais →</Button>
                </div>
                <div className="space-y-3">
                    {jobs.map((job) => (
                        <Card key={job.id} className="flex justify-between items-center">
                            <div>
                                <h3 className="font-semibold text-[var(--color-neutral-900)] mb-1">{job.title}</h3>
                                <p className="text-sm text-[var(--color-neutral-500)]">{job.company}</p>
                                <p className="text-sm font-semibold text-[var(--color-primary)] mt-1">{job.salary}</p>
                            </div>
                            <Button variant="secondary" className="cursor-pointer">Acessar vaga</Button>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Travel Packages Section */}
            <section className="mb-16">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-[var(--color-neutral-900)]">Pacotes de Viagem</h2>
                    <Button variant="ghost" onClick={() => navigate('/pacotes')} className="cursor-pointer">Ver mais →</Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {packages.map((pkg) => (
                        <Card key={pkg.id} className="p-0 overflow-hidden">
                            <img src={pkg.image} alt={pkg.destination} className="w-full h-40 object-cover" />
                            <div className="p-4">
                                <h3 className="font-semibold text-[var(--color-neutral-900)] mb-2">{pkg.destination}</h3>
                                <p className="text-sm text-[var(--color-neutral-500)] mb-1">Saída: {pkg.date}</p>
                                <p className="text-sm text-[var(--color-neutral-700)] mb-3">{pkg.agency}</p>
                                <Button variant="secondary" className="w-full cursor-pointer">Saiba mais</Button>
                            </div>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Events Section */}
            <section className="mb-16">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-[var(--color-neutral-900)]">Eventos</h2>
                    <Button variant="ghost" onClick={() => navigate('/eventos')} className="cursor-pointer">Ver mais →</Button>
                </div>
                <div className="space-y-3">
                    {events.map((event) => (
                        <Card key={event.id} className="flex justify-between items-center">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <h3 className="font-semibold text-[var(--color-neutral-900)]">{event.name}</h3>
                                    {event.isFree && (
                                        <span className="inline-block px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                                            Gratuito
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-[var(--color-neutral-500)] mb-1">📍 {event.location}</p>
                                <p className="text-sm text-[var(--color-neutral-500)]">📅 {event.date}</p>
                                <span className="inline-block mt-2 px-3 py-1 bg-[var(--color-primary-light)] text-[var(--color-primary-dark)] text-sm rounded-full capitalize">
                                    {event.type}
                                </span>
                            </div>
                            <Button variant="secondary" className="cursor-pointer">Ver detalhes</Button>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Food Section */}
            <section className="mb-16">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-[var(--color-neutral-900)]">Onde Comer?</h2>
                    <Button variant="ghost" onClick={() => navigate('/alimentacao')} className="cursor-pointer">Ver mais →</Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {foods.map((food) => (
                        <Card key={food.id} className="p-0 overflow-hidden">
                            <img src={food.image} alt={food.name} className="w-full h-40 object-cover" />
                            <div className="p-4">
                                <h3 className="font-semibold text-[var(--color-neutral-900)] mb-2">{food.name}</h3>
                                <div className="flex flex-wrap gap-2">
                                    {food.types.slice(0, 2).map((type, index) => (
                                        <span 
                                            key={index}
                                            className="inline-block px-3 py-1 bg-[var(--color-primary-light)] text-[var(--color-primary-dark)] text-sm rounded-full capitalize"
                                        >
                                            {type}
                                        </span>
                                    ))}
                                    {food.types.length > 2 && (
                                        <span className="inline-block px-3 py-1 bg-[var(--color-neutral-200)] text-[var(--color-neutral-600)] text-sm rounded-full">
                                            +{food.types.length - 2}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </section>
        </div>
    );
};
