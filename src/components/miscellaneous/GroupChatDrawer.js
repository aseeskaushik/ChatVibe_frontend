import { AddIcon } from "@chakra-ui/icons";
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
  Input,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { Fragment, useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import axios from "axios";
// import ChatLoading from "./ChatLoading";
import UserListItem from "../UserList/UserListItem";
import UserBadgeItem from "../UserList/UserBadgeItem";

const GroupChatDrawer = ({ children }) => {
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user, setSelectedChat, setChats } = ChatState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

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

  const addUserHandler = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      return toast({
        title: "user already presents in group",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    }
    setSelectedUsers((prevState) => {
      return [userToAdd, ...prevState];
    });
  };

  const deleteUserHandler = (userToDelete) => {
    setSelectedUsers((prevState) => {
      const updatedUsers = new Set(prevState);
      updatedUsers.delete(userToDelete);
      return Array.from(updatedUsers);
    });
  };

  const submitHandler = async () => {
    if (!groupChatName || !selectedUsers) {
      return toast({
        title: "please fill allthe details",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        "/api/chat/group",
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((user) => user._id)),
        },
        config
      );
      setChats((prevState) => {
        return [data, ...prevState];
      });
      setSelectedChat(data);
      onClose();
      toast({
        title: "Group has been created successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
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

  return (
    <Fragment>
      <Button
        display="flex"
        fontSize={{ base: "17px", md: "10px", lg: "17px" }}
        rightIcon={<AddIcon />}
        onClick={onOpen}
      >
        New Group Chat
      </Button>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader
            fontSize="25px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            Create Group Chat
          </DrawerHeader>
          <DrawerBody display="flex" flexDir="column" alignItems="center">
            <FormControl>
              <Input
                placeholder="Chat name"
                mb={3}
                value={groupChatName}
                onChange={(event) => setGroupChatName(event.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input placeholder="Add Users" mb={1} onChange={searchHandler} />
            </FormControl>
            <Box w="100%" display="flex" flexWrap="wrap">
              {selectedUsers?.map((user) => (
                <UserBadgeItem
                  key={user._id}
                  user={user}
                  deleteUser={() => deleteUserHandler(user)}
                />
              ))}
            </Box>
            {loading
              ? "loading......"
              : searchResult?.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    accessHandler={() => addUserHandler(user)}
                  />
                ))}
          </DrawerBody>
          <DrawerFooter>
            <Button colorScheme="blue" onClick={submitHandler}>
              Create Chat
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Fragment>
  );
};
export default GroupChatDrawer;
