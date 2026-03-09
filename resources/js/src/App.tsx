import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRoutes } from 'react-router-dom';
import { IRootState } from './store';
import {
    toggleRTL,
    toggleTheme,
    toggleLocale,
    toggleMenu,
    toggleLayout,
    toggleAnimation,
    toggleNavbar,
    toggleSemidark
} from './store/themeConfigSlice';
import { Toaster } from 'react-hot-toast';
import { routes } from './router/routes';

function App() {
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const dispatch = useDispatch();

    useEffect(() => {
        // Cargar configuración desde localStorage
        dispatch(toggleTheme(localStorage.getItem('theme') || themeConfig.theme));
        dispatch(toggleMenu(localStorage.getItem('menu') || themeConfig.menu));
        dispatch(toggleLayout(localStorage.getItem('layout') || themeConfig.layout));
        dispatch(toggleRTL(localStorage.getItem('rtlClass') || themeConfig.rtlClass));
        dispatch(toggleAnimation(localStorage.getItem('animation') || themeConfig.animation));
        dispatch(toggleNavbar(localStorage.getItem('navbar') || themeConfig.navbar));
        dispatch(toggleLocale(localStorage.getItem('i18nextLng') || themeConfig.locale));
        dispatch(toggleSemidark(localStorage.getItem('semidark') || themeConfig.semidark));
    }, [dispatch]);

    const routing = useRoutes(routes);

    return (
        <div
            className={`
                ${themeConfig.sidebar ? 'toggle-sidebar' : ''}
                ${themeConfig.menu}
                ${themeConfig.layout}
                ${themeConfig.rtlClass}
                main-section antialiased relative font-nunito text-sm font-normal
            `}
        >
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 3000,
                    style: {
                        borderRadius: '10px',
                        background: '#fff',
                        color: '#333',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                    },
                    success: { style: { border: '1px solid #22c55e' } },
                    error: { style: { border: '1px solid #ef4444' } },
                }}
            />
            {routing}
        </div>
    );
}

export default App;
