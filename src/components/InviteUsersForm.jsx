import { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const InviteUsersForm = () => {
  const { auth } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('member');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [error, setError] = useState('');

  // Replace with your actual invite API call
  const inviteUser = async (token, tenantSlug, email, role) => {
    const res = await fetch(`notes-backend-teal.vercel.app/api/tenants/${tenantSlug}/invite`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ email, role }),
    });
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.message || 'Failed to send invite');
    }
    return res.json();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');
    try {
      await inviteUser(auth.token, auth.tenant.slug, email, role);
      setSuccessMsg(`Invitation sent to ${email}. Now they can log in with the default password "password".`);
      setEmail('');
      setRole('member');
    } catch (err) {
    setError(err.message);
    console.log(err.message);
    
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow my-8">
      <h2 className="text-2xl font-semibold mb-4">Invite User</h2>
      {successMsg && <p className="mb-4 text-green-600">{successMsg}</p>}
      {error && <p className="mb-4 text-red-600">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label className="block mb-2 font-medium" htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
          disabled={loading}
        />
        <label className="block mb-2 font-medium" htmlFor="role">Role</label>
        <select
          id="role"
          value={role}
          onChange={e => setRole(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
          disabled={loading}
        >
          <option value="member">Member</option>
          <option value="admin">Admin</option>
        </select>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded bg-sky-600 text-white font-semibold hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? 'Sending invite...' : 'Send Invite'}
        </button>
      </form>
    </div>
  );
};

export default InviteUsersForm;
