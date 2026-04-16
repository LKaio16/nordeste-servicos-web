import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FiMenu, FiSidebar } from 'react-icons/fi';
import Sidebar from '../Sidebar';
import Breadcrumb from '../Breadcrumb';

const LayoutContainer = styled.div`
  min-height: 100vh;
  background: #f4f7fb;
`;

const Overlay = styled.div`
  display: none;
  @media (max-width: 1023px) {
    display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
    position: fixed;
    inset: 0;
    background: rgba(10, 30, 61, 0.5);
    backdrop-filter: blur(2px);
    z-index: 999;
    transition: opacity 0.3s;
  }
`;

const MainContent = styled.main`
  min-height: 100vh;
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  @media (min-width: 1024px) {
    margin-left: ${({ $collapsed }) => ($collapsed ? '78px' : '260px')};
  }

  @media (max-width: 1023px) {
    margin-left: 0;
  }
`;

const TopBar = styled.div`
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 32px;
  height: 56px;
  background: #fff;
  border-bottom: 1px solid #eef2f9;
  box-shadow: 0 1px 4px rgba(12, 45, 107, 0.04);

  @media (max-width: 767px) {
    padding: 0 16px;
  }
`;

const MenuButton = styled.button`
  display: ${({ $hide }) => ($hide ? 'none' : 'flex')};
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid #eef2f9;
  background: #f8faff;
  color: #1a4494;
  cursor: pointer;
  border-radius: 10px;
  transition: all 0.15s;
  flex-shrink: 0;

  &:hover {
    background: #eef2f9;
    border-color: #d6e0f0;
    color: #0c2d6b;
  }

  svg { width: 17px; height: 17px; }
`;

const Divider = styled.div`
  width: 1px;
  height: 22px;
  background: #e2e8f4;
  flex-shrink: 0;

  @media (max-width: 767px) { display: none; }
`;

const TopBarContent = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  min-width: 0;
  overflow: hidden;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: #0c2d6b;
  letter-spacing: -0.2px;
  white-space: nowrap;
`;

const ContentArea = styled.div`
  padding: 24px 32px;
  max-width: 1600px;
  margin: 0 auto;

  @media (max-width: 767px) {
    padding: 16px;
  }
`;

function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  const isDashboard = location.pathname === '/admin/dashboard' || location.pathname === '/admin';

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <LayoutContainer>
      <Overlay $isOpen={sidebarOpen} onClick={() => setSidebarOpen(false)} />

      <Sidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <MainContent $collapsed={collapsed}>
        <TopBar>
          <MenuButton
            $hide={!isMobile}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Abrir menu"
          >
            <FiMenu />
          </MenuButton>

          <MenuButton
            $hide={isMobile}
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
          >
            <FiSidebar />
          </MenuButton>

          <Divider />

          <TopBarContent>
            {isDashboard ? (
              <Title>Nordeste Serviços</Title>
            ) : (
              <Breadcrumb />
            )}
          </TopBarContent>
        </TopBar>

        <ContentArea>
          <Outlet />
        </ContentArea>
      </MainContent>
    </LayoutContainer>
  );
}

export default MainLayout;
