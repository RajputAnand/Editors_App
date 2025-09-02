import { FC, useState } from "react";
import Typography from "../Typography/Typography";
import Avatar from "../Avatar/Avatar";
import { MaterialSymbol } from "react-material-symbols";
import { AddNetworkPostModal } from "../Modal/Network/AddNetworkPostModal";
interface INetworkFeedHeaderCard {
  className?: string;
  profile_image?: string;
  networkGroupId?: number;
  is_joined?: boolean;
}

const NetworkFeedHeaderCard: FC<INetworkFeedHeaderCard> = (props) => {
  const { profile_image, networkGroupId, is_joined } = props;
  const [openNetwork, setOpenNetwork] = useState<boolean>(false);

  const handleOpenNetworkModal = () => {
    setOpenNetwork((_) => !_);
  };

  return (
    <div className="p-4 bg-white b500:rounded-lg border-b border border-solid border-[#E2E5FF] !mr-2 mb-4">
      <div className="flex items-start flex-col gap-[0.75rem justify-start">
        <div className="flex items-start justify-start">
          <Typography
            variant="title"
            size="medium"
            className="text-[#171725] font-semibold "
          >
            Post something
          </Typography>
        </div>
        <div className="w-full flex items-center gap-2 mt-4">
          <Avatar
            image={profile_image}
            classNameAvatarContainer="!w-[3rem] !h-[3rem]"
            className="!text-[1.9rem] "
          />
          <div className="flex-1 flex items-center bg-[#fffff] rounded-[0.25rem] py-2 text-[#92929D]">
            <input
              disabled={!is_joined}
              required
              onClick={() => setOpenNetwork(true)}
              type="text"
              className="bg-[#ffff] outline-none w-full min-h-[2.5rem] text-base placeholder:text-[#87899B] font-normal text-[1.2rem]"
              placeholder="Post your message here"
              autoComplete="off"
            />
            <MaterialSymbol
              onClick={() => setOpenNetwork(true)}
              icon={"image"}
              className="text-[#92929D] !text-[2rem] px-3 cursor-pointer"
              as={"div"}
            />
          </div>
        </div>
      </div>
      {openNetwork && (
        <AddNetworkPostModal
          handle={handleOpenNetworkModal}
          open={openNetwork}
          networkGroupId={networkGroupId}
        />
      )}
    </div>
  );
};

export default NetworkFeedHeaderCard;
