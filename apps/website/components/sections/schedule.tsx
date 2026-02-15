const morningSchedule = [
  { time: "08:00 – 08:15", event: "Opening Remarks" },
  { time: "08:15 – 10:00", event: "Invited Talks (3 speakers)" },
  { time: "10:00 – 10:45", event: "Poster Session I" },
  { time: "10:45 – 12:00", event: "Contributed Talks (3 speakers)" },
  { time: "12:00 – 13:00", event: "Lunch Break" },
];

const afternoonSchedule = [
  { time: "13:00 – 14:45", event: "Invited Talks (3 speakers)" },
  { time: "14:45 – 15:15", event: "Virtual Clinic Highlights" },
  { time: "15:15 – 16:00", event: "Global Health Panel" },
  { time: "16:00 – 16:45", event: "Poster Session II" },
  { time: "16:45 – 17:00", event: "Closing Remarks" },
];

export function Schedule() {
  return (
    <section id="schedule" className="py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <h2 className="heading-2 text-gradient text-center mb-4">Schedule</h2>
        <p className="text-center text-sm text-brand-neutral-200 mb-10">
          This one-day workshop will feature 6 invited talks, 3 contributed
          talks, 1 panel discussion, 1 Virtual Clinic highlights session, and 2
          poster sessions.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Morning */}
          <div className="rounded-lg border border-border bg-surface-elevated p-6">
            <h3 className="text-xs font-mono uppercase tracking-wider text-accent mb-4">
              Morning
            </h3>
            <div className="space-y-0">
              {morningSchedule.map((item) => (
                <div
                  key={item.time}
                  className="flex gap-4 py-2.5 border-b border-border-subtle last:border-0"
                >
                  <span className="text-xs font-mono text-brand-neutral-200 w-28 shrink-0">
                    {item.time}
                  </span>
                  <span className="text-sm text-brand-neutral-50">
                    {item.event}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Afternoon */}
          <div className="rounded-lg border border-border bg-surface-elevated p-6">
            <h3 className="text-xs font-mono uppercase tracking-wider text-accent mb-4">
              Afternoon
            </h3>
            <div className="space-y-0">
              {afternoonSchedule.map((item) => (
                <div
                  key={item.time}
                  className="flex gap-4 py-2.5 border-b border-border-subtle last:border-0"
                >
                  <span className="text-xs font-mono text-brand-neutral-200 w-28 shrink-0">
                    {item.time}
                  </span>
                  <span className="text-sm text-brand-neutral-50">
                    {item.event}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
