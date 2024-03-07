import axios from "axios";
import { ChatState } from "../context/ChatProvider";
import { Box, Stack, Text, useToast } from "@chakra-ui/react";
import { useEffect } from "react";
// import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "./miscellaneous/ChatLoading";
import GroupChatDrawer from "./miscellaneous/GroupChatDrawer";
var flag = false;

const MyChats = ({ fetchAgain }) => {
  const {
    user,
    selectedChat,
    setSelectedChat,
    chats,
    setChats,
    // notification,
    // setNotification,
  } = ChatState();
  // const [loggedUser, setLoggedUser] = useState();

  const toast = useToast();
  const fetchChats = async () => {
    flag = false;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get("/api/chat", config);
      flag = true;
      setChats(data);
    } catch (error) {
      toast({
        title: "Error occured",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    // setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);

  const getSender = (users) => {
    // console.log(user);
    return users[0]?._id === user._id ? users[1]?.name : users[0]?.name;
  };

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatDrawer></GroupChatDrawer>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflow="scroll">
            {chats.map((chat) => (
              <Box
                key={chat._id}
                onClick={() => {
                  setSelectedChat(chat);
                  // setNotification((prevState) => {
                  //   const updatedNotifications = new Set(prevState);
                  //   updatedNotifications.delete();
                  //   return Array.from(updatedNotifications);
                  // });
                }}
                cursor="pointer"
                bg={
                  selectedChat && selectedChat._id === chat._id
                    ? "#38B2AC"
                    : "#E8E8E8"
                }
                color={
                  selectedChat && selectedChat._id === chat._id
                    ? "white"
                    : "black"
                }
                px={3}
                py={2}
                borderRadius="lg"
              >
                {flag && (
                  <Text key={chat._id}>
                    {chat.isGroupChat ? chat?.chatName : getSender(chat.users)}
                  </Text>
                )}
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
