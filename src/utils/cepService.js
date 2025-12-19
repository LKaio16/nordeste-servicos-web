// Função para buscar endereço por CEP usando ViaCEP
export const buscarEnderecoPorCEP = async (cep) => {
    try {
        // Remove formatação do CEP
        const cepLimpo = cep.replace(/\D/g, '');
        
        // Valida se o CEP tem 8 dígitos
        if (cepLimpo.length !== 8) {
            throw new Error('CEP deve ter 8 dígitos');
        }

        // Busca na API ViaCEP
        const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        
        if (!response.ok) {
            throw new Error('Erro ao buscar CEP');
        }

        const data = await response.json();

        // Verifica se o CEP foi encontrado
        if (data.erro) {
            throw new Error('CEP não encontrado');
        }

        return {
            rua: data.logradouro || '',
            bairro: data.bairro || '',
            cidade: data.localidade || '',
            estado: data.uf || '',
        };
    } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        throw error;
    }
};


