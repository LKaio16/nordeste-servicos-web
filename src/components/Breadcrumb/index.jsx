import { Breadcrumb as AntBreadcrumb } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FiHome, FiChevronRight } from 'react-icons/fi';

const StyledBreadcrumb = styled(AntBreadcrumb)`
  && {
    margin: 0;
    padding: 0;
    background: none;
    border: none;
    box-shadow: none;
    font-size: 13px;
    line-height: 1;

    .ant-breadcrumb-link {
      color: #6b86b8;
      font-weight: 500;

      a {
        color: #6b86b8;
        text-decoration: none;
        transition: color 0.15s;
        display: inline-flex;
        align-items: center;
        gap: 5px;

        &:hover { color: #1a4494; }
      }
    }

    .ant-breadcrumb-separator {
      color: #c7d4e8;
      margin: 0 6px;
      display: inline-flex;
      align-items: center;
    }
  }
`;

const ActiveItem = styled.span`
  color: #0c2d6b;
  font-weight: 700;
  font-size: 13px;
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
            'criar': 'Criar',
            'recibos': 'Recibos',
            'fornecedores': 'Fornecedores',
            'contas': 'Contas',
            'notas-fiscais': 'Notas Fiscais',
        };

        if (/^\d+$/.test(pathname)) {
            const prev = allPathnames[index - 1];
            const labels = {
                'ordens-servico': 'OS', 'os': 'OS', 'orcamentos': 'Orçamento',
                'clientes': 'Cliente', 'equipamentos': 'Equipamento',
                'servicos': 'Serviço', 'pecas': 'Peça', 'usuarios': 'Usuário',
            };
            return `${labels[prev] || 'ID'} ${pathname}`;
        }

        return pathMap[pathname] || pathname.charAt(0).toUpperCase() + pathname.slice(1);
    };

    const getBreadcrumbItems = () => {
        const items = [
            {
                title: (
                    <Link to="/admin/dashboard">
                        <FiHome style={{ width: 13, height: 13 }} />
                        <span>Início</span>
                    </Link>
                )
            }
        ];

        let currentPath = '/admin';

        pathnames.forEach((pathname, index) => {
            if (pathname === 'admin' || pathname === 'dashboard') return;

            currentPath += `/${pathname}`;
            const name = getBreadcrumbName(pathname, index, pathnames);

            if (name) {
                const isLast = index === pathnames.length - 1;
                const isAction = ['detalhes', 'editar', 'novo', 'criar'].includes(pathname);

                if (isLast || isAction) {
                    items.push({ title: <ActiveItem>{name}</ActiveItem> });
                } else {
                    items.push({ title: <Link to={currentPath}>{name}</Link> });
                }
            }
        });

        return items;
    };

    if (location.pathname === '/admin/dashboard' || location.pathname === '/admin') {
        return null;
    }

    return (
        <StyledBreadcrumb
            items={getBreadcrumbItems()}
            separator={<FiChevronRight style={{ width: 12, height: 12 }} />}
        />
    );
};

export default Breadcrumb;
