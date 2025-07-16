export const getStatusLabel = (status) => {
    const labels = {
        ABERTA: 'Aberta',
        EM_ANDAMENTO: 'Em Andamento',
        PAUSADA: 'Pausada',
        CONCLUIDA: 'Concluída',
        CANCELADA: 'Cancelada',
    };
    return labels[status] || status;
};

export const getPrioridadeLabel = (prioridade) => {
    const labels = {
        BAIXA: 'Baixa',
        MEDIA: 'Média',
        ALTA: 'Alta',
        URGENTE: 'Urgente',
    };
    return labels[prioridade] || prioridade;
}; 