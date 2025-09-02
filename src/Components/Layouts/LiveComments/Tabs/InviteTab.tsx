import { Tab } from "@headlessui/react"
import { configType } from "../../../../Pages/Dashboard/Live/config";
import { FC } from "react";
import DashboardInnerPageTemplate from "../../../../Templates/Dashboard/DashboardInnerPageTemplate";
import Typography from "../../../Typography/Typography";
import LiveInviteAdmiring from "../InviteUsersTab/LiveInviteAdmiring";
import LiveInviteAdmiers from "../InviteUsersTab/LiveInviteAdmiers";

interface IInviteMembersTabs {
  liveId: string;
  config: configType;
  audience: boolean;
  isHost: boolean;
}

const InviteMembersTabs: FC<IInviteMembersTabs> = (props) => {
  const Tabs = [
    { title: "Admiring", Tab: LiveInviteAdmiring },
    { title: "Admirers", Tab: LiveInviteAdmiers },
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

export default InviteMembersTabs