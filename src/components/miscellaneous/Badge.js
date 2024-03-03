import React, { useState } from "react";

const Badge = ({ count, onRemoved }) => {
  const [isDragging, setIsDragging] = useState(false);

  const badgeDragStart = () => {
    setIsDragging(true);
  };

  const badgeDragEnd = () => {
    setIsDragging(false);
    if (onRemoved) {
      onRemoved();
    }
  };

  const style = {
    cursor: "pointer",
    position: "relative",
    backgroundColor: "red",
    padding: "2px 5px",
    marginLeft: "0",
    borderRadius: "50%",
    color: "#fff",
  };

  return (
    <sup style={style} onTouchStart={badgeDragStart} onTouchEnd={badgeDragEnd}>
      {count}
    </sup>
  );
};

export default Badge;
