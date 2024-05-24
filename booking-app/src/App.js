import React, { useState } from 'react';
import BookingForm from './components/BookingForm';
import RegistrationForm from './components/RegistrationForm';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import './App.css';

function App() {
  const [adminToken, setAdminToken] = useState(null);

  return (
    <div className="App">
      <header className="App-header">
        <h1>App di Prenotazione</h1>
      </header>
      <main>
        {!adminToken ? (
          <AdminLogin onLogin={setAdminToken} />
        ) : (
          <AdminDashboard token={adminToken} />
        )}
        <RegistrationForm />
        <BookingForm />
      </main>
    </div>
  );
}

export default App;
