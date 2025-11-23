import React from "react";
import event_list from "./EventList";

// --- EventCard Component ---
const EventCard = ({ event }) => (
  <div className="w-72 rounded-2xl shadow-xl overflow-hidden cursor-pointer transition transform hover:scale-[1.02] hover:shadow-2xl bg-white flex flex-col">
    {/* Poster */}
    <img
      src={event.poster}
      alt={event.title}
      className="w-full h-auto object-contain"
    />

    {/* Text section */}
    <div className="px-4 py-4 flex flex-col min-h-[100px]">
      <p className="text-xs font-extrabold text-black-600">{event.date_time}</p>
      <p className="text-sm font-semibold text-gray-800 mt-1">{event.title}</p>
      <p className="text-xs text-gray-500 mt-2 overflow-auto break-words">
        {event.fulldescription}
      </p>
    </div>
  </div>
);

// --- AllEvents Component ---
const AllEvents = () => {
  // Split events into rows of 3
  const rows = [];
  for (let i = 0; i < event_list.length; i += 3) {
    rows.push(event_list.slice(i, i + 3));
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-extrabold text-center mb-8">All Events</h1>

      <div className="flex flex-col gap-8">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-6 flex-wrap">
            {row.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllEvents;
