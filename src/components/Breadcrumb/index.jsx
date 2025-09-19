import { Breadcrumb as AntBreadcrumb } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const StyledBreadcrumb = styled(AntBreadcrumb)`
  margin-bottom: 16px;
  margin-left: 24px;
  margin-right: 24px;
  padding: 12px 16px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  
  .ant-breadcrumb-link {
    color: #666;
    font-weight: 500;
    
    &:hover {
      color: #00529b;
    }
  }
  
  .ant-breadcrumb-separator {
    color: #999;
  }
`;

const Breadcrumb = () => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);

    const getBreadcrumbName = (pathname, index, allPathnames) => {
        const pathMap = {
            'admin': 'Início',
            'dashboard': 'Dashboard',
            'ordens-servico': 'Ordens de Serviço',
            'os': 'Ordens de Serviço',
            'orcamentos': 'Orçamentos',
            'clientes': 'Clientes',
            'equipamentos': 'Equipamentos',
            'servicos': 'Serviços',
            'pecas': 'Peças',
            'usuarios': 'Usuários',
            'perfil': 'Perfil',
            'novo': 'Novo',
            'editar': 'Editar',
            'detalhes': 'Detalhes',
            'criar': 'Criar'
        };

        // Se for um ID (número), mostrar como "ID" ou o contexto apropriado
        if (/^\d+$/.test(pathname)) {
            const previousPath = allPathnames[index - 1];
            if (previousPath === 'ordens-servico' || previousPath === 'os') {
                return `OS ${pathname}`;
            } else if (previousPath === 'orcamentos') {
                return `Orçamento ${pathname}`;
            } else if (previousPath === 'clientes') {
                return `Cliente ${pathname}`;
            } else if (previousPath === 'equipamentos') {
                return `Equipamento ${pathname}`;
            } else if (previousPath === 'servicos') {
                return `Serviço ${pathname}`;
            } else if (previousPath === 'pecas') {
                return `Peça ${pathname}`;
            } else if (previousPath === 'usuarios') {
                return `Usuário ${pathname}`;
            }
            return `ID ${pathname}`;
        }

        return pathMap[pathname] || pathname.charAt(0).toUpperCase() + pathname.slice(1);
    };

    const getBreadcrumbItems = () => {
        const items = [
            {
                title: (
                    <Link to="/admin/dashboard">
                        <HomeOutlined />
                        <span style={{ marginLeft: 4 }}>Início</span>
                    </Link>
                )
            }
        ];

        // Construir o path corretamente, começando com /admin
        let currentPath = '/admin';

        pathnames.forEach((pathname, index) => {
            // Pular 'admin' e 'dashboard' para evitar duplicação
            if (pathname === 'admin' || pathname === 'dashboard') {
                return;
            }

            currentPath += `/${pathname}`;
            const name = getBreadcrumbName(pathname, index, pathnames);

            if (name) {
                const isLast = index === pathnames.length - 1;
                const isActionPage = pathname === 'detalhes' || pathname === 'editar' || pathname === 'novo' || pathname === 'criar';

                // Se for a última página OU for uma página de ação (detalhes, editar, etc.), não tornar clicável
                if (isLast || isActionPage) {
                    items.push({
                        title: (
                            <span style={{ color: '#00529b', fontWeight: 600 }}>{name}</span>
                        )
                    });
                } else {
                    items.push({
                        title: <Link to={currentPath}>{name}</Link>
                    });
                }
            }
        });

        return items;
    };

    // Não mostrar breadcrumb na página inicial
    if (location.pathname === '/admin/dashboard' || location.pathname === '/admin') {
        return null;
    }

    return <StyledBreadcrumb items={getBreadcrumbItems()} />;
};

export default Breadcrumb;
