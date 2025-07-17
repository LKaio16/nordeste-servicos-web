import styled from 'styled-components';
import React from 'react';
import { Button } from '../../styles/common';

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  max-width: 450px;
  width: 100%;
  margin: 1rem;
`;

const ModalHeader = styled.div`
    padding-bottom: 1rem;
    border-bottom: 1px solid #e5e7eb;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 1.25rem;
  color: #c53030; /* Red color for error */
`;

const ModalBody = styled.div`
    padding: 1.5rem 0;
    font-size: 1rem;
    color: #374151;
    line-height: 1.5;
`;

const ButtonGroup = styled.div`
  margin-top: 1.5rem;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

function AlertModal({ isOpen, onClose, title, message }) {
  if (!isOpen) return null;

  return (
    <ModalBackdrop onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <p>{message}</p>
        </ModalBody>
        <ButtonGroup>
          <Button onClick={onClose}>OK</Button>
        </ButtonGroup>
      </ModalContent>
    </ModalBackdrop>
  );
}

export default AlertModal; 