/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string;
    // aquí puedes agregar más variables de entorno si las tienes
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}