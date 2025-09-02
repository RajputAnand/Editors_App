import React from "react";

import NetworkProfileCard from "../Cards/NetworkProfileCard";

interface INetworkDetails {
  networkGroupId?: number;
}

const NetworkDetails: React.FC<INetworkDetails> = ({ networkGroupId }) => {
  const renderProfile = () => {
    return (
      <>
        <NetworkProfileCard networkGroupId={networkGroupId} />
      </>
    );
  };

  return <div>{renderProfile()}</div>;
};

export default NetworkDetails;
