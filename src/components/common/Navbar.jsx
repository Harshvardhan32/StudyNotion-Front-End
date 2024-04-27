import { useEffect, useState } from "react";
import { AiOutlineMenu, AiOutlineShoppingCart } from "react-icons/ai";
import { IoIosArrowDown } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { Link, matchPath, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/Logo/Logo-Full-Light.png";
import { NavbarLinks } from "../../data/navbar-links";
import { apiConnector } from "../../services/apiconnector";
import { categories } from "../../services/apis";
import { ACCOUNT_TYPE } from "../../utils/constants";
import ProfileDropdown from "../core/Auth/ProfileDropDown";
import { logout } from "../../services/operations/authAPI";

function Navbar() {
    const { token } = useSelector((state) => state.auth);
    const { user } = useSelector((state) => state.profile);
    const { totalItems } = useSelector((state) => state.cart);
    const location = useLocation();
    const navigate = useNavigate();

    const dispatch = useDispatch();
    const [subLinks, setSubLinks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [openCatalog, setOpenCatalog] = useState(false);

    const openCataloghandler = () => {
        setOpenCatalog(!openCatalog);
    };

    const getAllCategories = async () => {
        setLoading(true);
        try {
            const result = await apiConnector("POST", categories.CATEGORIES_API);
            setSubLinks(result?.data?.data);
        } catch (error) {
            console.log("Could not fetch Categories.", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        getAllCategories();
    }, []);

    const matchRoute = (route) => {
        return matchPath({ path: route }, location.pathname);
    };

    return (
        <div className="relative flex h-14 bg-richblack-800 items-center justify-center border-b-[1px] border-b-richblack-700 transition-all duration-200">
            <div className="flex w-11/12 max-w-maxContent items-center justify-between">
                <Link to="/">
                    <img src={logo} alt="Logo" width={160} height={32} loading="lazy" />
                </Link>
                <nav className="hidden md:block">
                    <ul className="flex gap-x-6 text-richblack-25">
                        {NavbarLinks?.map((link, index) => (
                            <li key={index}>
                                {link.title === "Catalog" ? (
                                    <>
                                        <div
                                            className={`group relative hover:text-yellow-25 flex cursor-pointer items-center gap-1 
                                            ${matchRoute("/catalog/:catalogName")
                                                    ? "text-yellow-25"
                                                    : "text-richblack-25"
                                                }`}
                                        >
                                            <p>{link.title}</p>
                                            <IoIosArrowDown fontSize={18} className="group-hover:rotate-180 transition-all duration-300" />
                                            <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">
                                                <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>
                                                {loading ? (
                                                    <p className="text-center">Loading...</p>
                                                ) : (subLinks && subLinks?.length) ? (
                                                    <>
                                                        {subLinks
                                                            ?.filter(
                                                                (subLink) => subLink?.courses?.length > 0
                                                            )
                                                            ?.map((subLink, i) => (
                                                                <Link
                                                                    to={`/catalog/${subLink?.name
                                                                        .split(" ")
                                                                        .join("-")
                                                                        .toLowerCase()}`}
                                                                    className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50"
                                                                    key={i}
                                                                >
                                                                    <p>{subLink?.name}</p>
                                                                </Link>
                                                            ))}
                                                    </>
                                                ) : (
                                                    <p className="text-center">No Record Found</p>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <Link to={link?.path}>
                                        <p
                                            className={`${matchRoute(link?.path)
                                                ? "text-yellow-25"
                                                : "text-richblack-25"
                                                } hover:text-yellow-25`}
                                        >
                                            {link?.title}
                                        </p>
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Login / Signup / Dashboard */}
                <div className="hidden items-center gap-x-4 md:flex">
                    {user && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
                        <Link to="/dashboard/cart" className="relative">
                            <AiOutlineShoppingCart className="text-2xl text-richblack-100" />
                            {totalItems > 0 && (
                                <span className="absolute bottom-3 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
                                    {totalItems}
                                </span>
                            )}
                        </Link>
                    )}
                    {token === null && (
                        <Link to="/login">
                            <button className="rounded-[8px] border border-richblack-600 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                                Log in
                            </button>
                        </Link>
                    )}
                    {token === null && (
                        <Link to="/signup">
                            <button className="rounded-[8px] border border-richblack-600 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                                Sign up
                            </button>
                        </Link>
                    )}
                    {token !== null && <ProfileDropdown />}
                </div>
                <button className="md:hidden" onClick={() => setMobileMenuOpen(true)}>
                    <AiOutlineMenu fill="#fff" fontSize="2.2rem" />
                </button>
            </div>

            {/* Mobile menu */}
            {
                mobileMenuOpen && (
                    <div className="fixed md:hidden inset-0 z-50 flex items-center justify-end bg-black bg-opacity-50">
                        <div className="relative w-full max-w-[300px] rounded-lg justify-end bg-richblack-800 mt-16 p-8">
                            <button
                                className="absolute top-4 left-10 text-white"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <RxCross2 fontSize="1.6rem" />
                            </button>
                            <div className="text-white flex flex-col gap-y-5 ">
                                <div className='bg-richblack-800 flex flex-col gap-y-5 h-screen pl-4 pr-8 pt-5'>
                                    <div>
                                        {user && (<Link to='/dashboard/my-profile' className={`hover:text-yellow-25 ${matchRoute('/dashboard/:profile')
                                            ? "text-yellow-25"
                                            : "text-richblack-25"
                                            }
                                    `}
                                            onClick={() => mobileMenuOpen(false)}
                                        >
                                            Dashboard
                                        </Link>
                                        )}
                                    </div>
                                    <div className='text-white flex flex-col gap-y-4'>
                                        {
                                            NavbarLinks?.map((link, index) => (
                                                <div key={index}>
                                                    {
                                                        link?.title === "Catalog" ? (
                                                            <>
                                                                <div
                                                                    onClick={openCataloghandler}
                                                                    className="flex flex-row gap-6 min-w-[150px] cursor-pointer items-center
                                                         rounded-md transition-all duration-300 hover:text-yellow-25 justify-between">
                                                                    <p className="">{link?.title}</p>
                                                                    <IoIosArrowDown fontSize={22} className={`transition-all duration-200 ${openCatalog && 'rotate-180'}`} />
                                                                </div>
                                                                <div className={`flex flex-col gap-4 pt-4 transition-all duration-300 
                                                        ${openCatalog ? 'block' : 'hidden'}`}>
                                                                    {
                                                                        (subLinks && subLinks?.length) ? (
                                                                            <>
                                                                                {subLinks
                                                                                    ?.filter(
                                                                                        (subLink) => subLink?.courses?.length > 0
                                                                                    )
                                                                                    ?.map((subLink, i) => (
                                                                                        <Link
                                                                                            to={`/catalog/${subLink?.name
                                                                                                .split(" ")
                                                                                                .join("-")
                                                                                                .toLowerCase()}`}
                                                                                            className=''
                                                                                            key={i}
                                                                                            onClick={() => {
                                                                                                setMobileMenuOpen(false);
                                                                                                setOpenCatalog(false);
                                                                                            }}
                                                                                        >
                                                                                            <p className="pl-4 hover:text-yellow-25 text-white transition-all duration-300">{subLink?.name}</p>
                                                                                        </Link>
                                                                                    ))}
                                                                            </>
                                                                        ) : (
                                                                            <p className="text-center">No Record</p>)
                                                                    }
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <div key={index}
                                                                onClick={() => {
                                                                    navigate(link?.path);
                                                                    setMobileMenuOpen(false);
                                                                }}
                                                                className={`cursor-pointer transition-all duration-300 hover:text-yellow-25
                                                        ${matchRoute(link?.path)
                                                                        ? "text-yellow-25"
                                                                        : "text-richblack-25"
                                                                    }
                                                        `}
                                                            >
                                                                {link?.title}
                                                            </div>
                                                        )
                                                    }
                                                </div>
                                            ))
                                        }
                                    </div>

                                    {user && (
                                        <button
                                            onClick={() => {
                                                dispatch(logout(navigate));
                                                setMobileMenuOpen(false);
                                            }}
                                            className="rounded-[8px] border border-richblack-600 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                                            Log out
                                        </button>
                                    )}
                                    {token === null && (
                                        <button
                                            onClick={() => {
                                                navigate('/login');
                                                setMobileMenuOpen(false);
                                            }}
                                            className="rounded-[8px] border border-richblack-600 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                                            Log in
                                        </button>
                                    )}
                                    {token === null && (
                                        <button
                                            onClick={() => {
                                                navigate('/signup');
                                                setMobileMenuOpen(false);
                                            }}
                                            className="rounded-[8px] border border-richblack-600 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                                            Sign up
                                        </button>
                                    )}

                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
}

export default Navbar;