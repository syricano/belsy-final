export const validateReservationTime = (dateStr, timeStr, dutyHours) => {
  const day = new Date(dateStr).toLocaleString('en-US', { weekday: 'long' });
  const duty = dutyHours.find(d => d.dayOfWeek === day);
  if (!duty) return `No working hours set for ${day}`;

  const toMinutes = str => {
    const [h, m] = str.split(':').map(Number);
    return h * 60 + (isNaN(m) ? 0 : m);
  };

  const timeMinutes = toMinutes(timeStr);
  const start = toMinutes(duty.startTime);
  const end = toMinutes(duty.endTime);

  if (timeMinutes < start || timeMinutes >= end) {
    return `Time outside working hours (${duty.startTime}–${duty.endTime})`;
  }

  if (!timeStr.endsWith(':00')) return `Time must be in full-hour blocks`;

  return null;
};
