import { FC } from "react";
import Typography from "../Typography/Typography.tsx";
import { MaterialSymbol } from "react-material-symbols";
import { useNavigate } from "react-router-dom";
import { PathConstants } from "../../Router/PathConstants.ts";
import UpdatesPostCard from "./UpdatesPostCard.tsx";
import SwipperCard from "./SwipperCard.tsx";
interface IUpdatesCard {
  video?: Array<any>;
  PinPost?: number;
}

const UpdatesCard: FC<IUpdatesCard> = (props) => {
  const { video } = props;
  const navigate = useNavigate();

  const handleNavigate = (path: string) => () => navigate(path);
  const renderHeader = () => {
    return (
      <div className="flex items-center mb-4">
        <img
          className="w-[2.5rem] h-[2.5rem]"
          alt="updates blue"
          src={"Assets/Images/updatesBlue.png"}
        />
        <Typography variant="headline" size="small" className="ml-1">
          Updates
        </Typography>
      </div>
    );
  };

  const renderPosts = () => {
    return (
      <div className="flex flex-row gap-3">
        {video?.map((item: any, index: number) => {
          return (
            <UpdatesPostCard
              key={index}
              onClick={handleNavigate(
                PathConstants.UpdatesView.replaceWithObject({ id: item?.id })
              )}
              title={item?.title}
              className={`${index == 2 ? "hidden laptop:block" : ""}`}
              video={item?.video}
            />
          );
        })}
      </div>
    );
  };

  const renderPosts1 = () => {
    return (
      <div className="flex flex-row items-center px-2 laptop:px-[7%]">
        {/* <div className={`relative max-w-[45%] w-full tablet:max-w-[48%] laptop:max-w-[33%] cursor-pointer`}> */}
        <div
          className={`relative max-w-[730px] w-full h-[150px] tablet:max-w-[500px] laptop:max-w-[732px] cursor-pointer`}
        >
          <SwipperCard video={video} />
        </div>
      </div>
    );
  };

  const renderSeeMore = () => {
    return (
      <div className="flex items-center justify-end py-3 gap-2">
        <Typography
          variant="body"
          size="medium"
          className="text-primary cursor-pointer"
          component="div"
          nodeProps={{ onClick: handleNavigate(PathConstants.Updates) }}
        >
          See more
        </Typography>
        <MaterialSymbol
          icon={"arrow_forward_ios"}
          className="!text-primary !text-[1.5rem] cursor-pointer"
        />
      </div>
    );
  };

  return (
    <div className="py-4 px-[0.38rem] bg-white rounded-t-[0.75rem] hidden b500:block">
      {renderHeader()}
      {renderPosts1()}
      {renderSeeMore()}
    </div>
  );
};

export default UpdatesCard;
