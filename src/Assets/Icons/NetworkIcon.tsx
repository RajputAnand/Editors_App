interface INetworkIcon {
  isFill?: boolean;
  className?: string;
}

const NetworkIcon = (props: INetworkIcon) => {
  const { className, isFill } = props;

  const defaultClassName = "w-[1.25rem] h-[1.5rem]";

  if (isFill) {
    return (
      <img
        className={`${defaultClassName} ${className}`}
        src="Assets/Images/networkFill.png"
        alt="updates"
      />
    );
  }

  return (
    <img
      className={`${defaultClassName} ${className}`}
      src="Assets/Images/network.png"
      alt="updates"
    />
  );
};
export default NetworkIcon;
