import { Head, Link, useForm } from "@inertiajs/react";
import {
    ArrowLeft, User, Mail, Lock, Shield, Check, Loader2, GraduationCap, AlertCircle, AlertTriangle, KeyRound, Info, BookOpen,
} from "lucide-react";
import { useState } from "react";

export default function Create({ roles }) {
    const { data, setData, post, errors, processing } = useForm({
        name: "",
        email: "",
        password: "",
        role_id: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [focusedField, setFocusedField] = useState(null);
    const selectedRole = roles.find(
        (role) => role.id.toString() === data.role_id,
    );

    const isStudent = selectedRole?.slug === "student";
    const cancelRoute = isStudent ? route("admin.students") : route("admin.staff");

    function submit(e) {
        e.preventDefault();
        post(route("admin.users.store"));
    }

    const isAdminRole = selectedRole?.slug === "admin";

    const getPasswordStrength = (password) => {
        if (!password)
            return { level: 0, text: "Ingrese una contraseña", color: "gray" };
        if (password.length < 6)
            return { level: 1, text: "Débil", color: "red" };
        if (password.length < 8)
            return { level: 2, text: "Aceptable", color: "yellow" };
        if (password.length < 12)
            return { level: 3, text: "Segura", color: "green" };
        return { level: 4, text: "Muy Segura", color: "emerald" };
    };

    const passwordStrength = getPasswordStrength(data.password);

    const isFieldValid = (field) => {
        if (!data[field]) return false;
        if (field === "email")
            return data.email.includes("@") && data.email.includes(".");
        if (field === "password") return data.password.length >= 8;
        return true;
    };

    const totalFields = isStudent ? 2 : 4;

    const completedFields =
        (data.name ? 1 : 0) +
        (data.role_id ? 1 : 0) +
        (isStudent ? 0 : isFieldValid("email") ? 1 : 0) +
        (isStudent ? 0 : isFieldValid("password") ? 1 : 0);

    const progress = Math.round((completedFields / totalFields) * 100);

    return (
        <>
            <Head title="Crear Usuario" />

            {/* Subtle academic background */}
            <div className="fixed inset-0 -z-10 overflow-hidden bg-gray-50">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(84, 13, 110, 0.08) 1px, transparent 0)`,
                        backgroundSize: "40px 40px",
                    }}
                ></div>
                <div
                    className="absolute top-0 left-0 w-full h-1"
                    style={{
                        background:
                            "linear-gradient(to right, #540D6E, #EE4266, #FFD23F, #3BCEAC, #0EAD69)",
                    }}
                ></div>
            </div>

            <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative">
                <div className="max-w-5xl mx-auto">
                    {/* Academic Header */}
                    <div className="mb-12 animate-fade-in">
                        <Link
                            href={cancelRoute}
                            className="group inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 mb-8 transition-all duration-300 px-4 py-2 rounded-lg hover:bg-white/80"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
                            <span>Volver al Panel de Usuarios</span>
                        </Link>

                        <div className="flex items-start gap-4 mb-6">
                            <div
                                className="p-4 rounded-xl shadow-sm border"
                                style={{
                                    backgroundColor: "white",
                                    borderColor: "#540D6E",
                                }}
                            >
                                <GraduationCap
                                    className="w-10 h-10"
                                    style={{ color: "#540D6E" }}
                                />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                                    Registro de Nuevo Usuario
                                </h1>
                                <p className="text-gray-600 text-base">
                                    Complete el formulario con la información
                                    del usuario institucional
                                </p>
                            </div>
                        </div>

                        {/* Academic breadcrumb */}
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <BookOpen className="w-4 h-4" />
                            <span>Gestión De Usuarios</span>
                            <span>/</span>
                            <span>Usuarios</span>
                            <span>/</span>
                            <span
                                className="font-medium"
                                style={{ color: "#540D6E" }}
                            >
                                Nuevo Registro
                            </span>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Main Form */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden animate-slide-up">
                                {/* Advertencia de rol Admin */}
                                {isAdminRole && (
                                    <div className="border-b border-gray-200 p-4" style={{ backgroundColor: '#FFF9E6' }}>
                                        <div className="flex items-start gap-3 p-4 bg-white rounded-lg border" style={{ borderColor: '#FFD23F' }}>
                                            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#D97706' }} />
                                            <div>
                                                <p className="text-sm font-bold text-gray-900 mb-1">
                                                    Advertencia de Seguridad
                                                </p>
                                                <p className="text-sm text-gray-700">
                                                    Está asignando el rol de Administrador, lo cual otorgará permisos completos sobre el sistema institucional.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                
                                {/* Progress indicator */}
                                <div className="h-1 bg-gray-100 relative overflow-hidden">
                                    <div
                                        className="absolute inset-y-0 left-0 transition-all duration-500 ease-out"
                                        style={{
                                            width: `${progress}%`,
                                            background: "linear-gradient(to right, #540D6E, #EE4266)",
                                        }}
                                    >
                                        <div className="absolute inset-0 bg-white/20 animate-shimmer"></div>
                                    </div>
                                </div>

                                <form
                                    onSubmit={submit}
                                    className="p-8 lg:p-10 space-y-8"
                                >
                                    <div className="border-b border-gray-200 pb-4 mb-6">
                                        <h2 className="text-lg font-bold text-gray-900">
                                            Información Institucional
                                        </h2>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Los campos marcados con{" "}
                                            <span style={{ color: "#EE4266" }}>
                                                *
                                            </span>{" "}
                                            son obligatorios
                                        </p>
                                    </div>

                                    {/* Role Field */}
                                    <div className="group/field">
                                        <label
                                            htmlFor="role"
                                            className="block text-sm font-semibold text-gray-700 mb-2"
                                        >
                                            <div className="flex items-center gap-2">
                                                <Shield
                                                    className="w-4 h-4"
                                                    style={{ color: "#540D6E" }}
                                                />
                                                <span>Rol Institucional</span>
                                                <span
                                                    style={{ color: "#EE4266" }}
                                                >
                                                    *
                                                </span>
                                                {data.role_id && (
                                                    <Check
                                                        className="w-4 h-4 ml-auto animate-scale-in"
                                                        style={{
                                                            color: "#0EAD69",
                                                        }}
                                                    />
                                                )}
                                            </div>
                                        </label>
                                        <div className="relative">
                                            <select
                                                id="role"
                                                value={data.role_id}
                                                onChange={(e) => {
                                                    const roleId =
                                                        e.target.value;
                                                    setData("role_id", roleId);

                                                    const role = roles.find(
                                                        (r) =>
                                                            r.id.toString() ===
                                                            roleId,
                                                    );

                                                    if (
                                                        role?.slug === "student"
                                                    ) {
                                                        setData("email", "");
                                                        setData("password", "");
                                                    }
                                                }}
                                                onFocus={() =>
                                                    setFocusedField("role")
                                                }
                                                onBlur={() =>
                                                    setFocusedField(null)
                                                }
                                                className={`w-full px-4 py-3 border rounded-lg font-medium transition-all duration-200 appearance-none cursor-pointer ${
                                                    errors.role_id
                                                        ? "border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                                                        : focusedField ===
                                                            "role"
                                                          ? "bg-white shadow-sm ring-2"
                                                          : "border-gray-300 bg-white hover:border-gray-400"
                                                }`}
                                                style={
                                                    focusedField === "role" &&
                                                    !errors.role_id
                                                        ? {
                                                              borderColor:
                                                                  "#540D6E",
                                                              "--tw-ring-color":
                                                                  "rgba(84, 13, 110, 0.2)",
                                                          }
                                                        : {}
                                                }
                                            >
                                                <option value="">
                                                    Seleccione un rol
                                                </option>
                                                {roles.map((role) => (
                                                    <option
                                                        key={role.id}
                                                        value={role.id}
                                                    >
                                                        {role.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                <svg
                                                    className="w-5 h-5 text-gray-400"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M19 9l-7 7-7-7"
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                        {errors.role_id && (
                                            <div
                                                className="mt-2 flex items-start gap-2 p-3 bg-red-50 border-l-4 rounded-r-lg animate-slide-down"
                                                style={{
                                                    borderLeftColor: "#EE4266",
                                                }}
                                            >
                                                <AlertCircle
                                                    className="w-4 h-4 flex-shrink-0 mt-0.5"
                                                    style={{ color: "#EE4266" }}
                                                />
                                                <p className="text-sm font-medium text-red-800">
                                                    {errors.role_id}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="border-b border-gray-200 pb-4 mb-6">
                                        <h2 className="text-lg font-bold text-gray-900">
                                            Información Personal
                                        </h2>
                                    </div>

                                    {/* Name Field */}
                                    <div className="group/field">
                                        <label
                                            htmlFor="name"
                                            className="block text-sm font-semibold text-gray-700 mb-2"
                                        >
                                            <div className="flex items-center gap-2">
                                                <User
                                                    className="w-4 h-4"
                                                    style={{ color: "#540D6E" }}
                                                />
                                                <span>Nombre Completo</span>
                                                <span
                                                    style={{ color: "#EE4266" }}
                                                >
                                                    *
                                                </span>
                                                {isFieldValid("name") && (
                                                    <Check
                                                        className="w-4 h-4 ml-auto animate-scale-in"
                                                        style={{
                                                            color: "#0EAD69",
                                                        }}
                                                    />
                                                )}
                                            </div>
                                        </label>
                                        <div className="relative">
                                            <input
                                                id="name"
                                                type="text"
                                                value={data.name}
                                                onChange={(e) =>
                                                    setData(
                                                        "name",
                                                        e.target.value,
                                                    )
                                                }
                                                onFocus={() =>
                                                    setFocusedField("name")
                                                }
                                                onBlur={() =>
                                                    setFocusedField(null)
                                                }
                                                className={`w-full px-4 py-3 border rounded-lg font-medium transition-all duration-200 ${
                                                    errors.name
                                                        ? "border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                                                        : focusedField ===
                                                            "name"
                                                          ? "bg-white shadow-sm ring-2"
                                                          : "border-gray-300 bg-white hover:border-gray-400"
                                                }`}
                                                style={
                                                    focusedField === "name" &&
                                                    !errors.name
                                                        ? {
                                                              borderColor:
                                                                  "#540D6E",
                                                              "--tw-ring-color":
                                                                  "rgba(84, 13, 110, 0.2)",
                                                          }
                                                        : {}
                                                }
                                                placeholder="Ejemplo: Dr. Juan Pérez González"
                                                autoFocus
                                            />
                                            {isFieldValid("name") &&
                                                !errors.name && (
                                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                        <div
                                                            className="p-1 rounded-full"
                                                            style={{
                                                                backgroundColor:
                                                                    "#E8F5F0",
                                                            }}
                                                        >
                                                            <Check
                                                                className="w-4 h-4"
                                                                style={{
                                                                    color: "#0EAD69",
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                        </div>
                                        {errors.name && (
                                            <div
                                                className="mt-2 flex items-start gap-2 p-3 bg-red-50 border-l-4 rounded-r-lg animate-slide-down"
                                                style={{
                                                    borderLeftColor: "#EE4266",
                                                }}
                                            >
                                                <AlertCircle
                                                    className="w-4 h-4 flex-shrink-0 mt-0.5"
                                                    style={{ color: "#EE4266" }}
                                                />
                                                <p className="text-sm font-medium text-red-800">
                                                    {errors.name}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Email Field */}
                                    {!isStudent && (
                                        <div className="group/field">
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
                                                    <span
                                                        style={{
                                                            color: "#EE4266",
                                                        }}
                                                    >
                                                        *
                                                    </span>
                                                    {isFieldValid("email") && (
                                                        <Check
                                                            className="w-4 h-4 ml-auto animate-scale-in"
                                                            style={{
                                                                color: "#0EAD69",
                                                            }}
                                                        />
                                                    )}
                                                </div>
                                            </label>
                                            <div className="relative">
                                                <input
                                                    id="email"
                                                    type="email"
                                                    value={data.email}
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
                                                    className={`w-full px-4 py-3 border rounded-lg font-medium transition-all duration-200 ${
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
                                                {isFieldValid("email") &&
                                                    !errors.email && (
                                                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                            <div
                                                                className="p-1 rounded-full"
                                                                style={{
                                                                    backgroundColor:
                                                                        "#E8F5F0",
                                                                }}
                                                            >
                                                                <Check
                                                                    className="w-4 h-4"
                                                                    style={{
                                                                        color: "#0EAD69",
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
                                            </div>
                                            {errors.email && (
                                                <div
                                                    className="mt-2 flex items-start gap-2 p-3 bg-red-50 border-l-4 rounded-r-lg animate-slide-down"
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
                                    )}

                                    <div className="border-b border-gray-200 pb-4 mb-6 mt-8">
                                        <h2 className="text-lg font-bold text-gray-900">
                                            Credenciales de Acceso
                                        </h2>
                                    </div>

                                    {/* Pin Field */}
                                    {isStudent && (
                                        <div className="mb-6 overflow-hidden rounded-xl border border-purple-200 bg-gradient-to-r from-purple-50 to-white shadow-sm">
                                            <div className="flex items-start gap-4 p-4">
                                                <div className="flex-shrink-0">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 shadow-sm">
                                                        <KeyRound className="h-5 w-5" style={{ color: '#540D6E' }} />
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-gray-900 mb-1">
                                                        Credenciales automáticas para estudiante
                                                    </h3>
                                                    <p className="text-sm text-gray-600 leading-relaxed">
                                                        El sistema generará automáticamente un <span className="font-medium text-purple-700">usuario único</span> y un <span className="font-medium text-purple-700">PIN de 4 dígitos</span>. 
                                                        Estas credenciales se mostrarán al guardar el registro.
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 bg-purple-100/50 px-4 py-2 text-xs border-t border-purple-200">
                                                <Info className="h-3.5 w-3.5" style={{ color: '#540D6E' }} />
                                                <span className="text-purple-800">El estudiante usará estas credenciales para iniciar sesión</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Password Field */}
                                    {!isStudent && (
                                        <div className="group/field">
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
                                                    <span
                                                        style={{
                                                            color: "#EE4266",
                                                        }}
                                                    >
                                                        *
                                                    </span>
                                                    {isFieldValid(
                                                        "password",
                                                    ) && (
                                                        <Check
                                                            className="w-4 h-4 ml-auto animate-scale-in"
                                                            style={{
                                                                color: "#0EAD69",
                                                            }}
                                                        />
                                                    )}
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
                                                    value={data.password}
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
                                                    className={`w-full px-4 py-3 pr-12 border rounded-lg font-medium transition-all duration-200 ${
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
                                                    placeholder="Mínimo 8 caracteres"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setShowPassword(
                                                            !showPassword,
                                                        )
                                                    }
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-100 rounded transition-colors"
                                                >
                                                    {showPassword ? (
                                                        <svg
                                                            className="w-5 h-5 text-gray-500"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                                                            />
                                                        </svg>
                                                    ) : (
                                                        <svg
                                                            className="w-5 h-5 text-gray-500"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                            />
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                            />
                                                        </svg>
                                                    )}
                                                </button>
                                            </div>
                                            {errors.password ? (
                                                <div
                                                    className="mt-2 flex items-start gap-2 p-3 bg-red-50 border-l-4 rounded-r-lg animate-slide-down"
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
                                            ) : (
                                                <div className="mt-3 space-y-2">
                                                    {/* Password strength bar */}
                                                    <div className="flex gap-1">
                                                        {[1, 2, 3, 4].map(
                                                            (level) => (
                                                                <div
                                                                    key={level}
                                                                    className={`h-1 flex-1 rounded-full transition-all duration-300`}
                                                                    style={{
                                                                        backgroundColor:
                                                                            level <=
                                                                            passwordStrength.level
                                                                                ? passwordStrength.color ===
                                                                                  "red"
                                                                                    ? "#EE4266"
                                                                                    : passwordStrength.color ===
                                                                                        "yellow"
                                                                                      ? "#FFD23F"
                                                                                      : passwordStrength.color ===
                                                                                          "green"
                                                                                        ? "#3BCEAC"
                                                                                        : passwordStrength.color ===
                                                                                            "emerald"
                                                                                          ? "#0EAD69"
                                                                                          : "#E5E7EB"
                                                                                : "#E5E7EB",
                                                                    }}
                                                                />
                                                            ),
                                                        )}
                                                    </div>
                                                    <div className="flex items-center justify-between text-xs">
                                                        <span className="font-medium text-gray-600">
                                                            Nivel de seguridad:{" "}
                                                            <span
                                                                className="font-semibold"
                                                                style={{
                                                                    color:
                                                                        passwordStrength.color ===
                                                                        "red"
                                                                            ? "#EE4266"
                                                                            : passwordStrength.color ===
                                                                                "yellow"
                                                                              ? "#D97706"
                                                                              : passwordStrength.color ===
                                                                                  "green"
                                                                                ? "#3BCEAC"
                                                                                : passwordStrength.color ===
                                                                                    "emerald"
                                                                                  ? "#0EAD69"
                                                                                  : "#6B7280",
                                                                }}
                                                            >
                                                                {
                                                                    passwordStrength.text
                                                                }
                                                            </span>
                                                        </span>
                                                        <span className="text-gray-400">
                                                            {
                                                                data.password
                                                                    .length
                                                            }{" "}
                                                            caracteres
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex items-center justify-end gap-4 pt-8 border-t border-gray-200">
                                        <Link
                                            href={cancelRoute}
                                            className="px-6 py-2.5 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200"
                                            style={{
                                                "--tw-ring-color":
                                                    "rgba(107, 114, 128, 0.3)",
                                            }}
                                        >
                                            Cancelar
                                        </Link>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
                                            style={{
                                                backgroundColor: "#540D6E",
                                                "--tw-ring-color":
                                                    "rgba(84, 13, 110, 0.5)",
                                            }}
                                            onMouseEnter={(e) =>
                                                (e.currentTarget.style.backgroundColor =
                                                    "#6B1689")
                                            }
                                            onMouseLeave={(e) =>
                                                (e.currentTarget.style.backgroundColor =
                                                    "#540D6E")
                                            }
                                        >
                                            {processing ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    <span>Procesando...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Check className="w-4 h-4" />
                                                    <span>
                                                        Registrar Usuario
                                                    </span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* Security Notice */}
                            <div className="mt-6 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                                <div className="flex items-start gap-3">
                                    <div
                                        className="p-2 rounded-lg"
                                        style={{ backgroundColor: "#E8F5F0" }}
                                    >
                                        <Shield
                                            className="w-5 h-5"
                                            style={{ color: "#0EAD69" }}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-sm font-bold text-gray-900 mb-1">
                                            Protección de Datos Institucionales
                                        </h3>
                                        <p className="text-xs text-gray-600 leading-relaxed">
                                            Toda la información será almacenada
                                            de forma segura y encriptada,
                                            cumpliendo con las normativas de
                                            protección de datos académicos y
                                            personales vigentes.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Academic Sidebar */}
                        <div className="lg:col-span-1 space-y-6 animate-slide-left">
                            {/* Progress Card */}
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                                <div className="flex items-center gap-3 mb-5">
                                    <div
                                        className="p-2 rounded-lg"
                                        style={{ backgroundColor: "#F3E8FF" }}
                                    >
                                        <Info
                                            className="w-5 h-5"
                                            style={{ color: "#540D6E" }}
                                        />
                                    </div>
                                    <h3 className="font-bold text-gray-900">
                                        Estado del Formulario
                                    </h3>
                                </div>
                                <div className="space-y-3">
                                    {[
                                        {
                                            label: "Información Personal",
                                            completed: isStudent
                                                ? !!data.name
                                                : !!data.name &&
                                                  isFieldValid("email"),
                                        },
                                        {
                                            label: "Credenciales",
                                            completed: isStudent
                                                ? true
                                                : isFieldValid("password"),
                                        },
                                        {
                                            label: "Rol Asignado",
                                            completed: !!data.role_id,
                                        },
                                    ].map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-3 p-3 rounded-lg border transition-all duration-200"
                                            style={{
                                                borderColor: item.completed
                                                    ? "#0EAD69"
                                                    : "#E5E7EB",
                                                backgroundColor: item.completed
                                                    ? "#F0FDF4"
                                                    : "#FAFAFA",
                                            }}
                                        >
                                            <div
                                                className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300`}
                                                style={{
                                                    backgroundColor:
                                                        item.completed
                                                            ? "#0EAD69"
                                                            : "#E5E7EB",
                                                }}
                                            >
                                                {item.completed && (
                                                    <Check className="w-3 h-3 text-white" />
                                                )}
                                            </div>
                                            <span
                                                className={`text-sm font-medium transition-colors duration-300`}
                                                style={{
                                                    color: item.completed
                                                        ? "#0EAD69"
                                                        : "#6B7280",
                                                }}
                                            >
                                                {item.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-5 pt-5 border-t border-gray-200">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="font-semibold text-gray-700">
                                            Progreso Total
                                        </span>
                                        <span
                                            className="font-bold"
                                            style={{ color: "#540D6E" }}
                                        >
                                            {progress}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="h-2 rounded-full transition-all duration-500"
                                            style={{
                                                width: `${progress}%`,
                                                backgroundColor: "#0EAD69",
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            </div>

                            {/* Available Roles */}
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                                <div className="flex items-center gap-3 mb-4">
                                    <div
                                        className="p-2 rounded-lg"
                                        style={{ backgroundColor: "#F3E8FF" }}
                                    >
                                        <Shield
                                            className="w-5 h-5"
                                            style={{ color: "#540D6E" }}
                                        />
                                    </div>
                                    <h3 className="font-bold text-gray-900">
                                        Roles Disponibles
                                    </h3>
                                </div>
                                <div className="space-y-2">
                                    {roles.map((role) => (
                                        <div
                                            key={role.id}
                                            className={`p-3 rounded-lg border transition-all duration-200 ${
                                                data.role_id ===
                                                role.id.toString()
                                                    ? "text-white shadow-sm"
                                                    : "bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200"
                                            }`}
                                            style={
                                                data.role_id ===
                                                role.id.toString()
                                                    ? {
                                                          backgroundColor:
                                                              "#540D6E",
                                                          borderColor:
                                                              "#540D6E",
                                                      }
                                                    : {}
                                            }
                                        >
                                            <div className="flex items-center gap-2">
                                                <Shield className="w-4 h-4" />
                                                <span className="text-sm font-semibold">
                                                    {role.name}
                                                </span>
                                                {data.role_id ===
                                                    role.id.toString() && (
                                                    <Check className="w-4 h-4 ml-auto" />
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Admin Warning */}
                            {isAdminRole && (
                                <div className="p-6 rounded-lg shadow-sm border" style={{backgroundColor: '#FFF9E6', borderColor: '#FFD23F'}}>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 rounded-lg" style={{ backgroundColor: '#FED7AA' }}>
                                            <AlertTriangle className="w-5 h-5" style={{ color: '#D97706' }} />
                                        </div>
                                        <h3 className="font-bold text-gray-900">Advertencia de Permisos</h3>
                                    </div>
                                    <div className="space-y-2.5 text-sm text-gray-700">
                                        <p className="font-semibold" style={{ color: '#92400E' }}>
                                            Rol de Administrador seleccionado:
                                        </p>
                                        <ul className="space-y-2">
                                            <li className="flex items-start gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: '#D97706' }}></div>
                                                <span>Acceso completo a todos los módulos del sistema</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: '#D97706' }}></div>
                                                <span>Capacidad de gestionar otros usuarios</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: '#D97706' }}></div>
                                                <span>Modificación de configuraciones institucionales</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>  
                            )}

                            {/* Requirements */}
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                                <div className="flex items-center gap-3 mb-4">
                                    <div
                                        className="p-2 rounded-lg"
                                        style={{ backgroundColor: "#FFF9E6" }}
                                    >
                                        <BookOpen
                                            className="w-5 h-5"
                                            style={{ color: "#D97706" }}
                                        />
                                    </div>
                                    <h3 className="font-bold text-gray-900">
                                        Requisitos
                                    </h3>
                                </div>
                                <ul className="space-y-2.5 text-sm text-gray-600">
                                    <li className="flex gap-2.5 items-start">
                                        <div
                                            className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                                            style={{
                                                backgroundColor: "#540D6E",
                                            }}
                                        ></div>
                                        <span>
                                            Contraseña de mínimo 8 caracteres
                                        </span>
                                    </li>
                                    <li className="flex gap-2.5 items-start">
                                        <div
                                            className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                                            style={{
                                                backgroundColor: "#540D6E",
                                            }}
                                        ></div>
                                        <span>
                                            Correo electrónico institucional
                                            válido
                                        </span>
                                    </li>
                                    <li className="flex gap-2.5 items-start">
                                        <div
                                            className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                                            style={{
                                                backgroundColor: "#540D6E",
                                            }}
                                        ></div>
                                        <span>
                                            Asignación de rol según función
                                            académica
                                        </span>
                                    </li>
                                    <li className="flex gap-2.5 items-start">
                                        <div
                                            className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                                            style={{
                                                backgroundColor: "#540D6E",
                                            }}
                                        ></div>
                                        <span>
                                            El usuario recibirá notificación por
                                            correo
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes shimmer {
                    0% {
                        transform: translateX(-100%);
                    }
                    100% {
                        transform: translateX(100%);
                    }
                }
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
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
                @keyframes slideLeft {
                    from {
                        opacity: 0;
                        transform: translateX(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                @keyframes scaleIn {
                    from {
                        opacity: 0;
                        transform: scale(0);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                .animate-shimmer {
                    animation: shimmer 2s infinite;
                }
                .animate-fade-in {
                    animation: fadeIn 0.6s ease-out;
                }
                .animate-slide-up {
                    animation: slideUp 0.6s ease-out;
                }
                .animate-slide-down {
                    animation: slideDown 0.3s ease-out;
                }
                .animate-slide-left {
                    animation: slideLeft 0.8s ease-out;
                }
                .animate-scale-in {
                    animation: scaleIn 0.3s ease-out;
                }
            `}</style>
        </>
    );
}
