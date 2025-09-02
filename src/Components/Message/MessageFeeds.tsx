import React from "react";
import Typography from "../Typography/Typography";

const MessageFeeds: React.FC = () => {

  const renderListing = () => {
    return (
      <Typography
        variant="body"
        size="large"
        className="flex justify-center flex-wrap"
      >
        {/* xxx */}
      </Typography>
    );
  };

  return (
    <div>
      <div className="sticky top-0 pt-[20px] pb-[27px] w-full laptop:top-[50px] left-0 z-[10]">
        <h3 className="text-xl font-semibold px-4 text-[1rem] text-[#0E0E0E]">
          {/* yyy */}
        </h3>
      </div>
      {renderListing()}
    </div>
  );
};

export default MessageFeeds;
