import { useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';

const Signin = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/signin', form);
      localStorage.setItem('token', res.data.token); // assuming token is returned
      navigate('/profile');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-md">
      <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-black">
        Sign In
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="input input-bordered w-full focus:ring-yellow-500 focus:border-yellow-500"
          name="email"
          placeholder="Email"
          type="email"
          onChange={handleChange}
        />
        <input
          className="input input-bordered w-full focus:ring-yellow-500 focus:border-yellow-500"
          name="password"
          placeholder="Password"
          type="password"
          onChange={handleChange}
        />
        <button className="btn btn-primary w-full bg-gradient-to-r from-yellow-400 via-orange-500 to-black text-white hover:bg-yellow-500">
          Sign In
        </button>
      </form>
    </div>
  );
};

export default Signin;
