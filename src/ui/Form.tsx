import styled, { css } from "styled-components";

type IProps = {
  type?: string;
};

const Form = styled.form<IProps>`
  background-color: #fff;
  margin-top: 1rem;
  padding: 3rem;
  border-radius: 1rem;
  ${(props) =>
    props.type === "regular" &&
    css`
      padding: 2.4rem 4rem;

      /* Box */
      background-color: var(--color-grey-0);
      border: 1px solid var(--color-grey-100);
      border-radius: var(--border-radius-md);
    `}

  ${(props) =>
    props.type === "modal" &&
    css`
      width: 80rem;
    `}
    
  overflow: hidden;
  font-size: 1.4rem;
`;

Form.defaultProps = {
  type: "regular",
};

export default Form;
