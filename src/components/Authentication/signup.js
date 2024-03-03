import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [pic, setPic] = useState();
  const [show, setShow] = useState(false);
  const [confirmShow, setConfirmShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const toast = useToast();

  const nameChangeHandler = (event) => {
    setName(event.target.value);
  };

  const emailChangeHandler = (event) => {
    setEmail(event.target.value);
  };

  const passwordChangeHandler = (event) => {
    setPassword(event.target.value);
  };

  const confirmPasswordChangeHandler = (event) => {
    setConfirmPassword(event.target.value);
  };

  const passwordShowHandler = () => {
    setShow((prevState) => {
      return !prevState;
    });
  };

  const confirmPasswordShowHandler = () => {
    setConfirmShow((prevState) => {
      return !prevState;
    });
  };

  const picChangeHandler = async (event) => {
    const pics = event.target.files[0];
    try {
      setLoading(true);
      if (pics === undefined) {
        toast({
          title: "Please select am image.",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
      if (
        pics.type === "image/jpeg" ||
        pics.type === "image/png" ||
        pics.type === "image/jpg"
      ) {
        const data = new FormData();
        data.append("file", pics);
        data.append("upload_preset", "Chat-App");
        data.append("cloud_name", "ritik123");
        const response = await fetch(
          "https://api.cloudinary.com/v1_1/ritik123/image/upload",
          {
            method: "POST",
            body: data,
          }
        );
        if (!response.ok) {
          throw new Error("can not upload the image");
        }
        const responseData = await response.json();
        setPic(responseData.url.toString());
        setLoading(false);
      } else {
        toast({
          title: "Please select am image.",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setLoading(false);
        return;
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const submitHandler = async () => {
    setLoading(true);
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "Please enter all the fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      toast({
        title: "confirm password does not match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    try {
      const { data } = await axios.post(
        "/api/user",
        { name, email, password, pic },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!data) {
        throw new Error("Could not register user");
      }
      toast({
        title: "Registration successfull",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chats");
      setName("");
      setEmail("");
      setPassword();
      setConfirmPassword();
      setPic();
    } catch (error) {
      toast({
        title: "Error occured",
        status: "warning",
        description: error.message,
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  return (
    <VStack spacing="5px">
      <FormControl id="name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter your name"
          value={name}
          onChange={nameChangeHandler}
        />
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter your email"
          value={email}
          onChange={emailChangeHandler}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            value={password}
            placeholder="password"
            onChange={passwordChangeHandler}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={passwordShowHandler}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="confirm-password" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup size="md">
          <Input
            type={confirmShow ? "text" : "password"}
            value={confirmPassword}
            placeholder="Confirm password"
            onChange={confirmPasswordChangeHandler}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={confirmPasswordShowHandler}>
              {confirmShow ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="pic" isRequired>
        <FormLabel>Upload your picture</FormLabel>
        <Input
          type="file"
          value={pic}
          accept="image/*"
          p={1.5}
          onChange={picChangeHandler}
        />
      </FormControl>
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Sign Up
      </Button>
    </VStack>
  );
};
export default SignUp;
