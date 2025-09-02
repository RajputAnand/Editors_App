import { FC, useState, useEffect } from "react";
import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import NetworkSidebar from "../../../Components/Network/NetworkSidebar.tsx";
import NetworkFeeds from "../../../Components/Network/NetworkFeeds.tsx";
import NetworkDiscover from "../../../Components/Network/NetworkDiscover.tsx";
import NetworkYours from "../../../Components/Network/NetworkYours.tsx";
import NetworkDetails from "../../../Components/Network/NetworkDetails.tsx";
import { IWithRouter } from "../../../Hoc/WithRouter.tsx";

const NetworkPage: FC<IWithRouter> = (props) => {
  const { params } = props;
  const { id, type } = params;
  const [searchParams] = useSearchParams();
  const groupId = searchParams.get("groupId");
  const groupPostId = searchParams.get("postId");
  const navigate = useNavigate();
  if (typeof document !== 'undefined') {
    document.title = "Networks | EditorsApp";
  }

  const [selectedComponent, setSelectedComponent] = useState<string>(
    id || groupId ? "details" : type === "pending" ? "networks" : "feeds"
  );
  const [showPendingNetworks, setShowPendingNetworks] = useState<boolean>(
    type === "pending"
  );
  const [searchNetwork, setSearchNetwork] = useState("");
  const [networkGroupId, setNetworkGroupId] = useState<number | null>(null);

  useEffect(() => {
    if (id || groupId) {
      setSelectedComponent("details");
      setNetworkGroupId(parseInt(id || groupId || "0"));
    } else if (type === "pending") {
      setSelectedComponent("networks");
      setShowPendingNetworks(true);
    } else {
      setShowPendingNetworks(false);
    }
    window.scrollTo(0,0)
  }, [id, groupId, type]);

  const renderComponent = () => {
    if (selectedComponent === "details" && networkGroupId) {
      return <NetworkDetails networkGroupId={networkGroupId} />;
    }

    switch (selectedComponent) {
      case "feeds":
        return <NetworkFeeds />;
      case "discover":
        return <NetworkDiscover />;
      case "search":
        return <NetworkDiscover searchNetwork={searchNetwork} type="all" />;
      case "networks":
        return <NetworkYours shouldShowPending={showPendingNetworks} />;
      default:
        return <NetworkFeeds />;
    }
  };

  return (
    <React.Fragment>
      <div className="flex-1 laptop:flex grow tablet:rounded-t-[0.75rem] bg-white">
        <NetworkSidebar
          onSelect={(component) => {
            setSelectedComponent(component);
            if (component === "networks") {
              setShowPendingNetworks(false);
            }
            if (component !== "details") {
              navigate("/network");
            }
          }}
          selected={selectedComponent}
          setSearchNetwork={setSearchNetwork}
          onSelectNetworkGroupId={setNetworkGroupId}
        />
        <div className="relative h-[61.44] bg-white flex-1 md:full md:flex-none md:self-stretch px-2 laptop:px-0">
          {renderComponent()}
        </div>
      </div>
    </React.Fragment>
  );
};

export default NetworkPage;
