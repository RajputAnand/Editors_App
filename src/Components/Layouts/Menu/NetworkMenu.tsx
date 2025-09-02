import { FC, Fragment } from "react";
import Button from "../../Buttons/Button.tsx";
import { NetworkMenus } from "../../../Constants/Common.ts";
import Typography from "../../Typography/Typography.tsx";
import FeedsIcon from "../../../Assets/Icons/FeedsIcon.tsx";
import DiscoverIcon from "../../../Assets/Icons/DiscoverIcon.tsx";
import NetworkIcon from "../../../Assets/Icons/NetworkIcon.tsx";
// import { useLocation, useNavigate } from "react-router-dom";

interface INetworkMenu {
  isMob?: boolean;
  hideAddPost?: boolean;
  onClickClose?: () => void;
  onSelect?: any;
  selected?: any;
}

const NetworkMenu: FC<INetworkMenu> = (props) => {
  const { isMob, onSelect, selected } = props;

  // const location = useLocation();
  // const navigate = useNavigate();

  // const handleNavigate = (path: string) => () => {
  //   if (onClickClose) onClickClose();
  //   navigate(path);
  // };

  return (
    <Fragment>
      <div className="flex gap-x-2 ml-6 laptop:ml-0 laptop:gap-x-0  laptop:px-4 laptop:mr-2 laptop:py-2 laptop:block">
        {NetworkMenus.map((item: any, key: number) => {
          const IsActive = selected === item.active;

          const renderMobileMenu = () => {
            return (
              <div className={`flex items-center justify-start`}>
                <div className={`flex items-center b500:!inline-block`}>
                  {handleIcon()}
                </div>
                <Typography
                  className={`pl-2 laptop:pl-4 !font-medium text-surface-20 ${
                    IsActive && "isActiveMenu"
                  } !md:max-w-[20px]`}
                >
                  {item?.title}
                </Typography>
              </div>
            );
          };

          const handleIcon = () => {
            if (item.icon === "feeds_icon") {
              if (IsActive) return <FeedsIcon isFill />;
              return <FeedsIcon />;
            } else if (item.icon === "discover_icon") {
              if (IsActive) return <DiscoverIcon isFill />;
              return <DiscoverIcon />;
            } else if (item.icon === "network_icon") {
              if (IsActive) return <NetworkIcon isFill />;
              return <NetworkIcon />;
            }
            // return (<MaterialSymbol className="!text-[1.5rem] text-surface-20" fill={IsActive} icon={item.icon}/>)
          };

          return (
            <>
              <button
                key={key}
                onClick={() => onSelect(item.active)}
                className={`tablet:hidden mb-2 mt-2 ${
                  IsActive && "isActiveMenu rounded-full px-4 py-2"
                }`}
              >
                {renderMobileMenu()}
              </button>
              <Button
                variant="menu"
                className={
                  isMob
                    ? `!p-0 hover:bg-transparent`
                    : `w-full !p-4 outline-none mb-1 laptop:!ml-[5%] ${
                        IsActive && "isActiveMenu"
                      } hover:!bg-secondary-100
                            buttonMenu titleMedium hidden tablet:block text-white px-[1.5rem] py-[0.625rem] text-center`
                }
                key={key}
                onClick={() => onSelect(item.active)}
              >
                {renderMobileMenu()}
              </Button>
            </>
          );
        })}
      </div>
    </Fragment>
  );
};

export default NetworkMenu;
