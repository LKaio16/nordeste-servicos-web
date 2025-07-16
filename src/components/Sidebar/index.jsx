import styled from 'styled-components';
import { NavLink, Link } from 'react-router-dom';
import {
  FiGrid, FiUsers, FiHardDrive, FiTool, FiFileText, FiTruck, FiArchive, FiLogOut, FiMenu, FiX, FiUser
} from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import logo from '../../assets/logo.png';

const SidebarWrapper = styled.div`
  position: relative;
  z-index: 1000;
`;

const SidebarContainer = styled.div`
  width: ${({ isOpen }) => (isOpen ? '260px' : '88px')};
  background-color: #ffffff;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease, transform 0.3s ease;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;

  @media (max-width: 768px) {
    width: 260px;
    transform: ${({ isOpen }) => (isOpen ? 'translateX(0)' : 'translateX(-100%)')};
    box-shadow: 0 0 20px rgba(0,0,0,0.1);
  }
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  margin-bottom: 1rem;
  background-color: #00529b;

  img {
    height: 70px;
    width: auto;
    transition: transform 0.3s ease, opacity 0.3s ease;
    transform: ${({ isOpen }) => (isOpen ? 'scale(1)' : 'scale(0)')};
    opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  }
`;

const NavList = styled.nav`
  flex-grow: 1;
  overflow-y: auto;
  padding-top: 1rem;
`;

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  color: #4a5568;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.2s, color 0.2s;
  white-space: nowrap;
  overflow: hidden;

  &:hover {
    background-color: #f1f5f9;
    color: #1a202c;
  }

  &.active {
    background-color: #e2e8f0;
    color: #00529b;
    border-right: 3px solid #00529b;
  }

  svg {
    min-width: 24px;
    margin-right: ${({ isOpen }) => (isOpen ? '1rem' : '0')};
    font-size: 1.3rem;
    transition: margin-right 0.3s ease;
  }
`;

const UserCard = styled.div`
    border-top: 1px solid #e2e8f0;
    padding: 1rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    white-space: nowrap;
    overflow: hidden;
`;

const UserAvatar = styled.div`
    background-color: #e2e8f0;
    color: #4a5568;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    flex-shrink: 0;
    overflow: hidden;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    svg {
        display: flex;
        align-items: center;
        justify-content: center;
    }
`;

const UserInfo = styled.div`
    display: flex;
    flex-direction: column;
    overflow: hidden;
`;

const UserName = styled.span`
    font-weight: 600;
    font-size: 0.9rem;
    color: #1a202c;
    text-decoration: none;

    &:hover {
        color: #00529b;
    }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #64748b;
  font-weight: 500;
  font-size: 0.85rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: color 0.2s;

  &:hover {
    color: #e53e3e;
  }
`;

const ToggleButton = styled.button`
    position: absolute;
    top: 24px;
    left: ${({ isOpen }) => (isOpen ? '245px' : '72px')};
    z-index: 1001;
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 50%;
    width: 44px;
    height: 44px;
    cursor: pointer;
    font-size: 1.4rem;
    color: #00529b;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    transition: left 0.3s ease, transform 0.3s ease;
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
        transform: scale(1.1);
    }

    @media (max-width: 768px) {
        position: fixed;
        left: ${({ isOpen }) => (isOpen ? '275px' : '1.5rem')};
        top: 1.5rem;
    }
`;

const navLinks = [
  { to: "/admin/dashboard", icon: <FiGrid />, text: "Dashboard" },
  { to: "/admin/clientes", icon: <FiUsers />, text: "Clientes" },
  { to: "/admin/equipamentos", icon: <FiHardDrive />, text: "Equipamentos" },
  { to: "/admin/servicos", icon: <FiTool />, text: "Serviços" },
  { to: "/admin/os", icon: <FiFileText />, text: "Ordens de Serviço" },
  { to: "/admin/orcamentos", icon: <FiArchive />, text: "Orçamentos" },
  { to: "/admin/pecas", icon: <FiTruck />, text: "Peças" },
  { to: "/admin/usuarios", icon: <FiUsers />, text: "Usuários" }
];

function Sidebar({ isOpen, setIsOpen }) {
  const { user, logout } = useAuth();

  return (
    <SidebarWrapper>
      <SidebarContainer isOpen={isOpen}>
        <LogoSection isOpen={isOpen}>
          <img src={logo} alt="Logo" />
        </LogoSection>
        <NavList>
          {navLinks.map((link) => (
            <NavItem key={link.to} to={link.to} isOpen={isOpen}>
              {link.icon}
              {isOpen && <span>{link.text}</span>}
            </NavItem>
          ))}
        </NavList>
        <UserCard>
          <UserAvatar>
            {user?.fotoPerfil ? (
              <img src={`data:image/jpeg;base64,${user.fotoPerfil}`} alt="Avatar" />
            ) : (
              <FiUser />
            )}
          </UserAvatar>
          {isOpen && (
            <UserInfo>
              <Link to="/admin/perfil" style={{ textDecoration: 'none' }}>
                <UserName>{user?.nome || 'Usuário'}</UserName>
              </Link>
              <LogoutButton onClick={logout}>
                <FiLogOut /> Sair
              </LogoutButton>
            </UserInfo>
          )}
        </UserCard>
      </SidebarContainer>
      <ToggleButton onClick={() => setIsOpen(!isOpen)} isOpen={isOpen}>
        {isOpen ? <FiX /> : <FiMenu />}
      </ToggleButton>
    </SidebarWrapper>
  );
}

export default Sidebar; 