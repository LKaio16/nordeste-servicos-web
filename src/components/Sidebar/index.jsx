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
  FiChevronLeft,
  FiChevronRight,
  FiPackage,
  FiCreditCard,
} from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import logo from '../../assets/logo.png';

const SidebarWrapper = styled.div`
  position: relative;
  z-index: 1000;
`;

const SidebarContainer = styled.div`
  width: ${({ $collapsed }) => ($collapsed ? '78px' : '260px')};
  background: #0a1e3d;
  display: flex;
  flex-direction: column;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  transform: ${({ $isOpen, $isMobile }) =>
    $isMobile ? ($isOpen ? 'translateX(0)' : 'translateX(-100%)') : 'translateX(0)'};
  overflow: hidden;

  @media (max-width: 1023px) {
    width: 260px;
    box-shadow: ${({ $isOpen }) => ($isOpen ? '8px 0 40px rgba(0, 0, 0, 0.3)' : 'none')};
  }
`;

const LogoArea = styled.div`
  padding: ${({ $collapsed }) => ($collapsed ? '20px 12px' : '24px 24px')};
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  min-height: ${({ $collapsed }) => ($collapsed ? '72px' : 'auto')};
  transition: padding 0.3s;

  img {
    height: ${({ $collapsed }) => ($collapsed ? '36px' : '52px')};
    width: auto;
    max-width: 100%;
    object-fit: contain;
    filter: brightness(0) invert(1);
    opacity: 0.95;
    transition: height 0.3s;
  }
`;

const CollapseBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: ${({ $collapsed }) => ($collapsed ? 'center' : 'flex-start')};
  gap: 8px;
  width: calc(100% - 24px);
  margin: 8px 12px;
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 500;
  font-family: inherit;
  color: rgba(255, 255, 255, 0.35);
  background: none;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: rgba(255, 255, 255, 0.6);
    background: rgba(255, 255, 255, 0.04);
  }

  svg { width: 15px; height: 15px; flex-shrink: 0; }

  @media (max-width: 1023px) { display: none; }
`;

const NavScroll = styled.nav`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 8px 12px;

  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 3px; }
`;

const NavGroup = styled.div`
  margin-bottom: 20px;
`;

const GroupLabel = styled.p`
  padding: 0 12px;
  margin: 0 0 6px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: rgba(255, 255, 255, 0.25);
`;

const NavItem = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  padding: ${({ $collapsed }) => ($collapsed ? '10px' : '9px 12px')};
  margin-bottom: 2px;
  font-size: 13.5px;
  font-weight: 500;
  font-family: inherit;
  line-height: 1.4;
  color: ${({ $active }) => ($active ? '#fff' : 'rgba(255, 255, 255, 0.55)')};
  background: ${({ $active }) => ($active ? 'rgba(255, 255, 255, 0.1)' : 'transparent')};
  border: none;
  border-radius: 10px;
  cursor: pointer;
  text-align: left;
  transition: all 0.15s ease;
  position: relative;
  justify-content: ${({ $collapsed }) => ($collapsed ? 'center' : 'flex-start')};

  ${({ $active }) => $active && `
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 20px;
      border-radius: 0 3px 3px 0;
      background: #4d9fff;
    }
  `}

  &:hover {
    color: #fff;
    background: ${({ $active }) => ($active ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.06)')};
  }

  svg {
    width: 18px;
    height: 18px;
    min-width: 18px;
    flex-shrink: 0;
    margin-right: ${({ $collapsed }) => ($collapsed ? '0' : '12px')};
    opacity: ${({ $active }) => ($active ? '1' : '0.7')};
    transition: opacity 0.15s;
  }

  &:hover svg { opacity: 1; }

  span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const NavTooltip = styled.span`
  position: absolute;
  left: calc(100% + 12px);
  top: 50%;
  transform: translateY(-50%);
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 600;
  color: #fff;
  background: #1a4494;
  border-radius: 8px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  z-index: 50;
  transition: opacity 0.15s, visibility 0.15s;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);

  &::before {
    content: '';
    position: absolute;
    left: -4px;
    top: 50%;
    transform: translateY(-50%) rotate(45deg);
    width: 8px;
    height: 8px;
    background: #1a4494;
  }

  ${NavItem}:hover & {
    opacity: 1;
    visibility: visible;
  }
