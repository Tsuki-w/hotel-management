import { useSearchParams } from "react-router-dom";
import styled, { css } from "styled-components";

const StyledFilter = styled.div`
  border: 1px solid var(--color-grey-100);
  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-sm);
  border-radius: var(--border-radius-sm);
  padding: 0.4rem;
  display: flex;
  gap: 0.4rem;
`;

const FilterButton = styled.button<{ active: string }>`
  background-color: var(--color-grey-0);
  border: none;

  ${(props) =>
    props.active === "true" &&
    css`
      background-color: var(--color-brand-600);
      color: var(--color-brand-50);
    `}

  border-radius: var(--border-radius-sm);
  font-weight: 500;
  font-size: 1.4rem;
  padding: 0.44rem 0.8rem;
  transition: all 0.3s;

  &:hover:not(:disabled) {
    background-color: var(--color-brand-600);
    color: var(--color-brand-50);
  }
`;

type IProps = {
  filterField: string;
  options: { value: string; label: string }[];
};

function Filter({ filterField, options }: IProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const handleClick = (value: string) => {
    searchParams.set(filterField, value);
    if (searchParams.get("page")) {
      searchParams.set("page", "1");
    }
    setSearchParams(searchParams);
  };
  return (
    <StyledFilter>
      {options.map((filter, index) => (
        <FilterButton
          key={index}
          disabled={filter.value === searchParams.get(filterField)}
          active={
            filter.value === searchParams.get(filterField) ? "true" : "false"
          }
          onClick={() => handleClick(filter.value)}
        >
          {filter.label}
        </FilterButton>
      ))}
    </StyledFilter>
  );
}

export default Filter;
