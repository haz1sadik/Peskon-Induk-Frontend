import React from 'react';
import PrimaryButton from './button/PrimaryButton.jsx'
const AnnouncementModal = ({ announcements = [], onClose }) => {
  if (!announcements.length) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl mx-auto bg-white rounded-4xl shadow-2xl border border-neutral-200 overflow-hidden animate-fadeIn">
        <button
          type="button"
          aria-label="Close announcements"
          onClick={onClose}
          className="absolute top-3 right-3 inline-flex items-center justify-center w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-peskon-primary hover:cursor-pointer"
        >
          <span className="text-xl leading-none">×</span>
        </button>
        <div className="px-6 pt-10 pb-6 max-h-[70vh] overflow-y-auto">
          <h2 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-peskon-primary to-purple-600 bg-clip-text text-transparent">
            Announcements
          </h2>
          <ul className="space-y-5">
            {announcements.map((a) => (
              <li
                key={a.id}
                className="group rounded-2xl border border-neutral-200 p-5 hover:border-indigo-500/70 transition-colors bg-neutral-100 hover:bg-white"
              >
                <h3 className="text-lg font-semibold flex items-c gap-2">
                  <span className="inline-block w-2 h-2 mt-2 rounded-full bg-peskon-primary group-hover:scale-125 transition-transform" />
                  <span>{a.title}</span>
                </h3>
                <div
                  className="mt-2 ml-4 text-sm leading-relaxed text-neutral-700 whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: a.content }}
                />
              </li>
            ))}
          </ul>
        </div>
        <div className="px-6 pb-6">
          <PrimaryButton onClick={onClose} text='Close'/>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementModal;