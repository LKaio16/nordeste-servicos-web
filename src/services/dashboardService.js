import api from './api';


const getDashboardStats = async () => {
    try {
        const osStatsResponse = await api.get('/api/ordens-servico/dashboard/stats');

        const d = osStatsResponse.data;

        return {
            os: {
                total: Number(d.totalOs ?? 0),
                status: {
                    CONCLUIDA: Number(d.osConcluidas ?? 0),
                    EM_ANDAMENTO: Number(d.osEmAndamento ?? 0),
                    PENDENTE_PECAS: Number(d.osPendentes ?? 0),
                    EM_ABERTO: Number(d.osAbertas ?? 0)
                },
                recentes: d.ordensRecentes || []
            },
            clientes: {
                total: Number(d.totalClientes ?? 0)
            },
            equipamentos: {
                total: Number(d.totalEquipamentos ?? 0)
            },
            tecnicos: {
                osPorTecnico: (d.osPorTecnico || []).map((t) => ({
                    name: t.name,
                    "Ordens Atribuídas": Number(t.ordensAtribuidas ?? 0)
                }))
            },
            lembretes: {
                proximos7Dias: Number(d.lembretesProximos7Dias ?? 0),
                atrasados: Number(d.lembretesAtrasados ?? 0)
            }
        };

    } catch (error) {
        console.error("Erro ao carregar estatísticas do dashboard:", error);
        throw new Error("Não foi possível carregar os dados do dashboard.");
    }
};


export const dashboardService = {
    getDashboardStats,
}; 