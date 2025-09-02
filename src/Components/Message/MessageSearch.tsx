import { FC } from "react";
import { MaterialSymbol } from "react-material-symbols";

interface ISearchInput {
  className?: string;
  searchOnChange?: (value: string) => void;
  onSelect?: any;
}

const MessageSearch: FC<ISearchInput> = (props) => {
  const { className, searchOnChange, onSelect } = props;
  const handleClick = () => { };
  const handleChangeSearch = (value: string) => {
    if (searchOnChange) searchOnChange(value);
  };
  return (
    <div className={`${className}`}>
      <div
        onClick={handleClick}
        className={`flex items-center border border-outline-light rounded-[1.75rem] bg-white overflow-hidden px-4 py-2 focus-within:border-primary`}
      >
        <input
          onClick={() => onSelect("search")}
          onChange={(event) => handleChangeSearch(event.target.value)}
          id="searchInput"
          placeholder="Search for users..."
          className="flex-1 outline-none  bodyLarge placeholder:text-surface-20 bg-transparent w-full tracking-[0.03125rem]"
        />
        <MaterialSymbol
          icon={"search"}
          className="cursor-pointer !text-[1.5rem] text-primary-50 pl-2"
          as={"div"}
        />
      </div>
    </div>
  );
};

export default MessageSearch;
