import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

const EventLatest = ({ events = [] }) => {
  const navigate = useNavigate();
  const [allEvents, setAllEvents] = useState(Array.isArray(events) ? events : []);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEvents, setFilteredEvents] = useState(Array.isArray(events) ? events : []);
  const containerRef = useRef(null);
  const SCROLL_STEP = 300;

  // useEffect(() => {
  //   getEvents();
  // }, []);

  // async function getEvents() {
  //   try {
  //     const response = await axios.get('/api/events')
  //     setAllEvents(response.data)
  //     setEvents(response.data)
  //   } catch (error) {
  //     console.error('Error fetching events:', error)
  //   }
  // }

  // Helper: format one date as "28 Nov 25"
  function formatSingleDate(dateString) {
    const d = new Date(dateString)
    if (isNaN(d.getTime())) return ''

    const day = d.getDate()
    const month = d.toLocaleString('en-US', { month: 'short' })
    const year = d.getFullYear()
    return `${day} ${month} ${year}`
  }

  // Final display:
  // - Single day: "28 Nov 25"
  // - Multi day : "28 Nov - 1 Dec 25"
  function formatDate(date_time, end_date_time) {
    const start = new Date(date_time)
    const end = end_date_time ? new Date(end_date_time) : null

    // If start invalid → nothing
    if (isNaN(start.getTime())) return ''

    // If no end date or invalid end → treat as single day
    if (!end || isNaN(end.getTime())) {
      return formatSingleDate(date_time)
    }

    // Same calendar day → single day
    if (start.toDateString() === end.toDateString()) {
      return formatSingleDate(date_time)
    }

    // Multi-day format: "28 Nov - 1 Dec 25"
    const sDay = start.getDate()
    const sMonth = start.toLocaleString('en-US', { month: 'short' })
    const eDay = end.getDate()
    const eMonth = end.toLocaleString('en-US', { month: 'short' })
    const eYear = end.getFullYear()

    return `${sDay} ${sMonth} - ${eDay} ${eMonth}`
  }

  // Keep internal allEvents & filteredEvents in sync when parent events change
  useEffect(() => {
    if (Array.isArray(events)) {
      setAllEvents(events);
      // Re-derive filtered list on external update
      if (searchTerm.trim()) {
        const term = searchTerm.trim().toLowerCase();
        setFilteredEvents(
          events.filter(e =>
            e.title?.toLowerCase().includes(term) ||
            e.shortdescription?.toLowerCase().includes(term)
          )
        );
      } else {
        setFilteredEvents(events);
      }
    }
  }, [events]);

  // Search & filter logic: local only
  useEffect(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      setFilteredEvents(allEvents);
      return;
    }
    setFilteredEvents(
      allEvents.filter(e =>
        e.title?.toLowerCase().includes(term) ||
        e.shortdescription?.toLowerCase().includes(term)
      )
    );
  }, [searchTerm, allEvents]);

  const handleScroll = (dir) => {
    if (!containerRef.current) return;
    const scrollAmount = dir === 'next' ? SCROLL_STEP : -SCROLL_STEP;
    containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <div className="p-4 sm:p-8 mt-5">
      {/* Header: Title, Search, View All + Buttons */}
      <div className="flex flex-col gap-4 mb-6">
        {/* Mobile: Stack everything vertically */}
        <div className="flex flex-col gap-2 sm:hidden">
          <h1 className="text-2xl font-extrabold text-gray-800">Latest Events</h1>
          <div className="relative w-full my-3">
            <input
              type="text"
              placeholder="Search events..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-peskon-primary focus:border-peskon-primary transition duration-150"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          </div>
          <div className="flex items-center justify-between">
            <Link to="/all-events" className="text-black font-semibold">View All</Link>
            <div className="flex gap-2">
              <button
                onClick={() => handleScroll('prev')}
                className="bg-black/30 text-white p-1 px-1.5 rounded-full hover:bg-black/40 transition"  // Smaller buttons on mobile
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              <button
                onClick={() => handleScroll('next')}
                className="bg-black/30 text-white p-1 px-1.5 rounded-full hover:bg-black/40 transition"
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Tablet and Desktop: Horizontal layout */}
        <div className="hidden sm:flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Left: Title + Search */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 w-full md:w-auto flex-1">
            <h1 className="text-2xl md:text-[1.7rem] font-extrabold text-gray-800 whitespace-nowrap">Latest Events</h1>
            <div>
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search events..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-peskon-primary focus:border-peskon-primary transition duration-150"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              </div>
            </div>

          </div>

          {/* Right: View All + Carousel Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto justify-end">
            <Link to="/all-events" className="text-black font-semibold whitespace-nowrap">View All</Link>
            <div className="flex gap-2">
              <button
                onClick={() => handleScroll('prev')}
                className="bg-black/30 text-white p-2 px-2.5 rounded-full hover:bg-black/60 hover:cursor-pointer transition"
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              <button
                onClick={() => handleScroll('next')}
                className="bg-black/30 text-white p-2 px-2.5 rounded-full hover:bg-black/40 hover:cursor-pointer transition"
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Event Slider */}
      <div ref={containerRef} className="flex overflow-x-scroll snap-x snap-mandatory space-x-6 pb-4 no-scrollbar scroll-smooth">
        {(Array.isArray(filteredEvents) && filteredEvents.length > 0) ? (
          filteredEvents.map((event, index) => (
            <NavLink
              to={`/eventdetails/${event.id}`}
              key={index}
              className={`shrink-0 snap-start block md:w-80 w-56 sm:rounded-2xl rounded-xl shadow-[3px_4px_20px_0_rgba(0,0,0,0.10)] bg-white overflow-hidden`}
            >
              <img
                src={event.poster_url}
                alt={event.title}
                className="w-full h-auto "
              />
              <hr className='text-gray-200' />
              <div className="flex flex-col sm:gap-2 gap-3 px-3 mt-3 md:mt-5 pb-4">
                <p className="sm:text-[1rem] text-[0.8rem] w-fit rounded-3xl bg-peskon-accent/50 shadow-[2px_2px_5px_0_rgba(0,0,0,0.05)] sm:px-6 px-4 py-[0.35rem] text-gray-600 font-semibold">
                  {formatDate(event.date_time, event.end_date_time)}
                </p>
                <p className="sm:text-[1.1rem] text-[0.9rem] sm:m-2 pl-2 text-black font-bold">
                  {event.title}
                </p>
              </div>
            </NavLink>
          ))
        ) : (
          <p className="text-center w-full p-10 text-gray-500">No events found for "{searchTerm}"</p>
        )}
      </div>
    </div>
  );
};

export default EventLatest;
