import React, { useRef, useEffect, Suspense, useState } from "react";
import { MaterialSymbol } from "react-material-symbols";
import DiscoverCard from "../Cards/DiscoverCard";
import { useNetworkList } from "../../Hooks/useNetwork";
import Loading from "../Common/Loading";
import Typography from "../Typography/Typography";
import InfiniteScroll from "react-infinite-scroll-component";
import NetworkDetails from "./MessageDetails";

interface INetworkDiscover {
  searchNetwork?: string;
  type?: string;
}

const NetworkDiscover: React.FC<INetworkDiscover> = ({
  searchNetwork,
  type,
}) => {
  const [networkCardActive, setNetworkCardActive] = useState<boolean>(false);
  const [networkGroupId, setNetworkGroupId] = useState<any>("");
  const {
    data: networkAllList,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useNetworkList(type || "not joined", searchNetwork);

  const dataLength =
    networkAllList?.pages.reduce(
      (counter, page) => counter + page?.data.length,
      0
    ) ?? 0;

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const loadingWithText = (
    <div className="flex items-center gap-1 w-full justify-center my-8">
      <Loading iconClassName="!w-[2rem] !h-[2rem]" />
      <Typography variant="title" size="large">
        Loading
      </Typography>
    </div>
  );

  const handleNavigateToDetails = (id: number) => {
    setNetworkGroupId(id);
    setNetworkCardActive(true);
  };

  const renderListing = () => {
    return (
      <div className="flex flex-1 bg-white justify-between gap-[1.25rem] md:self-stretch">
        {/* <div className="sticky bg-[#ffff] pt-[20px] pb-[27px] w-full top-[50px] left-0 z-[50]">
          <h3 className="text-xl font-semibold px-4 text-[1rem] text-[#0E0E0E]">
            More Suggestions
          </h3>
        </div> */}
        <div className="flex">
          <h3 className="text-xl font-semibold mb-4 px-4 py-4 text-[1rem] text-[#0E0E0E]">
            More Suggestions
          </h3>
        </div>
        <button
          className="flex items-center gap-[0.25rem]"
          disabled={!hasNextPage || isFetchingNextPage}
          onClick={() => fetchNextPage()}
        >
          <div className="text-[#343DFF] text-[0.81rem] font-semibold">
            See more
          </div>
          <MaterialSymbol
            icon={"chevron_right"}
            className="cursor-pointer !text-[1.5rem] text-primary-50 pl-2 text-center"
            as={"div"}
          />
        </button>
      </div>
    );
  };

  const gridrender = () => {
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

    if (dataLength === 0)
      return (
        <Typography
          variant="body"
          size="large"
          className="flex justify-center flex-wrap"
        >
          No network found
        </Typography>
      );

    return (
      <div
        className="b500:rounded-t-[0.75rem] !mr-2 mb-4 px-2 mt-2 bg-white"
        id="NetworkscrollableDiv"
      >
        <InfiniteScroll
          next={fetchNextPage}
          hasMore={hasNextPage}
          loader={loadingWithText}
          dataLength={dataLength}
          className="flex flex-col gap-[1rem]"
          scrollableTarget={undefined}
        >
          <div className="grid grid-cols-1 gap-5 laptop:grid-cols-2">
            <Suspense fallback={<div>Loading...</div>}>
              {networkAllList?.pages.map((page, Pageindex) =>
                page.data.map((network: any, index: number) => (
                  <DiscoverCard
                    {...network}
                    key={`discoverGrid${Pageindex}-${index}`}
                    handleNavigateToDetails={handleNavigateToDetails}
                  />
                ))
              )}
            </Suspense>
          </div>
        </InfiniteScroll>
      </div>
    );
  };

  useEffect(() => {
    if (isFetchingNextPage && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [isFetchingNextPage, networkAllList]);

  return (
    <div>
      {networkCardActive ? (
        <NetworkDetails networkGroupId={networkGroupId} />
      ) : (
        <div>
          {renderListing()}
          {gridrender()}
          <div ref={bottomRef}></div>
        </div>
      )}
    </div>
  );
};

export default NetworkDiscover;
