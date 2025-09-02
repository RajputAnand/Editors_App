interface IUpdatesIcon {
  isFill?: boolean;
  className?: string;
  upadates?: any;
}

const ViewIcon = (props: IUpdatesIcon) => {
  const { className, isFill } = props;

  const defaultClassName = "w-[1.2rem] h-[1.2rem]";

  if (isFill) {
    return (
      <img
        className={`${defaultClassName} ${className}`}
        src="Assets/Images/view.png"
        alt="updates"
        style={{ border: "2px solid #1B1B1F29", borderRadius: "100%" }}
      />
    );
  }

  return (
    <img
      className={`${defaultClassName} ${className}`}
      src="Assets/Images/view.png"
      alt="updates"
    />
  );
};
export default ViewIcon;
