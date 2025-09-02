import {FC} from "react";
import Typography from "../Typography/Typography.tsx";

interface IOR {

}

const OR: FC<IOR> = () => {
    return (
        <div className="flex flex-row items-center justify-center gap-2">
            <hr className="flex-1"/>
            <Typography variant="body" size="large">or</Typography>
            <hr className="flex-1"/>
        </div>
    )
}

export default OR