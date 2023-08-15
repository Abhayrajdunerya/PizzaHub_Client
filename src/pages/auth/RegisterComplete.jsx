import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux';

import { auth } from '../../firebase';
import { createOrUpdateUser } from '../../functions/auth';
import { images } from '../../constants';

const RegisterComplete = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {user} = useSelector((state) => ({...state}));

    useEffect(() => {
        setEmail(window.localStorage.getItem('emailForRegistration'))
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            toast.error('Email and Pasword is required.');
            return;
        }
      
        if (password.length < 6) {
            toast.error('Password must be at least 6 characters long');
            return;
        }

        try {
            const result = auth.signInWithEmailLink(email, window.location.href);
            window.localStorage.removeItem('emailForRegistration');

            let user = auth.currentUser;
            await user.updatePassword(password);
            const idTokenResult = await user.getIdTokenResult();
    
            createOrUpdateUser(idTokenResult.token)
            .then((res) => {
                dispatch({
                    type: 'LOGGED_IN_USER',
                    payload: {
                        name: res.data.name,
                        email: res.data.email,
                        token: idTokenResult.token,
                        role: res.data.role,
                        _id: res.data._id,
                    },
                });
            })
            .catch(error => console.log(error));

            navigate('/');

        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    return (
        <div>
            <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div>
                        <img className="mx-auto h-12 w-auto" src={images.logo_2} alt="Workflow" />
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Register to your account</h2>
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
                                <input onChange={e => setEmail(e.target.value)} id="email" name="email" value={email} type="email" autoComplete="email" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" placeholder="Email address" disabled={true} />
                            </div>
                            <div>
                                <label htmlFor="password" className="sr-only">Password</label>
                                <input onChange={e => setPassword(e.target.value)} id="password" name="password" value={password} type="password" autoComplete="current-password" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" placeholder="Password" autoFocus={true} />
                            </div>
                        </div>

                        <div>
                            <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                    <svg className="h-5 w-5 text-blue-500 group-hover:text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                    </svg>
                                </span>
                                Register
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default RegisterComplete