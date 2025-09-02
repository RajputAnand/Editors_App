interface IPinpostIcon {
  isFill?: boolean;
  className?: string;
}

const PinpostIcon = (props: IPinpostIcon) => {
  const { className, isFill } = props;

  const defaultClassName = "w-[2.25rem] h-[1.5rem]";

  if (isFill) {
    return (
      <img
        className={`${defaultClassName} ${className}`}
        src="Assets/Images/unpin.png"
        alt="pinpost"
      />
    );
  }

  return (
    <img
      className={`${defaultClassName} ${className}`}
      src="Assets/Images/pin.png"
      alt="pinpost"
    />
  );
};
export default PinpostIcon;
