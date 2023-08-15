import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import firebase from 'firebase/compat/app';

import { FiHeart } from "react-icons/fi";
import { BsHandbag, BsCartCheckFill } from "react-icons/bs";
import { MdOutlineAccountCircle, MdOutlineLogin, MdOutlineLogout, MdDashboardCustomize } from "react-icons/md";
import { RiFolderUploadLine } from 'react-icons/ri'
import { HiOutlineMenuAlt2 } from 'react-icons/hi'

import { images } from '../constants/index'

const Navbar = () => {

    const iconSize = 25;
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, cart } = useSelector((state) => ({ ...state }));

    useEffect(() => {
        if (user && user.token) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, [user])

    const logout = () => {
        firebase.auth().signOut();
        dispatch({
            type: 'LOGOUT',
            payload: null,
        });
        navigate('/login')
    }

    return (
        <header className="mb-2 relative flex flex-wrap sm:justify-start sm:flex-nowrap z-50 w-full bg-white text-sm py-4 dark:bg-gray-800 shadow-md">
            <nav className="max-w-[85rem] w-full mx-auto px-4 md:px-8 sm:flex sm:items-center sm:justify-between" aria-label="Global">
                <div className="flex items-center justify-between">
                    <Link to={'/'} className="inline-flex items-center gap-x-2 text-xl font-semibold dark:text-white">
                        <img className="w-10 h-auto" src={images.logo_2} alt="Logo" />
                    </Link>
                    <div className="sm:hidden">
                        <button type="button" className="hs-collapse-toggle p-2 inline-flex justify-center items-center gap-2 rounded-2xl font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white transition-all text-sm" data-hs-collapse="#navbar-image-and-text-2" aria-controls="navbar-image-and-text-2" aria-label="Toggle navigation">
                            <HiOutlineMenuAlt2 size={iconSize} />
                        </button>
                    </div>
                </div>
                <div id="navbar-image-and-text-2" className="hs-collapse hidden overflow-hidden transition-all duration-300 basis-full grow sm:block">
                    {isLoggedIn ? <div className="flex flex-col gap-5 mt-5 sm:flex-row sm:items-center sm:justify-end sm:mt-0 sm:pl-5">
                        {user && user.role === 'admin' && <Link to={'/admin/dashboard'} className="font-medium text-black hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-500">
                            <div className="flex flex-col items-center justify-center">
                                <MdDashboardCustomize size={iconSize} />
                                Dashboard
                            </div>
                        </Link>}
                        <Link to={'/account'} className="font-medium text-black hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-500">
                            <div className="flex flex-col items-center justify-center">
                                <MdOutlineAccountCircle size={iconSize} />
                                Account
                            </div>
                        </Link>
                        {/* <Link to={'/wishlist'} className="font-medium text-black hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-500">
                            <div className="flex flex-col items-center justify-center">
                                <FiHeart size={iconSize} />
                                Wishlist
                            </div>
                        </Link> */}
                        <Link to={'/cart'} className="font-medium text-black hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-500">
                            {/* <div className="flex flex-col items-center justify-center">
                                <BsCartCheckFill size={iconSize} />
                                Cart
                            </div> */}
                            <div className="flex flex-col items-center justify-center">
                                <div className="relative flex flex-col">
                                    <BsCartCheckFill size={iconSize} />
                                    {cart.length > 0 && <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -right-2 dark:border-gray-900">{cart.length}</div>}
                                </div>
                                    {/* Orders */}
                                    Cart
                            </div>
                        </Link>
                        <Link to={'/user/orders'} className="font-medium text-black hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-500">
                            {/* <div className="flex flex-col items-center justify-center">
                                <div className="relative flex flex-col">
                                    <RiFolderUploadLine size={iconSize} />
                                    {cart.length > 0 && <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -right-2 dark:border-gray-900">{cart.length}</div>}
                                </div>
                                    Orders
                            </div> */}
                            <div className="flex flex-col items-center justify-center">
                                <RiFolderUploadLine size={iconSize} />
                                {/* Cart */}
                                Orders
                            </div>
                        </Link>
                        <div onClick={logout} className="font-medium cursor-pointer text-black hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-500">
                            <div className="flex flex-col items-center justify-center">
                                <MdOutlineLogout size={iconSize} />
                                Logout
                            </div>
                        </div>
                    </div> :
                        <div className="flex flex-col gap-5 mt-5 sm:flex-row sm:items-center sm:justify-end sm:mt-0 sm:pl-5">
                            <Link to={'/login'} className="flex flex-col items-center justify-center">
                                <MdOutlineLogin size={iconSize} />
                                Login
                            </Link>
                        </div>
                    }
                </div>
            </nav>
        </header>
    )
}

export default Navbar