SELECT * FROM calendar_events
WHERE (start_time >= '2026-07-01T00:00:00.000Z' AND start_time <= '2026-07-31T23:59:59.999Z')
  OR (end_time >= '2026-07-01T00:00:00.000Z' AND end_time <= '2026-07-31T23:59:59.999Z');