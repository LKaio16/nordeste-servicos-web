import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem;
  width: 100%;
  height: 100%;
`;

const StyledSpinner = styled.div`
  border: 6px solid #f3f3f3; /* Light grey */
  border-top: 6px solid #3182ce; /* Blue from your theme */
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: ${spin} 1s linear infinite;
`;

const Spinner = () => (
    <SpinnerWrapper>
        <StyledSpinner />
    </SpinnerWrapper>
);

export default Spinner; 