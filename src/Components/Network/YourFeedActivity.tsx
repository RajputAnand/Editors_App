import { FC } from "react";
import Avatar from "../Avatar/Avatar";
import { convertTimestampToAgoNetwork } from "../../Utils/convertTimeStampToAgoNetwork";
interface IFeedActivity {
  className?: string;
  activenow?: string;
  updated_at: string;
  name?: string;
  profile_photo?: string;
}

const YourFeedActivity: FC<IFeedActivity> = (props) => {
  const { className, name, profile_photo, updated_at } = props;
  return (
    <>
      <div className={`${className} flex items-center gap-[0.50rem] text-sm`}>
        <Avatar
          image={profile_photo}
          classNameAvatarContainer="!w-[3rem] !h-[3rem]"
          className="!text-[1.9rem] "
          iconType={"groups"}
        />
        <div className="flex flex-col flex-wrap">
          <h2 className="!text-black-900_01 font-bold text-base">{name}</h2>
          <p className="!font-normal !text-blue_gray_300 text-xs !text-secondary-50">
            <div>Last active {convertTimestampToAgoNetwork(updated_at)}</div>
          </p>
        </div>
      </div>
    </>
  );
};

export default YourFeedActivity;
