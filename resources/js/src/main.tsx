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
import { RouterProvider } from 'react-router-dom';
import router from './router/index';

// Redux
import { Provider } from 'react-redux';
import store from './store/index';

// Importar toastr (opcional, lo importarás donde lo uses)
import toastr from 'toastr';
import { AuthProvider } from './context/AuthContext';

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
                <AuthProvider> {/* 👈 AÑADE AQUÍ */}
                    <RouterProvider router={router} />
                </AuthProvider>
            </Provider>
        </Suspense>
    </React.StrictMode>
);
