import {FC} from "react";
import {IWithRouter} from "../../../Hoc/WithRouter.tsx";
import DashboardInnerPageTemplate from "../../../Templates/Dashboard/DashboardInnerPageTemplate.tsx";
import {Tab} from "@headlessui/react";
import LiveTab from "./Tabs/LiveTab.tsx";
import JoinTab from "./Tabs/JoinTab.tsx";
import BroadcastsTab from "./Tabs/BroadcastsTab.tsx";
import JoinedTab from "./Tabs/JoinedTab.tsx";
import Typography from "../../../Components/Typography/Typography.tsx";

const LivePage:FC<IWithRouter> = (props) => {
    if (typeof document !== 'undefined') {
        document.title = "Live | EditorsApp"
    }

    const Tabs = [
        { title: "Live", Tab: LiveTab },
        { title: "Join", Tab: JoinTab },
        { title: "Broadcasts", Tab: BroadcastsTab, disabled: true },
        { title: "Joined", Tab: JoinedTab, disabled: true }
    ]
    // const isConnected = useIsConnected();
    // const RTCClient = useRTCClient()

    const handleOnChange = (index: number) => {
        // if (isConnected) {
        //     return RTCClient.leave();
        // }
        return index
    }


    return (
       
        <DashboardInnerPageTemplate navBarProps={{ title: "" }} hideNavBar >
            <div className="">
                <Tab.Group manual={true} onChange={handleOnChange} >
                    <Tab.List className={"flex items-center justify-between py-8 px-4 b500:px-[2rem] tablet:px-[15%] laptop:px-[20%]"}>
                        {Tabs.map((item, index) => {
                            return (
                                <Tab disabled={item?.disabled} key={index}>
                                    {({selected}) => {
                                        return (
                                            <Typography variant="body" size="large" className={`text-surface-20 ${selected ? "border-b border-primary" :""}`}>{item.title}</Typography>
                                        )
                                    }}
                                </Tab>
                            )
                        })}
                    </Tab.List>
                    <Tab.Panels>
                        {Tabs.map((Item, index) => (
                            <Tab.Panel key={index}>
                                <Item.Tab {...props}/>
                            </Tab.Panel>
                        ))}
                    </Tab.Panels>
                </Tab.Group>
            </div>
        </DashboardInnerPageTemplate>
        
    )
}

export default LivePage