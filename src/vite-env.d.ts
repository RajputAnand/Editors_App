/// <reference types="vite/client" />
interface ImportMetaEnv {
    readonly VITE_API_URL: string,
    readonly VITE_AGORA_APP_ID: string,
    readonly VITE_RTC_TOKEN_URL: string
    // more env variables...
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}