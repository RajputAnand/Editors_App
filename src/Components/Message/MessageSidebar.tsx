import React from "react"
import MessageSearch from "./MessageSearch"
import MessageSearchSidebar from "./MessageSearchSidebar"
import MessagedUsers from "./MessagedUsers"

interface SidebarProps {
  onSelect: (component: string) => void;
  setSearchUser: (searchText: any) => void;
  onSelectNetworkGroupId: (id: any) => void;
  searchUser: string
}

const MessageSidebar: React.FC<SidebarProps> = ({
  onSelect,
  setSearchUser,
  onSelectNetworkGroupId,
  searchUser
}) => {
  return (
    <div className="laptop:w-[28%] bg-white laptop:flex-col items-center  md:flex-row">
      <div className="flex justify-between items-center laptop:items-start laptop:flex-col w-full pt-4 px-2">
        <h1 className="!text-black-900 font-bold text-[1.4rem] laptop:text-[1.8rem] md:text-[1.38rem] px-4 py-4">
          Chat
        </h1>
      </div>
      <MessageSearch
        className="w-full px-2 laptop:px-4 pb-4"
        searchOnChange={setSearchUser}
        onSelect={onSelect}
      />
      <MessageSearchSidebar
        onSelect={onSelect}
        searchUser={searchUser}
        onSelectNetworkId={onSelectNetworkGroupId}
      />
      <MessagedUsers
        onSelect={onSelect}
        onSelectNetworkId={onSelectNetworkGroupId}
      />
    </div>
  );
};

export default MessageSidebar;
