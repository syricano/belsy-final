import { useEffect, useState } from 'react';
import { createReservation, suggestTables } from '@/data';
import { getAllDutyHours } from '@/data/duty';
import { getAvailableTimeSlots, asyncHandler, errorHandler } from '@/utils';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/context';

const toMinutes = (str) => {
  const [h, m] = str.split(':').map(Number);
  return h * 60 + (isNaN(m) ? 0 : m);
};

const useReservationForm = ({ onSuccess, onClose }) => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: user?.firstName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    guests: '',
    date: '',
    time: '',
    reservationTime: '',
    note: '',
    tableId: ''
  });

  const [dutyHours, setDutyHours] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const upcomingDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toISOString().slice(0, 10);
  });

  const day = new Date(form.date).toLocaleDateString('en-US', { weekday: 'long' });
  const timeOptions = getAvailableTimeSlots(day, dutyHours).filter(t => t.endsWith(':00'));

  useEffect(() => {
    asyncHandler(getAllDutyHours, 'Failed to fetch working hours')
      .then(setDutyHours)
      .catch(() => setDutyHours([]));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value, ...(name === 'guests' ? { tableId: '' } : {}) }));
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    setForm(prev => ({
      ...prev,
      date,
      reservationTime: date && prev.time ? `${date}T${prev.time}` : '',
      tableId: ''
    }));
  };

  const handleTimeChange = (e) => {
    const time = e.target.value;
    setForm(prev => ({
      ...prev,
      time,
      reservationTime: prev.date && time ? `${prev.date}T${time}` : '',
      tableId: ''
    }));
  };

  useEffect(() => {
    const shouldCheck = form.guests && form.date && form.time;
    if (!shouldCheck) return;

    asyncHandler(() => suggestTables({
      guests: Number(form.guests),
      reservationTime: `${form.date}T${form.time}`,
    }), 'Suggestion failed')
      .then(suggestion => {
        if (!suggestion?.tables?.length) {
          setErrorMsg('No available tables for the selected time.');
          setForm(prev => ({ ...prev, tableId: '' }));
        } else {
          setErrorMsg(null);
          setForm(prev => ({ ...prev, tableId: suggestion.tables[0] }));
        }
      })
      .catch(errorHandler);
  }, [form.guests, form.date, form.time]);

  const handleSubmit = () => {
    if (!form.reservationTime || !form.guests) {
      setErrorMsg('Please complete all fields');
      return;
    }

    const selectedDate = new Date(form.reservationTime);
    const weekday = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });
    const duty = dutyHours.find(d => d.dayOfWeek === weekday);

    if (!duty) {
      setErrorMsg(`No working hours set for ${weekday}`);
      return;
    }

    const selectedTime = form.time;
    const timeMinutes = toMinutes(selectedTime);
    const startMinutes = toMinutes(duty.startTime);
    const endMinutes = toMinutes(duty.endTime);

    if (timeMinutes < startMinutes || timeMinutes >= endMinutes) {
      setErrorMsg(`Selected time ${selectedTime} is outside working hours (${duty.startTime} – ${duty.endTime})`);
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    asyncHandler(async () => {
      const suggestion = await suggestTables({
        guests: Number(form.guests),
        reservationTime: form.reservationTime
      });

      if (!suggestion?.tables?.length) {
        throw new Error('No available tables for the selected time.');
      }

      const payload = {
        ...form,
        guests: Number(form.guests),
        tableIds: [suggestion.tables[0]]
      };

      const data = await createReservation(payload);
      toast.success('Reservation successful!');
      onSuccess(data);
      onClose();
    }, 'Reservation failed')
      .catch(err => setErrorMsg(err.message))
      .finally(() => setLoading(false));
  };

  return {
    form,
    loading,
    upcomingDates,
    timeOptions,
    handleChange,
    handleDateChange,
    handleTimeChange,
    handleSubmit,
    errorMsg
  };
};

export default useReservationForm;
