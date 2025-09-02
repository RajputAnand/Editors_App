import { FC, useState } from "react"
import Avatar from "../Avatar/Avatar"
import { MaterialSymbol } from "react-material-symbols"
import Typography from "../Typography/Typography"
import { useNavigate } from "react-router-dom"
import { PathConstants } from "../../Router/PathConstants"

interface INetworkCard {
admired:any;
}
const NetworkCard: FC<INetworkCard> = (props) => {
    const { admired} = props;
    const [isAdmiring,setIsAdmiring] = useState<boolean>(true);
    const navigate = useNavigate();

    const handleUserClick = () => {
        return navigate(PathConstants.NetworkView.replaceWithObject({ id:admired.id}))
    }
    return (
        <div className="p-4 bg-white rounded flex flex-row gap-2 items-center cursor-pointer">
            <div className="flex flex-row flex-1 gap-2" onClick={handleUserClick}>
                <div className="relative">
                <Avatar classNameAvatarContainer="w-[4rem] h-[4rem]" image={admired.profile_photo} />
                <MaterialSymbol className={`text-primary text-center !text-[1.4rem] absolute bottom-[-6px] right-0`} icon={"verified"} fill/>
                </div>
                <div className="flex-1">
                    <Typography variant="body" className="!font-medium">{admired.name} </Typography>
                    <Typography variant="body" className="text-secondary-50">@{admired.user_name}</Typography>
                </div>
            </div>
        </div>
    )
}

export default NetworkCard