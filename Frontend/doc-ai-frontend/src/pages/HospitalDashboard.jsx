import React, { useEffect, useState } from 'react';
import apiNode from '../config/apiNode';

const HospitalDashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [ambulances, setAmbulances] = useState({ total: 0, available: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Get hospital info from localStorage
  const hospital = JSON.parse(localStorage.getItem('user'));
  const hospitalId = hospital?._id || hospital?.hospitalId;

  useEffect(() => {
    if (!hospitalId) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch doctors
        const docRes = await apiNode.get(`/hospitals/${hospitalId}/doctors`);
        setDoctors(docRes.data);
        // Fetch ambulances
        const ambRes = await apiNode.get(`/hospitals/${hospitalId}/ambulances`);
        setAmbulances(ambRes.data);
      } catch (err) {
        setError('Failed to load hospital data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [hospitalId]);

  const handleToggleAmbulance = () => {
    const newAvailable = ambulances.available === ambulances.total ? 0 : ambulances.total;
    setAmbulances(a => ({ ...a, available: newAvailable }));
    apiNode.put(`/hospitals/${hospitalId}/ambulances`, { available: newAvailable })
      .catch(() => setError('Failed to update ambulance availability'));
  };

  if (!hospitalId) return <div className="p-8">Not authorized</div>;
  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Hospital Dashboard</h1>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Ambulances</h2>
        <div className="flex items-center gap-4">
          <span>Total: {ambulances.total}</span>
          <span>Available: {ambulances.available}</span>
          <button
            onClick={handleToggleAmbulance}
            className={`ml-4 px-4 py-2 rounded ${ambulances.available ? 'bg-green-500' : 'bg-red-500'} text-white`}
          >
            Toggle {ambulances.available ? 'Unavailable' : 'Available'}
          </button>
        </div>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Doctors</h2>
        <ul className="divide-y divide-gray-200">
          {doctors.length === 0 && <li className="py-2">No doctors found.</li>}
          {doctors.map(doc => (
            <li key={doc._id} className="py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <span className="font-medium">{doc.name}</span>
              <span className="text-gray-600">{doc.specialization || 'General Medicine'}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HospitalDashboard; 