import { FC, Fragment } from "react";
import Button from "../../Buttons/Button.tsx";
import { DashboardMenus } from "../../../Constants/Common.ts";
import { MaterialSymbol } from "react-material-symbols";
import Typography from "../../Typography/Typography.tsx";
import { useLocation, useNavigate } from "react-router-dom";
import { PathConstants } from "../../../Router/PathConstants.ts";
import UpdatesIcon from "../../../Assets/Icons/UpdatesIcon.tsx";
import NetworksIcon from "../../../Assets/Icons/NetworksIcon.tsx";

interface IDashboardMenu {
  isMob?: boolean;
  hideAddPost?: boolean;
  onClickClose?: () => void;
}

const DashboardMenu: FC<IDashboardMenu> = (props) => {
  const { isMob, hideAddPost, onClickClose } = props;

  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigate = (path: string) => () => {
    if (onClickClose) onClickClose();
    navigate(path);
  };

  return (
    <Fragment>
      {DashboardMenus.filter(
        (_) => !hideAddPost || _?.path !== PathConstants.AddPost
      ).map((item: any, key: number) => {
        const IsActive = location.pathname === item.path;

        const renderMobileMenu = () => {
          if (isMob)
            return (
              <div className="flex flex-col items-center justify-center">
                <div
                  className={`${
                    IsActive && "isActiveMenu"
                  } px-4 py-1 flex items-center rounded-[6rem]`}
                >
                  {handleIcon()}
                </div>
                <Typography
                  className={`!font-medium text-surface-20 mt-1 ${
                    IsActive && `!font-semibold text-surface-10`
                  }`}
                >
                  {item?.title}
                </Typography>
              </div>
            );

          return (
            <div className="flex items-center justify-start">
              <div className={`flex items-center`}>{handleIcon()}</div>
              <Typography
                className={`pl-2 !font-medium text-surface-20 ${
                  IsActive && "isActiveMenu"
                }`}
              >
                {item?.title}
              </Typography>
            </div>
          );
        };

        const handleIcon = () => {
          if (item.icon === "updates_custom_icon") {
            if (IsActive) return <UpdatesIcon isFill />;
            return <UpdatesIcon />;
          }
          if (item.icon === "networks_custom_icon") {
            if (IsActive) return <NetworksIcon isFill />;
            return <NetworksIcon />;
          }
          return (
            <MaterialSymbol
              className="!text-[1.5rem] text-surface-20"
              fill={IsActive}
              icon={item.icon}
            />
          );
        };

        return (
          <Button
            variant="menu"
            className={
              isMob
                ? `!p-0 hover:bg-transparent`
                : `!p-4 outline-none mb-1 ${
                    IsActive && "isActiveMenu"
                  } hover:!bg-secondary-100`
            }
            key={key}
            onClick={handleNavigate(item?.path)}
          >
            {renderMobileMenu()}
          </Button>
        );
      })}
    </Fragment>
  );
};

export default DashboardMenu;
