import {FC} from "react";
import {IWithRouter} from "../../../Hoc/WithRouter.tsx";
import Typography from "../../../Components/Typography/Typography.tsx";

const Page404: FC<IWithRouter> = (props) => {
    const {navigatePage, paths} = props


    return (
        <section className="h-[100vh] ">
            <div className="bg-surface responsiveContainer h-full">
                <div className="p-2 bg-white">
                    <Typography variant="headline" size="medium" className="text-surface-10">Page not found</Typography>
                    <Typography variant="body" size="small" className="text-surface-20">
                        Looks like you've followed a broken link or entered a URL that doesn't
                        exist on this site.
                    </Typography>
                    <Typography variant="body" size="small" className="text-primary mt-1 cursor-pointer" nodeProps={{ onClick: navigatePage(paths.SingIn) }}>
                        Back to our site
                    </Typography>
                </div>
            </div>
        </section>
    )
}

export default Page404