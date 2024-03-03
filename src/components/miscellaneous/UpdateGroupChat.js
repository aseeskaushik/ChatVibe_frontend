import { ViewIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormControl,
  IconButton,
  Input,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { Fragment, useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import UserBadgeItem from "../UserList/UserBadgeItem";
import axios from "axios";
import UserListItem from "../UserList/UserListItem";

const UpdateGroupChat = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
  const [groupChatName, setGroupChatName] = useState("");
  const [renameLoading, setRenameLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState([]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, selectedChat, setSelectedChat } = ChatState();

  const toast = useToast();

  const deleteUserHandler = async (userToDelete) => {
    if (
      selectedChat.groupAdmin._id !== user._id &&
      userToDelete._id !== user._id
    ) {
      return toast({
        title: "Only admin can remove someone",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "/api/chat/groupremove",
        {
          chatId: selectedChat._id,
          userId: userToDelete._id,
        },
        config
      );
      userToDelete._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error occured",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
    }
  };

  const renameHandler = async () => {
    if (!groupChatName) {
      return;
    }
    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "/api/chat/rename",
        {
          chatName: groupChatName,
          chatId: selectedChat._id,
        },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      toast({
        title: "Error occured",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setRenameLoading(false);
    }
    setGroupChatName("");
    onClose();
  };

  const searchHandler = async (event) => {
    const query = event.target.value;
    setSearch(query);
    if (!query) {
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setSearchResult(data);
      setLoading(false);
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

  const addUserHandler = async (userToAdd) => {
    if (selectedChat.users.find((user) => user._id === userToAdd._id)) {
      return toast({
        title: "user already presents in group",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    }
    if (selectedChat.groupAdmin._id !== user._id) {
      return toast({
        title: "Only admin can add users",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "/api/chat/groupadd",
        {
          chatId: selectedChat._id,
          userId: userToAdd._id,
        },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error occured",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
    }
  };

  return (
    <Fragment>
      <IconButton
        display={{ base: "flex" }}
        icon={<ViewIcon />}
        onClick={onOpen}
      />
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader
            fontSize="25px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            {selectedChat.chatName}
          </DrawerHeader>
          <DrawerBody display="flex" flexDir="column" alignItems="center">
            <Box display="flex" flexWrap="wrap">
              {selectedChat.users.map((user) => (
                <UserBadgeItem
                  key={user._id}
                  user={user}
                  deleteUser={() => deleteUserHandler(user)}
                />
              ))}
            </Box>
            <FormControl display="flex">
              <Input
                placeholder="Chat name"
                mb={3}
                value={groupChatName}
                onChange={(event) => setGroupChatName(event.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={renameLoading}
                onClick={renameHandler}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input placeholder="Add Users" mb={1} onChange={searchHandler} />
            </FormControl>
            {loading ? (
              <Spinner m="auto" display="flex" />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  accessHandler={() => addUserHandler(user)}
                />
              ))
            )}
          </DrawerBody>
          <DrawerFooter>
            <Button colorScheme="red" onClick={() => deleteUserHandler(user)}>
              Leave
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Fragment>
  );
};
export default UpdateGroupChat;
