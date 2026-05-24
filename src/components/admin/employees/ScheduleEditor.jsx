// Weekly schedule editor: toggle working/day-off per day, set start/end times
const DAYS = [
  { key: 'mon', label: 'Mon' },
  { key: 'tue', label: 'Tue' },
  { key: 'wed', label: 'Wed' },
  { key: 'thu', label: 'Thu' },
  { key: 'fri', label: 'Fri' },
  { key: 'sat', label: 'Sat' },
  { key: 'sun', label: 'Sun' },
]

const DEFAULT_HOURS = { start: '10:00', end: '18:00' }

// Normalises "9:00" → "09:00" so <input type="time"> recognises it as valid
const padTime = (t) => {
  if (!t) return ''
  const [h, m = '00'] = t.split(':')
  return `${h.padStart(2, '0')}:${m.padStart(2, '0')}`
}

const timeInputClass =
  'bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-3 py-1.5 text-sm outline-none focus:border-gray-500 transition-colors cursor-pointer'

export default function ScheduleEditor({ schedule, onChange }) {
  const toggle = (key) => {
    onChange({ ...schedule, [key]: schedule[key] ? null : { ...DEFAULT_HOURS } })
  }

  const updateTime = (key, field, value) => {
    onChange({ ...schedule, [key]: { ...schedule[key], [field]: value } })
  }

  return (
    <div className="space-y-2">
      {DAYS.map(({ key, label }) => {
        const working = !!schedule[key]
        return (
          <div key={key} className="flex items-center gap-3">
            <span className="text-sm text-[#888] w-8">{label}</span>

            {/* Working / Day off toggle */}
            <button
              type="button"
              onClick={() => toggle(key)}
              className={`text-xs px-3 py-1.5 rounded-xl border transition-all w-20 ${
                working
                  ? 'border-white bg-white text-black'
                  : 'border-[#2a2a2a] bg-[#141414] text-[#888] hover:border-gray-500'
              }`}
            >
              {working ? 'Working' : 'Day off'}
            </button>

            {/* Time range inputs — colorScheme:dark makes the native picker visible */}
            {working && (
              <>
                <input
                  type="time"
                  value={padTime(schedule[key].start)}
                  onChange={(e) => updateTime(key, 'start', e.target.value)}
                  onClick={(e) => e.currentTarget.showPicker?.()}
                  style={{ colorScheme: 'dark' }}
                  className={timeInputClass}
                />
                <span className="text-[#888] text-sm">—</span>
                <input
                  type="time"
                  value={padTime(schedule[key].end)}
                  onChange={(e) => updateTime(key, 'end', e.target.value)}
                  onClick={(e) => e.currentTarget.showPicker?.()}
                  style={{ colorScheme: 'dark' }}
                  className={timeInputClass}
                />
              </>
            )}
          </div>
        )
      })}
    </div>
  )
}
