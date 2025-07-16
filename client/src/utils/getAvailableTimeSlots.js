export const getAvailableTimeSlots = (date, day, dutyHours) => {
  if (!Array.isArray(dutyHours)) return [];
  const duty = dutyHours.find(d => d.dayOfWeek === day);
  if (!duty) return [];

  const start = new Date(`${date}T${duty.startTime}`);
  const end = new Date(`${date}T${duty.endTime}`);

  const slots = [];
  const temp = new Date(start);
  const now = new Date();

  while (temp <= end) {
    const slotTime = new Date(temp);
    if (slotTime > now) {
      slots.push(slotTime.toTimeString().slice(0, 5));
    }
    temp.setMinutes(temp.getMinutes() + 60);
  }

  return slots;
};
