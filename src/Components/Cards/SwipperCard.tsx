import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { FC } from "react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import UpdatesPostCard from "./UpdatesPostCard";
import { useNavigate } from "react-router-dom";
import { PathConstants } from "../../Router/PathConstants";
import Typography from "../Typography/Typography";
interface ISwiperCard {
  video?: Array<any>;
}

const SwipperCard: FC<ISwiperCard> = (props) => {
  const { video } = props;
  const renderInnerContent = (title: string) => {
    return (
      <div className="absolute inset-0 flex items-start justify-end flex-col h-full p-2">
        <Typography variant="title" size="medium" className="text-white">
          {title}
        </Typography>
      </div>
    );
  };

  const navigate = useNavigate();
  const src =
    "https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4";
  const handleNavigate = (path: string) => () => navigate(path);
  return (
    <div>
      <Swiper
        // install Swiper modules
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        spaceBetween={5}
        slidesPerView={6}
        // navigation
        // prevButton={<CustomPrevButton />}
        // nextButton={<CustomNextButton />}
        pagination={{ clickable: true }}
        //   scrollbar={{ draggable: true }}
        // onSwiper={(swiper) => console.log(swiper)}
        // onSlideChange={() => console.log("slide change")}
      >
        {video &&
          video?.map((item: any, index: number) => {
            return (
              <SwiperSlide key={index}>
                <div
                  className="mr-2 "
                  onClick={handleNavigate(
                    PathConstants.UpdatesView.replaceWithObject({
                      id: item?.id,
                    })
                  )}
                >
                  <video
                  autoPlay
                  muted
                    preload="metadata"
                    className="h-[150px] object-cover rounded-[0.75rem] "
                    // className="relative w-full h-full flex items-center justify-center rounded-[0.75rem] object-cover"
                  >
                    <source src={item?.video} className="object-cover" />
                  </video>
                  {renderInnerContent(item.title)}
                  {/* <UpdatesPostCard
              key={index}
              onClick={handleNavigate(
               PathConstants.UpdatesView.replaceWithObject({ id: item?.id })
              )}
              title={item?.title}
              className={`${index == 2 ? "hidden laptop:block" : ""}`}
              video={item?.video}
            /> */}
                  {/* <video preload="metadata" 
                className="h-[150px] object-cover rounded-[0.75rem]"
                >
                  <source src={src} type="video/mp4" />
                </video> */}
                </div>
              </SwiperSlide>
            );
          })}
      </Swiper>
    </div>
  );
};

export default SwipperCard;
