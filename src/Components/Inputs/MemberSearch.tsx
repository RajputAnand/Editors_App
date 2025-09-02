import { FC } from "react";
import { MaterialSymbol } from "react-material-symbols";
// import { useLocation, useNavigate } from "react-router-dom";

interface IMemberSearch {
  className?: string;
  searchOnChange?: (value: string) => void;
  placeHolder?: string;
}

const MemberSearch: FC<IMemberSearch> = (props) => {
  const { className, searchOnChange, placeHolder } = props;
  // const location = useLocation();
  // const navigate = useNavigate();
  // const handleClick = (event: any) => {};
  const handleChangeSearch = (value: string) => {
    searchOnChange && searchOnChange(value);
  };
  return (
    <div className={`${className}`}>
      <div
        className={`flex items-center border border-outline-light rounded-[1.75rem] bg-white overflow-hidden px-4 py-2 focus-within:border-primary`}
      >
        <input
          onChange={(event) => handleChangeSearch(event.target.value)}
          id="searchInput"
          placeholder={placeHolder || "Search..."}
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

export default MemberSearch;
