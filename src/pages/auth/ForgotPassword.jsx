import { useState, useEffect } from 'react';
import { auth } from '../../firebase';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';

import { images } from '../../constants';

const ForgotPassword = () => {

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const { user } = useSelector((state) => ({ ...state }));
    const navigate = useNavigate();

    useEffect(() => {
        if (user && user.token) {
            navigate('/');
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const config = {
            url: import.meta.env.VITE_FORGOT_PASSWORD_REDIRECT,
            handleCodeInApp: true,
        }

        await auth.sendPasswordResetEmail(email, config)
            .then(() => {
                setEmail('');
                setLoading(false);
                toast.success('Check your email for password reset link')
            })
            .catch((error) => {
                setLoading(false);
                toast.error(error.message);
                console.log("ERROR MSG IN FORGOT PASSWORD ", error);
            })

    }

    return (
        <div>
            <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div>
                        <img className="mx-auto h-12 w-auto" src={images.logo_2} alt="Workflow" />
                        <h2 className={`mt-6 text-center text-3xl font-extrabold ${loading ? 'text-red-600' : ' text-gray-900'}`}>{loading ? 'Loading...' : 'Forgot your Password'}</h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Or
                            <Link to={'/login'} className="font-medium text-blue-600 hover:text-blue-500" > Login</Link>
                        </p>
                    </div>
                    <form onSubmit={handleSubmit} className="mt-8 space-y-6" method="POST">
                        <input type="hidden" name="remember" value="true" />
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                                <label htmlFor="email" className="sr-only">Email address</label>
                                <input onChange={e => setEmail(e.target.value)} id="email" name="email" value={email} type="email" autoComplete="email" autoFocus={true} required className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" placeholder="Email address" />
                            </div>
                        </div>

                        <div>
                            <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" disabled={!email}>
                                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                    <svg className="h-5 w-5 text-blue-500 group-hover:text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                    </svg>
                                </span>
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword