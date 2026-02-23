import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import {
    GraduationCap,
    Mail,
    Lock,
    AlertCircle,
    CheckCircle,
    Eye,
    EyeOff,
    User,
    KeyRound,
    ChevronRight,
    School,
    Users,
    Sparkles,
    BookOpen,
} from "lucide-react";
import { useState, useEffect } from "react";

export default function Login({ status, canResetPassword }) {
    const { flash } = usePage().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        username: "",
        pin: "",
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [focusedField, setFocusedField] = useState(null);
    const [mode, setMode] = useState("student");
    const [isAnimating, setIsAnimating] = useState(false);
    const [slideDirection, setSlideDirection] = useState("");
    const [pinValues, setPinValues] = useState(["", "", "", ""]);

    const toggleMode = () => {
        if (isAnimating) return;

        setIsAnimating(true);
        setSlideDirection(mode === "student" ? "slide-left" : "slide-right");

        setTimeout(() => {
            setMode(mode === "student" ? "staff" : "student");
            setData({
                ...data,
                email: "",
                password: "",
                username: "",
                pin: "",
            });
            setPinValues(["", "", "", ""]);
            setSlideDirection("");
            setTimeout(() => setIsAnimating(false), 50);
        }, 300);
    };

    const handlePinChange = (index, value) => {
        if (value.length > 1) return;

        const newPinValues = [...pinValues];
        newPinValues[index] = value;
        setPinValues(newPinValues);

        const fullPin = newPinValues.join("");
        setData("pin", fullPin);

        if (value && index < 3) {
            const nextInput = document.getElementById(`pin-${index + 1}`);
            if (nextInput) nextInput.focus();
        }
    };

    const handlePinKeyDown = (index, e) => {
        if (e.key === "Backspace" && !pinValues[index] && index > 0) {
            const prevInput = document.getElementById(`pin-${index - 1}`);
            if (prevInput) prevInput.focus();
        }
    };

    const submit = (e) => {
        e.preventDefault();

        post(route("login"), {
            onFinish: () => {
                reset("password", "pin");
                setPinValues(["", "", "", ""]);
            },
        });
    };

    return (
        <>
            <Head title="Iniciar Sesión" />

            {/* Fondo académico */}
            <div className="fixed inset-0 -z-10 overflow-hidden bg-gray-50">
                {/* Barra de colores superior */}
                <div
                    className="absolute top-0 left-0 w-full h-1 z-20"
                    style={{
                        background:
                            "linear-gradient(to right, #540D6E, #EE4266, #FFD23F, #3BCEAC, #0EAD69)",
                    }}
                ></div>

                {/* Patrón de puntos principal */}
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(84, 13, 110, 0.08) 1px, transparent 0)`,
                        backgroundSize: "40px 40px",
                    }}
                ></div>

                {/* Círculos decorativos grandes */}
                <div className="absolute top-20 -left-20 w-96 h-96 rounded-full bg-purple-200/20 blur-3xl"></div>
                <div className="absolute bottom-20 -right-20 w-96 h-96 rounded-full bg-pink-200/20 blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border-2 border-purple-200/30"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border-2 border-purple-300/20"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border-2 border-purple-400/10"></div>
            </div>

            <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-lg space-y-8">
                    {/* Header con logo institucional */}
                    <div className="text-center">
                        <h2 className="text-4xl font-bold text-gray-900 mb-2">
                            {mode === "student"
                                ? "Acceso Estudiantes"
                                : "Acceso Docentes / Administradores"}
                        </h2>
                        <p className="text-gray-600">
                            Plataforma Virtual de Aprendizaje
                        </p>
                    </div>

                    {/* Selector de modo */}
                    <div className="bg-white/50 backdrop-blur-sm rounded-xl p-2 border border-gray-200">
                        <div className="flex relative">
                            <div
                                className="absolute h-full w-1/2 top-0 transition-all duration-300 ease-in-out rounded-lg"
                                style={{
                                    backgroundColor: "#540D6E",
                                    left: mode === "student" ? "0%" : "50%",
                                    opacity: 0.1,
                                }}
                            />
                            <button
                                onClick={toggleMode}
                                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 relative z-10 ${
                                    mode === "student"
                                        ? "text-white"
                                        : "text-gray-600 hover:text-gray-900"
                                }`}
                                style={
                                    mode === "student"
                                        ? { backgroundColor: "#540D6E" }
                                        : {}
                                }
                            >
                                <GraduationCap className="w-4 h-4" />
                                <span>Estudiante</span>
                            </button>
                            <button
                                onClick={toggleMode}
                                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 relative z-10 ${
                                    mode === "staff"
                                        ? "text-white"
                                        : "text-gray-600 hover:text-gray-900"
                                }`}
                                style={
                                    mode === "staff"
                                        ? { backgroundColor: "#540D6E" }
                                        : {}
                                }
                            >
                                <Users className="w-4 h-4" />
                                <span>Docente/Admin</span>
                            </button>
                        </div>
                    </div>

                    {/* Mensajes de estado */}
                    {status && (
                        <div
                            className="flex items-start gap-3 p-4 rounded-lg border animate-slide-down"
                            style={{
                                backgroundColor: "#E8F5F0",
                                borderColor: "#3BCEAC",
                            }}
                        >
                            <CheckCircle
                                className="w-5 h-5 flex-shrink-0 mt-0.5"
                                style={{ color: "#0EAD69" }}
                            />
                            <p
                                className="text-sm font-medium"
                                style={{ color: "#065F46" }}
                            >
                                {status}
                            </p>
                        </div>
                    )}

                    {flash?.message && (
                        <div
                            className="flex items-start gap-3 p-4 rounded-lg border animate-slide-down"
                            style={{
                                backgroundColor: "#FFF9E6",
                                borderColor: "#FFD23F",
                            }}
                        >
                            <AlertCircle
                                className="w-5 h-5 flex-shrink-0 mt-0.5"
                                style={{ color: "#D97706" }}
                            />
                            <p
                                className="text-sm font-medium"
                                style={{ color: "#92400E" }}
                            >
                                {flash.message}
                            </p>
                        </div>
                    )}

                    {/* Formulario con animación */}
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 overflow-hidden">
                        <div
                            className={`transition-all duration-300 ease-in-out ${
                                slideDirection === "slide-left"
                                    ? "-translate-x-full opacity-0"
                                    : slideDirection === "slide-right"
                                      ? "translate-x-full opacity-0"
                                      : "translate-x-0 opacity-100"
                            }`}
                        >
                            <form onSubmit={submit} className="space-y-6">
                                {/* Campos específicos para estudiantes */}
                                {mode === "student" && (
                                    <>
                                        {/* Username Field */}
                                        <div>
                                            <label
                                                htmlFor="username"
                                                className="block text-sm font-semibold text-gray-700 mb-2"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <User
                                                        className="w-4 h-4"
                                                        style={{
                                                            color: "#540D6E",
                                                        }}
                                                    />
                                                    <span>
                                                        Nombre de Usuario
                                                    </span>
                                                </div>
                                            </label>
                                            <div className="relative">
                                                <input
                                                    id="username"
                                                    type="text"
                                                    name="username"
                                                    value={data.username}
                                                    autoFocus={
                                                        mode === "student"
                                                    }
                                                    onChange={(e) =>
                                                        setData(
                                                            "username",
                                                            e.target.value,
                                                        )
                                                    }
                                                    onFocus={() =>
                                                        setFocusedField(
                                                            "username",
                                                        )
                                                    }
                                                    onBlur={() =>
                                                        setFocusedField(null)
                                                    }
                                                    className={`w-full px-4 py-3 border-2 rounded-lg font-medium transition-all duration-200 ${
                                                        errors.username
                                                            ? "border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                                                            : focusedField ===
                                                                "username"
                                                              ? "bg-white shadow-sm ring-2"
                                                              : "border-gray-300 bg-white hover:border-gray-400"
                                                    }`}
                                                    style={
                                                        focusedField ===
                                                            "username" &&
                                                        !errors.username
                                                            ? {
                                                                  borderColor:
                                                                      "#540D6E",
                                                                  "--tw-ring-color":
                                                                      "rgba(84, 13, 110, 0.2)",
                                                              }
                                                            : {}
                                                    }
                                                    placeholder="usuario_estudiante"
                                                />
                                            </div>
                                            {errors.username && (
                                                <div
                                                    className="mt-2 flex items-start gap-2 p-3 bg-red-50 border-l-4 rounded-r-lg"
                                                    style={{
                                                        borderLeftColor:
                                                            "#EE4266",
                                                    }}
                                                >
                                                    <AlertCircle
                                                        className="w-4 h-4 flex-shrink-0 mt-0.5"
                                                        style={{
                                                            color: "#EE4266",
                                                        }}
                                                    />
                                                    <p className="text-sm font-medium text-red-800">
                                                        {errors.username}
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {/* PIN Field — cajitas grandes con estilo lila */}
                                        <div>
                                            <label
                                                htmlFor="pin"
                                                className="block text-sm font-semibold text-gray-700 mb-3"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <KeyRound
                                                        className="w-4 h-4"
                                                        style={{
                                                            color: "#540D6E",
                                                        }}
                                                    />
                                                    <span>
                                                        PIN de Acceso{" "}
                                                        <span className="text-gray-400 font-normal">
                                                            (4 dígitos)
                                                        </span>
                                                    </span>
                                                </div>
                                            </label>

                                            <div className="flex gap-4 justify-center">
                                                {[0, 1, 2, 3].map((index) => (
                                                    <div
                                                        key={index}
                                                        className="relative flex-1"
                                                    >
                                                        <input
                                                            id={`pin-${index}`}
                                                            type="password"
                                                            maxLength={1}
                                                            value={
                                                                pinValues[index]
                                                            }
                                                            onChange={(e) =>
                                                                handlePinChange(
                                                                    index,
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            onKeyDown={(e) =>
                                                                handlePinKeyDown(
                                                                    index,
                                                                    e,
                                                                )
                                                            }
                                                            onFocus={() =>
                                                                setFocusedField(
                                                                    `pin-${index}`,
                                                                )
                                                            }
                                                            onBlur={() =>
                                                                setFocusedField(
                                                                    null,
                                                                )
                                                            }
                                                            inputMode="numeric"
                                                            pattern="[0-9]*"
                                                            className="w-full text-center text-3xl font-black outline-none rounded-2xl border-2 transition-all duration-200"
                                                            style={{
                                                                height: "72px",
                                                                borderColor:
                                                                    pinValues[
                                                                        index
                                                                    ]
                                                                        ? "#540D6E"
                                                                        : focusedField ===
                                                                            `pin-${index}`
                                                                          ? "#540D6E"
                                                                          : "#E5E7EB",
                                                                background:
                                                                    pinValues[
                                                                        index
                                                                    ]
                                                                        ? "linear-gradient(135deg, #F5F0FF, #EDE3FF)"
                                                                        : focusedField ===
                                                                            `pin-${index}`
                                                                          ? "#FAFAFA"
                                                                          : "#F9FAFB",
                                                                boxShadow:
                                                                    pinValues[
                                                                        index
                                                                    ]
                                                                        ? "0 4px 16px rgba(84,13,110,0.18)"
                                                                        : focusedField ===
                                                                            `pin-${index}`
                                                                          ? "0 0 0 4px rgba(84,13,110,0.09)"
                                                                          : "none",
                                                                color: "#540D6E",
                                                                transform:
                                                                    pinValues[
                                                                        index
                                                                    ]
                                                                        ? "scale(1.05)"
                                                                        : "scale(1)",
                                                            }}
                                                        />
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Barra de progreso */}
                                            <div className="flex items-center gap-3 mt-3">
                                                <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full transition-all duration-400"
                                                        style={{
                                                            width: `${
                                                                (pinValues.filter(
                                                                    Boolean,
                                                                ).length /
                                                                    4) *
                                                                100
                                                            }%`,
                                                            background:
                                                                pinValues.filter(
                                                                    Boolean,
                                                                ).length === 4
                                                                    ? "linear-gradient(to right, #0EAD69, #3BCEAC)"
                                                                    : "linear-gradient(to right, #540D6E, #9C27B0)",
                                                        }}
                                                    />
                                                </div>
                                                <span
                                                    className="text-xs font-bold w-12 text-right"
                                                    style={{
                                                        color:
                                                            pinValues.filter(
                                                                Boolean,
                                                            ).length === 4
                                                                ? "#0EAD69"
                                                                : "#9CA3AF",
                                                    }}
                                                >
                                                    {pinValues.filter(Boolean)
                                                        .length === 4
                                                        ? "¡Listo!"
                                                        : `${pinValues.filter(Boolean).length}/4`}
                                                </span>
                                            </div>

                                            {errors.pin && (
                                                <div
                                                    className="mt-2 flex items-start gap-2 p-3 bg-red-50 border-l-4 rounded-r-lg"
                                                    style={{
                                                        borderLeftColor:
                                                            "#EE4266",
                                                    }}
                                                >
                                                    <AlertCircle
                                                        className="w-4 h-4 flex-shrink-0 mt-0.5"
                                                        style={{
                                                            color: "#EE4266",
                                                        }}
                                                    />
                                                    <p className="text-sm font-medium text-red-800">
                                                        {errors.pin}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}

                                {/* Campos específicos para docentes/administradores */}
                                {mode === "staff" && (
                                    <>
                                        {/* Email Field */}
                                        <div>
                                            <label
                                                htmlFor="email"
                                                className="block text-sm font-semibold text-gray-700 mb-2"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Mail
                                                        className="w-4 h-4"
                                                        style={{
                                                            color: "#540D6E",
                                                        }}
                                                    />
                                                    <span>
                                                        Correo Electrónico
                                                    </span>
                                                </div>
                                            </label>
                                            <div className="relative">
                                                <input
                                                    id="email"
                                                    type="email"
                                                    name="email"
                                                    value={data.email}
                                                    autoFocus={mode === "staff"}
                                                    autoComplete="username"
                                                    onChange={(e) =>
                                                        setData(
                                                            "email",
                                                            e.target.value,
                                                        )
                                                    }
                                                    onFocus={() =>
                                                        setFocusedField("email")
                                                    }
                                                    onBlur={() =>
                                                        setFocusedField(null)
                                                    }
                                                    className={`w-full px-4 py-3 border-2 rounded-lg font-medium transition-all duration-200 ${
                                                        errors.email
                                                            ? "border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                                                            : focusedField ===
                                                                "email"
                                                              ? "bg-white shadow-sm ring-2"
                                                              : "border-gray-300 bg-white hover:border-gray-400"
                                                    }`}
                                                    style={
                                                        focusedField ===
                                                            "email" &&
                                                        !errors.email
                                                            ? {
                                                                  borderColor:
                                                                      "#540D6E",
                                                                  "--tw-ring-color":
                                                                      "rgba(84, 13, 110, 0.2)",
                                                              }
                                                            : {}
                                                    }
                                                    placeholder="usuario@ejemplo.com"
                                                />
                                            </div>
                                            {errors.email && (
                                                <div
                                                    className="mt-2 flex items-start gap-2 p-3 bg-red-50 border-l-4 rounded-r-lg"
                                                    style={{
                                                        borderLeftColor:
                                                            "#EE4266",
                                                    }}
                                                >
                                                    <AlertCircle
                                                        className="w-4 h-4 flex-shrink-0 mt-0.5"
                                                        style={{
                                                            color: "#EE4266",
                                                        }}
                                                    />
                                                    <p className="text-sm font-medium text-red-800">
                                                        {errors.email}
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Password Field */}
                                        <div>
                                            <label
                                                htmlFor="password"
                                                className="block text-sm font-semibold text-gray-700 mb-2"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Lock
                                                        className="w-4 h-4"
                                                        style={{
                                                            color: "#540D6E",
                                                        }}
                                                    />
                                                    <span>Contraseña</span>
                                                </div>
                                            </label>
                                            <div className="relative">
                                                <input
                                                    id="password"
                                                    type={
                                                        showPassword
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    name="password"
                                                    value={data.password}
                                                    autoComplete="current-password"
                                                    onChange={(e) =>
                                                        setData(
                                                            "password",
                                                            e.target.value,
                                                        )
                                                    }
                                                    onFocus={() =>
                                                        setFocusedField(
                                                            "password",
                                                        )
                                                    }
                                                    onBlur={() =>
                                                        setFocusedField(null)
                                                    }
                                                    className={`w-full px-4 py-3 pr-12 border-2 rounded-lg font-medium transition-all duration-200 ${
                                                        errors.password
                                                            ? "border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                                                            : focusedField ===
                                                                "password"
                                                              ? "bg-white shadow-sm ring-2"
                                                              : "border-gray-300 bg-white hover:border-gray-400"
                                                    }`}
                                                    style={
                                                        focusedField ===
                                                            "password" &&
                                                        !errors.password
                                                            ? {
                                                                  borderColor:
                                                                      "#540D6E",
                                                                  "--tw-ring-color":
                                                                      "rgba(84, 13, 110, 0.2)",
                                                              }
                                                            : {}
                                                    }
                                                    placeholder="••••••••"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setShowPassword(
                                                            !showPassword,
                                                        )
                                                    }
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                                >
                                                    {showPassword ? (
                                                        <EyeOff className="w-5 h-5 text-gray-500" />
                                                    ) : (
                                                        <Eye className="w-5 h-5 text-gray-500" />
                                                    )}
                                                </button>
                                            </div>
                                            {errors.password && (
                                                <div
                                                    className="mt-2 flex items-start gap-2 p-3 bg-red-50 border-l-4 rounded-r-lg"
                                                    style={{
                                                        borderLeftColor:
                                                            "#EE4266",
                                                    }}
                                                >
                                                    <AlertCircle
                                                        className="w-4 h-4 flex-shrink-0 mt-0.5"
                                                        style={{
                                                            color: "#EE4266",
                                                        }}
                                                    />
                                                    <p className="text-sm font-medium text-red-800">
                                                        {errors.password}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}

                                {/* Remember Me (solo para staff) */}
                                {mode === "staff" && (
                                    <div className="flex items-center justify-between">
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                name="remember"
                                                checked={data.remember}
                                                onChange={(e) =>
                                                    setData(
                                                        "remember",
                                                        e.target.checked,
                                                    )
                                                }
                                                className="w-4 h-4 rounded border-gray-300 transition-colors"
                                                style={{
                                                    accentColor: "#540D6E",
                                                }}
                                            />
                                            <span className="ml-2 text-sm font-medium text-gray-700">
                                                Recordar sesión
                                            </span>
                                        </label>

                                        {canResetPassword && (
                                            <Link
                                                href={route("password.request")}
                                                className="text-sm font-semibold hover:underline transition-colors"
                                                style={{ color: "#540D6E" }}
                                            >
                                                ¿Olvidó su contraseña?
                                            </Link>
                                        )}
                                    </div>
                                )}

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full flex items-center justify-center gap-2 px-6 py-3 text-white rounded-lg font-bold transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                    style={{
                                        backgroundColor: "#540D6E",
                                    }}
                                >
                                    {processing ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            <span>Iniciando sesión...</span>
                                        </>
                                    ) : (
                                        <>
                                            {mode === "student" ? (
                                                <GraduationCap className="w-5 h-5" />
                                            ) : (
                                                <School className="w-5 h-5" />
                                            )}
                                            <span>
                                                {mode === "student"
                                                    ? "Acceder como Estudiante"
                                                    : "Acceder como Docente/Admin"}
                                            </span>
                                            <ChevronRight className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* Footer del formulario */}
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                                <span>¿Necesita ayuda?</span>
                                <a
                                    href="#"
                                    className="font-semibold hover:underline transition-colors"
                                    style={{ color: "#540D6E" }}
                                >
                                    Contactar soporte
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Footer institucional */}
                    <div className="text-center">
                        <p className="text-sm text-gray-500">
                            © 2026 EVA Platform - Todos los derechos reservados
                        </p>
                        <div className="flex items-center justify-center gap-4 mt-3 text-xs text-gray-400">
                            <a
                                href="#"
                                className="hover:text-gray-600 transition-colors"
                            >
                                Términos de uso
                            </a>
                            <span>•</span>
                            <a
                                href="#"
                                className="hover:text-gray-600 transition-colors"
                            >
                                Política de privacidad
                            </a>
                            <span>•</span>
                            <a
                                href="#"
                                className="hover:text-gray-600 transition-colors"
                            >
                                Ayuda
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes float {
                    0%,
                    100% {
                        transform: translateY(0px) rotate(0deg);
                    }
                    50% {
                        transform: translateY(-20px) rotate(5deg);
                    }
                }

                .animate-slide-down {
                    animation: slideDown 0.3s ease-out;
                }

                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }

                .animation-delay-2000 {
                    animation-delay: 2s;
                }

                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </>
    );
}
