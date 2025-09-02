interface IUpdatesIcon {
  isFill?: boolean;
  className?: string;
}

const UpdatesIcon = (props: IUpdatesIcon) => {
  const { className, isFill } = props;

  const defaultClassName = "w-[1.25rem] h-[1.5rem]";

  if (isFill) {
    return (
      <img
        className={`${defaultClassName} ${className}`}
        src="Assets/Images/updatesFill.png"
        alt="updates"
      />
    );
  }

  return (
    <img
      className={`${defaultClassName} ${className}`}
      src="Assets/Images/updates.png"
      alt="updates"
    />
  );
};
export default UpdatesIcon;
