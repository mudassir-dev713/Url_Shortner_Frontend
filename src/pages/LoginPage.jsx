import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';

function LoginPage() {
  const { theme } = useTheme();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      await login(formData.email, formData.password);
      toast.success('Logged in successfully!');
      navigate('/shorten'); // change to your post-login route
    } catch (err) {
      console.error(err);
      const message =
        err?.response?.data?.message || 'Login failed. Please try again.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <>
      <Helmet>
        <title>Login - LinkSnip</title>
        <meta
          name="description"
          content="Login to your LinkSnip account and start shortening and managing links with ease."
        />
        <meta property="og:title" content="Login - LinkSnip" />
        <meta
          property="og:description"
          content="Securely sign in to manage your shortened URLs with analytics and more."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://link-snip.netlify.app/login" />
        <meta
          property="og:image"
          content="https://link-snip.netlify.app/og-image.png"
        />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12">
        <div
          className={`max-w-md w-full space-y-8 p-8 rounded-xl shadow-lg transition-colors duration-200 ${
            theme === 'dark' ? 'bg-gradient-card-dark' : 'bg-white'
          }`}
        >
          <div className="text-center">
            <h1 className="mt-6 text-3xl font-bold">Welcome Back</h1>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Sign in to your account to continue
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Email Address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`appearance-none relative block w-full px-3 py-3 border ${
                      errors.email
                        ? 'border-red-500 dark:border-red-500'
                        : 'border-gray-300 dark:border-gray-600'
                    } placeholder-gray-500 dark:placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-transparent`}
                    placeholder="you@example.com"
                  />
                  {errors.email && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <AlertCircle
                        className="h-5 w-5 text-red-500"
                        aria-hidden="true"
                      />
                    </div>
                  )}
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`appearance-none relative block w-full px-3 py-3 border ${
                      errors.password
                        ? 'border-red-500 dark:border-red-500'
                        : 'border-gray-300 dark:border-gray-600'
                    } placeholder-gray-500 dark:placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-transparent`}
                    placeholder="••••••••"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" aria-hidden="true" />
                      ) : (
                        <Eye className="h-5 w-5" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end">
              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-primary hover:text-primary/90"
                >
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="btn-animate px-8 py-3 rounded-lg font-medium w-full  text-white bg-gradient-to-r from-green-500 via-emerald-500 to-lime-500 
             hover:from-lime-500 hover:to-green-600 
             dark:from-emerald-600 dark:via-green-600 dark:to-lime-500 
             dark:hover:from-lime-400 dark:hover:to-green-400
             shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-70"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>

            <div className="text-center text-sm">
              <span className="text-gray-500 dark:text-gray-400">
                Don't have an account?{' '}
              </span>
              <Link
                to="/signup"
                className="font-medium text-primary hover:text-primary/90"
              >
                Sign up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
