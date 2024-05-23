import React, { useState } from 'react';

const BookingForm = () => {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5000/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, date, time })
    });
    if (response.ok) {
      alert('Prenotazione effettuata con successo!');
    } else {
      alert('Errore nella prenotazione.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Prenota un Appuntamento</h2>
      <div>
        <label>Nome:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <label>Data:</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      </div>
      <div>
        <label>Ora:</label>
        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
      </div>
      <button type="submit">Prenota</button>
    </form>
  );
};

export default BookingForm;
