import { FC } from "react";
import { MaterialSymbol } from "react-material-symbols";
import { useLocation, useNavigate } from "react-router-dom";
import { PathConstants } from "../../../Router/PathConstants.ts";

interface ISearchInput {
    className?: string,
    searchOnChange: (value: string) => void;
    handleHashOnChange: (value: string) => void;
    handleUsernameOnChange: (value: string) => void;

}

const SearchInput: FC<ISearchInput> = (props) => {

    const { className, searchOnChange, handleHashOnChange, handleUsernameOnChange } = props
    const location = useLocation();
    const navigate = useNavigate()
    const handleClick = (event: any) => {

        if (location.pathname == PathConstants.Home) return event;
        return navigate(PathConstants.Home)
    }
    const handleChangeSearch = (value: string) => {
        const hashtags = value.match(/#[^\s#]*/g);
        const atusername = value.includes('@');

        // const hashtags = value.startsWith('#')
        if (hashtags)
        // hashtags.replaceLinksWithAHashTag();
        {
            return handleHashOnChange(value)
        }
        else if (atusername) {
            return handleUsernameOnChange(value)
        }
        else
            return searchOnChange(value)


    }
    return (
        <div className={`${className}`}>
            <div onClick={handleClick} className={`flex items-center border border-outline-light rounded-[1.75rem] bg-white overflow-hidden px-4 py-2 focus-within:border-primary`}>
                <input onChange={(event) => handleChangeSearch(event.target.value)} id="searchInput" placeholder="Search..." className="flex-1 outline-none  bodyLarge placeholder:text-surface-20 bg-transparent w-full tracking-[0.03125rem]" />
                {/* <input onChange={(event) => searchOnChange(event.target.value)} id="searchInput" placeholder="Search..." className="flex-1 outline-none  bodyLarge placeholder:text-surface-20 bg-transparent w-full tracking-[0.03125rem]"/> */}
                <MaterialSymbol icon={"search"} className="cursor-pointer !text-[1.5rem] text-primary-50 pl-2" as={"div"} />
            </div>
        </div>
    )
}

export default SearchInput