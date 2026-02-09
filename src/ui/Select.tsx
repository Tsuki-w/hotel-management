import styled from "styled-components";

const StyledSelect = styled.select<{ type?: string }>`
  font-size: 1.4rem;
  padding: 0.8rem 1.2rem;
  border: 1px solid
    ${(props) =>
      props.type === "white"
        ? "var(--color-grey-100)"
        : "var(--color-grey-300)"};
  border-radius: var(--border-radius-sm);
  background-color: var(--color-grey-0);
  font-weight: 500;
  box-shadow: var(--shadow-sm);
`;

type IProps = {
  options: { value: string; label: string }[];
  value: string;
  type?: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

/**
 * 通用下拉选择组件
 * @param {Object} props
 * @param {Array<{label: string, value: any}>} props.options 选项列表
 * @param {'white' | 'gray'} props.type 背景颜色主题
 * @param {function} props.onChange 值改变时的回调
 * @param {string|number} props.value 当前选中的值
 */

function Select({ options, value, type, onChange }: IProps) {
  return (
    <StyledSelect value={value} type={type} onChange={onChange}>
      {options.map((option) => (
        <option value={option.value} key={option.value}>
          {option.label}
        </option>
      ))}
    </StyledSelect>
  );
}

export default Select;
