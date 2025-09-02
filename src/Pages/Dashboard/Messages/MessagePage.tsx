import React, { FC, useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom";
import MessageSidebar from "../../../Components/Message/MessageSidebar.tsx";
import MessageDetails from "../../../Components/Message/MessageDetails.tsx";
import { IWithRouter } from "../../../Hoc/WithRouter.tsx";
import { PathConstants } from "../../../Router/PathConstants.ts";
import { Endpoints } from "../../../Api/Endpoints.ts";

const MessagePage: FC<IWithRouter> = (props) => {
  const selector = useSelector((state: any) => state.AuthData)  
  const { params } = props;
  const { id, type } = params;
  const navigate = useNavigate();
  if (typeof document !== 'undefined') {
    document.title = "Chat | EditorsApp";
  }

  const [selectedComponent, setSelectedComponent] = useState<string>(
    id ? "details" : type === "pending" ? "networks" : "feeds"
  )
  const [searchUser, setSearchUser] = useState("");
  const [networkGroupId, setNetworkGroupId] = useState<number | null>(null);

  useEffect(() => {
    const fetchLastActiveTimes = async () => {
      try {
        await fetch(import.meta.env.VITE_API_URL + Endpoints.UpdateLastActiveAt, {
          method: 'POST',
          headers: {
            'Token': selector.authKey
          }
        })
      } catch (error) {
        console.error('Error fetching last active times : ', error)
      }
    }
    if (location.pathname === PathConstants.Messages) {
      fetchLastActiveTimes()
      const intervalId = setInterval(() => {
        fetchLastActiveTimes()
      }, 55555)
      return () => clearInterval(intervalId)
    }
  }, [location.pathname])

  useEffect(() => {
    if (id) {
      setSelectedComponent("details");
      setNetworkGroupId(parseInt(id));
    } else if (type === "pending") {
      setSelectedComponent("networks");
    }
  }, [id, type]);

  const renderComponent = () => {
    if ((selectedComponent === "details" || selectedComponent === "search") && (id || networkGroupId))
      return <MessageDetails userId={networkGroupId || parseInt(id)} apiToken={selector.authKey} />
  }

  return (
    <React.Fragment>
      <div className="flex-1 laptop:flex grow tablet:rounded-t-[0.75rem] bg-white">
        <MessageSidebar
          onSelect={(component) => {
            setSelectedComponent(component)
            if (component !== "details")
              navigate(PathConstants.Messages)
          }}
          setSearchUser={setSearchUser}
          onSelectNetworkGroupId={setNetworkGroupId}
          searchUser={searchUser}
        />
        <div className="flex-1 md:full md:flex-none md:self-stretch px-2 laptop:px-0">
          {renderComponent()}
        </div>
      </div>
    </React.Fragment>
  );
};

export default MessagePage;
