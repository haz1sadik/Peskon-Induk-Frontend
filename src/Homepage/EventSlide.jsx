import { useState, useEffect } from "react";
import event_list from "./EventList";

const EventSlide = () => {
  // Only show events marked for slider
  const filteredEvents = event_list
    .map((event, index) => ({ ...event, originalIndex: index }))
    .filter(event => event.showInSlider)
    .sort((a, b) => a.originalIndex - b.originalIndex)
    .slice(0, 5);

  const [current, setCurrent] = useState(0);

  const nextSlide = () =>
    setCurrent((prev) => (prev + 1) % filteredEvents.length);
  const prevSlide = () =>
    setCurrent((prev) => (prev - 1 + filteredEvents.length) % filteredEvents.length);

  // Preload background images
  useEffect(() => {
    filteredEvents.forEach(event => {
      const img = new Image();
      img.src = event.bg;
    });
  }, [filteredEvents]);

  return (
    <section
      className="
        relative w-full max-w-6xl mx-auto overflow-hidden mt-6
        min-h-[500px] sm:min-h-[550px] md:min-h-[600px] lg:min-h-[650px]
        bg-transparent  /* Transparent to let blurred bg show */
      "
    >
      {filteredEvents.map((event, index) => (
        <div
          key={event.id}
          className={`absolute inset-0 transition-opacity duration-300 ease-in-out 
            ${index === current ? "opacity-100 z-10" : "opacity-0 z-0"} 
            flex items-center justify-center px-4 py-10
          `}
        >
          {/* BLURRED BACKGROUND */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat filter sm z-0"
            style={{ backgroundImage: `url(${event.bg})` }}
          ></div>

          {/* CONTENT WRAPPER */}
          <div className="relative z-10 flex flex-col items-center justify-center gap-6 w-full max-w-4xl p-8 shadow-xl md:flex-row md:gap-10">
            {/* DARK OVERLAY*/}
            <div className="absolute inset-0 bg-black/30 rounded-xl"></div>

            {/* POSTER */}
            <div
              className={`relative z-10 flex-none w-full max-w-xs mx-auto md:w-1/2 md:mx-0 p-2 md:p-4 
                ${event.align === "right" ? "order-1 md:order-2" : "order-1 md:order-1"}
              `}
            >
              <img
                src={event.poster}
                alt={`Poster of ${event.title}`}
                className="w-full max-h-[45vh] object-contain rounded-xl shadow-xl"
              />
            </div>

            {/* TEXT INFO */}
            <div
              className={`relative z-10 flex-1 text-center md:text-left px-2 md:px-4
                ${event.align === "right" ? "order-2 md:order-1" : "order-2"}
              `}
            >
              <h2
                className="
                  text-[4.5vw] sm:text-2xl md:text-4xl lg:text-5xl 
                  font-black text-white uppercase tracking-wider drop-shadow-2xl mb-3
                  break-words max-w-[85vw]
                "
              >
                {event.title}
              </h2>

              <p className="text-[3vw] sm:text-base md:text-xl font-semibold text-white drop-shadow-lg mb-1 break-words max-w-[85vw]">
                {event.date_time}
              </p>

              <p className="text-[3vw] sm:text-base md:text-xl font-medium text-white drop-shadow-lg break-words max-w-[85vw]">
                {event.location}
              </p>
            </div>
          </div>
        </div>
      ))}

      {/* NAV LEFT */}
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 text-white p-2 md:p-3 rounded-full hover:bg-black/80 z-30 transition"
      >
        <i className="fas fa-chevron-left text-sm md:text-base"></i>
      </button>

      {/* NAV RIGHT */}
      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 text-white p-2 md:p-3 rounded-full hover:bg-black/80 z-30 transition"
      >
        <i className="fas fa-chevron-right text-sm md:text-base"></i>
      </button>

      {/* BULLETS */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-30 md:bottom-5 md:gap-3">
        {filteredEvents.map((_, index) => (
          <span
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-2 h-2 md:w-3 md:h-3 rounded-full cursor-pointer transition-all duration-300 ${index === current
                ? "bg-white scale-110"
                : "bg-white/50 hover:bg-white/70"
              }`}
          />
        ))}
      </div>
    </section>
  );
};

export default EventSlide;
