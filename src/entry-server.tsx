import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from './App';
import './index.css'

export function render(url: string) {
    const appHtml = renderToString(
        <StaticRouter location={url}>
            <App />
        </StaticRouter>
    );
    console.log("App rendered as:", appHtml); // Add this log
    return appHtml;
}