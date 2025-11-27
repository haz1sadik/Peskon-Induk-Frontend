import EventSlide from "../homepage/EventSlide.jsx";
import EventLatest from "../homepage/EventLatest.jsx";
import EventPartners from "../homepage/EventPartners.jsx";
import { useEffect, useState } from "react";
import axios from '../../axios.js';
import AnnouncementModal from "../../components/ui/AnnouncementModal.jsx";


const Home = () => {

    const [events, setEvents] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);

    async function getEvents() {
        try {
            const response = await axios.get('/api/events');
            setEvents(response.data);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    }

    async function getAnnouncements() {
        try {
            const response = await axios.get('/api/announcements');
            const data = Array.isArray(response.data) ? response.data : [];
            setAnnouncements(data);
            if (data.length > 0) {
                const dismissed = localStorage.getItem('announcementModalDismissed') === 'true';
                if (!dismissed) {
                    setShowAnnouncementModal(true);
                }
            }
        } catch (error) {
            console.error('Error fetching announcements:', error);
        }
    }

    useEffect(() => {
        getEvents();
        getAnnouncements();
    }, []);

    return (
        <>
            {showAnnouncementModal && (
                <AnnouncementModal
                    announcements={announcements}
                    onClose={() => {
                        setShowAnnouncementModal(false);
                        localStorage.setItem('announcementModalDismissed', 'true');
                    }}
                />
            )}
            <EventSlide events={events} />
            <EventLatest events={events} />
            <EventPartners />
        </>
    );
};

export default Home;
