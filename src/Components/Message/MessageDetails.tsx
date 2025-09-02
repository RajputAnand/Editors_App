import React from "react";
import MessageUserCard from "../Cards/MessageUserCard";

interface IMessageDetails {
  userId?: number
  apiToken: string
}

const MessageDetails: React.FC<IMessageDetails> = ({ userId, apiToken }) => {
  const renderProfile = () => {
    return (
      <>
        <MessageUserCard userId={userId} apiToken={apiToken}/>
      </>
    );
  };
  return <div>{renderProfile()}</div>;
};

export default MessageDetails;
