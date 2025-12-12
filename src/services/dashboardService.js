import { getAllOrdensServico } from './osService';
import { getAllClientes } from './clienteService';
import { getAllEquipamentos } from './equipamentoService';
import { getAllUsuarios } from './usuarioService';


const getDashboardStats = async () => {
    try {
        // Busca todas as listas em paralelo para otimizar o tempo de carregamento
        // Para OS, busca apenas as 5 mais recentes para a lista, e usa endpoint de estatísticas para totais
        const [ordens, clientes, equipamentos, usuarios] = await Promise.all([
            getAllOrdensServico('', 0, 100), // Busca até 100 para ter dados suficientes
            getAllClientes(),
            getAllEquipamentos(),
            getAllUsuarios()
        ]);

        // Processa as estatísticas das Ordens de Serviço
        const osStats = {
            total: ordens.length, // Será limitado a 100, mas é uma estimativa
            status: ordens.reduce((acc, os) => {
                acc[os.status] = (acc[os.status] || 0) + 1;
                return acc;
            }, {}),
            recentes: ordens.slice(0, 5) // Pega as 5 mais recentes
        };

        const clienteStats = {
            total: clientes.length
        };

        const equipamentoStats = {
            total: equipamentos.length
        };

        // Processa as estatísticas dos técnicos
        const tecnicos = usuarios.filter(u => u.perfil === 'TECNICO');
        const osPorTecnico = tecnicos.map(tecnico => ({
            name: tecnico.nome.split(' ')[0], // Pega só o primeiro nome
            "Ordens Atribuídas": ordens.filter(os => os.tecnicoAtribuido?.id === tecnico.id).length,
        }));


        return {
            os: osStats,
            clientes: clienteStats,
            equipamentos: equipamentoStats,
            tecnicos: {
                osPorTecnico
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