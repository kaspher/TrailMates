import React from "react";

const reactionEmojis = {
  like: "👍",
};

const ReactionIcons = ({ reaction, count, onClick, title }) => {
  return (
    <button onClick={onClick} className="bg-gray-200 p-2 rounded" title={title}>
      {reactionEmojis[reaction]} {count}
    </button>
  );
};

export default ReactionIcons;