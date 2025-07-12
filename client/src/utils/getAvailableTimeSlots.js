// utils/getAvailableTimeSlots.js
export const getAvailableTimeSlots = (day, dutyHours) => {
  const duty = dutyHours.find(d => d.dayOfWeek === day);
  if (!duty) return [];

  const [startHour, startMinute] = duty.startTime.split(':').map(Number);
  const [endHour, endMinute] = duty.endTime.split(':').map(Number);

  const start = new Date();
  start.setHours(startHour, startMinute, 0, 0);

  const end = new Date();
  end.setHours(endHour, endMinute, 0, 0);

  const slots = [];
  const temp = new Date(start);

  while (temp <= end) {
    slots.push(temp.toTimeString().slice(0, 5));
    temp.setMinutes(temp.getMinutes() + 15);
  }

  return slots;
};
