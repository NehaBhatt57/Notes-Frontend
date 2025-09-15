import React, { useEffect, useState, useContext } from 'react';
import { fetchNotes, deleteNote, editNote } from '../api';
import { AuthContext } from '../contexts/AuthContext';

const noteEmojis = ['📝', '📒', '✏️', '📋', '🗒️'];

const NotesList = ({ notesCount }) => {
  const { auth } = useContext(AuthContext);
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState('');
  const [expandedNoteId, setExpandedNoteId] = useState(null);
  const [editingNote, setEditingNote] = useState(null);

  const loadNotes = async () => {
    try {
      const data = await fetchNotes(auth.token);
      setNotes(data);
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const handleDelete = async id => {
    try {
      await deleteNote(auth.token, id);
      setNotes(prevNotes => prevNotes.filter(note => note._id !== id));
      if (expandedNoteId === id) setExpandedNoteId(null);
      if (editingNote && editingNote._id === id) setEditingNote(null);
    } catch (e) {
      setError(e.message);
    }
  };

  const toggleExpand = id => {
    setExpandedNoteId(prev => (prev === id ? null : id));
  };

  const handleEditClick = note => {
    setEditingNote(note);
    setExpandedNoteId(note._id);
  };

  // For edit modal form inputs
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editError, setEditError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (editingNote) {
      setEditTitle(editingNote.title);
      setEditContent(editingNote.content);
      setEditError('');
    }
  }, [editingNote]);

  const canEditDelete = auth.role === 'admin' || auth.role === 'member';

  const submitEdit = async e => {
    e.preventDefault();
    setIsSaving(true);
    setEditError('');
    try {
      await editNote(auth.token, editingNote._id, { title: editTitle, content: editContent });
      setEditingNote(null);
      setIsSaving(false);
      loadNotes();
    } catch (e) {
      setEditError(e.message || 'Failed to update note');
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <h2 className="relative text-5xl font-extrabold text-center text-sky-700 mb-12 tracking-tight rounded-3xl border-t-4 border-b-4 border-t-orange-300 border-b-orange-300 pt-6 pb-6 select-none">
        Your Notes
        <span className="absolute top-0 left-1/4 right-1/4 h-1 bg-orange-300 rounded-t-full shadow-md"></span>
        <span className="absolute bottom-0 left-1/4 right-1/4 h-1 bg-orange-300 rounded-b-full shadow-md"></span>
      </h2>

      {error && <p className="mb-8 text-center text-red-600 font-semibold">{error}</p>}

      {notes.length === 0 ? (
        <p className="text-center text-gray-500 italic text-lg font-light">You have no notes yet. Start by adding a new note!</p>
      ) : (
        <div className="grid gap-28 py-8 sm:grid-cols-1 lg:grid-cols-2">
          {notes.map((note, idx) => {
            const isExpanded = expandedNoteId === note._id;
            const emoji = noteEmojis[idx % noteEmojis.length];
            return (
              <div
                key={note._id}
                onClick={() => toggleExpand(note._id)}
                className={`relative bg-gradient-to-tr ${
                  isExpanded
                    ? 'from-sky-100 via-sky-50 to-white text-gray-800 rounded-2xl p-6 flex flex-col cursor-pointer transition-all duration-500 ease-in-out shadow-2xl'
                    : 'from-white to-gray-100 text-gray-800 rounded-2xl p-6 flex flex-col cursor-pointer transition-all duration-500 ease-in-out hover:from-sky-100 hover:to-white hover:shadow-xl'
                }`}
                style={{
                  boxShadow: isExpanded
                    ? '0 20px 50px rgba(0, 0, 0, 0.7)'
                    : '0 12px 30px rgba(0, 0, 0, 0.4)',
                }}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold truncate flex items-center">
                    <span className="mr-3 text-base font-mono text-gray-900 select-none">{idx + 1}.</span>
                    <span className="mr-3 text-3xl select-none">{emoji}</span>
                    {note.title}
                  </h3>
                  <div className="flex space-x-3 ml-4">
                    <button
                      disabled={!canEditDelete}
                      onClick={e => {
                        e.stopPropagation();
                        handleEditClick(note);
                      }}
                      aria-label={`Edit note titled ${note.title}`}
                      className={`inline-flex items-center justify-center rounded-full p-2 shadow-lg bg-blue-600 hover:bg-blue-700 text-white transition-transform duration-200 transform-gpu hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-300 ${
                        !canEditDelete ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5h6M7 7v11a2 2 0 002 2h6a2 2 0 002-2V7h2" />
                      </svg>
                    </button>
                    <button
                      disabled={!canEditDelete}
                      onClick={e => {
                        e.stopPropagation();
                        handleDelete(note._id);
                      }}
                      aria-label={`Delete note titled ${note.title}`}
                      className={`inline-flex items-center justify-center rounded-full p-2 shadow-lg transition-transform duration-200 ${
                        isExpanded ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-red-600 hover:bg-red-700 text-white'
                      } transform-gpu hover:scale-110 focus:outline-none focus:ring-4 focus:ring-red-300 ${
                        !canEditDelete ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 0a1 1 0 00-1 1v1h6V4a1 1 0 00-1-1m-4 0h4" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div
                  className={`mt-4 overflow-hidden transition-max-height duration-500 ease-in-out ${isExpanded ? 'max-h-[500px]' : 'max-h-0'}`}
                >
                  <p className={`whitespace-pre-wrap ${isExpanded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
                    {note.content}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Modal */}
      {editingNote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <form
            onSubmit={submitEdit}
            className="bg-white rounded-xl p-8 max-w-lg w-full relative shadow-lg"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold mb-4">Edit Note</h3>
            {editError && <p className="mb-4 text-red-600 font-semibold">{editError}</p>}

            <label className="block mb-2 font-semibold">Title</label>
            <input
              type="text"
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
              className="mb-4 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
            />

            <label className="block mb-2 font-semibold">Content</label>
            <textarea
              rows="5"
              value={editContent}
              onChange={e => setEditContent(e.target.value)}
              className="mb-6 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
            />

            <div className="flex justify-end space-x-4">
              <button type="button" onClick={() => setEditingNote(null)} className="px-5 py-2 rounded bg-gray-300 hover:bg-gray-400 transition">
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2 rounded bg-sky-600 text-white font-semibold hover:bg-sky-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default NotesList;
