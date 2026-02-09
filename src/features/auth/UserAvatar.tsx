import styled from "styled-components";
import { useQuery } from "@tanstack/react-query";
import { userQuery } from "@/loader/userLoader";

const StyledUserAvatar = styled.div`
  display: flex;
  gap: 1.2rem;
  align-items: center;
  font-weight: 500;
  font-size: 1.4rem;
  color: var(--color-grey-600);
`;

const Avatar = styled.img`
  display: block;
  width: 4rem;
  width: 3.6rem;
  border-radius: 50%;
  outline: 2px solid var(--color-grey-100);
`;

function UserAvatar() {
  const { data: user } = useQuery(userQuery());
  const fullName = user?.user_metadata?.fullName || "Tsuki";
  const avatar = user?.user_metadata?.avatar;

  return (
    <StyledUserAvatar>
      <div>
        <Avatar
          src={avatar || "public/avatar.jpg"}
          alt={`${fullName} 的头像`}
        />
        <span>{fullName}</span>
      </div>
    </StyledUserAvatar>
  );
}

export default UserAvatar;
