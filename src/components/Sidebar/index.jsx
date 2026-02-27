import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import styled from 'styled-components';
import {
  FiGrid,
  FiUsers,
  FiHardDrive,
  FiTool,
  FiFileText,
  FiDollarSign,
  FiArchive,
  FiTruck,
  FiLogOut,
  FiMenu,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import logo from '../../assets/logo.png';

const NORDESTE = '#203d7b';
const NORDESTE_LIGHT = 'rgba(32, 61, 123, 0.1)';

const SidebarWrapper = styled.div`
  position: relative;
  z-index: 1000;
`;

const SANS_SERIF = "'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

const SidebarContainer = styled.div`
  font-family: ${SANS_SERIF} !important;
  width: ${({ collapsed }) => (collapsed ? '80px' : '256px')};
  background: linear-gradient(to bottom, #ffffff, rgba(248, 250, 252, 0.8));
  border-right: 2px solid rgba(32, 61, 123, 0.2);
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease, transform 0.3s ease;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  transform: ${({ isOpen, isMobile }) =>
    isMobile ? (isOpen ? 'translateX(0)' : 'translateX(-100%)') : 'translateX(0)'};

  @media (max-width: 1023px) {
    width: 256px;
    box-shadow: ${({ isOpen }) => (isOpen ? '8px 0 30px rgba(0,0,0,0.15)' : 'none')};
  }
`;

const Header = styled.div`
  padding: ${({ collapsed }) => (collapsed ? '0.75rem' : '1.5rem')};
  background: linear-gradient(135deg, #00529b 0%, #203d7b 100%);
  border-bottom: none;
  transition: padding 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 82, 155, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: ${({ collapsed }) => (collapsed ? '72px' : 'auto')};
  box-sizing: border-box;
`;

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-width: 0;
  overflow: hidden;

  img {
    height: ${({ collapsed }) => (collapsed ? '40px' : '64px')};
    width: auto;
    max-width: ${({ collapsed }) => (collapsed ? '100%' : 'none')};
    object-fit: contain;
    object-position: center;
  }
`;

const ToggleSection = styled.div`
  padding: 0.5rem 1rem;
  border-bottom: 1px solid #e2e8f0;

  @media (max-width: 1023px) {
    display: none;
  }
`;

const RecolherButton = styled.button`
  font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
  display: flex;
  align-items: center;
  justify-content: ${({ collapsed }) => (collapsed ? 'center' : 'flex-start')};
  width: 100%;
  height: 32px;
  padding: 0 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: #64748b;
  background: none;
  border: none;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s;

  &:hover {
    background: #f1f5f9;
    color: #1e293b;
  }

  svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    margin-right: ${({ collapsed }) => (collapsed ? '0' : '0.5rem')};
  }
`;

const NavContent = styled.nav`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
`;

const SectionGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.p`
  font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0 0.75rem;
  margin-bottom: 0.5rem;
  font-size: 0.8rem;
  font-weight: 500;
  color: ${NORDESTE};
  text-transform: uppercase;
  letter-spacing: 0.04em;

  &::before {
    content: '';
    width: 4px;
    height: 2px;
    background: ${NORDESTE};
    border-radius: 2px;
  }
