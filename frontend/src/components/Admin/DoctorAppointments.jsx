import React, { useRef, useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import api from '../../api';
import '../../assets/css/calender.css'; 

const DoctorAppointments = () => {
  const calendarRef = useRef(null);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        const parsedUser = JSON.parse(storedUser);

        if (parsedUser?.id) {
          const response = await api.get(`/api/users/slots/all/`);
          const formattedEvents = response.data.map((appointment) => {
            console.log(appointment);
            const appointmentDateTime = `${appointment.date}T${appointment.start_time}`;
            const doctor = `\n\n\n\n ${appointment.start_time}`;
            

            return {
              title: appointment.reason || "RDV",
              doctor: doctor,
              start: appointmentDateTime, 
              end: appointmentDateTime, 
              className: 'custom-event-style'
            };
          });

          setEvents(formattedEvents);
        } else {
          setError("Invalid user data.");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch appointments.");
      }
    };

    fetchAppointments();
  }, []);

  return (
    <div id="calendar">
      {error && <p className="text-red-500">{error}</p>}
      <FullCalendar
        ref={calendarRef}
        plugins={[timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        slotMinTime="07:00:00"
        slotMaxTime="22:00:00"
        events={events}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'timeGridWeek,timeGridDay'
        }}
        selectable={false} 
        selectOverlap={false}
        eventContent={(arg) => (
          <div>
            <div className="font-semibold">{arg.event.title}</div>
            <div className="text-sm" style={{margin: '10px 0px'}}>{arg.event.extendedProps.doctor}</div>
          </div>
        )}
      />
    </div>
  );
};

export default DoctorAppointments;
