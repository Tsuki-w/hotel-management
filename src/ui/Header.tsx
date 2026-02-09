import { styled } from "styled-components";
import HeaderMenu from "@/ui/HeaderMenu";
import UserAvatar from "@/features/auth/UserAvatar";

const StyledHeader = styled.header`
  display: flex;
  gap: 1.2rem;
  justify-content: flex-end;
  align-items: center;
  background-color: var(--color-grey-0);
  padding: 1.2rem 4.8rem;
  border-bottom: 1px solid var(--color-grey-100);
  grid-row: 1/2;
  grid-column: 2/3;
`;

const Header = () => {
  return (
    <StyledHeader>
      <UserAvatar />
      <HeaderMenu />
    </StyledHeader>
  );
};

export default Header;
