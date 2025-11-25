import React, { useEffect, useState } from 'react'
import axios from '../../axios'
import { NavLink, useNavigate } from 'react-router-dom';

const AllEvents = () => {
  const navigate = useNavigate();

  const [events, setEvents] = useState([])

  useEffect(() => {
    getEvents();
  }, []);

  async function getEvents() {

    try {
      const response = await axios.get('/api/events')
      setEvents(response.data)
    } catch (error) {
      console.error('Error fetching events:', error)

    }
  }

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
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="md:text-3xl text-2xl font-extrabold text-center mb-8">All Events</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {events.map((event) => (
          <NavLink
            to={`/eventdetails/${event.id}`}
            key={event.id}
            className="block rounded-xl shadow-[3px_4px_20px_0_rgba(0,0,0,0.10)] bg-white overflow-hidden hover:shadow-lg transition-shadow"
          >
            <img
              src={event.poster_url}
              alt={event.title || 'Event poster'}
              className="w-full h-auto"
              loading="lazy"
            />
            <hr className='text-gray-200' />
            <div className="flex flex-col sm:gap-2 gap-3 px-3 mt-3 md:mt-5 pb-4">
              <p className="sm:text-[1rem] text-[0.8rem] w-fit rounded-3xl bg-peskon-accent shadow-[2px_2px_5px_0_rgba(0,0,0,0.05)] sm:px-6 px-4 py-[0.35rem] text-gray-600 font-semibold">
                {formatDate(event.date_time, event.end_date_time)}
              </p>
              <p className="sm:text-[1.1rem] text-[0.9rem] sm:m-2 pl-2 text-black font-bold truncate">
                {event.title}
              </p>
            </div>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default AllEvents;
