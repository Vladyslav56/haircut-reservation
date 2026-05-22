const toMin = (time) => {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

const toTime = (min) => {
  const h = Math.floor(min / 60)
    .toString()
    .padStart(2, '0')
  const m = (min % 60).toString().padStart(2, '0')
  return `${h}:${m}`
}

export const generateSlots = (workStart, workEnd, duration, bookings) => {
  const start = toMin(workStart)
  const end = toMin(workEnd)
  const step = 30

  const busy = bookings.map((b) => ({
    start: toMin(b.timeStart),
    end: toMin(b.timeStart) + b.totalDuration,
  }))

  const slots = []

  for (let t = start; t + duration <= end; t += step) {
    const slotEnd = t + duration
    const isFree = busy.every((b) => t >= b.end || slotEnd <= b.start)
    if (isFree) slots.push(toTime(t))
  }

  return slots
}

export const getDayKey = (date) => {
  const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
  return days[new Date(date).getDay()]
}

export const isEmployeeWorkingDay = (employee, date) => {
  const dayKey = getDayKey(date)
  return employee.schedule[dayKey] !== null
}

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}
