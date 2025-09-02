import './Utils/Prototype/prototypes.ts'
import { FC } from "react";
import Client from "./Api/Client.tsx";
import AppInit from "./Router/Init.tsx";
import CreateStore from "./Store/CreateStore.tsx";
import { Toaster } from "react-hot-toast";
import 'react-material-symbols/rounded';
import 'react-tooltip/dist/react-tooltip.css';
import './Utils/Prototype/index.d.ts';
import { HelmetProvider } from 'react-helmet-async';
const App: FC = () => {
    const helmetContext = {};
    return (
        <HelmetProvider context={helmetContext}>
            <Client>
                <CreateStore>
                    <AppInit />
                    <Toaster
                        toastOptions={{
                            className: '',
                            style: {
                                marginTop: "50px"
                            },
                        }} />
                </CreateStore>
            </Client>
        </HelmetProvider>
    )
}

export default App;