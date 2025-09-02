import { FC, useState } from "react";
import Loading from "../../../Common/Loading";
import InviteCard from "../../../Cards/InviteCard";
import { configType } from "../../../../Pages/Dashboard/Live/config";
import { useGetQuery } from "../../../../Api/QueryHooks/useGetQuery";
import { Endpoints } from "../../../../Api/Endpoints";

interface ILiveInviteUsers {
  liveId: string;
  config: configType
}

const LiveInviteAdmiers: FC<ILiveInviteUsers> = ({ config, liveId }) => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { isLoading, data } = useGetQuery({ queryKey: [(Endpoints.ListAdmirer).replaceWithObject({ id: config?.uid?.toString() }), "GET", { page: 1, per_page: 999999 }], refetchOnMount: true })
  // Sort the data alphabetically by name
  const sortedData = data?.data?.sort((a: any, b: any) => {
    if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
    if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
    return 0;
  });

  const renderListing = () => {
    if (isLoading) return <Loading className="w-full h-[40rem] items-center justify-center flex" />
    const filteredData = sortedData.filter((item: any) => {
      const searchField = `${item.name || ""} ${item.user_name || ""}`;
      return searchField.toLowerCase().includes(searchQuery.toLowerCase());
    });

    if (filteredData.length === 0) {
      return <div className="text-center text-gray-500 h-[20em] flex flex-col items-center justify-center text-xl">No members found!</div>;
    }
    return (
      <div className="flex flex-col gap-2 max-h-[40em] min-h-[20em] overflow-y-auto custom-scrollbar">
        {
          filteredData.map((item: any) => {
            return <InviteCard
              {...item}
              currentUserid={config.uid}
              liveId={liveId}
              config={config}
              key={item?.id}
            />
          })
        }
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <input
        type="text"
        className="w-full border border-gray-300 outline-blue-400 rounded-md h-12"
        placeholder="Search..... "
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {renderListing()}
    </div>
  )
}

export default LiveInviteAdmiers