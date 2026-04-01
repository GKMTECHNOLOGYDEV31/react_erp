import PerfectScrollbar from 'react-perfect-scrollbar';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import { toggleSidebar } from '../../store/themeConfigSlice';
import { IRootState } from '../../store';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const Sidebar = () => {
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const semidark = useSelector((state: IRootState) => state.themeConfig.semidark);
    const location = useLocation();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { user } = useAuth();
    const [clienteGeneral, setClienteGeneral] = useState(null);
    const [loadingCliente, setLoadingCliente] = useState(false);

    const API_URL = 'http://127.0.0.1:8000/api';

    // Mapeo de roles por ID
    const ROLES = {
        ADMINISTRADOR: 1,
        CALL_CENTER: 2,
        INVITADO: 3
    };

    // Cargar datos del cliente general
    useEffect(() => {
        const cargarClienteGeneral = async () => {
            if (!user || !user.idRol) return;

            console.log('Rol', user.idRol);

            console.log('Rol', user.idRol);

            if (user.clienteGeneral) {
                console.log('✅ Sidebar - Usando clienteGeneral del user:', user.clienteGeneral);
                setClienteGeneral(user.clienteGeneral);
                return;
            }

            if (user.idClienteGeneral && !user.clienteGeneral) {
                setLoadingCliente(true);
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.get(`${API_URL}/mi-cliente-general`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Accept': 'application/json'
                        }
                    });

                    if (response.data.success) {
                        console.log('✅ Sidebar - ClienteGeneral cargado:', response.data.data);
                        setClienteGeneral(response.data.data);
                    }
                } catch (error) {
                    console.error('❌ Sidebar - Error cargando cliente general:', error);
                } finally {
                    setLoadingCliente(false);
                }
            }
        };

        cargarClienteGeneral();
    }, [user]);

    useEffect(() => {
        if (window.innerWidth < 1024 && themeConfig.sidebar) {
            dispatch(toggleSidebar());
        }
    }, [location, dispatch, themeConfig.sidebar]);

    // Función para obtener la URL del logo
    const getLogoUrl = () => {
        if (clienteGeneral?.foto) {
            if (typeof clienteGeneral.foto === 'string') {
                if (clienteGeneral.foto.startsWith('data:image')) {
                    return clienteGeneral.foto;
                }
                return `data:image/jpeg;base64,${clienteGeneral.foto}`;
            }
        }

        if (user?.clienteGeneral?.foto) {
            if (typeof user.clienteGeneral.foto === 'string') {
                if (user.clienteGeneral.foto.startsWith('data:image')) {
                    return user.clienteGeneral.foto;
                }
                return `data:image/jpeg;base64,${user.clienteGeneral.foto}`;
            }
        }

        return '/assets/images/LOGO-GKM-1.webp';
    };

    // Función para obtener la descripción de la empresa
    const getEmpresaDescripcion = () => {
        if (clienteGeneral?.descripcion) {
            return clienteGeneral.descripcion;
        }

        if (user?.clienteGeneral?.descripcion) {
            return user.clienteGeneral.descripcion;
        }

        return 'GKM TECHNOLOGY';
    };

    return (
        <div className={semidark ? 'dark' : ''}>
            <nav
                className={`sidebar fixed min-h-screen h-full top-0 bottom-0 w-[260px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] z-50 transition-all duration-300 ${semidark ? 'text-white-dark' : ''}`}
            >
                <div className="bg-white dark:bg-black h-full">
                    <div className="flex justify-between items-center px-4 py-3">
                        <NavLink to="/" className="main-logo flex items-center shrink-0">
                            <img
                                className="w-8 ml-[5px] flex-none rounded"
                                src={getLogoUrl()}
                                alt={getEmpresaDescripcion()}
                                onError={(e) => {
                                    console.log('Error cargando logo en sidebar, usando default');
                                    e.target.src = '/assets/images/LOGO-GKM-1.webp';
                                }}
                            />
                            <span className="text-1x2 ltr:ml-1.5 rtl:mr-1.5 font-extrabold align-middle lg:inline dark:text-white-light">
                                {loadingCliente ? 'Cargando...' : getEmpresaDescripcion()}
                            </span>
                        </NavLink>

                        <button
                            type="button"
                            className="collapse-icon w-8 h-8 rounded-full flex items-center hover:bg-gray-500/10 dark:hover:bg-dark-light/10 dark:text-white-light transition duration-300 rtl:rotate-180"
                            onClick={() => dispatch(toggleSidebar())}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 m-auto">
                                <path d="M13 19L7 12L13 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path opacity="0.5" d="M16.9998 19L10.9998 12L16.9998 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>

                    <PerfectScrollbar className="h-[calc(100vh-80px)] relative">
                        <ul className="relative font-semibold space-y-0.5 p-4 py-0">
                            {/* DASHBOARD - Visible para ADMINISTRADOR e INVITADO */}
                            {user && user.idRol && (user.idRol === ROLES.ADMINISTRADOR || user.idRol === ROLES.INVITADO) && (
                                <>
                                    <h2 className="py-3 px-7 flex items-center uppercase font-extrabold bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] -mx-4 mb-1">
                                        <span>DASHBOARD</span>
                                    </h2>

                                    <li className="nav-item">
                                        <NavLink to="/analytics" className="group">
                                            <div className="flex items-center">
                                                <svg className="group-hover:!text-primary shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        opacity="0.5"
                                                        d="M2 12.2039C2 9.91549 2 8.77128 2.5192 7.82274C3.0384 6.87421 3.98695 6.28551 5.88403 5.10813L7.88403 3.86687C9.88939 2.62229 10.8921 2 12 2C13.1079 2 14.1106 2.62229 16.116 3.86687L18.116 5.10812C20.0131 6.28551 20.9616 6.87421 21.4808 7.82274C22 8.77128 22 9.91549 22 12.2039V13.725C22 17.6258 22 19.5763 20.8284 20.7881C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.7881C2 19.5763 2 17.6258 2 13.725V12.2039Z"
                                                        fill="currentColor"
                                                    />
                                                    <path
                                                        d="M9 17.25C8.58579 17.25 8.25 17.5858 8.25 18C8.25 18.4142 8.58579 18.75 9 18.75H15C15.4142 18.75 15.75 18.4142 15.75 18C15.75 17.5858 15.4142 17.25 15 17.25H9Z"
                                                        fill="currentColor"
                                                    />
                                                </svg>
                                                <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">Analítica</span>
                                            </div>
                                        </NavLink>
                                    </li>
                                </>
                            )}

                            {/* SECCIÓN TICKETS - Visible para ADMINISTRADOR y CALL CENTER */}
                            {user && user.idRol && (user.idRol === ROLES.ADMINISTRADOR || user.idRol === ROLES.CALL_CENTER) && (
                                <>
                                    <h2 className="py-3 px-7 flex items-center uppercase font-extrabold bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] -mx-4 mb-1 mt-4">
                                        <span>TICKETS</span>
                                    </h2>

                                    {/* LISTA TICKETS */}
                                    <li className="nav-item">
                                        <NavLink to="/tickets" className="group" end>
                                            <div className="flex items-center">
                                                <svg className="group-hover:!text-primary shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        opacity="0.5"
                                                        d="M2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12Z"
                                                        fill="currentColor"
                                                    />
                                                    <path
                                                        d="M16.75 12C16.75 12.4142 16.4142 12.75 16 12.75L8 12.75C7.58579 12.75 7.25 12.4142 7.25 12C7.25 11.5858 7.58579 11.25 8 11.25L16 11.25C16.4142 11.25 16.75 11.5858 16.75 12Z"
                                                        fill="currentColor"
                                                    />
                                                    <path
                                                        d="M13.75 16C13.75 16.4142 13.4142 16.75 13 16.75H8C7.58579 16.75 7.25 16.4142 7.25 16C7.25 15.5858 7.58579 15.25 8 15.25H13C13.4142 15.25 13.75 15.5858 13.75 16Z"
                                                        fill="currentColor"
                                                    />
                                                    <path
                                                        d="M11.75 8C11.75 8.41421 11.4142 8.75 11 8.75H8C7.58579 8.75 7.25 8.41421 7.25 8C7.25 7.58579 7.58579 7.25 8 7.25H11C11.4142 7.25 11.75 7.58579 11.75 8Z"
                                                        fill="currentColor"
                                                    />
                                                </svg>
                                                <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">Lista Tickets</span>
                                            </div>
                                        </NavLink>
                                    </li>

                                    {/* CREAR TICKET */}
                                    <li className="nav-item">
                                        <NavLink to="/tickets/crear" className="group">
                                            <div className="flex items-center">
                                                <svg className="group-hover:!text-primary shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        opacity="0.5"
                                                        d="M12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22Z"
                                                        fill="currentColor"
                                                    />
                                                    <path
                                                        d="M12 7.25C12.4142 7.25 12.75 7.58579 12.75 8V11.25H16C16.4142 11.25 16.75 11.5858 16.75 12C16.75 12.4142 16.4142 12.75 16 12.75H12.75V16C12.75 16.4142 12.4142 16.75 12 16.75C11.5858 16.75 11.25 16.4142 11.25 16V12.75H8C7.58579 12.75 7.25 12.4142 7.25 12C7.25 11.5858 7.58579 11.25 8 11.25H11.25V8C11.25 7.58579 11.5858 7.25 12 7.25Z"
                                                        fill="currentColor"
                                                    />
                                                </svg>
                                                <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">Crear Tickets</span>
                                            </div>
                                        </NavLink>
                                    </li>
                                </>
                            )}

                            {/* CONSULTAR TICKET - Visible para todos los roles */}
                            <li className="nav-item">
                                <NavLink to="/tickets/consultar" className="group">
                                    <div className="flex items-center">
                                        <svg className="group-hover:!text-primary shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                opacity="0.5"
                                                d="M15.7164 16.2234H8.2832C7.80877 16.2234 7.33597 16.3977 6.96297 16.7103C6.48921 17.1092 5.95163 17.5009 5.46102 17.8642C4.615 18.4919 4.19199 18.8058 3.98802 18.8494C3.8511 18.8789 3.71018 18.8652 3.58185 18.8101C3.38497 18.7271 3.29753 18.4708 3.12264 17.9582C2.54147 16.3141 2.19336 13.8155 2.19336 11.9898C2.19336 7.07441 6.0918 4.05078 11.9998 4.05078C17.9078 4.05078 21.8062 7.07441 21.8062 11.9898C21.8062 16.9053 17.9078 19.9289 11.9998 19.9289C11.4929 19.9289 10.9904 19.8937 10.4937 19.8236"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                fill="none"
                                            />
                                            <path
                                                d="M11.2002 11.25C11.2002 10.4216 11.8577 9.75 12.6502 9.75C13.4427 9.75 14.1002 10.4216 14.1002 11.25C14.1002 12.0784 13.4427 12.75 12.6502 12.75C12.2462 12.75 11.8863 12.5625 11.6475 12.27"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                fill="none"
                                            />
                                            <path d="M11.1992 14.25H11.2082" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                        </svg>
                                        <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">Consultar Ticket</span>
                                    </div>
                                </NavLink>
                            </li>
                        </ul>
                    </PerfectScrollbar>
                </div>
            </nav>
        </div>
    );
};

export default Sidebar;