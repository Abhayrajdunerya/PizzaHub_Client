import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'

import { auth, googleAuthProvider } from '../../firebase'
import { images } from '../../constants/index'
import { createOrUpdateUser } from '../../functions/auth'

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {user} = useSelector((state) => ({...state}));

  useEffect(() => {
    if (user && user.token) {
      navigate('/');
    }
  }, [user])

  const roleBasedRedirect = (res) => {
    if (res.data.role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/');
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await auth.signInWithEmailAndPassword(email, password);
      const {user} = result;
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
        })
        roleBasedRedirect(res);
      })
      .catch(error => console.log(error))

    } catch (error) {
      console.log(error);
      toast.error(error.message);
      setLoading(false);
    }
  }

  const googleLogin = async () => {
    auth.signInWithPopup(googleAuthProvider).then(async (result) => {
      const {user} = result;
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
            // _id: user.uid,
            _id: res.data._id,
          }
        })
        roleBasedRedirect(res);
      })
      .catch((error) => {
        console.log(error);
      })
      // navigate('/');
    }).catch((error) => {
      console.log(error);
      toast.error(error.message);
    });
  }

  return (
    <div>
      <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <img className="mx-auto h-12 w-auto" src={images.logo_2} alt="Workflow" />
              <h2 className={`mt-6 text-center text-3xl font-extrabold ${loading ? 'text-red-600' : 'text-gray-900'}`}>{ loading ? 'Loading...' : 'Login to your account'}</h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                Or
                <Link to={'/register'} className="font-medium text-blue-600 hover:text-blue-500" > Register</Link>
              </p>
          </div>
          <form onSubmit={handleSubmit} className="mt-8 space-y-6" method="POST">
            <input type="hidden" name="remember" value="true" />
              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <label htmlFor="email" className="sr-only">Email address</label>
                  <input onChange={e => setEmail(e.target.value)} id="email" name="email" value={email} type="email" autoComplete="email" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" placeholder="Email address" />
                </div>
                <div>
                  <label htmlFor="password" className="sr-only">Password</label>
                  <input onChange={e => setPassword(e.target.value)} id="password" name="password" value={password} type="password" autoComplete="current-password" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" placeholder="Password" />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <Link to={'/forgot/password'} className="font-medium text-blue-600 hover:text-blue-500"> Forgot your password? </Link>
                </div>
              </div>

              <div>
                <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <svg className="h-5 w-5 text-blue-500 group-hover:text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  Login
                </button>
              </div>
          </form>
          <button onClick={googleLogin} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md bg-gray-100 hover:bg-gray-200 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" preserveAspectRatio="xMidYMid" viewBox="0 0 256 262"><path fill="#4285F4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"/><path fill="#34A853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"/><path fill="#FBBC05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"/><path fill="#EB4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"/></svg>
            <span className="border-l border-blue-500 h-6 w-1 ml-3 block"></span>
            <span className="pl-3 text-blue-600">Sign up with Google</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login