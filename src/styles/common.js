import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const PageContainer = styled.div`
    padding: 2rem;
    background-color: #f4f6f8;
    min-height: calc(100vh - 60px); // Subtrai a altura do header
`;

export const Title = styled.h1`
    font-size: 2rem;
    color: #333;
    margin-bottom: 2rem;
`;

export const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    background-color: #fff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
`;

export const Th = styled.th`
    background-color: #4a5568;
    color: white;
    padding: 1rem;
    text-align: left;
    font-weight: 600;
    white-space: nowrap;
`;

export const Td = styled.td`
    padding: 1rem;
    border-bottom: 1px solid #e2e8f0;
    color: #4a5568;
    white-space: nowrap;
`;

export const Tr = styled.tr`
    &:hover {
        background-color: #f1f5f9;
    }

    &[data-clickable="true"] {
        cursor: pointer;
    }
`;

export const Card = styled.div`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

export const Button = styled.button`
    display: inline-block;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: bold;
    transition: background-color 0.2s;
    min-width: 100px;
    text-align: center;

    ${({ variant }) => {
        switch (variant) {
            case 'danger':
                return `
                    background-color: #e53e3e;
                    color: white;
                    &:hover {
                        background-color: #c53030;
                    }
                `;
            case 'dangerOutline':
                return `
                    background-color: transparent;
                    color: #e53e3e;
                    border: 1px solid #e53e3e;
                    &:hover {
                        background-color: #e53e3e;
                        color: white;
                    }
                `;
            case 'secondary':
                return `
                    background-color: #64748b;
                    color: white;
                    &:hover {
                        background-color: #475569;
                    }
                `;
            default:
                return `
                    background-color: #3182ce;
                    color: white;
                    &:hover {
                        background-color: #2b6cb0;
                    }
                `;
        }
    }}
`;

export const ButtonGroup = styled.div`
    display: flex;
    gap: 0.5rem;
`;

export const Form = styled.form`
    background-color: #fff;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    max-width: 600px;
    margin: 0 auto;
`;

export const FormGroup = styled.div`
    margin-bottom: 1.5rem;
`;

export const Label = styled.label`
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #4a5568;
`;

export const Input = styled.input`
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #cbd5e0;
    border-radius: 4px;
    font-size: 1rem;
    color: #2d3748;

    &:focus {
        outline: none;
        border-color: #3182ce;
        box-shadow: 0 0 0 2px rgba(49, 130, 206, 0.2);
    }
`;

export const Select = styled.select`
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #cbd5e0;
    border-radius: 4px;
    font-size: 1rem;
    background-color: white;

    &:focus {
        outline: none;
        border-color: #3182ce;
        box-shadow: 0 0 0 2px rgba(49, 130, 206, 0.2);
    }
`;

export const Textarea = styled.textarea`
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #cbd5e0;
    border-radius: 4px;
    font-size: 1rem;
    color: #2d3748;
    font-family: inherit;
    resize: vertical;

    &:focus {
        outline: none;
        border-color: #3182ce;
        box-shadow: 0 0 0 2px rgba(49, 130, 206, 0.2);
    }
`;

export const ActionButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.25rem;
    font-size: 1.2rem;
    color: #4a5568;

    &:hover {
        color: #e53e3e;
    }
`;

export const ActionLink = styled(Link)`
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.25rem;
    font-size: 1.2rem;
    color: #4a5568;
    text-decoration: none;

    &:hover {
        color: #3182ce;
    }
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: flex-end;

   @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
    width: 100%;
  }
`;

export const RefreshButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  background-color: #fff;
  color: #4a5568;
  border: 1px solid #cbd5e0;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.9rem;
  line-height: 1.25;
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    background-color: #f1f5f9;
    border-color: #a0aec0;
  }
`;


export const PageHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #e2e8f0;
`;

export const CreateButton = styled(Link)`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    padding: 0.6rem 1.2rem;
    background-color: #3182ce;
    color: white;
    text-decoration: none;
    border-radius: 6px;
    font-weight: 500;
    font-size: 0.9rem;
    line-height: 1.25;
    transition: background-color 0.2s;
    text-align: center;

    &:hover {
        background-color: #2b6cb0;
    }
`;

export const DetailCard = styled.div`
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: ${({ theme }) => theme.spacing.large};
  margin-bottom: ${({ theme }) => theme.spacing.large};
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
`;

export const SectionTitle = styled.h2`
  border-bottom: 2px solid ${({ theme }) => theme.colors.primary};
  padding-bottom: ${({ theme }) => theme.spacing.small};
  margin-bottom: ${({ theme }) => theme.spacing.medium};
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.dark};
`;

export const DetailSection = styled.div`
    background-color: #fff;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    margin-bottom: 2rem;
`;

export const DetailItem = styled.div`
    display: flex;
    flex-direction: column;
`;

export const DetailLabel = styled.span`
    font-size: 0.875rem;
    color: #64748b;
    margin-bottom: 0.25rem;
`;

export const DetailValue = styled.span`
    font-size: 1rem;
    color: #1e293b;
    font-weight: 500;
`;
