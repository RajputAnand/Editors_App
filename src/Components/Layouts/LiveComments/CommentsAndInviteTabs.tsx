import { Tab } from "@headlessui/react"
import DashboardInnerPageTemplate from "../../../Templates/Dashboard/DashboardInnerPageTemplate"
import LiveComments from "./Tabs/LiveComments"
import Typography from "../../Typography/Typography"
import { FC } from "react"
import { configType } from "../../../Pages/Dashboard/Live/config"
import InviteMembersTabs from "./Tabs/InviteTab"

interface ICommentsAndInviteTabs {
  liveId: string;
  config: configType;
  audience: boolean;
  isHost: boolean;
}

const CommentsAndInviteTabs: FC<ICommentsAndInviteTabs> = (props) => {
  const { audience, isHost } = props;

  const Tabs = [
    { title: "Comments", Tab: LiveComments },
    ...(audience || !isHost ? [] : [{ title: "Invite Members", Tab: InviteMembersTabs }]),
  ];

  const handleOnChange = (index: number) => {
    return index
  }
  return (
    <DashboardInnerPageTemplate navBarProps={{ title: "" }} hideNavBar >
      <div className="">
        <Tab.Group manual={true} onChange={handleOnChange} >
          <Tab.List className={"flex items-center justify-between py-8 px-4 b500:px-[2rem] tablet:px-[15%] laptop:px-[20%]"}>
            {Tabs.map((item, index) => {
              return (
                <Tab key={index}>
                  {({ selected }) => {
                    return (
                      <Typography variant="body" size="large" className={`text-surface-20 ${selected ? "border-b border-primary" : ""}`}>{item.title}</Typography>
                    )
                  }}
                </Tab>
              )
            })}
          </Tab.List>
          <Tab.Panels>
            {Tabs.map((Item, index) => (
              <Tab.Panel key={index}>
                <Item.Tab {...props} />
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </div>
    </DashboardInnerPageTemplate>
  )
}

export default CommentsAndInviteTabs