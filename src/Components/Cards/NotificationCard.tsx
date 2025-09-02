import { FC, useContext, useState} from "react";
import Notification from "../../Templates/Notification/Notification";
import { useNavigate } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from "../Common/Loading";
import Typography from "../Typography/Typography";
import { MaterialSymbol } from "react-material-symbols";

 
interface INotificationCard {
 
  hasNextPage?:any
  fetchNextPage?:any
  isLoading?:any
  data?:any
  refetch?:any
  addClass?:any
 
}
interface CustomElement extends HTMLElement {
  scrollbarzindex: number;
}

const NotificationCard: FC<INotificationCard> = (props) => {
  const {hasNextPage,fetchNextPage,isLoading, refetch,data,addClass} = props;
  // const addclassNotification = useContext(UserContext);
  const navigate = useNavigate();
  const loadingWithText = (
    <div className="flex items-center gap-1 w-full justify-center my-8">
      <Loading iconClassName="!w-[2rem] !h-[2rem]" />
      <Typography variant="title" size="large">
        Loading
      </Typography>
    </div>
  );
  const nodataWithText = (
    <div className="flex items-center gap-1 w-full justify-center my-8">     
      <Typography variant="title" size="large">
        No notification yet
      </Typography>
    </div>
  );
  const dataLength =
    data?.pages.reduce((counter:any, page:any) => counter + page?.data.length, 0) ?? 0;

  return (
    <>
     {(isLoading)  && loadingWithText}
     {(dataLength === 0) && nodataWithText}
    
      <div className={`${addClass===true ? "notificationopen":""} overflow-y-auto !z-50`} id="scrollableDiv">
        <InfiniteScroll
          next={fetchNextPage}
          hasMore={hasNextPage}
          loader={loadingWithText}
          dataLength={dataLength}
          scrollableTarget="scrollableDiv"
        >
          {data?.pages?.map((page:any) => {
            
            return page.data?.map?.((item: any, key: number) => {
         
              return (
                <div
                id="notificationcardid"
                  key={key}
                  className={`${
                    item?.is_read === 0 && "bg-gray-100"
                  } flex flex-col gap-[1.5rem]  pb-6 tablet:pb-0  overflow-auto h-[96%] mb-4 !z-50`}
                > 
                <div className="flex text-center items-center justify-between !z-50">
               
                <Notification key={key} userNav refetch={refetch} {...item} post={item?.post} />
                {item?.is_read === 0 &&<MaterialSymbol className="text-primary text-center !text-[0.9rem]" icon={"fiber_manual_record"} fill/>}
                </div>
               
                </div>
              );
            })
          })}
        </InfiniteScroll>
      </div>
      {/* } */}
    </>
  );
};

export default NotificationCard;
