import React, { useState, useContext } from 'react';
import { createNote } from '../api';
import { AuthContext } from '../contexts/AuthContext';

const NoteForm = ({ onCreate, notesCount }) => {
  const { auth } = useContext(AuthContext);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Determine if user is member on free tenant and reached note limit
  const isFreeMemberAtLimit =
    auth.role === 'member' && auth.tenant?.subscription === 'free' && notesCount >= 3;

  const handleSubmit = async e => {
    e.preventDefault();
    if (isFreeMemberAtLimit) {
      setError('Note limit reached. Please upgrade your plan.');
      return;
    }
    setIsSaving(true);
    setError('');
    try {
      await createNote(auth.token, { title, content });
      setTitle('');
      setContent('');
      setIsSaving(false);
      onCreate();
    } catch (e) {
      setError(e.message || 'Failed to create note');
      setIsSaving(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-white px-6 py-12 overflow-hidden">
      {/* Abstract background shapes */}
      <div className="absolute top-[18%] left-0 w-[350px] h-[350px] bg-sky-300 rounded-full mix-blend-multiply filter blur-xl opacity-80 animate-blob"></div>
      <div className="absolute top-[12%] right-[30%] w-[350px] h-[350px] bg-sky-300 rounded-full mix-blend-multiply filter blur-md opacity-65 animate-blob animation-delay-1000"></div>
      <div className="absolute top-[30%] right-0 w-[400px] h-[400px] bg-cyan-300 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-10 left-[30%] w-[300px] h-[300px] bg-blue-400 rounded-full mix-blend-multiply filter blur-lg opacity-85 animate-blob animation-delay-4000"></div>

      {/* Form card */}
      <form
        onSubmit={handleSubmit}
        className="relative bg-white p-10 rounded-3xl max-w-lg w-full z-10 shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
      >
        <h3 className="text-3xl font-bold mb-8 text-gray-900 text-center tracking-wide">
          Create Note
        </h3>

        {error && (
          <p className="mb-6 text-center text-red-600 font-semibold animate-pulse">
            {error}
          </p>
        )}

        {/* Floating label input */}
        <div className="relative mb-8">
          <input
            id="title"
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            placeholder=" " // Important
            disabled={isFreeMemberAtLimit || isSaving}
            className="peer block w-full appearance-none border-b-2 border-gray-300 bg-transparent py-3 px-0 text-lg text-gray-900 focus:border-sky-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100"
          />
          <label
            htmlFor="title"
            className="absolute left-0 top-5 text-gray-400 text-base transition-all pointer-events-none peer-focus:top-1 peer-focus:text-sky-600 peer-focus:text-sm"
          >
            Title
          </label>
          <span
            className="absolute bottom-0 left-0 h-1 w-0 bg-sky-500 transition-all peer-focus:w-full"
          ></span>
        </div>

        {/* Floating label textarea */}
        <div className="relative mb-10">
          <textarea
            id="content"
            rows="5"
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder=" " // Important
            disabled={isFreeMemberAtLimit || isSaving}
            className="peer block w-full appearance-none border-b-2 border-gray-300 bg-transparent py-3 px-0 text-lg text-gray-900 resize-y focus:border-sky-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100"
            required
          />
          <label
            htmlFor="content"
            className="absolute left-0 top-5 text-gray-400 text-base transition-all pointer-events-none peer-focus:top-1 peer-focus:text-sky-600 peer-focus:text-sm"
          >
            Content
          </label>
          <span
            className="absolute bottom-0 left-0 h-1 w-0 bg-sky-500 transition-all peer-focus:w-full"
          ></span>
        </div>

        <button
          type="submit"
          disabled={isFreeMemberAtLimit || isSaving}
          className="w-full py-4 rounded-xl bg-sky-600 text-white font-semibold text-lg hover:bg-sky-700 transition duration-300 shadow-lg select-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? 'Saving...' : 'Add Note'}
        </button>
        {isFreeMemberAtLimit && (
          <p className="mt-4 text-center text-red-600 font-semibold">
            Upgrade to Pro plan to add more notes.
          </p>
        )}
      </form>

      {/* Blob animation keyframes */}
      <style>{`
        /* Blob animations */
        @keyframes blob {
          0%, 100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }

        /* Keep label floated when input/textarea have content */
        input:not(:placeholder-shown) + label,
        textarea:not(:placeholder-shown) + label {
          top: 0.05rem;             /* float label up */
          font-size: 0.875rem;      /* smaller font */
          color: #0ea5e9;           /* sky-500 color */
        }
      `}</style>
    </div>
  );
};

export default NoteForm;
