import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client'

// Toastr CSS
import 'toastr/build/toastr.min.css'; // 👈 IMPORTAR ESTILOS DE TOASTR

// Perfect Scrollbar
import 'react-perfect-scrollbar/dist/css/styles.css';

// Tailwind css
import './tailwind.css';

// i18n (needs to be bundled)
import './i18n';

// Router
import { BrowserRouter, RouterProvider } from 'react-router-dom';
import router from './router/index';
import { AuthProvider } from './context/AuthContext'; // Ajusta la ruta

// Redux
import { Provider } from 'react-redux';
import store from './store/index';

// Importar toastr (opcional, lo importarás donde lo uses)
import toastr from 'toastr';
import App from './App';

// Configuración global de toastr
toastr.options = {
    closeButton: true,
    progressBar: true,
    positionClass: 'toast-top-right',
    timeOut: 3000,
    extendedTimeOut: 1000,
    showMethod: 'fadeIn',
    hideMethod: 'fadeOut',
    showDuration: 300,
    hideDuration: 500,
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <Suspense fallback={<div>Cargando...</div>}>
            <Provider store={store}>
                <BrowserRouter>
                    <AuthProvider>
                        <App />
                    </AuthProvider>
                </BrowserRouter>
            </Provider>
        </Suspense>
    </React.StrictMode>
);
