import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import event_list from "./EventList";

const EventCard = ({ event, onCardClick }) => {
  return (
    <div
      className="flex-shrink-0 w-[80vw] sm:w-72 rounded-2xl shadow-xl overflow-hidden cursor-pointer transition transform hover:scale-[1.02] hover:shadow-2xl"
      onClick={() => onCardClick?.(event)}
    >
      {/* Poster */}
      <img
        src={event.poster}
        alt={event.title}
        className="w-full h-auto object-contain"
      />

      {/* Text below */}
      <div className="bg-white px-4 py-2 flex flex-col">
        <p className="text-xs font-extrabold text-black">{event.date_time}</p>
        <p className="text-sm font-semibold text-gray-800 line-clamp-1">{event.title}</p>
        <p className="text-xs text-gray-500 line-clamp-1">
          {event.shortdescription.split(" ").slice(0, 5).join(" ") + "..."}
        </p>
      </div>
    </div>
  );
};

// --- Main Component ---
const EventLatest = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [events, setEvents] = useState([]);  // Start empty, will be set after filtering
  const containerRef = useRef(null);
  const SCROLL_STEP = 300;

  const filterEvents = useCallback((term) => {
    const lower = term.toLowerCase().trim();
    let filtered = event_list.filter(e =>
      e.title.toLowerCase().includes(lower) ||
      e.shortdescription.toLowerCase().includes(lower)
    );

    // Sort by date (newest first) - assumes date_time is a string like "YYYY-MM-DD" or Date object
    filtered = filtered.sort((a, b) => new Date(b.date_time) - new Date(a.date_time));

    // Limit to 6 events
    filtered = filtered.slice(0, 6);

    setEvents(filtered);
  }, []);

  useEffect(() => { filterEvents(searchTerm); }, [searchTerm, filterEvents]);

  const handleScroll = (dir) => {
    if (!containerRef.current) return;
    const scrollAmount = dir === 'next' ? SCROLL_STEP : -SCROLL_STEP;
    containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <div className="p-4 sm:p-8">
      {/* Header: Title, Search, View All + Buttons */}
      <div className="flex flex-col gap-4 mb-6">
        {/* Mobile: Stack everything vertically */}
        <div className="flex flex-col gap-2 sm:hidden">
          <h1 className="text-2xl font-extrabold text-gray-800">Latest Events</h1>
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search events..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          </div>
          <div className="flex items-center justify-between gap-2">
            <Link to="/all-events" className="text-black font-semibold">View All</Link>
            <div className="flex gap-2">
              <button
                onClick={() => handleScroll('prev')}
                className="bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition"  // Smaller buttons on mobile
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              <button
                onClick={() => handleScroll('next')}
                className="bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition"
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Tablet and Desktop: Horizontal layout */}
        <div className="hidden sm:flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Left: Title + Search */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto flex-1">
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800 whitespace-nowrap">Latest Events</h1>
            <div className="relative w-full sm:w-64 flex-1">
              <input
                type="text"
                placeholder="Search events..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
          </div>

          {/* Right: View All + Carousel Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto justify-end">
            <Link to="/all-events" className="text-black font-semibold whitespace-nowrap">View All</Link>
            <div className="flex gap-2">
              <button
                onClick={() => handleScroll('prev')}
                className="bg-black/40 text-white p-3 rounded-full hover:bg-black/60 transition"
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              <button
                onClick={() => handleScroll('next')}
                className="bg-black/40 text-white p-3 rounded-full hover:bg-black/60 transition"
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Event Slider */}
      <div ref={containerRef} className="flex overflow-x-scroll snap-x snap-mandatory space-x-6 pb-4 no-scrollbar">
        {events.length > 0 ? (
          events.map((event, idx) => <EventCard key={event.id} event={event} index={idx} />)
        ) : (
          <p className="text-center w-full p-10 text-gray-500">No events found for "{searchTerm}"</p>
        )}
      </div>
    </div>
  );
};

export default EventLatest;
