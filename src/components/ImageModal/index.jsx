import styled from 'styled-components';
import { FiX } from 'react-icons/fi';

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
  padding: 1rem;
`;

const ModalContent = styled.div`
  position: relative;
  background-color: #fff;
  border-radius: 8px;
  padding: 1rem;
  max-width: 90vw;
  max-height: 90vh;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  display: flex;
`;

const CloseButton = styled.button`
  position: absolute;
  top: -15px;
  right: -15px;
  background: #fff;
  border: 2px solid #333;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #333;
  
  &:hover {
    background: #333;
    color: #fff;
  }
`;

const Image = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;

const ImageModal = ({ src, alt, isOpen, onClose }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <ModalBackdrop onClick={onClose}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
                <CloseButton onClick={onClose}>
                    <FiX />
                </CloseButton>
                <Image src={src} alt={alt} />
            </ModalContent>
        </ModalBackdrop>
    );
};

export default ImageModal; 