`;

const FooterArea = styled.div`
  padding: ${({ $collapsed }) => ($collapsed ? '12px' : '16px')};
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  transition: padding 0.3s;
`;

const UserCard = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  margin-bottom: 8px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.06);
  text-decoration: none;
  color: inherit;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.1);
  }
`;

const Avatar = styled.div`
  width: 36px;
  height: 36px;
  min-width: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, #1a4494, #2b6fc2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 700;
  font-size: 14px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 10px;
  }
`;

const UserInfo = styled.div`
  flex: 1;
  min-width: 0;
  overflow: hidden;
`;

const UserName = styled.p`
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const UserEmail = styled.p`
  margin: 2px 0 0;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.35);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const LogoutBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: ${({ $collapsed }) => ($collapsed ? 'center' : 'flex-start')};
  gap: 8px;
  width: 100%;
  padding: 9px 12px;
  font-size: 13px;
  font-weight: 500;
  font-family: inherit;
  color: rgba(255, 255, 255, 0.4);
  background: none;
  border: none;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s;

  &:hover {
    background: rgba(220, 38, 38, 0.12);
    color: #f87171;
  }

  svg { width: 16px; height: 16px; flex-shrink: 0; }
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
    title: 'Financeiro',
    items: [
      { path: '/admin/fornecedores', icon: FiPackage, text: 'Fornecedores' },
      { path: '/admin/contas', icon: FiCreditCard, text: 'Contas a pagar/receber' },
      { path: '/admin/notas-fiscais', icon: FiFileText, text: 'Notas fiscais' },
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

  const handleNav = (path) => navigate(path);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  const imgSrc = getImageSrc(user?.fotoUrl || user?.fotoPerfil);

  return (
    <SidebarWrapper>
      <SidebarContainer $isOpen={isOpen} $isMobile={isMobile} $collapsed={collapsed}>
        <LogoArea $collapsed={collapsed}>
          <img src={logo} alt="Nordeste Serviços" />
        </LogoArea>

        {!isMobile && (
          <CollapseBtn $collapsed={collapsed} onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <FiChevronRight /> : <><FiChevronLeft /> Recolher</>}
          </CollapseBtn>
        )}

        <NavScroll>
          {navGroups.map((group) => (
            <NavGroup key={group.title}>
              {!collapsed && <GroupLabel>{group.title}</GroupLabel>}
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <NavItem
                    key={item.path}
                    $active={active}
                    $collapsed={collapsed}
                    onClick={() => handleNav(item.path)}
                    title={collapsed ? item.text : undefined}
                  >
                    <Icon />
                    {!collapsed && <span>{item.text}</span>}
                    {collapsed && <NavTooltip>{item.text}</NavTooltip>}
                  </NavItem>
                );
              })}
            </NavGroup>
          ))}
        </NavScroll>

        <FooterArea $collapsed={collapsed}>
          {user && !collapsed && (
            <UserCard to="/admin/perfil">
              <Avatar>
                {imgSrc ? (
                  <img
                    src={imgSrc}
                    alt={user.nome}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      if (e.target.nextElementSibling) e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <span style={{ display: imgSrc ? 'none' : 'flex' }}>
                  {user?.nome?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </Avatar>
              <UserInfo>
                <UserName>{user?.nome || 'Usuário'}</UserName>
                <UserEmail>{user?.email || ''}</UserEmail>
              </UserInfo>
            </UserCard>
          )}

          {user && collapsed && (
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
              <Avatar>
                {imgSrc ? (
                  <img src={imgSrc} alt="" />
                ) : (
                  <span>{user?.nome?.charAt(0)?.toUpperCase() || 'U'}</span>
                )}
              </Avatar>
            </div>
          )}

          <LogoutBtn $collapsed={collapsed} onClick={handleLogout} title={collapsed ? 'Sair' : undefined}>
            <FiLogOut />
            {!collapsed && <span>Sair</span>}
          </LogoutBtn>
        </FooterArea>
      </SidebarContainer>
    </SidebarWrapper>
  );
}

export default Sidebar;