`;

const NavItem = styled.button`
  font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
  display: flex;
  align-items: center;
  width: 100%;
  padding: ${({ collapsed }) => (collapsed ? '0.625rem 0.75rem' : '0.5rem 0.75rem')};
  margin-bottom: 2px;
  font-size: 0.9rem;
  font-weight: 500;
  line-height: 1.4;
  color: ${({ active }) => (active ? '#fff' : '#334155')};
  background: ${({ active }) => (active ? NORDESTE : 'transparent')};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;
  position: relative;
  box-shadow: ${({ active }) => (active ? `0 2px 8px ${NORDESTE}4D` : 'none')};
  justify-content: ${({ collapsed }) => (collapsed ? 'center' : 'flex-start')};

  &:hover {
    background: ${({ active }) => (active ? NORDESTE : NORDESTE_LIGHT)};
    color: ${({ active }) => (active ? '#fff' : NORDESTE)};
  }

  svg {
    width: 20px;
    height: 20px;
    min-width: 20px;
    flex-shrink: 0;
    margin-right: ${({ collapsed }) => (collapsed ? '0' : '0.75rem')};
  }

  span {
    font-family: inherit !important;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const Tooltip = styled.span`
  font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
  position: absolute;
  left: calc(100% + 8px);
  top: 50%;
  transform: translateY(-50%);
  padding: 4px 8px;
  font-size: 0.75rem;
  font-weight: 500;
  color: white;
  background: #0f172a;
  border-radius: 4px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  z-index: 50;
  transition: opacity 0.2s, visibility 0.2s;

  ${NavItem}:hover & {
    opacity: 1;
    visibility: visible;
  }
`;

const Footer = styled.div`
  padding: ${({ collapsed }) => (collapsed ? '0.75rem' : '1rem')};
  border-top: 2px solid rgba(32, 61, 123, 0.3);
  background: linear-gradient(to top, rgba(32, 61, 123, 0.05), transparent);
  transition: padding 0.3s ease;
`;

const UserCard = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  margin-bottom: 0.75rem;
  border-radius: 8px;
  background: white;
  border: 2px solid rgba(32, 61, 123, 0.2);
  box-shadow: 0 2px 8px rgba(32, 61, 123, 0.1);
  text-decoration: none;
  color: inherit;
  transition: box-shadow 0.2s, border-color 0.2s;

  &:hover {
    box-shadow: 0 2px 12px rgba(32, 61, 123, 0.15);
    border-color: rgba(32, 61, 123, 0.3);
  }
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  min-width: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${NORDESTE}, #2d5aa0);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(32, 61, 123, 0.2);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const UserInfo = styled.div`
  flex: 1;
  min-width: 0;
  overflow: hidden;
`;

const UserName = styled.p`
  font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
  font-size: 0.875rem;
  font-weight: 500;
  color: #0f172a;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const UserEmail = styled.p`
  font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
  font-size: 0.75rem;
  color: #64748b;
  margin: 0.125rem 0 0 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const LogoutButton = styled.button`
  font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
  display: flex;
  align-items: center;
  justify-content: ${({ collapsed }) => (collapsed ? 'center' : 'flex-start')};
  width: 100%;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #334155;
  background: none;
  border: none;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s;

  &:hover {
    background: #fef2f2;
    color: #dc2626;
  }

  svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    margin-right: ${({ collapsed }) => (collapsed ? '0' : '0.5rem')};
  }
`;

const navGroups = [
  {
    title: 'Principal',
    items: [
      { path: '/admin/dashboard', icon: FiGrid, text: 'Dashboard' },
    ],
  },
  {
    title: 'Cadastros',
    items: [
      { path: '/admin/clientes', icon: FiUsers, text: 'Clientes' },
      { path: '/admin/equipamentos', icon: FiHardDrive, text: 'Equipamentos' },
      { path: '/admin/pecas', icon: FiTruck, text: 'Peças' },
      { path: '/admin/servicos', icon: FiTool, text: 'Serviços' },
    ],
  },
  {
    title: 'Operacional',
    items: [
      { path: '/admin/os', icon: FiFileText, text: 'Ordens de Serviço' },
      { path: '/admin/orcamentos', icon: FiArchive, text: 'Orçamentos' },
      { path: '/admin/recibos', icon: FiDollarSign, text: 'Recibos' },
    ],
  },
  {
    title: 'Administração',
    items: [
      { path: '/admin/usuarios', icon: FiUsers, text: 'Usuários' },
    ],
  },
];

const getImageSrc = (imageData) => {
  if (!imageData) return null;
  if (imageData.startsWith('http://') || imageData.startsWith('https://')) return imageData;
  if (imageData.startsWith('data:image/')) return imageData;
  return `data:image/jpeg;base64,${imageData}`;
};

function Sidebar({ isOpen, setIsOpen, collapsed, setCollapsed }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (isMobile && isOpen) setIsOpen(false);
  }, [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleNav = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <SidebarWrapper>
      <SidebarContainer isOpen={isOpen} isMobile={isMobile} collapsed={collapsed}>
        <Header collapsed={collapsed}>
          <LogoWrapper collapsed={collapsed}>
            <img src={logo} alt="Nordeste Serviços" />
          </LogoWrapper>
        </Header>

        {!isMobile && (
          <ToggleSection>
            <RecolherButton
              collapsed={collapsed}
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? (
                <FiChevronRight />
              ) : (
                <>
                  <FiChevronLeft />
                  Recolher
                </>
              )}
            </RecolherButton>
          </ToggleSection>
        )}

        <NavContent>
          {navGroups.map((group) => (
            <SectionGroup key={group.title}>
              {!collapsed && <SectionTitle>{group.title}</SectionTitle>}
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <NavItem
                    key={item.path}
                    active={active}
                    collapsed={collapsed}
                    onClick={() => handleNav(item.path)}
                    title={collapsed ? item.text : undefined}
                  >
                    <Icon />
                    {!collapsed && <span>{item.text}</span>}
                    {collapsed && <Tooltip>{item.text}</Tooltip>}
                  </NavItem>
                );
              })}
            </SectionGroup>
          ))}
        </NavContent>

        <Footer collapsed={collapsed}>
          {user && (
            <>
              <UserCard to="/admin/perfil" style={{ display: collapsed ? 'none' : 'flex' }}>
                <UserAvatar>
                  {getImageSrc(user?.fotoPerfil) ? (
                    <img
                      src={getImageSrc(user.fotoPerfil)}
                      alt={user.nome}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        const fallback = e.target.nextElementSibling;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <span style={{ display: getImageSrc(user?.fotoPerfil) ? 'none' : 'flex' }}>
                    {user?.nome?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </UserAvatar>
                <UserInfo>
                  <UserName>{user?.nome || 'Usuário'}</UserName>
                  <UserEmail>{user?.email || ''}</UserEmail>
                </UserInfo>
              </UserCard>
              {collapsed && (
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
                  <UserAvatar>
                    {getImageSrc(user?.fotoPerfil) ? (
                      <img src={getImageSrc(user.fotoPerfil)} alt="" />
                    ) : (
                      <span>{user?.nome?.charAt(0)?.toUpperCase() || 'U'}</span>
                    )}
                  </UserAvatar>
                </div>
              )}
            </>
          )}
          <LogoutButton collapsed={collapsed} onClick={handleLogout} title={collapsed ? 'Sair' : undefined}>
            <FiLogOut />
            {!collapsed && <span>Sair</span>}
          </LogoutButton>
        </Footer>
      </SidebarContainer>
    </SidebarWrapper>
  );
}

export default Sidebar;
