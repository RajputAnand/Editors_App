import React from "react"
import SearchedUsers from "./SearchedUsers"

interface SidebarProps {
  onSelect: (component: string) => void
  onSelectNetworkId: (id: any) => void
  searchUser: string
}

const MessageSearchSidebar: React.FC<SidebarProps> = ({
  onSelect,
  onSelectNetworkId,
  searchUser
}) => {
  return (
    <div>
      {searchUser.trim() !== '' && (
        <div>
          <SearchedUsers
            onSelect={onSelect}
            onSelectNetworkId={onSelectNetworkId}
            searchUser={searchUser}
          />
        </div>
      )}
    </div>
  )
}

export default MessageSearchSidebar
