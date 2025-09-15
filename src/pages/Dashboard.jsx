import { useContext, useState, useEffect } from 'react';
import NotesList from '../components/NotesList';
import NoteForm from '../components/NoteForm';
import InviteUsersForm from '../components/InviteUsersForm';
import { AuthContext } from '../contexts/AuthContext';
import { fetchNotes, upgradeTenant } from '../api';

const Dashboard = () => {
  const { auth, logout, refreshAuth } = useContext(AuthContext);
  const [notesCount, setNotesCount] = useState(0);
  const [notesRefreshKey, setNotesRefreshKey] = useState(0);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [upgradeError, setUpgradeError] = useState('');
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  const loadNotesCount = async () => {
    try {
      const notes = await fetchNotes(auth.token);
      setNotesCount(notes.length);
    } catch {
      setNotesCount(0);
    }
  };

  useEffect(() => {
    loadNotesCount();
  }, [notesRefreshKey]);

  const onNoteCreated = () => setNotesRefreshKey(k => k + 1);

  // Show upgrade banner only to members of free tenants who hit note limits
  const showUpgradeBanner =
    auth?.tenant?.subscription === 'free' &&
    auth?.role === 'member' &&
    notesCount >= 3;

  // Admin only
  const showAdminControls = auth?.role === 'admin';

  const onUpgrade = async () => {
    setIsUpgrading(true);
    setUpgradeError('');
    try {
      await upgradeTenant(auth.token, auth.tenant);
      await refreshAuth(); // reload updated subscription info
      setIsUpgrading(false);
      loadNotesCount();      
    } catch (e) {
      setUpgradeError(e.message || 'Upgrade failed');
      setIsUpgrading(false);
    }
  };

  return (
    <div className="mx-auto py-10 px-4">
      <div className="flex items-center justify-between mt-8 mb-6">
        <h1 className="text-5xl font-extrabold text-gray-900 tracking-wide select-none px-8">
          Welcome, <span className="text-sky-400">{auth.email}</span>
        </h1>
        <button
          onClick={logout}
          className="px-5 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-red-400 select-none"
          aria-label="Logout"
          title="Logout"
        >
          Logout
        </button>
      </div>

      {/* Admin Controls */}
      {showAdminControls && (
        <>
          <div className="w-full flex justify-between mb-6 space-x-6 mx-auto px-8">
            <button
              onClick={onUpgrade}
              disabled={isUpgrading || auth?.subscription === 'pro'}
              className={
                "px-6 py-3 rounded-lg font-semibold transition shadow-md " +
                (auth?.subscription === 'pro'
                  ? "bg-gray-300 text-green-600 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700")
              }
            >
              {auth?.subscription === 'pro'
                ? 'Pro Version Activated'
                : isUpgrading
                ? 'Upgrading...'
                : 'Upgrade Tenant to Pro'}
            </button>
            <button
              onClick={() => setIsInviteOpen(true)}
              className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow-md"
            >
              Invite User
            </button>
          </div>
          {upgradeError && (
            <p className="text-center text-sm text-red-600 font-medium mb-6">
              {upgradeError}
            </p>
          )}
          {isInviteOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              onClick={() => setIsInviteOpen(false)}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-xl p-8 max-w-md w-full shadow-lg relative"
              >
                <button
                  onClick={() => setIsInviteOpen(false)}
                  className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-2xl font-bold"
                  aria-label="Close invite form"
                >
                  &times;
                </button>
                <InviteUsersForm onClose={() => setIsInviteOpen(false)} />
              </div>
            </div>
          )}
        </>
      )}

      <NoteForm onCreate={onNoteCreated} notesCount={notesCount} />
      <NotesList key={notesRefreshKey} notesCount={notesCount} />
    </div>
  );
};

export default Dashboard;
