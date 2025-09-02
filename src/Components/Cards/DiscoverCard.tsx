import { FC } from "react";
import Avatar from "../Avatar/Avatar";
import { MaterialSymbol } from "react-material-symbols";
import Typography from "../Typography/Typography";
import Button from "../Buttons/Button";
import { useNetworkDetais } from "../../Hooks/useNetwork";
import { useNetworkPost } from "../../Hooks/useNetworkPost";
import { Endpoints } from "../../Api/Endpoints";
import { queryClient } from "../../Api/Client";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

interface IDiscoverCard {
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
  refetch?: () => void;
  handleNavigateToDetails: any;
}

const DiscoverCard: FC<IDiscoverCard> = (props) => {
  const {
    admirer_count,
    className,
    description,
    id,
    like_count,
    member_count,
    name,
    post_count,
    profile_photo,
    user_name,
    join_status,
    is_joined,
    admired_count,
    type,
    handleNavigateToDetails,
  } = props;

  const selector = useSelector((state: any) => state.AuthData);

  const {
    networkGroupInfo,
    refetch: refetchNetworkDetails,
    networkGroupInfoLoading,
  } = useNetworkDetais(id);
  const { joinNetwork } = useNetworkPost();

  const { mutate, isPending } = joinNetwork({
    mutationKey: [
      Endpoints.NetworkMemberJoin.replaceWithObject({
        invitation_code: networkGroupInfo?.data?.invitation_code || "",
      }),
      "PUT",
    ],
  });

  const { acceptNetworkMember, rejectNetworkMember, deleteNetworkMember } =
    useNetworkPost();
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

  const { mutate: cancelRequest, isPending: isCancelLoading } =
    deleteNetworkMember();

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

  const handleJoin = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (join_status === "request for join") {
      return cancelRequest(
        {
          network_group_id: networkGroupInfo?.data.id,
          member_user_id: selector.isLoginUserId,
        },
        {
          onSuccess: () => {
            toast.success("Request canceled successfully");
            queryClient.invalidateQueries({
              queryKey: [Endpoints.NetworkListJoinAndNotJoin],
            });
          },
          onError: () => {
            toast.error("Cancel request failed");
          },
        }
      );
    }
    mutate(
      {},
      {
        onSuccess: () => {
          if (type === "private") {
            toast.success("Join request sent successfully");
          } else {
            toast.success(`You have joined the ${networkGroupInfo?.data.name}`);
          }
          refetchNetworkDetails();
          queryClient.invalidateQueries({
            queryKey: [Endpoints.NetworkListJoinAndNotJoin],
          });
        },
        onError: (data) => {
          toast.success(data?.message);
        },
      }
    );
  };

  const renderButton = () => {
    if (join_status === "invited user") {
      return (
        <div className="flex w-full">
          <Button
            onClick={handleAccept}
            isLoading={isAcceptPending}
            variant="outline"
            className="w-full !p-0 !pl-4 !pr-6 !py-[0.5rem] laptop:!flex justify-center text-center"
          >
            <Typography variant="title" size="medium">
              Accept
            </Typography>
          </Button>
          <Button
            onClick={handleReject}
            isLoading={isRejectionPending}
            variant="primary"
            className="w-full !p-0 !pl-4 !pr-6 !py-[0.5rem] laptop:!flex laptop:!ml-[5%] justify-center text-center"
          >
            <Typography variant="title" size="medium">
              Reject
            </Typography>
          </Button>
        </div>
      );
    }

    if (networkGroupInfoLoading) {
      return (
        <Button
          isLoading={networkGroupInfoLoading}
          disabled={networkGroupInfo?.data.is_joined}
          onClick={handleJoin}
          variant="outline"
          className="w-full !p-0 !pl-4 !pr-6 !py-[0.5rem] laptop:!flex laptop:!ml-[5%] justify-center text-center"
        />
      );
    }
    if (join_status === "rejected invite request") {
      return (
        <Button
          isLoading={isPending}
          disabled={networkGroupInfo?.data.is_joined}
          onClick={handleJoin}
          variant="primary"
          className="w-full !p-0 !pl-4 !pr-6 !py-[0.5rem] laptop:!flex laptop:!ml-[5%] justify-center text-center"
        >
          {join_status}
        </Button>
      );
    }

    if (networkGroupInfo?.data.is_joined) {
      return (
        <Button
          isLoading={isPending}
          disabled={networkGroupInfo?.data.is_joined}
          onClick={handleJoin}
          variant="primary"
          className="w-full !p-0 !pl-4 !pr-6 !py-[0.5rem] laptop:!flex laptop:!ml-[5%] justify-center text-center"
        >
          {join_status}
        </Button>
      );
    }

    if (
      type === "private" &&
      (join_status === "request for join" ||
        join_status === "rejected join request")
    ) {
      return (
        <Button
          isLoading={isPending}
          disabled={networkGroupInfo?.data.is_joined}
          onClick={handleJoin}
          variant="primary"
          className="w-full !p-0 !pl-4 !pr-6 !py-[0.5rem] laptop:!flex laptop:!ml-[5%] justify-center text-center"
        >
          {join_status === "request for join" ? "Cancel request" : join_status}
        </Button>
      );
    }

    if (join_status === "blocked by admin" || join_status === "deleted") {
      return (
        <Button
          isLoading={isPending}
          disabled={networkGroupInfo?.data.is_joined}
          onClick={handleJoin}
          variant="outline"
          className="w-full !p-0 !pl-4 !pr-6 !py-[0.5rem] laptop:!flex laptop:!ml-[5%] justify-center text-center"
        >
          {join_status}
        </Button>
      );
    }

    return (
      <Button
        isLoading={isPending}
        disabled={is_joined}
        onClick={handleJoin}
        variant="outline"
        className="w-full !p-0 !pl-4 !pr-6 !py-[0.5rem] laptop:!flex laptop:!ml-[5%] justify-center text-center"
      >
        <>
          <MaterialSymbol
            icon={"add_circle"}
            className="!text-[1.5rem] cursor-pointer text-primary !hidden b500:!inline-block"
            fill
            as={"div"}
          />
          <Typography variant="title" size="medium">
            {/* {type === "public" ? "Join Network" : "Request join"} */}
            Join Network
          </Typography>
        </>
      </Button>
    );
  };

  return (
    <div
      onClick={() => handleNavigateToDetails(id)}
      className={`${className} flex flex-col w-full cursor-pointer gap-[1.44rem] sm:p-[1.25rem] border-[#E2E5FF] shadow-[#E4E4EF] border-solid bg-[#FFFFFF] rounded-lg p-[10px] shadow-md`}
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
      <div className="flex justify-between  gap-[1.25rem] self-stretch md:pr-[1.25rem]">
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
      <div className="flex text-center p-4">{renderButton()}</div>
    </div>
  );
};

export default DiscoverCard;
