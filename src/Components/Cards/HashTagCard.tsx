import { FC, useState } from "react";
import ReadMore from "../ReadMore/ReadMore";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Endpoints } from "../../Api/Endpoints";
import Typography from "../Typography/Typography";
import { AxiosResponse } from "axios";
import { buildRequest } from "../../Api/buildRequest";

interface IHashCard {
    searchText?:string,
    className?:string,
    searchHashText?:string,
    handleHashOnChange?:any;
    handleUsernameOnChange?:any;
    searchUsernameText?:string,

}
export const HashTagCard: FC<IHashCard> = (props) => {
    const {searchText,className,searchHashText,handleHashOnChange,searchUsernameText}=props
    const LIMIT_PAGINATION = 1000;
    const filterResponse = (data: AxiosResponse<any>) => {
        const res = data?.data;
    
        return {
          ...res,
          posts: res?.data?.filter((_: any) => _),
          updates: res?.data?.filter((_: any) => _?.video?.length !== 0),
        };
      };
    
    const { data: Postadata } = useInfiniteQuery({
        queryKey: [
          Endpoints.FeedPosts,
          "GET",
          { per_page: LIMIT_PAGINATION, name: searchText,hashtags:searchHashText,username:searchUsernameText?.replace("@","") },
        ],
        queryFn: (args) => buildRequest(args, filterResponse),
        getNextPageParam: (lastPage: any, allPages: any) => {
          return lastPage.data.length === LIMIT_PAGINATION
            ? allPages.length + 1
            : undefined;
        },
       
        initialPageParam: 1,
        staleTime: Infinity,
      });

  const [seeMore, setSeeMore] = useState<boolean>(false);
  const handleSeeMore = () => setSeeMore((_) => !_);
  const defaultClassName = "flex-col b500:gap-[0.5rem]"
  return (
    <div
    className={`${defaultClassName} ${className}`} >
      <div className="flex justify-between">
        {/* <h1 className="!p-4 outline-none !font-bold mb-1 px-[1.5rem] py-[0.625rem] text-center  pl-2  bodyLarge"> */}
          <h1 className="!p-4 outline-none mb-1 px-[1.5rem] py-[0.625rem] text-center  pl-2 !font-medium text-surface-20 false bodyLarge">
          Explore
        </h1>
        {Postadata?.pages[0]?.all_hashtags &&
          Postadata?.pages[0]?.all_hashtags?.length > 4 && (
            <div className="flex items-center justify-end r-2 !p-4 outline-none mb-1  titleMedium px-[1.5rem] py-[0.625rem] text-center  pl-2 !font-medium bodyLarge">
              <Typography
                variant="body"
                size="medium"
                className="text-primary cursor-pointer"
                nodeProps={{ onClick: handleSeeMore }}
              >
                {`See ${seeMore ? "Less" : "More"}`}
              </Typography>
            </div>
          )}
      </div>
      <div className="flex items-start mt-5 max-h-[350px] overflow-y-auto" id="hashcardscroll">
      <ul className="globel-footer-links" >
        {Postadata?.pages[0]?.all_hashtags &&
          Postadata?.pages[0]?.all_hashtags
            ?.slice?.(
              0,
              seeMore ? Postadata?.pages[0]?.all_hashtags.length  : 4
            )
            ?.map((item: any, key: number) => {
              return (
                <li
                  className="globel-footer-links-item1 cursor-pointer px-2 rounded-full
  !font-medium text-surface-20 isActiveMenu bodyLarge no-underline" id="hashtagcard"
                  key={key}
                  onClick={()=>handleHashOnChange(item)}
                >
                  <ReadMore count={150} text={item ?? ""} />
                </li>
              );
            })}
      </ul>
      </div>
    </div>
  );
};
