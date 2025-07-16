import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import Sidebar from '../Sidebar';

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  position: relative;
  background-color: #f8f9fa;
`;

const ContentContainer = styled.main`
  flex-grow: 1;
  padding: 2rem;
  transition: margin-left 0.3s ease;
  margin-left: ${({ isOpen }) => (isOpen ? '260px' : '88px')};
  width: 100%;
  overflow-x: hidden;

  @media (max-width: 768px) {
    margin-left: 0;
    padding: 1.5rem;
    padding-top: 6rem; /* Add space for the floating button */
  }
`;

const Overlay = styled.div`
    display: none;
    @media (max-width: 768px) {
        display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.4);
        z-index: 999;
    }
`;

function MainLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth > 1024);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <LayoutContainer>
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />
      <Overlay isOpen={isSidebarOpen} onClick={() => setSidebarOpen(false)} />
      <ContentContainer isOpen={isSidebarOpen}>
        <Outlet />
      </ContentContainer>
    </LayoutContainer>
  );
}

export default MainLayout; 