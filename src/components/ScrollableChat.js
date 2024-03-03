import ScrollableFeed from "react-scrollable-feed";
import { ChatState } from "../context/ChatProvider";
import { Avatar, Tooltip } from "@chakra-ui/react";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  const isSameSender = (m, i, userId) => {
    return (
      i < messages.length - 1 &&
      (messages[i + 1].sender._id !== m.sender._id ||
        messages[i + 1].sender._id === undefined) &&
      messages[i].sender._id !== userId
    );
  };

  const isLastMessage = (i, userId) => {
    return (
      i === messages.length - 1 &&
      messages[messages.length - 1].sender._id !== userId &&
      messages[messages.length - 1].sender._id
    );
  };

  const isSameSenderMessage = (i, userId) => {
    if (
      i < messages.length - 1 &&
      messages[i].sender._id !== userId &&
      messages[i + 1].sender._id !== userId
    ) {
      return 33;
    } else if (
      (i < messages.length - 1 &&
        messages[i].sender._id !== userId &&
        messages[i + 1].sender._id === userId) ||
      (i === messages.length-1 && messages[i].sender._id !== userId)
    ) {
      return 0;
    } else {
      return "auto";
    }
  };

  const isSameUser = (m, i) => {
    return i > 0 && messages[i - 1].sender._id === m.sender._id;
  };

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id}>
            {(isSameSender(m, i, user._id) || isLastMessage(i, user._id)) && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.pic}
                />
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                }`,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
                marginLeft: isSameSenderMessage(i, user._id),
                marginTop:isSameUser(m,i)?3:10
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};
export default ScrollableChat;
