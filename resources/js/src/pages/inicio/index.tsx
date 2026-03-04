import React, { useState } from 'react'; import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { login } from '../../services/authService';
import { Usuario } from '../../types/auth';
import toast from 'react-hot-toast';

const InicioPage: React.FC = () => {


    const [documento, setDocumento] = useState('');
    const [clave, setClave] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [captchaChecked, setCaptchaChecked] = useState(false);
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!documento || !clave) {
            toast.error('Completa todos los campos');
            return;
        }

        if (!captchaChecked) {
            toast.error('Confirma que no eres un robot 🤖');
            return;
        }
        const loadingToast = toast.loading('Validando credenciales...');

        try {
            const data = await login(documento, clave);

            localStorage.setItem('token', data.access_token);
            localStorage.setItem('user', JSON.stringify(data.user));

            toast.dismiss(loadingToast);

            toast.success('Bienvenido 🎉', {
                duration: 2000,
            });

            setTimeout(() => {
                navigate('/analytics');
            }, 1200);

        } catch (error: any) {
            toast.dismiss(loadingToast);

            if (error.response?.status === 401) {
                toast.error('Documento o contraseña incorrectos');
            } else {
                toast.error('Error de conexión con el servidor');
            }
        }
    };

    const handleCreateAccount = () => {
        navigate('/auth/boxed-signup');
    };

    const handleForgotPassword = () => {
        navigate('/auth/boxed-password-reset');
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#D11D1D] via-[#B01818] to-[#8B1212] relative">
            {/* Sombras ambientales */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-black/20 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#D11D1D]/20 rounded-full blur-3xl"></div>
            </div>

            {/* Header */}
            <header className="py-6 px-6 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <img
                        src="/assets/images/LOGO-PRINCIPAL-GKM.webp"
                        alt="Logo GKM Technology"
                        className="w-40 h-auto drop-shadow-2xl hover:drop-shadow-3xl transition-all duration-300"
                    />
                </div>
            </header>

            {/* Contenido principal - centrado verticalmente */}
            <div className="flex-1 flex items-center relative z-10">
                <div className="flex-1 flex max-w-7xl mx-auto px-4">
                    {/* Lado izquierdo - Imagen del técnico */}
                    <div className="hidden lg:flex lg:w-1/2 items-center justify-center">
                        <div className="relative">
                            {/* Círculos decorativos mejorados con sombras */}
                            <div className="absolute -inset-20 bg-gradient-to-r from-white/10 to-transparent rounded-full blur-3xl"></div>
                            <div className="absolute -inset-10 bg-[#D11D1D]/20 rounded-full blur-2xl"></div>

                            {/* Líneas decorativas */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-white/10 rounded-full"></div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-white/5 rounded-full"></div>

                            {/* Imagen del técnico */}
                            <div className="relative z-10 scale-110">
                                <img
                                    src="/assets/images/imageinicio.png"
                                    alt="Técnico GKM Technology"
                                    className="w-full max-w-2xl h-auto object-contain drop-shadow-3xl"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Lado derecho - Formulario */}
                    <div className="w-full lg:w-1/2 flex items-center justify-center py-8">
                        <div className="w-full max-w-md">
                            {/* Formulario con sombras mejoradas */}
                            <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-3xl overflow-hidden border border-white/20">
                                {/* Cabecera del formulario */}
                                <div className="pt-8 pb-2 flex justify-center items-center gap-3 bg-gradient-to-b from-white to-gray-50/50">
                                    <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full p-4 shadow-inner">
                                        <img
                                            src="/assets/images/usuarios.png"
                                            alt="Usuarios GKM Technology"
                                            className="w-16 h-auto object-contain drop-shadow-md"
                                        />
                                    </div>
                                    <span className="text-3xl font-black text-[#D11D1D] tracking-wider"
                                        style={{
                                            fontFamily: "'Orbitron', 'Rajdhani', 'Arial Black', sans-serif"
                                        }}>
                                        MI PORTAL
                                    </span>
                                </div>

                                {/* Contenido del formulario */}
                                <div className="p-6 pt-2">
                                    <form className="space-y-4" onSubmit={handleSubmit}>
                                        {/* Documento de identidad */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1 drop-shadow-sm">
                                                Número de documento
                                            </label>
                                            <input
                                                type="text"
                                                value={documento}
                                                onChange={(e) => setDocumento(e.target.value)}
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D11D1D] focus:border-[#D11D1D] outline-none transition shadow-md hover:shadow-lg focus:shadow-lg"
                                                placeholder="Ingresa tu número de documento"
                                            />
                                        </div>

                                        {/* Contraseña */}
                                        <div>
                                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1 drop-shadow-sm">
                                                Contraseña
                                            </label>
                                            <input
                                                type="password"
                                                id="password"
                                                value={clave}
                                                onChange={(e) => setClave(e.target.value)}
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D11D1D] focus:border-[#D11D1D] outline-none transition shadow-md hover:shadow-lg focus:shadow-lg"
                                                placeholder="Ingresa tu contraseña"
                                            />
                                        </div>

                                        {/* reCAPTCHA con sombras */}
                                        <div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-br from-gray-50 to-white shadow-md hover:shadow-lg transition-shadow duration-300">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <input
                                                        type="checkbox"
                                                        id="recaptcha"
                                                        checked={captchaChecked}
                                                        onChange={(e) => setCaptchaChecked(e.target.checked)}
                                                        className="w-4 h-4 text-[#D11D1D] border-2 border-gray-300 rounded focus:ring-2 focus:ring-[#D11D1D] focus:ring-offset-0 shadow-sm"
                                                    />
                                                    <label htmlFor="recaptcha" className="text-sm text-gray-700 cursor-pointer select-none font-medium">
                                                        No soy un robot
                                                    </label>
                                                </div>
                                                <div className="text-right">
                                                    <div className="flex items-center gap-1 justify-end">
                                                        <span className="text-xs font-bold text-[#D11D1D] drop-shadow-sm">re</span>
                                                        <span className="text-xs font-medium text-gray-600">CAPTCHA</span>
                                                    </div>
                                                    <div className="text-[10px] font-medium text-gray-400 tracking-wide">Enterprise</div>
                                                </div>
                                            </div>
                                            <div className="mt-2 flex gap-3 text-[10px]">
                                                <span className="text-gray-400 hover:text-[#D11D1D] cursor-pointer transition-colors drop-shadow-sm">Privacidad</span>
                                                <span className="text-gray-300">|</span>
                                                <span className="text-gray-400 hover:text-[#D11D1D] cursor-pointer transition-colors drop-shadow-sm">Términos</span>
                                            </div>
                                        </div>

                                        {/* Olvidé mi contraseña */}
                                        <div className="text-right">
                                            <button
                                                type="button"
                                                onClick={handleForgotPassword}
                                                className="text-sm text-[#D11D1D] hover:text-[#9E1515] hover:underline focus:outline-none font-medium drop-shadow-sm transition-all"
                                            >
                                                ¿Olvidaste tu contraseña?
                                            </button>
                                        </div>

                                        {/* Botón Iniciar sesión con sombra más pronunciada */}
                                        <button
                                            type="submit"
                                            className="w-full bg-gradient-to-r from-[#D11D1D] to-[#9E1515] hover:from-[#9E1515] hover:to-[#D11D1D] text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#D11D1D] focus:ring-offset-2 shadow-xl hover:shadow-2xl"
                                        >
                                            Iniciar sesión
                                        </button>

                                        {/* Crear cuenta */}
                                        <div className="text-center">
                                            <button
                                                type="button"
                                                onClick={handleCreateAccount}
                                                className="text-sm text-[#D11D1D] hover:text-[#9E1515] font-medium hover:underline focus:outline-none drop-shadow-sm transition-all"
                                            >
                                                ¿No tienes cuenta? Créala aquí
                                            </button>
                                        </div>

                                        {/* Iconos de redes sociales con sombras */}
                                        <div className="pt-4 mt-2 border-t border-gray-200">
                                            <p className="text-xs text-center text-gray-500 mb-3 drop-shadow-sm">Síguenos en nuestras redes</p>
                                            <div className="flex justify-center space-x-4">
                                                {/* Facebook */}
                                                <a
                                                    href="https://facebook.com"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="bg-[#1877F2] hover:bg-[#0D5AB9] text-white p-2.5 rounded-full transition-all transform hover:scale-110 shadow-lg hover:shadow-xl"
                                                >
                                                    <svg className="w-5 h-5 drop-shadow-md" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647z" />
                                                    </svg>
                                                </a>

                                                {/* Instagram */}
                                                <a
                                                    href="https://instagram.com"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="bg-gradient-to-tr from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] hover:opacity-90 text-white p-2.5 rounded-full transition-all transform hover:scale-110 shadow-lg hover:shadow-xl"
                                                >
                                                    <svg className="w-5 h-5 drop-shadow-md" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z" />
                                                    </svg>
                                                </a>

                                                {/* LinkedIn */}
                                                <a
                                                    href="https://linkedin.com"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="bg-[#0A66C2] hover:bg-[#084A94] text-white p-2.5 rounded-full transition-all transform hover:scale-110 shadow-lg hover:shadow-xl"
                                                >
                                                    <svg className="w-5 h-5 drop-shadow-md" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                                    </svg>
                                                </a>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer con sombra */}
            <footer className="py-4 px-6 relative z-10">
                <div className="max-w-7xl mx-auto text-center">
                    <p className="text-xs text-white/60 drop-shadow-lg">
                        © 2026 GKM Technology. Todos los derechos reservados.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default InicioPage;
