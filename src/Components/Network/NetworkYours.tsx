import React, { Suspense, useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import YoursNetworkCard from "../Cards/YoursNetworkCard";
import PendingNetworkCard from "../Cards/PendingNetworkCard";
import Typography from "../Typography/Typography";
import NetworkDetails from "./NetworkDetails";
import InfiniteScroll from "react-infinite-scroll-component";
import { useNetworkList } from "../../Hooks/useNetwork";
import Loading from "../Common/Loading";

interface INetworkYours {
  searchNetwork?: string;
  shouldShowPending?: any;
}

const NetworkYours: React.FC<INetworkYours> = ({
  searchNetwork,
  shouldShowPending,
}) => {
  const roles = ["invited user"];
  const [networkCardActive, setNetworkCard] = useState<any>(false);
  const [networkGroupId, setNetworkGroupId] = useState<number>();
  const {
    data: networkJoinedList,
    fetchNextPage,
    hasNextPage,
    isLoading,
    error,
  } = useNetworkList("joined", searchNetwork);
  const {
    data: networkNotJoinedList,
    fetchNextPage: fetchNextNotJoinedlistPage,
    hasNextPage: hasNotJoinedListNextPage,
    isLoading: isLoadingNotJoinedList,
    error: errorNotJoinedList,
  } = useNetworkList("", searchNetwork, roles);

  const totalJoinedNetworks = networkJoinedList?.pages[0]?.total || 0;
  const totalNotJoinedNetworks = networkNotJoinedList?.pages[0]?.total || 0;

  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (shouldShowPending) {
      setActiveTab(1);
    }
  }, [shouldShowPending]);

  const loadingWithText = (
    <div className="flex items-center gap-1 w-full justify-center my-8">
      <Loading iconClassName="!w-[2rem] !h-[2rem]" />
      <Typography variant="title" size="large">
        Loading
      </Typography>
    </div>
  );

  const gridrenderAll = () => {
    const dataLength =
      networkJoinedList?.pages.reduce(
        (counter, page) => counter + page?.data.length,
        0
      ) ?? 0;
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
          No networks found
        </Typography>
      );
    return (
      <div
        className="b500:rounded-t-[0.75rem] !mr-2 mb-4"
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
          <div className="grid grid-cols-1 gap-5 laptop:grid-cols-2 bg-[#FCF8FD] p-4">
            <Suspense fallback={<div>Loading...</div>}>
              {networkJoinedList?.pages.map((page, pageIndex) =>
                page.data.map((network: any, networkIndex: number) => (
                  <YoursNetworkCard
                    {...network}
                    key={`discoverGrid${pageIndex}-${networkIndex}`}
                    setNetworkCard={setNetworkCard}
                    setNetworkGroupId={setNetworkGroupId}
                  />
                ))
              )}
            </Suspense>
          </div>
        </InfiniteScroll>
      </div>
    );
  };

  const gridrenderPending = () => {
    const notJoinedListlength =
      networkNotJoinedList?.pages.reduce(
        (counter, page) => counter + page?.data.length,
        0
      ) ?? 0;
    if (isLoadingNotJoinedList) return loadingWithText;
    if (errorNotJoinedList)
      return (
        <Typography
          variant="body"
          size="large"
          className="flex justify-center flex-wrap"
        >
          Something went wrong
        </Typography>
      );

    if (notJoinedListlength === 0)
      return (
        <Typography
          variant="body"
          size="large"
          className="flex justify-center flex-wrap"
        >
          No invite found
        </Typography>
      );

    return (
      <div className="b500:rounded-t-[0.75rem] !mr-2 mb-4" id="scrollableDiv">
        <InfiniteScroll
          next={fetchNextNotJoinedlistPage}
          hasMore={hasNotJoinedListNextPage}
          loader={loadingWithText}
          dataLength={notJoinedListlength}
          className="flex flex-col gap-[1rem]"
          scrollableTarget={undefined}
        >
          <div className="grid grid-cols-1 gap-5 laptop:grid-cols-2 bg-[#FCF8FD] p-4">
            {networkNotJoinedList?.pages.map((page, pageIndex) =>
              page.data.map((network: any, networkIndex: number) => (
                <PendingNetworkCard
                  {...network}
                  key={`discoverGrid${pageIndex}-${networkIndex}`}
                  setNetworkCard={setNetworkCard}
                  setNetworkGroupId={setNetworkGroupId}
                />
              ))
            )}
          </div>
        </InfiniteScroll>
      </div>
    );
  };

  const renderListing = () => {
    return (
      <div
        className="flex flex-wrap relative justify-end mt-4"
        id="network-tabs"
      >
        <div className="w-full">
          <Tabs
            selectedIndex={activeTab}
            onSelect={(index) => setActiveTab(index)}
          >
            <TabList>
              <Tab>
                <span
                //  className="text-[#0E0E0E] text-[1.03rem] font-bold"
                >
                  All Networks you have joined
                </span>
                <span className="text-[#83869B] text-[1.03rem] font-bold ml-3">
                  ({totalJoinedNetworks})
                </span>
              </Tab>
              <Tab>
                <span>Pending requests</span>
                <span className="text-[#83869B] text-[1.03rem] font-bold ml-3">
                  ({totalNotJoinedNetworks})
                </span>
              </Tab>
            </TabList>

            <TabPanel>{gridrenderAll()}</TabPanel>
            <TabPanel>{gridrenderPending()}</TabPanel>
          </Tabs>
        </div>
        {/* <div className="absolute flex text-center gap-[1rem]">
          <div className="flex">
            <MaterialSymbol
              icon={"filter_alt"}
              className="cursor-pointer !text-[1.5rem] text-[#575B80] pl-2"
              as={"div"}
            />
            <Typography variant="title" size="medium">
              Filter
            </Typography>
          </div>
          <MaterialSymbol
            icon={"grid_on"}
            className="cursor-pointer !text-[1.5rem] text-[#575B80] pl-2"
            as={"div"}
          />
          <MaterialSymbol
            icon={"table_rows"}
            className="cursor-pointer !text-[1.5rem] text-[#575B80] pl-2"
            as={"div"}
          />
        </div> */}
      </div>
    );
  };
  return (
    <div className="relative h-[61.44rem] flex-1 md:w-full md:flex-none md:self-stretch">
      {networkCardActive ? (
        <NetworkDetails networkGroupId={networkGroupId} />
      ) : (
        renderListing()
      )}
    </div>
  );
};

export default NetworkYours;
