import { styled } from "styled-components";

const StyledLogo = styled.div`
  text-align: center;
`;

const Img = styled.img`
  height: 9rem;
  width: 9rem;
  border-radius: 10%;
`;

const Logo = () => {
  return (
    <StyledLogo>
      <Img
        src="https://pjlxgflmrejgipvxmjgr.supabase.co/storage/v1/object/public/cabin-images/logo.png"
        alt="Logo"
      />
    </StyledLogo>
  );
};

export default Logo;
