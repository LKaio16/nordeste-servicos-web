import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import { FiMenu, FiSidebar } from 'react-icons/fi';
import Sidebar from '../Sidebar';
import Breadcrumb from '../Breadcrumb';

const LayoutContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(to bottom right, #f8fafc, rgba(241, 245, 249, 0.5), rgba(238, 242, 255, 0.2));
`;

const Overlay = styled.div`
  display: none;
  @media (max-width: 1023px) {
    display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
    transition: opacity 0.3s;
  }
`;

const MainContent = styled.main`
  min-height: 100vh;
  transition: margin-left 0.3s ease, padding-left 0.3s ease;

  /* Desktop: ajusta baseado no estado do menu */
  @media (min-width: 1024px) {
    margin-left: ${({ collapsed }) => (collapsed ? '80px' : '256px')};
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
  gap: 0.5rem;
  padding: 1rem 1.5rem 1rem 2rem;
  border-bottom: 1px solid #e2e8f0;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const MenuButton = styled.button`
  display: ${({ $hide }) => ($hide ? 'none' : 'flex')};
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  background: none;
  color: #64748b;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s;

  &:hover {
    background: #f1f5f9;
    color: #334155;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const Divider = styled.div`
  width: 1px;
  height: 24px;
  background: #e2e8f0;

  @media (max-width: 767px) {
    display: none;
  }
`;

const Title = styled.h2`
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: #334155;
`;

const ContentArea = styled.div`
  padding: 1.5rem 2rem;
  max-width: 1600px;
  margin: 0 auto;

  @media (max-width: 767px) {
    padding: 1rem;
  }
`;

function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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
      <Overlay isOpen={sidebarOpen} onClick={() => setSidebarOpen(false)} />

      <Sidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <MainContent collapsed={collapsed}>
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
          <Title>Nordeste Serviços</Title>
        </TopBar>

        <ContentArea>
          <Breadcrumb />
          <Outlet />
        </ContentArea>
      </MainContent>
    </LayoutContainer>
  );
}

export default MainLayout;
