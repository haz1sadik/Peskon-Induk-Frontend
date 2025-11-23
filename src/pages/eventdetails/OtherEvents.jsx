import React, { useEffect, useState } from 'react'
import axios from '../../axios'
import { NavLink, useNavigate } from 'react-router-dom';


const OtherEvents = () => {

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

  // ---------- Sort earliest and take first 3 ----------
  const earliestEvents = [...events]
    .sort((a, b) => new Date(a.date_time) - new Date(b.date_time))
    .slice(0, 3);


  return (
    <>


      <div className="w-screen flex justify-center ">
        <div className="w-[90%] max-w-210 ">

          <h1 className="text-2xl my-3 pl-2">Other Events</h1>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 sm:gap-7 gap-2 mb-7 ">
            {earliestEvents.map((event, index) => (
              <NavLink
                to={`/eventdetails/${event.id}`}
                key={index}
                className={`block sm:rounded-2xl rounded-xl shadow-[3px_4px_20px_0_rgba(0,0,0,0.10)] bg-white overflow-hidden ${index === 2 ? "hidden sm:block" : ""}`}
              >
                <img
                  src={event.poster_url}
                  alt={event.title}
                  className="w-full h-auto "
                />

                <div className="flex flex-col sm:gap-3 gap-2 px-5 mt-7 pb-9">
                  <p className="sm:text-[1rem] text-[0.7rem] w-fit rounded-3xl bg-[#FFF9F9] shadow-[2px_2px_5px_0_rgba(0,0,0,0.25)] sm:px-[1.5rem] px-[1rem] py-[0.35rem] text-[#6B6B6B]">
                    {formatDate(event.date_time, event.end_date_time)}
                  </p>
                  <p className="sm:text-[1.1rem] text-[0.9rem] sm:m-2 text-[#403E3E]">
                    {event.title}
                  </p>
                </div>
              </NavLink>
            ))}
          </div>
        </div>
      </div>

    </>
  )
}

export default OtherEvents