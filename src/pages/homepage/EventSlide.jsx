import { useState, useEffect } from "react";
import api from "../../axios";

// Provide safe defaults so component doesn't crash if parent forgets props
const EventSlide = ({ events = [] }) => {
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // If parent controls data, only set loading false when events arrive
  useEffect(() => {
    // When events first populate, stop loading
    if (Array.isArray(events) && events.length > 0) {
      setLoading(false);
    }
  }, [events]);

  // Only show featured events, keep original order
  const safeEvents = Array.isArray(events) ? events : [];
  const filteredEvents = safeEvents
    .map((event, index) => ({ ...event, originalIndex: index }))
    .filter(event => event.is_featured)
    .sort((a, b) => a.originalIndex - b.originalIndex);


  const nextSlide = () => {
    if (filteredEvents.length > 0) {
      setCurrent((prev) => (prev + 1) % filteredEvents.length);
    }
  };
  const prevSlide = () => {
    if (filteredEvents.length > 0) {
      setCurrent((prev) => (prev - 1 + filteredEvents.length) % filteredEvents.length);
    }
  };

  // Preload poster images for background
  useEffect(() => {
    filteredEvents.forEach(event => {
      const img = new Image();
      img.src = event.poster_url;
    });
  }, [filteredEvents]);

  if (loading) {
    return (
      <section className="relative w-full max-w-6xl mx-auto mt-6 min-h-[500px] flex items-center justify-center">
        <p className="text-white/70">Loading featured events...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative w-full max-w-6xl mx-auto mt-6 min-h-[500px] flex items-center justify-center">
        <p className="text-red-400">{error}</p>
      </section>
    );
  }

  if (filteredEvents.length === 0) {
    return (
      <section className="relative w-full max-w-6xl mx-auto mt-6 min-h-[500px] flex items-center justify-center">
        <p className="text-white/70">No featured events available.</p>
      </section>
    );
  }

  // Helper to format date/time range
  const formatEventDateRange = (event) => {
    const startRaw = event.date_time;
    const endRaw = event.end_date_time || event.endDateTime || event.end_time || event.endTime || null;

    const parse = (val) => {
      const d = new Date(val);
      if (isNaN(d)) return null;
      const dd = String(d.getDate()).padStart(2, "0");
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const yyyy = d.getFullYear();
      // 12h time
      let hrs = d.getHours();
      const ampm = hrs >= 12 ? "PM" : "AM";
      hrs = hrs % 12 || 12;
      const min = String(d.getMinutes()).padStart(2, "0");
      return { d, date: `${dd}/${mm}/${yyyy}`, time: `${hrs}:${min} ${ampm}` };
    };

    const start = parse(startRaw);
    if (!start) return { dateLine: "Date TBA", timeLine: "" };
    const end = endRaw ? parse(endRaw) : null;

    // No end time/date
    if (!end) {
      return { dateLine: start.date, timeLine: start.time };
    }

    // Same calendar day
    if (start.date === end.date) {
      return { dateLine: start.date, timeLine: `${start.time} - ${end.time}` };
    }

    // Different day: show date range then time range
    return { dateLine: `${start.date} - ${end.date}`, timeLine: `${start.time} - ${end.time}` };
  };

  return (
    <section
      className="
        relative w-full  mx-auto overflow-hidden
        min-h-[650px] md:min-h-[650px]
        bg-transparent
      "
    >
      {filteredEvents.map((event, index) => (
        <div
          key={event.id}
          className={`absolute inset-0 flex items-center justify-center px-4 transition-all duration-500 ease-out 
            ${index === current ? "opacity-100 z-10 scale-100" : "opacity-0 z-0 scale-95"}`}
        >
          {/* BLURRED POSTER BACKGROUND */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0 scale-105 blur-sm brightness-[0.55] after:absolute after:inset-0 after:bg-linear-to-b after:from-black/40 after:via-black/30 after:to-black/70"
            style={{ backgroundImage: `url(${event.poster_url})` }}
          />

          {/* CONTENT WRAPPER (Glass Card) */}
          <div className="relative -mt-6 z-10 flex flex-col md:flex-row items-center md:items-stretch justify-center gap-8 w-full max-w-5xl p-6 md:p-10 rounded-3xl backdrop-blur-md bg-white/15 border border-white/25 shadow-[0_8px_40px_-10px_rgba(0,0,0,0.5)]">
            {/* Accent gradient edge */}
            <div className="absolute -inset-px rounded-3xl pointer-events-none bg-linear-to-br from-indigo-500/40 via-pink-500/30 to-orange-400/40 opacity-70 mix-blend-overlay" />

            {/* POSTER */}
            <div
              className={`relative z-10 w-full max-w-xs md:max-w-sm mx-auto md:mx-0 md:w-1/2 flex items-center justify-center p-2 md:p-4 
                ${event.align === "right" ? "order-2" : "order-1"}`}
            >
              <img
                src={event.poster_url}
                alt={`Poster of ${event.title}`}
                className="w-full max-h-[50vh] object-contain rounded-2xl shadow-2xl ring-1 ring-white/30"
                loading="lazy"
              />
            </div>

            {/* TEXT INFO */}
            <div
              className={`relative z-10 flex-1 flex flex-col justify-center items-center md:items-center text-center md:text-left px-2 md:px-4 gap-4 md:gap-6 ${event.align === "right" ? "order-1" : "order-2"}`}
            >
              <div className="md:space-y-4 w-full">
                <h2
                  className="text-[5.5vw] -mt-6 sm:text-3xl md:text-4xl lg:text-5xl font-extrabold leading-[1.05] uppercase tracking-tight text-white bg-clip-text drop-shadow-[0_4px_10px_rgba(0,0,0,0.4)]"
                >
                  {event.title}
                </h2>
                <div className="flex flex-col gap-1 md:gap-3 w-full max-w-xl mt-3">
                  <p className="flex items-center justify-center md:justify-start text-[3.3vw] sm:text-base md:text-lg lg:text-xl font-semibold text-white/90 drop-shadow-lg">
                    {(() => {
                      const { dateLine, timeLine } = formatEventDateRange(event);
                      return (
                        <span className="flex flex-col justify-center items-center md:items-start gap-2 md:gap-3">
                          <span className="inline-flex items-start gap-2 ">
                            <i className="far fa-calendar-alt text-peskon-primary mt-0.5"></i>
                            <span className="flex flex-col gap-1 md:gap-3 leading-tight ">
                              <span>{dateLine}</span>
                            </span>
                          </span>
                          <span className="inline-flex items-center gap-2 ">
                            <i className="fa-solid fa-clock text-peskon-primary"></i>
                            <span className="flex flex-col gap-1 md:gap-3 leading-tight ">
                              {timeLine && <span>{timeLine}</span>}
                            </span>
                          </span>
                        </span>

                      );
                    })()}
                  </p>
                  <p className="flex items-center justify-center md:justify-start text-[3.3vw] sm:text-base md:text-lg lg:text-xl font-medium text-white/90 drop-shadow-lg">
                    <span className="inline-flex items-center gap-2">
                      <i className="fas fa-map-marker-alt text-peskon-primary"></i>
                      {event.location}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* NAV LEFT */}
      <button
        onClick={prevSlide}
        className="absolute left-5 top-1/2 -translate-y-1/2 bg-white/60 text-black p-2 md:p-3 rounded-full hover:bg-black/80 hover:text-white hover:cursor-pointer z-30 transition"
      >
        <i className="fas fa-chevron-left text-sm md:text-base"></i>
      </button>

      {/* NAV RIGHT */}
      <button
        onClick={nextSlide}
        className="absolute right-5 top-1/2 -translate-y-1/2 bg-white/60 text-black p-2 md:p-3 rounded-full hover:bg-black/80 hover:text-white hover:cursor-pointer z-30 transition"
      >
        <i className="fas fa-chevron-right text-sm md:text-base"></i>
      </button>

      {/* BULLETS */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-30 md:bottom-5 md:gap-3">
        {filteredEvents.map((_, index) => (
          <span
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-1 h-1 md:w-1 md:h-1 rounded-full cursor-pointer transition-all duration-300 ring-1 ring-offset-2 ring-offset-transparent ${index === current
              ? "bg-white scale-125 ring-white/80"
              : "bg-white/40 hover:bg-white/70 ring-white/30"}`}
          />
        ))}
      </div>
    </section>
  );
};

export default EventSlide;
