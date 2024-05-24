import React, { useState, useEffect } from 'react';

const AdminDashboard = ({ token }) => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      const response = await fetch('http://localhost:5000/api/admin/bookings', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setBookings(data);
    };

    fetchBookings();
  }, [token]);

  const handleDelete = async (id) => {
    const response = await fetch(`http://localhost:5000/api/admin/bookings/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (response.ok) {
      setBookings(bookings.filter(booking => booking.id !== id));
    } else {
      alert('Errore nella cancellazione della prenotazione');
    }
  };

  return (
    <div>
      <h2>Gestione Prenotazioni</h2>
      <ul>
        {bookings.map(booking => (
          <li key={booking.id}>
            {booking.name} - {booking.date} - {booking.time}
            <button onClick={() => handleDelete(booking.id)}>Elimina</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
