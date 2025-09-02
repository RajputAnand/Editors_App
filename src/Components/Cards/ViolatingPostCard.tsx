import React, { FC} from "react";
import Typography from "../Typography/Typography.tsx";
import { MaterialSymbol } from "react-material-symbols";
interface IViolatingPostCard {

}

const ViolatingPostCard: FC<IViolatingPostCard> = (props) => {
  return (
    <React.Fragment>
      <div className="p-4 bg-white b500:rounded-t-[0.75rem] border-b border-outline-light">
        <div
          className={`py-2 px-[4%] flex flex-col bg-black items-center justify-center laptop:px-[7%] w-full h-[17rem] object-cover rounded-[0.75rem]
          tablet:!h-[15rem] laptop:!h-[18rem]"
                  : "laptop:h-[24rem]"}`}
        >
          <Typography variant="body" size="large" className="mb-4 text-secondary-50 !font-normal truncate">
            This video/post is removed for violating our terms of use.
          </Typography>
          <hr className="border border-surface-0 w-full " />
          {/* <Typography
           variant="body" size="large" 
            className="text-secondary-50 !font-normal truncate mt-2"
          >
            Sorry about that
          </Typography> */}
          <div>
            <MaterialSymbol
              className="text-white text-center !text-[1.625rem]"
              icon={"sentiment_sad"}
              fill
            />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ViolatingPostCard;
