interface INetworkIcon {
  isFill?: boolean;
  className?: string;
}

const NetworksIcon = (props: INetworkIcon) => {
  const { className, isFill } = props;

  const defaultClassName = "w-[1.25rem] h-[1.5rem]";

  if (isFill) {
    return (
      <img
        className={`${defaultClassName} ${className}`}
        src="Assets/Images/Network-icon_grey.png"
        alt="updates"
      />
    );
  }

  return (
    <img
      className={`${defaultClassName} ${className}`}
      src="Assets/Images/Network-icon_grey.png"
      alt="updates"
    />
  );
};
export default NetworksIcon;
