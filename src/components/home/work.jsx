import { useState } from 'react';
import axios from 'axios';

function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? 'login' : 'signup';
    try {
      const res = await axios.post(`http://localhost:5001/api/auth/${endpoint}`, {
        email, password
      });
      alert(res.data.message || 'Success');
    } catch (err) {
      alert(err.response.data.message || 'Error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md max-w-sm mx-auto">
      <h2 className="text-2xl font-bold text-center text-gray-800">{isLogin ? 'Login' : 'Sign Up'}</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
      >
        {isLogin ? 'Login' : 'Sign Up'}
      </button>
      <p
        onClick={() => setIsLogin(!isLogin)}
        className="text-sm text-center text-blue-500 cursor-pointer hover:underline"
      >
        {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
      </p>
    </form>
  );
}

export default AuthForm;
