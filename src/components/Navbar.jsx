import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setMenuOpen(false);
        navigate("/");
    };

    return (
        <nav className="w-full border-b bg-white px-6 py-4">
            <div className="flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="text-xl font-bold">
                    GuardedWallet
                </Link>

                {/* Desktop Menu */}
                <ul className="hidden md:flex gap-6 items-center">
                    {!user ? (
                        <>
                            <Link to="/login">
                                <li className="cursor-pointer hover:text-black">
                                    Login
                                </li>
                            </Link>

                            <Link to="/signup">
                                <li className="bg-black text-white px-4 py-2 rounded-lg cursor-pointer">
                                    Sign Up
                                </li>
                            </Link>
                        </>
                    ) : (
                        <>
                            {/* User Info */}
                            <Link to="/guardian/requests">
                                <li className="cursor-pointer hover:underline">
                                    Guardian Requests
                                </li>
                            </Link>

                            <Link to="/approvals">
                                <li className="cursor-pointer hover:underline">
                                    Approvals
                                </li>
                            </Link>


                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center font-bold">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="font-medium">{user.name}</span>
                            </div>

                            <button
                                onClick={handleLogout}
                                className="text-red-600 hover:underline"
                            >
                                Logout
                            </button>
                        </>
                    )}
                </ul>

                {/* Mobile Hamburger */}
                <button
                    className="md:hidden text-2xl"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    ☰
                </button>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden mt-4 border-t pt-4">
                    <ul className="flex flex-col gap-4">
                        {!user ? (
                            <>
                                <Link to="/login" onClick={() => setMenuOpen(false)}>
                                    <li className="cursor-pointer">Login</li>
                                </Link>

                                <Link to="/signup" onClick={() => setMenuOpen(false)}>
                                    <li className="bg-black text-white px-4 py-2 rounded-lg w-fit">
                                        Sign Up
                                    </li>
                                </Link>
                            </>
                        ) : (
                            <>
                                {/* User Info */}
                                <Link to="/guardian/requests" onClick={() => setMenuOpen(false)}>
                                    <li className="cursor-pointer hover:underline">
                                        Guardian Requests
                                    </li>
                                </Link>

                                <Link to="/approvals" onClick={() => setMenuOpen(false)}>
                                    <li className="cursor-pointer hover:underline">
                                        Approvals
                                    </li>
                                </Link>




                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center font-bold">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="font-medium">{user.name}</span>
                                </div>

                                <button
                                    onClick={handleLogout}
                                    className="text-red-600 text-left"
                                >
                                    Logout
                                </button>
                            </>
                        )}
                    </ul>
                </div>
            )}
        </nav>
    );
}
