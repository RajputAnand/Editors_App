import { FC } from "react";
import Avatar from "../Avatar/Avatar";
import Typography from "../Typography/Typography";
import Button from "../Buttons/Button";
import { useNetworkPost } from "../../Hooks/useNetworkPost";
import { Endpoints } from "../../Api/Endpoints";
import toast from "react-hot-toast";
import { queryClient } from "../../Api/Client";
import { useNetworkDetais } from "../../Hooks/useNetwork";

interface IPendingNetworkCard {
  setNetworkCard?: any;
  setNetworkGroupId: any;
  className?: string;
  id?: any;
  profile_photo?: string;
  name?: string;
  user_name?: string;
  type?: string;
  purpose?: string;
  description?: string;
  member_count?: number;
  admirer_count?: number;
  admired_count?: number;
  post_count?: number;
  like_count?: number;
  is_joined: boolean;
  join_status: any;
}

const PendingNetworkCard: FC<IPendingNetworkCard> = (props) => {
  const {
    id,
    admirer_count,
    className,
    description,
    like_count,
    member_count,
    name,
    post_count,
    profile_photo,
    user_name,
    join_status,
    setNetworkGroupId,
    setNetworkCard,
    admired_count,
    type,
  } = props;

  const { networkGroupInfo } = useNetworkDetais(id);

  const handleGoToNetworkGroupDetails = () => {
    setNetworkGroupId(id);
    setNetworkCard(true);
  };

  const { acceptNetworkMember, rejectNetworkMember } = useNetworkPost();
  const { mutate: acceptNetworkMemberRequest, isPending: isAcceptPending } =
    acceptNetworkMember({
      mutationKey: [
        Endpoints.AcceptNetworkMember.replaceWithObject({
          network_group_id: id || "",
        }),
        "PATCH",
      ],
    });
  const { mutate: rejectNetworkMemberRequest, isPending: isRejectionPending } =
    rejectNetworkMember({
      mutationKey: [
        Endpoints.RejectNetworkMember.replaceWithObject({
          network_group_id: id || "",
        }),
        "PATCH",
      ],
    });

  const handleAccept = (event: React.MouseEvent) => {
    event.stopPropagation();
    acceptNetworkMemberRequest(
      {},
      {
        onSuccess: (data) => {
          toast.success(data?.message);
          queryClient.invalidateQueries({
            queryKey: [Endpoints.NetworkListJoinAndNotJoin],
          });
        },
      }
    );
  };

  const handleReject = (event: React.MouseEvent) => {
    event.stopPropagation();
    rejectNetworkMemberRequest(
      {},
      {
        onSuccess: (data) => {
          toast.success(data?.message);
          queryClient.invalidateQueries({
            queryKey: [Endpoints.NetworkListJoinAndNotJoin],
          });
        },
      }
    );
  };

  return (
    <div
      onClick={handleGoToNetworkGroupDetails}
      className={`${className} flex flex-col w-full gap-[1.44rem] sm:p-[1.25rem] border-[#E2E5FF] shadow-[#E4E4EF]
        border-solid bg-[#FFFFFF] rounded-lg p-[10px] cursor-pointer`}
    >
      <div className="flex flex-col gap-[1.00rem] self-stretch">
        <div className="flex w-[68%] items-center gap-[0.50rem] md:w-full">
          <Avatar image={profile_photo} iconType={"groups"} />
          <div className="flex flex-1 flex-col align items-start">
            <h2 className="!text-[#0E0E0E] font-bold text-base">{name}</h2>
            <p className="text-xs !text-secondary-50 text-medium">
              @{user_name}
            </p>
          </div>
        </div>
        <div className="overflow-hidden line-clamp-3 h-12  !font-normal !text-blue_gray_300 text-xs !text-secondary-50">
          {description}
        </div>
      </div>
      <div className="flex justify-between gap-[1.25rem] self-stretch md:pr-[1.25rem]">
        <div className="flex flex-1 flex-col items-start py-[0.06rem]">
          <p className="!font-normal !text-blue_gray_300 text-xs !text-secondary-50">
            Admirers
          </p>
          <span className="!text-[#0E0E0E] font-bold text-base">
            {networkGroupInfo?.data.admired_count}
          </span>
        </div>
        <div className="flex flex-1 flex-col items-start py-[0.06rem]">
          <p className="!font-normal !text-blue_gray_300 text-xs !text-secondary-50">
            Likes
          </p>
          <span className="!text-[#0E0E0E] font-bold text-base">
            {like_count}
          </span>
        </div>
        <div className="flex flex-1 flex-col items-start py-[0.06rem]">
          <p className="!font-normal !text-blue_gray_300 text-xs !text-secondary-50">
            Posts
          </p>
          <span className="!text-[#0E0E0E] font-bold text-base">
            {post_count}
          </span>
        </div>
        <div className="flex flex-1 flex-col items-start py-[0.06rem]">
          <p className="!font-normal !text-blue_gray_300 text-xs !text-secondary-50">
            Members
          </p>
          <span className="!text-[#0E0E0E] font-bold text-base">
            {member_count}
          </span>
        </div>
      </div>
      <div className="flex flex-col text-center mb-2">
        <div className="flex">
          {join_status === "rejected invite request" ? (
            <Button
              onClick={handleAccept}
              isLoading={isAcceptPending}
              variant="primary"
              disabled
              className="w-full !p-0 !pl-4 !pr-6 !py-[0.5rem] laptop:!flex  justify-center text-center "
            >
              <Typography variant="title" size="medium">
                Rejected
              </Typography>
            </Button>
          ) : (
            <div className="flex w-full gap-2">
              <Button
                onClick={handleAccept}
                isLoading={isAcceptPending}
                variant="outline"
                className="w-full !p-0 !pl-4 !pr-6 !py-[0.5rem] laptop:!flex  justify-center text-center "
              >
                <Typography variant="title" size="medium">
                  Accept
                </Typography>
              </Button>
              <Button
                onClick={handleReject}
                isLoading={isRejectionPending}
                variant="primary"
                className="w-full !p-0 !pl-4 !pr-6 !py-[0.5rem] laptop:!flex laptop:!ml-[5%] justify-center text-center "
              >
                <Typography variant="title" size="medium">
                  Reject
                </Typography>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PendingNetworkCard;
