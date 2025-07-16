import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getUsuarioById } from '../../services/usuarioService';
import { PageContainer, Title, PageHeader } from '../../styles/common';
import styled from 'styled-components';

const Card = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 2rem;
  max-width: 700px;
  margin: 0 auto;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
`;

const ProfileAvatar = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-right: 2rem;
  object-fit: cover;
  border: 4px solid #e2e8f0;
`;

const ProfileInfo = styled.div`
  h2 {
    font-size: 1.75rem;
    font-weight: 600;
    color: #111827;
  }
  p {
    font-size: 1rem;
    color: #6b7280;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin-top: 2rem;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const DetailLabel = styled.span`
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
`;

const DetailValue = styled.span`
  font-size: 1rem;
  color: #1f2937;
  font-weight: 500;
  word-wrap: break-word;
`;


function PerfilPage() {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user || !user.id) {
                setError('Usuário não autenticado.');
                setIsLoading(false);
                return;
            }

            try {
                const data = await getUsuarioById(user.id);
                setProfile(data);
            } catch (err) {
                console.error(err);
                setError('Falha ao carregar dados do perfil.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [user]);
    
    if (isLoading) return <PageContainer><p>Carregando perfil...</p></PageContainer>;
    if (error) return <PageContainer><p style={{ color: 'red' }}>{error}</p></PageContainer>;
    if (!profile) return <PageContainer><p>Perfil não encontrado.</p></PageContainer>;
    
    const getProfileImageUrl = () => {
        if (profile.fotoPerfil) {
            // Verifica se o campo já é uma URL de dados base64
            if (profile.fotoPerfil.startsWith('data:image')) {
                return profile.fotoPerfil;
            }
            // Adiciona o prefixo para strings base64 puras
            return `data:image/jpeg;base64,${profile.fotoPerfil}`;
        }
        // Retorna uma imagem padrão
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.nome)}&background=random&color=fff&size=100`;
    };
    
    const perfilLabel = (perfil) => {
        switch (perfil) {
            case 'ADMIN':
                return 'Administrador';
            case 'TECNICO':
                return 'Técnico';
            default:
                return 'Usuário';
        }
    }

    return (
        <PageContainer>
            <PageHeader>
                <Title>Meu Perfil</Title>
            </PageHeader>
            <Card>
                <ProfileHeader>
                    <ProfileAvatar src={getProfileImageUrl()} alt={`Foto de ${profile.nome}`} />
                    <ProfileInfo>
                        <h2>{profile.nome}</h2>
                        <p>{perfilLabel(profile.perfil)}</p>
                    </ProfileInfo>
                </ProfileHeader>

                <SectionTitle>Informações de Contato</SectionTitle>
                <InfoGrid>
                    <DetailItem>
                        <DetailLabel>Email</DetailLabel>
                        <DetailValue>{profile.email}</DetailValue>
                    </DetailItem>
                </InfoGrid>

                <SectionTitle>Informações Adicionais</SectionTitle>
                <InfoGrid>
                    <DetailItem>
                        <DetailLabel>Crachá</DetailLabel>
                        <DetailValue>{profile.cracha || 'Não informado'}</DetailValue>
                    </DetailItem>
                </InfoGrid>
            </Card>
        </PageContainer>
    );
}

export default PerfilPage; 