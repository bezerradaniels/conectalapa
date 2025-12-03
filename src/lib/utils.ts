/**
 * Converte um texto em slug amigável para URL
 * Exemplo: "Empresa de Tecnologia" -> "empresa-de-tecnologia"
 */
export const generateSlug = (text: string): string => {
    return text
        .toLowerCase()
        .normalize('NFD') // Normaliza caracteres acentuados
        .replace(/[\u0300-\u036f]/g, '') // Remove acentos
        .replace(/[^\w\s-]/g, '') // Remove caracteres especiais
        .replace(/\s+/g, '-') // Substitui espaços por hífens
        .replace(/-+/g, '-') // Remove hífens duplicados
        .trim();
};

/**
 * Converte slug de volta para texto
 * Exemplo: "empresa-de-tecnologia" -> "Empresa De Tecnologia"
 */
export const slugToText = (slug: string): string => {
    return slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

/**
 * Formata telefone brasileiro
 */
export const formatPhone = (phone: string): string => {
    const cleaned = phone.replace(/\D/g, '');

    if (cleaned.length === 11) {
        return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    } else if (cleaned.length === 10) {
        return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
    }

    return phone;
};

/**
 * Formata data para pt-BR
 */
export const formatDate = (date: string | Date): string => {
    return new Date(date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
};
