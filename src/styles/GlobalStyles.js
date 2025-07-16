import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
        font-family: 'Poppins', sans-serif;
        background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    }

    a {
        color: inherit;
        text-decoration: none;
  }
`; 