import React, { useState } from "react";
import { MaterialSymbol } from "react-material-symbols";
import Typography from "../Typography/Typography";
import Button from "../Buttons/Button";
import NetworkMenu from "../Layouts/Menu/NetworkMenu";
import NetworkSearch from "./NetworkSearch";
import JoinedNetworks from "./JoinedNetworks";
import AddNetworkModal from "../Modal/AddNetworkModal";

interface SidebarProps {
  onSelect: (component: string) => void;
  selected: any;
  setSearchNetwork: (searchText: any) => void;
  onSelectNetworkGroupId: (id: any) => void;
}

const NetworkSidebar: React.FC<SidebarProps> = ({
  onSelect,
  selected,
  setSearchNetwork,
  onSelectNetworkGroupId,
}) => {
  const [openNetwork, setOpenNetwork] = useState<boolean>(false);
  const handleOpenNetworkModal = () => {
    setOpenNetwork((_) => !_);
  };
  return (
    <div className="laptop:w-[28%] bg-white laptop:flex-col items-center  md:flex-row">
      <div className="flex justify-between items-center laptop:items-start laptop:flex-col w-full py-4 px-2">
        <h1 className="!text-black-900 font-bold text-[1.4rem] laptop:mb-8 laptop:text-[1.8rem] md:text-[1.38rem] px-4 laptop:py-2">
          Networks
        </h1>

        <div className="self-stretch">
          {/* network list section */}
          <div className="flex items-start laptop:mr-4">
            <div className="flex flex-1 flex-col items-start">
              <Button
                variant="outline"
                className="w-full !p-0 !pl-4 !pr-6 !py-[0.5rem] flex laptop:!ml-[5%] justify-center"
                // className="w-full gap-[0.25rem rounded-[22px] font-semibold !text-indigo-A700_02 sm:px-[1.25rem]"
                onClick={handleOpenNetworkModal}
              >
                <MaterialSymbol
                  icon={"add_circle"}
                  className="!text-[1.5rem] cursor-pointer text-primary"
                  fill
                  as={"div"}
                />
                <Typography variant="title" size="medium">
                  Add Network
                </Typography>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <NetworkMenu onSelect={onSelect} selected={selected} />
      <NetworkSearch
        className="w-full  px-2  laptop:py-4 laptop:px-4 py-2"
        searchOnChange={setSearchNetwork}
        onSelect={onSelect}
      />
      <JoinedNetworks
        onSelect={onSelect}
        onSelectNetworkId={onSelectNetworkGroupId}
      />

      {openNetwork && (
        <AddNetworkModal open={openNetwork} handle={handleOpenNetworkModal} />
      )}
    </div>
  );
};

export default NetworkSidebar;
