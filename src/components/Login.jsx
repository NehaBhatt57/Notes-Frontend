import React, { useState, useContext, useEffect } from 'react';
import { login } from '../api';
import { AuthContext } from '../contexts/AuthContext';

const quotes = [
  "Welcome Back!",
  "Your notes. Anytime. Anywhere.",
  "Stay organized. Stay productive.",
  "Collaborate with your team effortlessly.",
  "Secure. Fast. Simple.",
];

const Login = () => {
  const { setAuth } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex(prev => (prev + 1) % quotes.length);
    }, 4000); // rotate every 4 seconds
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const data = await login(email, password);
      setAuth(data);
      setError('');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gradient-to-b from-sky-400 to-white px-6 py-16 md:py-0">
      
      {/* Left rotating quote panel */}
      <div className="md:w-1/2 mb-12 md:mb-0 text-center md:text-left px-8 select-none">
        <h1 className="text-5xl font-extrabold text-white drop-shadow-lg min-h-[6rem] flex items-center justify-center">
          <span
            key={quoteIndex}
            className="transform transition duration-1000 ease-in-out animate-fade-in opacity-100"
          >
            {quotes[quoteIndex]}
          </span>
        </h1>
      </div>

      {/* Login form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white max-w-md w-full p-14 rounded-[2rem] shadow-2xl border border-gray-200"
      >
        <h2 className="text-4xl font-extrabold mb-12 text-center text-gray-900 tracking-tight select-none">
          Sign In
        </h2>

        {error && (
          <p className="mb-6 text-center text-red-600 font-semibold animate-pulse">
            {error}
          </p>
        )}

        <label className="block mb-3 text-gray-700 font-medium tracking-wide" htmlFor="email">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="w-full px-6 py-4 mb-10 rounded-xl border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-sky-300 focus:border-transparent transition duration-300 ease-in-out shadow-sm"
        />

        <label className="block mb-3 text-gray-700 font-medium tracking-wide" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="w-full px-6 py-4 mb-12 rounded-xl border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-sky-300 focus:border-transparent transition duration-300 ease-in-out shadow-sm"
        />

        <button
          type="submit"
          className="w-full py-5 rounded-xl bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white font-semibold text-lg tracking-wide shadow-lg transition duration-300 select-none"
        >
          Log In
        </button>
      </form>

      {/* Tailwind custom fade-in animation */}
      <style>{`
        @keyframes fade-in {
          0% {opacity: 0; transform: translateY(10px);}
          100% {opacity: 1; transform: translateY(0);}
        }
        .animate-fade-in {
          animation: fade-in 1s ease forwards;
        }
      `}</style>
    </div>
  );
};

export default Login;










































// import React, { useState, useContext } from 'react';
// import { login } from '../api';
// import { AuthContext } from '../contexts/AuthContext';

// const Login = () => {
//   const { setAuth } = useContext(AuthContext);
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');

//   const handleSubmit = async e => {
//     e.preventDefault();
//     try {
//       const data = await login(email, password);
//       setAuth(data);
//       setError('');
//     } catch (err) {
//       setError('Invalid credentials');
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-400 to-white px-6">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white max-w-md w-full p-14 rounded-[2rem] shadow-2xl border border-gray-200"
//       >
//         <h2 className="text-4xl font-extrabold mb-12 text-center text-gray-900 tracking-tight select-none">
//           Sign In
//         </h2>

//         {error && (
//           <p className="mb-6 text-center text-red-600 font-semibold animate-pulse">
//             {error}
//           </p>
//         )}

//         <label className="block mb-3 text-gray-700 font-medium tracking-wide" htmlFor="email">
//           Email Address
//         </label>
//         <input
//           id="email"
//           type="email"
//           placeholder="you@example.com"
//           value={email}
//           onChange={e => setEmail(e.target.value)}
//           required
//           className="w-full px-6 py-4 mb-10 rounded-xl border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-sky-300 focus:border-transparent transition duration-300 ease-in-out shadow-sm"
//         />

//         <label className="block mb-3 text-gray-700 font-medium tracking-wide" htmlFor="password">
//           Password
//         </label>
//         <input
//           id="password"
//           type="password"
//           placeholder="••••••••"
//           value={password}
//           onChange={e => setPassword(e.target.value)}
//           required
//           className="w-full px-6 py-4 mb-12 rounded-xl border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-sky-300 focus:border-transparent transition duration-300 ease-in-out shadow-sm"
//         />

//         <button
//           type="submit"
//           className="w-full py-5 rounded-xl bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white font-semibold text-lg tracking-wide shadow-lg transition duration-300 select-none"
//         >
//           Log In
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Login;
