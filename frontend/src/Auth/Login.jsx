import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Shield } from 'lucide-react';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function Login({ status }) {
    const [data, setFormData] = useState({
        email: '',
        password: '',
        remember: false,
    });
    const [errors] = useState({});
    const processing = false;

    const [showPassword, setShowPassword] = useState(false);

    const setData = (field, value) => {
        setFormData((current) => ({
            ...current,
            [field]: value,
        }));
    };

    const submit = (e) => {
        e.preventDefault();
    };

    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-[#f7f9fe] p-4 relative overflow-hidden">
                {/* Background Gradient Blobs */}
                <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none opacity-40">
                    <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-blue-200 rounded-full blur-[100px]"></div>
                    <div className="absolute bottom-[10%] right-[5%] w-64 h-64 bg-red-200 rounded-full blur-[100px]"></div>
                </div>

                <main className="w-full max-w-[480px] mx-auto z-10">
                    {/* Glass Card */}
                    <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl p-6 md:p-8 shadow-[0_10px_40px_rgba(10,36,114,0.08)] transition-all duration-500">
                        {/* Brand Identity */}
                        <div className="flex flex-col items-center text-center mb-6">
                            <div className="mb-3 animate-float">
                                <ApplicationLogo className="h-24 w-24 object-contain" />
                            </div>
                            <h1 className="text-2xl font-semibold text-[#00114a] mb-2">
                                Complete in Jesus Christ 
                                <br />Mission Church
                            </h1>
                        </div>

                        {/* Status Message */}
                        {status && (
                            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-xs font-medium text-green-600">
                                {status}
                            </div>
                        )}

                        {/* Login Form */}
                        <form onSubmit={submit} className="space-y-4">
                            {/* Email Field */}
                            <div className="space-y-1.5">
                                <label htmlFor="email" className="block text-xs font-semibold text-zinc-600 px-1">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="w-full pl-10 pr-3 py-3 bg-white/50 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:border-[#00114a] focus:ring-2 focus:ring-[#00114a]/10 transition-all placeholder:text-zinc-400"
                                        placeholder="admin@cjcmission.com"
                                        required
                                        autoFocus
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-xs text-red-600 px-1">{errors.email}</p>
                                )}
                            </div>

                            {/* Password Field */}
                            <div className="space-y-1.5">
                                <label htmlFor="password" className="block text-xs font-semibold text-zinc-600 px-1">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className="w-full pl-10 pr-10 py-3 bg-white/50 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:border-[#00114a] focus:ring-2 focus:ring-[#00114a]/10 transition-all placeholder:text-zinc-400"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-[#00114a] transition-colors"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-xs text-red-600 px-1">{errors.password}</p>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-between px-1 pt-1">
                                <label className="flex items-center gap-1.5 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="h-3.5 w-3.5 rounded border-zinc-300 text-[#00114a] focus:ring-[#00114a]/20 transition-all cursor-pointer"
                                    />
                                    <span className="text-xs font-semibold text-zinc-600 group-hover:text-[#00114a] transition-colors">
                                        Remember me
                                    </span>
                                </label>
                                {/* {canResetPassword && (
                                    <Link
                                        href={route('password.request') }
                                        className="text-xs font-semibold text-[#930018] hover:underline transition-all decoration-2 underline-offset-4"
                                    >
                                        Forgot Password?
                                    </Link>
                                )} */}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-gradient-to-b from-[#0d7a3a] to-[#0a5c2c] text-white py-3 rounded-lg text-sm font-semibold shadow-lg flex items-center justify-center gap-2 mt-4 group hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(10,92,44,0.28)] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span>Sign In</span>
                                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </form>

                        {/* Footer Help */}
                        <div className="mt-5 pt-4 border-t border-zinc-200/50 text-center">
                            <p className="text-[12px] text-zinc-500">
                                Authorized Access Only. For technical support, contact the{' '}
                                <a href="#" className="text-[#00114a] font-semibold hover:underline">
                                    Church IT Ministry
                                </a>
                                .
                            </p>
                        </div>
                    </div>

                    {/* System Message */}
                    <div className="mt-3 text-center">
                        <p className="text-[12px] text-zinc-500 flex items-center justify-center gap-1.5">
                            <Shield className="h-3 w-3" />
                            Secure End-to-End Encrypted Session
                        </p>
                    </div>
                </main>
            </div>

            <style>{`
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-8px); }
                    100% { transform: translateY(0px); }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
            `}</style>
        </>
    );
}
