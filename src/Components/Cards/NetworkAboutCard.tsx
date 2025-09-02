import { FC, useState } from "react";
import Typography from "../Typography/Typography";
import Avatar from "../Avatar/Avatar";
import { MaterialSymbol } from "react-material-symbols";
import Button from "../Buttons/Button";
import { NetworkGroup } from "../../Types/networkGroupInfoTypes";
import { formatNumber } from "../../Utils/FormatNumbers";
import EditNetworkGroupModal from "../Modal/Network/EditNetworkGroupModal";
import DeleteConfirm from "../Modal/DeleteConfirm";
import { useNetworkPost } from "../../Hooks/useNetworkPost";
import { Endpoints } from "../../Api/Endpoints";
import toast from "react-hot-toast";
import { queryClient } from "../../Api/Client";

interface INetworkAboutCard {
  className?: string;
  profile_image?: string;
  networkInfo?: NetworkGroup;
  isAdmin: any;
}

const NetworkAboutCard: FC<INetworkAboutCard> = (props) => {
  const { networkInfo, isAdmin } = props;
  const [openEditNetwork, setOpenEditNetwork] = useState<boolean>(false);
  const [openConfirmDelete, setOpenConfirmDelete] = useState<boolean>(false);

  const { deleteNetwork } = useNetworkPost();
  const { mutate } = deleteNetwork({
    mutationKey: [
      Endpoints.DeleteNetwork.replaceWithObject({
        id: networkInfo?.data.id.toString() || "",
      }),
      "DELETE",
    ],
  });

  const handleOpenConfirmDeleteModal = () => {
    setOpenConfirmDelete((_) => !_);
  };

  const handleOpenNetworkModal = () => {
    setOpenEditNetwork((_) => !_);
  };
  
  const Abouticons = [
    networkInfo?.data.purpose && {
      icon: "business_center",
      text: networkInfo?.data.purpose,
    },
    networkInfo?.data.phone_no && {
      icon: "call",
      text: networkInfo?.data.phone_no,
    },
    networkInfo?.data.location && {
      icon: "location_on",
      text: networkInfo?.data.location,
    },
    networkInfo?.data.is_show_email === 1 &&
      networkInfo.data.email && {
        icon: "mail",
        text: networkInfo?.data.email,
      },
    networkInfo?.data.website && {
      icon: "language",
      text: networkInfo?.data.website,
    },
    networkInfo?.data.country && {
      icon: "flag",
      text: networkInfo.data.country,
    },
  ].filter(Boolean);

  const handleDeleteButton = () => {
    mutate(
      {},
      {
        onSuccess: () => {
          toast.success("Network group has been successfully deleted");
          window.location.reload();
          queryClient.invalidateQueries({
            queryKey: [Endpoints.NetworkListJoinAndNotJoin],
          });
        },
      }
    );
  };

  return (
    <div className="p-4 bg-white b500:rounded-lg border-b border border-solid border-[#E2E5FF] !mr-2 mb-4">
      <div className="flex items-start flex-col gap-[0.75rem justify-start w-full">
        {/* header section */}
        <div className="flex flex-1 flex-col gap-[0.1rem] w-full">
          <div className="flex flex-wrap items-center gap-[0.50rem]">
            <Typography
              className="!text-[#0E0E0E] font-bold flex items-center flex-wrap"
              variant="title"
              size="large"
            >
              <h1 className="!text-black-900 font-bold text-[1.4rem] md:text-[1.38rem] pr-2 mb-2">
                About Network
              </h1>
            </Typography>
          </div>
          {/* header end */}
          <div>
            <div className="flex flex-1 flex-col gap-[0.25rem]">
              <div className="flex flex-wrap items-center gap-[0.50rem]">
                <div className="flex justify-start gap-[1.00rem] md:w-full">
                  <Avatar
                    image={networkInfo?.data.profile_photo}
                    className="!text-[3rem]"
                    classNameAvatarContainer={` h-[4rem] w-[4rem] ${
                      networkInfo?.data.profile_photo ? "" : "!bg-surface-light"
                    }`}
                  />
                </div>
                <div className="flex flex-1 flex-col gap-[0.25rem]">
                  <div className="flex flex-wrap items-center ">
                    <h1 className="!text-black-900 font-bold text-[1.4rem] md:text-[1.38rem] pr-2 pl-2">
                      {networkInfo?.data.name}
                    </h1>
                    <Typography
                      className="!text-[#8F92AB] flex items-center flex-wrap"
                      variant="body"
                      size="large"
                    >
                      @{networkInfo?.data.user_name}
                    </Typography>
                  </div>
                  <div className="flex w-[78%] items-center md-full">
                    <div className="flex flex-1 items-center gap-[0.31rem] pl-2">
                      <MaterialSymbol
                        icon={"public"}
                        className="cursor-pointer !text-[1.5rem] !text-[#8F92AB]"
                        as={"div"}
                      />
                      <Typography
                        className="!text-[#8F92AB] flex items-center flex-wrap capitalize"
                        variant="body"
                        size="large"
                      >
                        {networkInfo?.data.type} Network
                      </Typography>
                    </div>
                  </div>
                </div>
              </div>
              <Typography
                className="!text-[#8F92AB] flex items-center flex-wrap mt-4"
                variant="body"
                size="large"
              >
                {networkInfo?.data.description}
              </Typography>
              <div className="flex flex-col mt-8">
                {Abouticons.map((d: any, index) => (
                  <div
                    className="flex flex-1 items-center gap-[2rem] pb-4 font-bold"
                    key={index}
                  >
                    <MaterialSymbol
                      icon={d?.icon}
                      className="cursor-pointer !text-[1.5rem] !text-[#8F92AB] pl-2"
                      as={"div"}
                    />
                    <Typography
                      className="!text-[#0E0E0E] font-bold flex items-center flex-wrap"
                      variant="title"
                      size="medium"
                    >
                      {" "}
                      <span className="!text-[#0E0E0E] flex items-center flex-wrap font-bold">
                        {d.text}
                      </span>
                    </Typography>
                  </div>
                ))}
              </div>
              <div className="mt-4 mb-4 w-full flex justify-between">
                <div className="flex flex-col items-center">
                  <Typography
                    className="!text-[#8F92AB] flex items-center flex-wrap font-bold"
                    variant="body"
                    size="large"
                  >
                    Admirers
                  </Typography>
                  <span className="!text-[#0E0E0E] flex items-center flex-wrap font-bold">
                    {networkInfo?.data.admirer_count}
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <Typography
                    className="!text-[#8F92AB] flex items-center flex-wrap font-bold"
                    variant="body"
                    size="large"
                  >
                    Likes
                  </Typography>
                  <Typography
                    className="!text-[#0E0E0E] font-bold flex items-center flex-wrap"
                    variant="title"
                    size="medium"
                  >
                    <span className="!text-[#0E0E0E] flex items-center flex-wrap font-bold">
                      {networkInfo?.data.like_count}
                    </span>
                  </Typography>
                </div>
                <div className="flex flex-col items-center">
                  <Typography
                    className="!text-[#8F92AB] flex items-center flex-wrap font-bold"
                    variant="body"
                    size="large"
                  >
                    Posts
                  </Typography>
                  <Typography
                    className="!text-[#0E0E0E] font-bold flex items-center flex-wrap"
                    variant="title"
                    size="medium"
                  >
                    <span className="!text-[#0E0E0E] flex items-center flex-wrap font-bold">
                      {formatNumber(networkInfo?.data.post_count)}
                    </span>
                  </Typography>
                </div>
                <div className="flex flex-col items-center">
                  <Typography
                    className="!text-[#8F92AB] flex items-center flex-wrap font-bold"
                    variant="body"
                    size="large"
                  >
                    Members
                  </Typography>
                  <Typography
                    className="!text-[#0E0E0E] font-bold flex items-center flex-wrap"
                    variant="title"
                    size="medium"
                  >
                    <span className="!text-[#0E0E0E] flex items-center flex-wrap font-bold">
                      {formatNumber(networkInfo?.data.member_count)}
                    </span>
                  </Typography>
                </div>
              </div>
              {isAdmin && (
                <div className="flex gap-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setOpenEditNetwork(!openEditNetwork)}
                    className="!p-0 !pl-4 !pr-6 !py-[0.5rem] flex justify-center items-center  w-full hover:bg-primary-100 hover:bg-opacity-10"
                  >
                    <MaterialSymbol
                      icon={"edit"}
                      className="cursor-pointer !text-[1.5rem] text-primary-50 pl-2"
                      as={"div"}
                    />
                    <Typography variant="title" size="medium">
                      Edit Network Details
                    </Typography>
                  </Button>
                  <Button
                    variant="menu"
                    onClick={() => setOpenConfirmDelete(true)}
                    className="!p-0 !pl-4 !pr-6 !py-[0.5rem] flex justify-center items-center w-full bg-red-100 hover:bg-red-200"
                  >
                    <MaterialSymbol
                      icon={"delete"}
                      className="cursor-pointer !text-[1.5rem] text-red-600 pl-2"
                      as={"div"}
                    />
                    <Typography
                      variant="title"
                      size="medium"
                      className="text-red-600"
                    >
                      Delete network
                    </Typography>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {openEditNetwork && (
        <EditNetworkGroupModal
          handle={handleOpenNetworkModal}
          open={openEditNetwork}
          networkInfo={networkInfo}
        />
      )}

      <DeleteConfirm
        isOpen={openConfirmDelete}
        closeModal={handleOpenConfirmDeleteModal}
        onClickYes={handleDeleteButton}
        buttonName="Yes"
      >
        <div className="pb-6 flex items-center justify-center">
          <Typography variant="body" size="large" className="text-black">
            Do you want to delete the network {""}
            <span className="font-bold text-lg">
              {networkInfo?.data.name}
            </span>{" "}
            ?
          </Typography>
        </div>
      </DeleteConfirm>
    </div>
  );
};

export default NetworkAboutCard;
