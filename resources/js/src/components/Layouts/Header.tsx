import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { IRootState } from '../../store';
import { toggleRTL, toggleTheme, toggleSidebar } from '../../store/themeConfigSlice';
import { useTranslation } from 'react-i18next';
import Dropdown from '../Dropdown';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios'; // IMPORTAR AXIOS

const Header = () => {
    const { user, logout } = useAuth(); // Datos del usuario y función de logout
    const [clienteGeneral, setClienteGeneral] = useState(null);
    const [loadingCliente, setLoadingCliente] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    
    // Configuración de axios
    const API_URL = 'http://127.0.0.1:8000/api';

    // 👇 LOG PARA VER QUÉ RECIBE EL USER
    useEffect(() => {
        console.log('🔍 Usuario desde contexto:', user);
        if (user) {
            console.log('📸 Avatar:', user.avatar);
            console.log('📸 Tipo de avatar:', typeof user.avatar);
            console.log('🔍 idClienteGeneral del usuario:', user.idClienteGeneral);
            console.log('🏢 ClienteGeneral del usuario:', user.clienteGeneral);
            
            // Si el cliente general ya viene en el user, lo usamos
            if (user.clienteGeneral) {
                console.log('✅ Usando clienteGeneral del user:', user.clienteGeneral);
                setClienteGeneral(user.clienteGeneral);
            } 
            // Si no viene pero tiene idClienteGeneral, lo cargamos
            else if (user.idClienteGeneral) {
                console.log('🔄 Cargando clienteGeneral desde API...');
                cargarClienteGeneral(user.idClienteGeneral);
            } else {
                console.log('⚠️ El usuario no tiene clienteGeneral asociado');
            }
        }
    }, [user]);

   // En la función cargarClienteGeneral:
const cargarClienteGeneral = async (idClienteGeneral) => {
    if (!idClienteGeneral) return;
    
    setLoadingCliente(true);
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No hay token disponible');
            return;
        }

        console.log('📡 Llamando a API /mi-cliente-general');
        const response = await axios.get(`${API_URL}/mi-cliente-general`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });

        console.log('✅ Respuesta de cliente general:', response.data);

        if (response.data.success) {
            setClienteGeneral(response.data.data);
            console.log('✅ ClienteGeneral cargado:', response.data.data);
        }
    } catch (error) {
        console.error('❌ Error cargando cliente general:', error);
        if (error.response) {
            console.error('Detalles del error:', {
                status: error.response.status,
                data: error.response.data
            });
        }
    } finally {
        setLoadingCliente(false);
    }
};

    // Efecto para manejar la activación de enlaces en el menú horizontal
    useEffect(() => {
        const selector = document.querySelector('ul.horizontal-menu a[href="' + window.location.pathname + '"]');
        if (selector) {
            selector.classList.add('active');
            const all: any = document.querySelectorAll('ul.horizontal-menu .nav-link.active');
            for (let i = 0; i < all.length; i++) {
                all[0]?.classList.remove('active');
            }
            const ul: any = selector.closest('ul.sub-menu');
            if (ul) {
                let ele: any = ul.closest('li.menu').querySelectorAll('.nav-link');
                if (ele) {
                    ele = ele[0];
                    setTimeout(() => {
                        ele?.classList.add('active');
                    });
                }
            }
        }
    }, [location]);

    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const dispatch = useDispatch();

    // Datos de ejemplo para mensajes y notificaciones
    const [messages, setMessages] = useState([]);
    const removeMessage = (value: number) => {};
    const [notifications, setNotifications] = useState([]);
    const removeNotification = (value: number) => {};
    const [search, setSearch] = useState(false);
    const { t } = useTranslation();

    const setLocale = (flag: string) => {
        setFlag(flag);
        if (flag.toLowerCase() === 'ae') {
            dispatch(toggleRTL('rtl'));
        } else {
            dispatch(toggleRTL('ltr'));
        }
    };
    const [flag, setFlag] = useState(themeConfig.locale);

    // Función para obtener la URL del avatar del usuario
    const getAvatarUrl = () => {
        if (user?.avatar) {
            // Si ya viene con el prefijo data:image, lo usamos directo
            if (typeof user.avatar === 'string' && user.avatar.startsWith('data:image')) {
                return user.avatar;
            }
            // Si viene como base64 puro, le agregamos el prefijo
            return `data:image/jpeg;base64,${user.avatar}`;
        }
        return '/assets/images/user-profile.jpeg';
    };

    // Función para obtener la foto del cliente general (logo de la empresa)
    const getLogoUrl = () => {
        // Prioridad 1: Foto del cliente general cargado
        if (clienteGeneral?.foto) {
            if (typeof clienteGeneral.foto === 'string') {
                if (clienteGeneral.foto.startsWith('data:image')) {
                    return clienteGeneral.foto;
                }
                return `data:image/jpeg;base64,${clienteGeneral.foto}`;
            }
        }
        
        // Prioridad 2: Foto del cliente general desde el user
        if (user?.clienteGeneral?.foto) {
            if (typeof user.clienteGeneral.foto === 'string') {
                if (user.clienteGeneral.foto.startsWith('data:image')) {
                    return user.clienteGeneral.foto;
                }
                return `data:image/jpeg;base64,${user.clienteGeneral.foto}`;
            }
        }
        
        // Prioridad 3: Logo por defecto
        return '/assets/images/LOGO-GKM-1.webp';
    };

    // Función para obtener la descripción del cliente general (nombre de la empresa)
    const getEmpresaNombre = () => {
        // Prioridad 1: Descripción del cliente general cargado
        if (clienteGeneral?.descripcion) {
            return clienteGeneral.descripcion;
        }
        
        // Prioridad 2: Descripción del cliente general desde el user
        if (user?.clienteGeneral?.descripcion) {
            return user.clienteGeneral.descripcion;
        }
        
        // Prioridad 3: Texto por defecto
        return 'GKM TECHNOLOGY S.A.C.';
    };

    // Manejar logout
    const handleLogout = () => {
        logout();
        navigate('/'); // Redirige al login
    };

    // Mostrar loading mientras carga el cliente general
    if (loadingCliente) {
        return (
            <header className={`z-40 ${themeConfig.semidark && themeConfig.menu === 'horizontal' ? 'dark' : ''}`}>
                <div className="shadow-sm">
                    <div className="relative bg-white flex w-full items-center px-5 py-2.5 dark:bg-black">
                        <div className="horizontal-logo flex lg:hidden justify-between items-center ltr:mr-2 rtl:ml-2">
                            <Link to="/" className="main-logo flex items-center shrink-0">
                                <img
                                    className="w-8 ltr:-ml-1 rtl:-mr-1 inline"
                                    src="/assets/images/LOGO-GKM-1.webp"
                                    alt="logo"
                                />
                                <span className="text-2xl ltr:ml-1.5 rtl:mr-1.5 font-semibold align-middle hidden md:inline dark:text-white-light transition-all duration-300">
                                    Cargando...
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>
        );
    }

    return (
        <header className={`z-40 ${themeConfig.semidark && themeConfig.menu === 'horizontal' ? 'dark' : ''}`}>
            <div className="shadow-sm">
                <div className="relative bg-white flex w-full items-center px-5 py-2.5 dark:bg-black">
                    {/* Logo para móvil y botón de menú */}
                    <div className="horizontal-logo flex lg:hidden justify-between items-center ltr:mr-2 rtl:ml-2">
                        <Link to="/" className="main-logo flex items-center shrink-0">
                            <img
                                className="w-8 ltr:-ml-1 rtl:-mr-1 inline"
                                src={getLogoUrl()}
                                alt="logo"
                                onError={(e) => {
                                    console.log('Error cargando logo, usando default');
                                    e.target.src = '/assets/images/LOGO-GKM-1.webp';
                                }}
                            />
                            <span className="text-2xl ltr:ml-1.5 rtl:mr-1.5 font-semibold align-middle hidden md:inline dark:text-white-light transition-all duration-300">
                                {getEmpresaNombre()}
                            </span>
                        </Link>
                        <button
                            type="button"
                            className="collapse-icon flex-none dark:text-[#d0d2d6] hover:text-primary dark:hover:text-primary flex lg:hidden ltr:ml-2 rtl:mr-2 p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:bg-white-light/90 dark:hover:bg-dark/60"
                            onClick={() => dispatch(toggleSidebar())}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20 7L4 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                <path opacity="0.5" d="M20 12L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                <path d="M20 17L4 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                        </button>
                    </div>

                    {/* Barra de herramientas derecha */}
                    <div className="sm:flex-1 ltr:sm:ml-0 ltr:ml-auto sm:rtl:mr-0 rtl:mr-auto flex items-center space-x-1.5 lg:space-x-2 rtl:space-x-reverse dark:text-[#d0d2d6]">
                        {/* Botón de búsqueda móvil */}
                        <div className="sm:ltr:mr-auto sm:rtl:ml-auto">
                            <button
                                type="button"
                                onClick={() => setSearch(!search)}
                                className="search_btn sm:hidden p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:bg-white-light/90 dark:hover:bg-dark/60"
                            >
                                <svg className="w-4.5 h-4.5 mx-auto dark:text-[#d0d2d6]" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="11.5" cy="11.5" r="9.5" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
                                    <path d="M18.5 18.5L22 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                            </button>
                        </div>

                        {/* Selector de tema */}
                        <div>
                            {themeConfig.theme === 'light' && (
                                <button
                                    className="flex items-center p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60"
                                    onClick={() => dispatch(toggleTheme('dark'))}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.5" />
                                        <path d="M12 2V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        <path d="M12 20V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        <path d="M4 12L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        <path d="M22 12L20 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        <path opacity="0.5" d="M19.7778 4.22266L17.5558 6.25424" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        <path opacity="0.5" d="M4.22217 4.22266L6.44418 6.25424" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        <path opacity="0.5" d="M6.44434 17.5557L4.22211 19.7779" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        <path opacity="0.5" d="M19.7778 19.7773L17.5558 17.5551" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>
                                </button>
                            )}
                            {themeConfig.theme === 'dark' && (
                                <button
                                    className="flex items-center p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60"
                                    onClick={() => dispatch(toggleTheme('system'))}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M21.0672 11.8568L20.4253 11.469L21.0672 11.8568ZM12.1432 2.93276L11.7553 2.29085V2.29085L12.1432 2.93276ZM21.25 12C21.25 17.1086 17.1086 21.25 12 21.25V22.75C17.9371 22.75 22.75 17.9371 22.75 12H21.25ZM12 21.25C6.89137 21.25 2.75 17.1086 2.75 12H1.25C1.25 17.9371 6.06294 22.75 12 22.75V21.25ZM2.75 12C2.75 6.89137 6.89137 2.75 12 2.75V1.25C6.06294 1.25 1.25 6.06294 1.25 12H2.75ZM15.5 14.25C12.3244 14.25 9.75 11.6756 9.75 8.5H8.25C8.25 12.5041 11.4959 15.75 15.5 15.75V14.25ZM20.4253 11.469C19.4172 13.1373 17.5882 14.25 15.5 14.25V15.75C18.1349 15.75 20.4407 14.3439 21.7092 12.2447L20.4253 11.469ZM9.75 8.5C9.75 6.41182 10.8627 4.5828 12.531 3.57467L11.7553 2.29085C9.65609 3.5593 8.25 5.86509 8.25 8.5H9.75ZM12 2.75C11.9115 2.75 11.8077 2.71008 11.7324 2.63168C11.6686 2.56527 11.6538 2.50244 11.6503 2.47703C11.6461 2.44587 11.6482 2.35557 11.7553 2.29085L12.531 3.57467C13.0342 3.27065 13.196 2.71398 13.1368 2.27627C13.0754 1.82126 12.7166 1.25 12 1.25V2.75ZM21.7092 12.2447C21.6444 12.3518 21.5541 12.3539 21.523 12.3497C21.4976 12.3462 21.4347 12.3314 21.3683 12.2676C21.2899 12.1923 21.25 12.0885 21.25 12H22.75C22.75 11.2834 22.1787 10.9246 21.7237 10.8632C21.286 10.804 20.7293 10.9658 20.4253 11.469L21.7092 12.2447Z"
                                            fill="currentColor"
                                        />
                                    </svg>
                                </button>
                            )}
                            {themeConfig.theme === 'system' && (
                                <button
                                    className="flex items-center p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60"
                                    onClick={() => dispatch(toggleTheme('light'))}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M3 9C3 6.17157 3 4.75736 3.87868 3.87868C4.75736 3 6.17157 3 9 3H15C17.8284 3 19.2426 3 20.1213 3.87868C21 4.75736 21 6.17157 21 9V14C21 15.8856 21 16.8284 20.4142 17.4142C19.8284 18 18.8856 18 17 18H7C5.11438 18 4.17157 18 3.58579 17.4142C3 16.8284 3 15.8856 3 14V9Z"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                        />
                                        <path opacity="0.5" d="M22 21H2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        <path opacity="0.5" d="M15 15H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>
                                </button>
                            )}
                        </div>

                        {/* Dropdown de mensajes */}
                        <div className="dropdown shrink-0">
                            <Dropdown
                                offset={[0, 8]}
                                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                btnClassName="block p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60"
                                button={
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M22 10C22.0185 10.7271 22 11.0542 22 12C22 15.7712 22 17.6569 20.8284 18.8284C19.6569 20 17.7712 20 14 20H10C6.22876 20 4.34315 20 3.17157 18.8284C2 17.6569 2 15.7712 2 12C2 8.22876 2 6.34315 3.17157 5.17157C4.34315 4 6.22876 4 10 4H13"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                        />
                                        <path
                                            d="M6 8L8.1589 9.79908C9.99553 11.3296 10.9139 12.0949 12 12.0949C13.0861 12.0949 14.0045 11.3296 15.8411 9.79908"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                        />
                                        <circle cx="19" cy="5" r="3" stroke="currentColor" strokeWidth="1.5" />
                                    </svg>
                                }
                            >
                                {/* Contenido del dropdown de mensajes */}
                            </Dropdown>
                        </div>

                        {/* Dropdown de usuario */}
                        <div className="dropdown shrink-0 flex">
                            <Dropdown
                                offset={[0, 8]}
                                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                btnClassName="relative group block"
                                button={
                                    <img
                                        className="w-9 h-9 rounded-full object-cover saturate-50 group-hover:saturate-100"
                                        src={getAvatarUrl()}
                                        alt="Avatar"
                                        onError={(e) => {
                                            e.target.src = '/assets/images/user-profile.jpeg';
                                        }}
                                    />
                                }
                            >
                                <ul className="text-dark dark:text-white-dark !py-0 w-[230px] font-semibold dark:text-white-light/90">
                                    <li>
                                        <div className="flex items-center px-4 py-4">
                                            <img
                                                className="rounded-md w-10 h-10 object-cover"
                                                src={getAvatarUrl()}
                                                alt="Avatar"
                                                onError={(e) => {
                                                    e.target.src = '/assets/images/user-profile.jpeg';
                                                }}
                                            />
                                            <div className="ltr:pl-4 rtl:pr-4 truncate">
                                                <h4 className="text-base flex items-center gap-2">
                                                    {user ? `${user.Nombre || user.nombre || ''} ${user.apellidoPaterno || ''} ${user.apellidoMaterno || ''}` : 'Usuario'}
                                                    {user?.idRol === 1 && (
                                                        <span className="text-xs bg-success-light rounded text-success px-1">Admin</span>
                                                    )}
                                                </h4>
                                                <button type="button" className="text-black/60 hover:text-primary dark:text-dark-light/60 dark:hover:text-white">
                                                    {user?.correo || user?.usuario || 'correo@ejemplo.com'}
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <Link to="/users/profile" className="dark:hover:text-white">
                                            <svg className="ltr:mr-2 rtl:ml-2 shrink-0" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <circle cx="12" cy="6" r="4" stroke="currentColor" strokeWidth="1.5" />
                                                <path
                                                    opacity="0.5"
                                                    d="M20 17.5C20 19.9853 20 22 12 22C4 22 4 19.9853 4 17.5C4 15.0147 7.58172 13 12 13C16.4183 13 20 15.0147 20 17.5Z"
                                                    stroke="currentColor"
                                                    strokeWidth="1.5"
                                                />
                                            </svg>
                                            Perfil
                                        </Link>
                                    </li>
                                  
                                    <li className="border-t border-white-light dark:border-white-light/10">
                                        <button
                                            onClick={handleLogout}
                                            className="text-danger !py-3 flex items-center w-full px-4 dark:hover:text-white"
                                        >
                                            <svg className="ltr:mr-2 rtl:ml-2 rotate-90 shrink-0" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    opacity="0.5"
                                                    d="M17 9.00195C19.175 9.01406 20.3529 9.11051 21.1213 9.8789C22 10.7576 22 12.1718 22 15.0002V16.0002C22 18.8286 22 20.2429 21.1213 21.1215C20.2426 22.0002 18.8284 22.0002 16 22.0002H8C5.17157 22.0002 3.75736 22.0002 2.87868 21.1215C2 20.2429 2 18.8286 2 16.0002L2 15.0002C2 12.1718 2 10.7576 2.87868 9.87889C3.64706 9.11051 4.82497 9.01406 7 9.00195"
                                                    stroke="currentColor"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                />
                                                <path d="M12 15L12 2M12 2L15 5.5M12 2L9 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            Cerrar sesión
                                        </button>
                                    </li>
                                </ul>
                            </Dropdown>
                        </div>
                    </div>
                </div>

                {/* Menú horizontal */}
                <ul className="horizontal-menu hidden py-1.5 font-semibold px-6 lg:space-x-1.5 xl:space-x-8 rtl:space-x-reverse bg-white border-t border-[#ebedf2] dark:border-[#191e3a] dark:bg-black text-black dark:text-white-dark">
                    {/* Aquí va el contenido de tu menú horizontal */}
                </ul>
            </div>
        </header>
    );
};

export default Header;