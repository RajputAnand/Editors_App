interface IFeedsIcon {
  isFill?: boolean;
  className?: string;
}

const FeedsIcon = (props: IFeedsIcon) => {
  const { className, isFill } = props;

  const defaultClassName = "w-[1.25rem] h-[1.5rem]";

  if (isFill) {
    return (
      <img
        className={`${defaultClassName} ${className}`}
        src="Assets/Images/feedsFill.png"
        alt="updates"
      />
    );
  }

  return (
    <img
      className={`${defaultClassName} ${className}`}
      src="Assets/Images/feeds.png"
      alt="updates"
    />
  );
};
export default FeedsIcon;
