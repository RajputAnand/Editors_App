import React, { Suspense } from "react";
import { MaterialSymbol } from "react-material-symbols";
import YourFeedActivity from "./YourFeedActivity";
import { useNetworkList } from "../../Hooks/useNetwork";
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from "../Common/Loading";
import Typography from "../Typography/Typography";

interface IJoinedNetworks {
  onSelect?: any;
  onSelectNetworkId?: any;
}

const JoinedNetworks: React.FC<IJoinedNetworks> = ({
  onSelect,
  onSelectNetworkId,
}) => {
  const {
    data: networkJoinedList,
    fetchNextPage,
    error,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
  } = useNetworkList("joined");

  const dataLength =
    networkJoinedList?.pages.reduce(
      (counter, page) => counter + page?.data.length,
      0
    ) ?? 0;

  const handleNavigateToDetails = (id: any) => {
    onSelectNetworkId(id);
    onSelect("details");
  };

  const loadingWithText = (
    <div className="flex items-center gap-1 w-full justify-center my-8">
      <Loading iconClassName="!w-[2rem] !h-[2rem]" />
      <Typography variant="title" size="large">
        Loading
      </Typography>
    </div>
  );

  if (isLoading) return loadingWithText;
  if (error)
    return (
      <Typography
        variant="body"
        size="large"
        className="flex justify-center flex-wrap"
      >
        Something went wrong
      </Typography>
    );

  return (
    <>
      {/* joined networks section */}
      <div className="px-2 laptop:px-0 flex items-center justify-between gap-[1.25rem] self-stretch cursor-pointer ">
        <h1 className="text-medium text-sm laptop:text-lg font-bold mb-2 laptop:!ml-[5%] text-center py-2">
          Networks you have joined
        </h1>

        <button
          disabled={!hasNextPage || isFetchingNextPage}
          onClick={() => fetchNextPage()}
        >
          <MaterialSymbol
            icon={"chevron_right"}
            className="cursor-pointer !text-[1.5rem] mb-2 text-primary-50 pl-2 text-center"
            as={"div"}
          />
        </button>
      </div>
      {/* joined networks list section */}
      <div>
        <InfiniteScroll
          next={fetchNextPage}
          hasMore={hasNextPage}
          loader={loadingWithText}
          dataLength={dataLength}
          className="flex flex-col gap-[1rem]"
          scrollableTarget={undefined}
        >
          <div className="flex w-[81%] flex-col gap-[0.5rem] md:w-full laptop:!ml-[5%] px-4 laptop:px-0">
            <Suspense fallback={<div>Loading feed...</div>}>
              {networkJoinedList?.pages.map((page, index) =>
                page.data.map((network: any, networkIndex: number) => (
                  <div
                    onClick={() => handleNavigateToDetails(network?.id)}
                    className="cursor-pointer"
                  >
                    <YourFeedActivity
                      key={`network-${index}-${networkIndex}`}
                      {...network}
                      className="flex-1"
                    />
                  </div>
                ))
              )}
            </Suspense>
          </div>
        </InfiniteScroll>
      </div>
    </>
  );
};

export default JoinedNetworks;
