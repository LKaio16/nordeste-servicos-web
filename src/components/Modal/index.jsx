import styled from 'styled-components';
import React from 'react';

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: ${({ theme }) => theme.spacing.xlarge};
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  text-align: center;
  max-width: 400px;
`;

const ModalTitle = styled.h2`
  margin-top: 0;
`;

const ButtonGroup = styled.div`
  margin-top: ${({ theme }) => theme.spacing.large};
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.medium};
`;

const Button = styled.button`
  padding: ${({ theme }) => theme.spacing.small} ${({ theme }) => theme.spacing.large};
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-weight: bold;
`;

const DeleteButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.danger};
  color: white;
`;

const CancelButton = styled(Button)`
  background-color: #eee;
  color: #333;
`;


function Modal({ isOpen, onClose, onConfirm, title, children }) {
  if (!isOpen) return null;

  return (
    <ModalBackdrop onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalTitle>{title}</ModalTitle>
        <div>{children}</div>
        <ButtonGroup>
          <CancelButton onClick={onClose}>Cancelar</CancelButton>
          <DeleteButton onClick={onConfirm}>Excluir</DeleteButton>
        </ButtonGroup>
      </ModalContent>
    </ModalBackdrop>
  );
}

export default Modal; 