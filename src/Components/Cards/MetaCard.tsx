import {FC} from "react";
import Typography from "../Typography/Typography.tsx";

export interface IMetaCard {
    title: string,
    link: string,
    og?: {
        [x: string]: any
    }
}

const MetaCard:FC<IMetaCard> = (props) => {

    const {title, og, link} = props

    return (
        <a className="inline-flex w-full shadow p-4 mb-2 rounded" target="_blank" href={link}>
            <div className="flex items-center">
                {
                    Boolean(og?.["og:image"]) && (
                        <div className="w-1/5">
                            <img className="w-full" loading="lazy" src={og?.["og:image"]} alt={title}/>
                        </div>
                    )
                }
                <div className="flex-1 px-3">
                    <Typography variant="title" size="small" className="text-surface-10">{title}</Typography>
                    {
                        Boolean(og?.["og:description"]) && (<Typography variant="body" size="small" className="text-surface-10">{og?.["og:description"]}</Typography>)
                    }
                </div>
            </div>
        </a>
    )
}
export default MetaCard