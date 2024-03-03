import { CloseIcon } from "@chakra-ui/icons";
import { Box } from "@chakra-ui/react";

const UserBadgeItem = ({ user, deleteUser }) => {
  return (
    <Box
      px={2}
      py={1}
      borderRadius="lg"
      m={1}
      mb={2}
      fontSize={15}
      color="white"
      bgColor="purple"
      cursor="pointer"
      onClick={deleteUser}
    >
      {user.name}
      <CloseIcon pl={1} />
    </Box>
  );
};
export default UserBadgeItem;
