import styled from "styled-components";
import React from "react";

const StyledFormRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  padding: 1.2rem 0;
`;

const Label = styled.label`
  font-weight: 500;
`;

const Error = styled.span`
  font-size: 1.4rem;
  color: var(--color-red-700);
`;

type IProps = {
  label?: string;
  error?: string;
  children: React.ReactElement<React.HTMLAttributes<HTMLElement>>;
};

function FormRowVertical({ label, error, children }: IProps) {
  const childId = children.props.id;
  return (
    <StyledFormRow>
      {label && <Label htmlFor={childId}>{label}</Label>}
      {children}
      {error && <Error>{error}</Error>}
    </StyledFormRow>
  );
}

export default FormRowVertical;
