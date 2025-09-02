import {ComponentType} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {Endpoints} from "../Api/Endpoints.ts";
import {PathConstants} from "../Router/PathConstants.ts";


export interface IWithRouter {
    endpoints: typeof Endpoints;
    location: ReturnType<typeof useLocation>;
    navigate: ReturnType<typeof useNavigate>;
    params: Record<string, string>;
    paths: typeof PathConstants,
    navigatePage: (path: string | any) => () => void,
}

export const WithRouter = <Props extends IWithRouter>(
    Component: ComponentType<Props>
) => {
    return (props: Omit<Props, keyof IWithRouter>) => {
        const location = useLocation();
        const params = useParams();
        const navigate = useNavigate();
        
        const navigatePage = (path: string | any) => () => navigate(path)

        return (
            <Component
                {...(props as Props)}
                location={location}
                params={params}
                navigate={navigate}
                endpoints={Endpoints}
                paths={PathConstants}
                navigatePage={navigatePage}
            />
        );
    };
};