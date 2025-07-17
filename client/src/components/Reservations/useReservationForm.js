import { useEffect, useState, useMemo } from 'react';
import { createReservation, suggestTables, updateReservation } from '@/data';
import { getAllDutyHours } from '@/data/duty';
import { getAvailableTimeSlots, asyncHandler, errorHandler } from '@/utils';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/context';

const toMinutes = (str) => {
  const [h, m] = str.split(':').map(Number);
  return h * 60 + (isNaN(m) ? 0 : m);
};

const useReservationForm = ({ onSuccess, onClose, initialData = null }) => {
  const { user } = useAuth();

  const [form, setForm] = useState({
    name: initialData?.guestName || user?.firstName || '',
    email: initialData?.guestEmail || user?.email || '',
    phone: initialData?.guestPhone || user?.phone || '',
    guests: initialData?.guests || '',
    date: initialData?.reservationTime ? initialData.reservationTime.split('T')[0] : '',
    time: initialData?.reservationTime ? initialData.reservationTime.split('T')[1]?.slice(0, 5) : '',
    reservationTime: initialData?.reservationTime || '',
    note: initialData?.note || '',
    tableId: initialData?.Table?.id || '',
  });

  const [dutyHours, setDutyHours] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const now = new Date();
  const upcomingDates = [];
  for (let i = 0; i < 90; i++) {
    const d = new Date();
    d.setDate(now.getDate() + i);
    upcomingDates.push(d.toISOString().slice(0, 10));
  }

  const validDates = useMemo(() => {
    return upcomingDates.filter(dateStr => {
      const date = new Date(dateStr + 'T00:00');
      if (date < new Date().setHours(0, 0, 0, 0)) return false;
      const weekday = date.toLocaleString('en-US', { weekday: 'long' });
      return getAvailableTimeSlots(dateStr, weekday, dutyHours).length > 0;
    });
  }, [upcomingDates, dutyHours]);

  const day = form.date
    ? new Date(form.date + 'T00:00').toLocaleDateString('en-US', { weekday: 'long' })
    : null;

  const timeOptions = useMemo(() => {
    if (!form.date || !dutyHours.length || !day) return [];
    return getAvailableTimeSlots(form.date, day, dutyHours).filter(t => t.endsWith(':00'));
  }, [form.date, day, dutyHours]);

  useEffect(() => {
    asyncHandler(getAllDutyHours, 'Failed to fetch working hours')
      .then(setDutyHours)
      .catch(() => setDutyHours([]));
  }, []);

  useEffect(() => {
    if (form.date && form.time) {
      setForm(prev => ({ ...prev, reservationTime: `${form.date}T${form.time}` }));
    }
  }, [form.date, form.time]);

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

  const handleSubmit = () => {
    const reservationTime = `${form.date}T${form.time}`;
    const selectedDate = new Date(reservationTime);
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

    if (!selectedTime.endsWith(':00')) {
      setErrorMsg(`Time must be in full-hour blocks (e.g. 13:00)`);
      return;
    }

    if (timeMinutes < startMinutes || timeMinutes >= endMinutes) {
      setErrorMsg(`Selected time ${selectedTime} is outside working hours (${duty.startTime} – ${duty.endTime})`);
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    const action = initialData?.id
      ? () => updateReservation(initialData.id, {
          guests: Number(form.guests),
          reservationTime,
          note: form.note
        })
      : async () => {
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

          return createReservation(payload, !user);
        };

    asyncHandler(action, initialData?.id ? 'Update failed' : 'Reservation failed')
      .then((data) => {
        toast.success(initialData?.id ? 'Reservation updated' : 'Reservation successful!');
        onSuccess?.(data);
        onClose?.();
      })
      .catch(err => setErrorMsg(err.message))
      .finally(() => setLoading(false));
  };

  return {
    form,
    loading,
    upcomingDates,
    validDates,
    timeOptions,
    handleChange,
    handleDateChange,
    handleTimeChange,
    handleSubmit,
    errorMsg
  };
};

export default useReservationForm;
