import { FC } from "react";
import Avatar from "../Avatar/Avatar";
import { useNetworkDetais } from "../../Hooks/useNetwork";

interface IYoursNetworkCard {
  setNetworkCard?: any;
  setNetworkGroupId?: any;
  className?: string;
  id?: number;
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

const YoursNetworkCard: FC<IYoursNetworkCard> = (props) => {
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
    setNetworkCard,
    setNetworkGroupId,
    admired_count,
  } = props;

  const { networkGroupInfo } = useNetworkDetais(id);

  const handleGoToNetworkGroupDetails = () => {
    setNetworkGroupId(id);
    setNetworkCard(true);
  };

  return (
    <div
      onClick={handleGoToNetworkGroupDetails}
      className={`${className} flex flex-col w-full gap-[1.44rem] sm:p-[1.25rem] border-[#E2E5FF] shadow-[#E4E4EF]
        border-solid bg-[#FFFFFF] rounded-lg p-[10px] cursor-pointer shadow-md`}
    >
      <div className="flex flex-col gap-[1.00rem] self-stretch">
        <div className="flex w-[68%] items-center gap-[0.50rem] md:w-full">
          <Avatar
            image={profile_photo}
            classNameAvatarContainer="!w-[3rem] !h-[3rem]"
            className="!text-[1.9rem] "
            iconType={"groups"}
          />
          <div className="flex flex-1 flex-col align items-start">
            <h2 className="!text-[#0E0E0E] font-bold text-base">{name}</h2>
            <p className="text-xs !text-[#80839F] text-medium">@{user_name}</p>
          </div>
        </div>
        <div className="overflow-hidden line-clamp-3 h-12 !font-normal !text-blue_gray_300 text-xs !text-secondary-50">
          {description}
        </div>
      </div>
      <div className="flex justify-between gap-[1.25rem] self-stretch md:pr-[1.25rem]">
        <div className="flex flex-1 flex-col items-start py-[0.06rem]">
          <p className="!font-normal !text-blue_gray_300 text-xs !text-[#80839F]">
            Admirers
          </p>
          <span className="!text-[#0E0E0E] font-bold text-base">
            {networkGroupInfo?.data.admired_count}
          </span>
        </div>
        <div className="flex flex-1 flex-col items-start py-[0.06rem]">
          <p className="!font-normal !text-blue_gray_300 text-xs !text-[#80839F]">
            Likes
          </p>
          <span className="!text-[#0E0E0E] font-bold text-base">
            {like_count}
          </span>
        </div>
        <div className="flex flex-1 flex-col items-start py-[0.06rem]">
          <p className="!font-normal !text-blue_gray_300 text-xs !text-[#80839F]">
            Posts
          </p>
          <span className="!text-[#0E0E0E] font-bold text-base">
            {post_count}
          </span>
        </div>
        <div className="flex flex-1 flex-col items-start py-[0.06rem] pb-3">
          <p className="!font-normal !text-blue_gray_300 text-xs !text-[#80839F]">
            Members
          </p>
          <span className="!text-[#0E0E0E] font-bold text-base">
            {member_count}
          </span>
        </div>
      </div>
    </div>
  );
};

export default YoursNetworkCard;
