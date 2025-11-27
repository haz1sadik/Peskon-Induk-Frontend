import React, { useEffect, useState, useRef } from 'react'
import axios from '../../axios'

import arrow from '../../assets/arrow.svg'
import DOMPurify from 'dompurify';
import { useParams } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

const EventCard = () => {

  const [events, setEvents] = useState({})
  const { eventId } = useParams();
  const firstLoadRef = useRef(true);


  useEffect(() => {
    getEvents();
  }, []);

  useEffect(() => {
    if (!eventId) return; // don't fetch when undefined

    window.scrollTo({ top: 0, behavior: 'smooth' });

    // optionally clear previous details while loading
    setEvents({});
    getEvents();
  }, [eventId]);

  async function getEvents() {
    if (!eventId) return;
    try {
      const response = await axios.get(`/api/events/${eventId}`)
      console.log(response.data)
      setEvents(response.data)
    } catch (error) {
      console.error('Error fetching events:', error)

    }
  }

  // Normalize anchors from Quill content (ensure absolute https links, strip hidden chars)
  function normalizeAnchors(html) {
    if (!html) return '';

    try {
      const parser = new DOMParser();
      // Wrap in a container to safely read back innerHTML
      const doc = parser.parseFromString(`<div>${html}</div>`, 'text/html');
      const root = doc.body.firstChild || doc.body;
      const anchors = root.querySelectorAll ? root.querySelectorAll('a[href]') : [];

      anchors.forEach((a) => {
        let href = a.getAttribute('href') || '';
        href = href.trim();
        // Remove zero-width and directionality marks that sometimes appear when pasting
        href = href.replace(/[\u200B-\u200D\uFEFF\u200E\u200F]/g, '');

        // Allow common safe schemes
        const hasHttp = /^https?:\/\//i.test(href);
        const isProtocolRelative = /^\/\//.test(href);
        const isMailOrTel = /^(mailto:|tel:)/i.test(href);
        const hasOtherScheme = /^[a-zA-Z][a-zA-Z0-9+\-.]*:/.test(href);

        if (!hasHttp && !isMailOrTel) {
          if (isProtocolRelative) {
            href = 'https:' + href;
          } else if (!hasOtherScheme) {
            // Looks like a domain? Add https://
            if (/^www\./i.test(href) || /^[\w.-]+\.[a-z]{2,}(\/|$)/i.test(href)) {
              href = 'https://' + href;
            }
            // else leave relative links as-is
          }
        }

        a.setAttribute('href', href);

        // Always open in new tab safely
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener noreferrer');
      });

      return root.innerHTML;
    } catch (e) {
      // Fallback to original content on parser error
      return html;
    }
  }

  // First normalize URLs, then sanitize for safety
  // Explicitly allow 'target' so links can open in new tabs
  const clean = DOMPurify.sanitize(
    normalizeAnchors(events.description || ''),
    { ADD_ATTR: ['target', 'rel'] }
  );

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

    return `${sDay} ${sMonth} - ${eDay} ${eMonth} ${eYear}`
  }

  function extractTime(dateString) {
    if (!dateString) return '';

    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '';

    const hours = d.getHours();
    const minutes = d.getMinutes();

    return (hours === 0 && minutes === 0)
      ? ''
      : d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }

  const startTime = extractTime(events.date_time);
  const endTime = extractTime(events.end_date_time);


  return (
    <>
      {/* Outer container – center everything */}
      <div className="w-full flex justify-center md:py-12 py-6 px-4 md:px-8">
        <div className="w-full max-w-6xl mx-auto">
          <div className="flex gap-4 my-4">
            <NavLink to="/">
              <p className="ml-2 md:ml-7 text-gray-500 sm:text-[1rem] text-[0.8rem]">Home </p>
            </NavLink>

            <img src={arrow} alt="arrow" className="sm:h-4 h-3 sm:mt-1 mt-[0.3rem]" />
            <p className="sm:text-[1rem] text-[0.8rem]">{events.title}</p>
          </div>

          {/* Flex layout: column on mobile, centered side-by-side on md+ */}
          <div className="flex flex-col md:flex-row justify-center items-center md:items-start w-full">

            {/* Image column – fixed width on md+, centered */}
            <div className="w-full md:w-[360px] lg:w-[400px]">
              <img
                src={events.poster_url}
                alt="rumahSeram"
                className="
                  w-full
                  h-auto
                  object-cover
                  rounded-2xl
                  shadow-[3px_4px_20px_0_rgba(0,0,0,0.10)]
                "
              />
            </div>

            {/* Details column – takes remaining width, grows vertically, centered */}
            <div className="flex-1 w-full mt-5 md:mt-0 md:ml-6 md:max-w-lg">
              <div
                className="
                  shadow-[3px_4px_20px_0_rgba(0,0,0,0.10)]
                  rounded-2xl
                  p-8
                  w-full
                
                "
              >

                <div className='flex flex-col lg:gap-6 gap-3 w-full lg:my-2 my-1'>
                  <div>
                    <p className='whitespace-pre-line md:text-[1.5rem] font-bold text-[1.5rem]'>{events.title}</p>
                    <hr className="h-px mt-5 bg-neutral-quaternary text-gray-300"></hr>
                  </div>

                  <div>
                    <h1 className='text-gray-500 md:text-[0.9rem] text-[0.9rem] mb-1'>Date</h1>
                    <p className='whitespace-pre-line md:text-[1rem] text-[1rem]'>{formatDate(events.date_time, events.end_date_time)}</p>
                  </div>

                  {startTime || endTime ? (
                    <div>
                      <h1 className="text-gray-500 md:text-[0.9rem] text-[0.9rem] mb-1">
                        Time
                      </h1>

                      <p className="md:text-[1rem] text-[1rem]">
                        {
                          startTime
                            ? endTime
                              ? `${startTime} – ${endTime}`    // both exist
                              : startTime                      // only start
                            : endTime                          // only end
                        }
                      </p>
                    </div>
                  ) : null}

                  <div>
                    <h1 className='text-gray-500 md:text-[0.9rem] text-[0.9rem] mb-1'>Location</h1>
                    <p className='whitespace-pre-line md:text-[1rem] text-[1rem]'>{events.location}</p>
                  </div>

                  <div>
                    <h1 className='text-gray-500 md:text-[0.9rem] text-[0.9rem] mb-1'>Caption</h1>
                    <div
                      className='caption-content whitespace-pre-line wrap-break-word md:text-[1rem] text-[1rem]'
                      style={{ overflowWrap: 'anywhere' }}
                      dangerouslySetInnerHTML={{ __html: clean }}
                    />
                  </div>

                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}

export default EventCard
