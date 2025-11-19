import { useEffect, useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { Dashboard } from './components/Dashboard';
import { Appointment, Service, User } from './types';
import {
  loadAppointments,
  loadServices,
  loadUser,
  saveAppointments,
  saveServices,
  saveUser,
} from './storage';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Carrega tudo do localStorage apenas uma vez
  useEffect(() => {
    setUser(loadUser());
    setServices(loadServices());
    setAppointments(loadAppointments());
    setLoaded(true);
  }, []);

  // Só salva depois de carregar (evita sobrescrever com vazio)
  useEffect(() => {
    if (loaded) saveUser(user);
  }, [user, loaded]);

  useEffect(() => {
    if (loaded) saveServices(services);
  }, [services, loaded]);

  useEffect(() => {
    if (loaded) saveAppointments(appointments);
  }, [appointments, loaded]);

  function handleLogin(name: string) {
    setUser({ name });
  }

  function handleLogout() {
    setUser(null);
    saveUser(null);
  }

  function handleAddService(data: Omit<Service, 'id'>) {
    setServices(prev => [...prev, { ...data, id: crypto.randomUUID() }]);
  }

  function handleUpdateService(id: string, data: Omit<Service, 'id'>) {
    setServices(prev => prev.map(s => (s.id === id ? { ...s, ...data } : s)));
  }

  function handleDeleteService(id: string) {
    setServices(prev => prev.filter(s => s.id !== id));
  }

  function handleAddAppointment(data: Omit<Appointment, 'id'>) {
    setAppointments(prev => [...prev, { ...data, id: crypto.randomUUID() }]);
  }

  function handleUpdateAppointment(id: string, data: Omit<Appointment, 'id'>) {
    setAppointments(prev =>
      prev.map(a => (a.id === id ? { ...a, ...data } : a)),
    );
  }

  function handleDeleteAppointment(id: string) {
    setAppointments(prev => prev.filter(a => a.id !== id));
  }

  function handleToggleAppointmentAttendance(id: string) {
    setAppointments(prev =>
      prev.map(a =>
        a.id === id ? { ...a, attended: !a.attended } : a,
      ),
    );
  }

  if (!loaded) return null;

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <Dashboard
      userName={user.name}
      services={services}
      appointments={appointments}
      onAddService={handleAddService}
      onUpdateService={handleUpdateService}
      onDeleteService={handleDeleteService}
      onAddAppointment={handleAddAppointment}
      onUpdateAppointment={handleUpdateAppointment}
      onDeleteAppointment={handleDeleteAppointment}
      onToggleAppointmentAttendance={handleToggleAppointmentAttendance}
      onLogout={handleLogout}
    />
  );
}
