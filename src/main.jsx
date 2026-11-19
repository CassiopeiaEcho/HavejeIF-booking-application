import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { supabase } from "./supabase";
import "./styles.css";

const SLOT_LABEL = new Intl.DateTimeFormat("da-DK", {
  day: "2-digit",
  month: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

function App() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session?.user) {
      setProfile(null);
      setLoading(false);
      return;
    }
    supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single()
      .then(({ data }) => {
        setProfile(data);
        setLoading(false);
      });
  }, [session]);

  if (loading) return <div className="center">Indlæser...</div>;
  if (!session) return <Auth />;
  if (!profile) return <div className="center">Din profil kunne ikke indlæses.</div>;
  if (profile.account_status !== "APPROVED") {
    return (
      <div className="center card">
        <h1>Afventer godkendelse</h1>
        <p>Din konto skal godkendes af en administrator, før du kan bruge booking.</p>
        <button className="secondary" onClick={() => supabase.auth.signOut()}>Log ud</button>
      </div>
    );
  }
  return <Shell session={session} profile={profile} />;
}

function Auth() {
  const [mode, setMode] = useState("login");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const form = new FormData(event.currentTarget);
    const email = form.get("email").trim();
    const password = form.get("password");
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const fields = ["full_name", "sex", "country", "address", "postal_code", "municipality", "phone", "birth_date"];
        if (fields.some((field) => !form.get(field)?.toString().trim())) {
          throw new Error("Udfyld alle medlemsoplysninger.");
        }
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: form.get("full_name"),
              sex: form.get("sex"),
              country: form.get("country"),
              address: form.get("address"),
              postal_code: form.get("postal_code"),
              municipality: form.get("municipality"),
              phone: form.get("phone"),
              birth_date: form.get("birth_date"),
            },
          },
        });
        if (error) throw error;
        setMessage("Din konto er oprettet og afventer godkendelse.");
        setMode("login");
      }
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-layout">
      <form className="card auth-card" onSubmit={submit}>
        <h1>Haveje IF</h1>
        <h2>{mode === "login" ? "Log ind" : "Opret medlemskonto"}</h2>
        {mode === "signup" && (
          <>
            <label>Fulde navn<input name="full_name" required /></label>
            <label>Køn<select name="sex" required><option value="">Vælg</option><option>Mand</option><option>Kvinde</option><option>Andet</option></select></label>
            <label>Land<input name="country" defaultValue="Danmark" required /></label>
            <label>Adresse<input name="address" required /></label>
            <label>Postnr.<input name="postal_code" required /></label>
            <label>Kommune<input name="municipality" required /></label>
            <label>Mobilnummer<input name="phone" required /></label>
            <label>Fødselsdato<input name="birth_date" type="date" required /></label>
          </>
        )}
        <label>Email<input name="email" type="email" required /></label>
        <label>Adgangskode<input name="password" type="password" minLength="6" required /></label>
        {message && <p className="notice">{message}</p>}
        <button disabled={busy}>{mode === "login" ? "Log ind" : "Opret konto"}</button>
        <button type="button" className="link" onClick={() => setMode(mode === "login" ? "signup" : "login")}>
          {mode === "login" ? "Opret medlemskonto" : "Tilbage til log ind"}
        </button>
      </form>
    </main>
  );
}

function Shell({ session, profile }) {
  const [page, setPage] = useState("venues");
  return (
    <>
      <header>
        <button className="brand" onClick={() => setPage("venues")}>Haveje IF</button>
        <nav>
          <button className={page === "venues" ? "active" : ""} onClick={() => setPage("venues")}>Lokationer</button>
          <button className={page === "bookings" ? "active" : ""} onClick={() => setPage("bookings")}>Mine bookinger</button>
          {profile.role === "ADMIN" && <button className={page === "admin" ? "active" : ""} onClick={() => setPage("admin")}>Admin</button>}
          <button onClick={() => supabase.auth.signOut()}>Log ud</button>
        </nav>
      </header>
      <main>
        {page === "venues" && <Venues />}
        {page === "bookings" && <MyBookings memberId={session.user.id} />}
        {page === "admin" && <Admin />}
      </main>
    </>
  );
}

function Venues() {
  const [venues, setVenues] = useState([]);
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    supabase.from("venues").select("*").eq("active", true).order("name").then(({ data }) => setVenues(data || []));
  }, []);

  const filtered = venues.filter((venue) =>
    [venue.name, venue.location, venue.type].join(" ").toLowerCase().includes(query.toLowerCase())
  );

  if (selected) return <Booking selected={selected} back={() => setSelected(null)} />;
  return (
    <section>
      <h1>Lokationer</h1>
      <input className="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Søg navn, lokation eller type" />
      <div className="grid">
        {filtered.map((venue) => (
          <article className="card venue" key={venue.id}>
            <h2>{venue.name}</h2>
            <p>{venue.location}</p>
            <p>{venue.type} · plads til {venue.capacity}</p>
            <button onClick={() => setSelected(venue)}>Se ledige tider</button>
          </article>
        ))}
      </div>
      {filtered.length === 0 && <p>Ingen lokationer matcher søgningen.</p>}
    </section>
  );
}

function DateStrip({ date, onChange }) {
  const selected = new Date(`${date}T12:00:00`);
  const days = Array.from({ length: 7 }, (_, index) => {
    const day = new Date(selected);
    day.setDate(selected.getDate() - 3 + index);
    return day;
  });

  function shift(direction) {
    const next = new Date(selected);
    next.setDate(selected.getDate() + direction);
    onChange(next.toISOString().slice(0, 10));
  }

  return (
    <div className="calendar-strip">
      <button type="button" className="calendar-arrow" onClick={() => shift(-1)} aria-label="Forrige dag">‹</button>
      <div className="calendar-days">
        {days.map((day) => {
          const iso = day.toISOString().slice(0, 10);
          return (
            <button
              type="button"
              key={iso}
              className={iso === date ? "calendar-day selected" : "calendar-day"}
              onClick={() => onChange(iso)}
            >
              <span>{day.toLocaleDateString("da-DK", { weekday: "short" })}</span>
              <strong>{day.toLocaleDateString("da-DK", { day: "2-digit", month: "2-digit" })}</strong>
            </button>
          );
        })}
      </div>
      <button type="button" className="calendar-arrow" onClick={() => shift(1)} aria-label="Næste dag">›</button>
    </div>
  );
}

function Booking({ selected, back }) {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [slots, setSlots] = useState([]);
  const [chosen, setChosen] = useState([]);
  const [teamName, setTeamName] = useState("");
  const [message, setMessage] = useState("");

  async function loadSlots(nextDate = date) {
    setChosen([]);
    setMessage("");
    const { data, error } = await supabase.rpc("available_slots", {
      p_venue_id: selected.id,
      p_date: nextDate,
    });
    if (error) setMessage(error.message);
    setSlots(data || []);
  }

  useEffect(() => { loadSlots(); }, [date]);

  function toggleSlot(slot) {
    setChosen((current) => current.includes(slot) ? current.filter((item) => item !== slot) : [...current, slot]);
  }

  async function submit(event) {
    event.preventDefault();
    setMessage("");
    const ordered = [...chosen].sort();
    if (!teamName.trim() || ordered.length === 0) {
      setMessage("Vælg holdnavn og mindst én time.");
      return;
    }
    const start = ordered[0];
    const end = new Date(new Date(ordered[ordered.length - 1]).getTime() + 60 * 60 * 1000).toISOString();
    const { error } = await supabase.rpc("create_booking", {
      p_venue_id: selected.id,
      p_team_name: teamName.trim(),
      p_starts: ordered,
      p_start: start,
      p_end: end,
    });
    if (error) setMessage(error.message);
    else {
      setMessage("Booking afventer godkendelse.");
      setTeamName("");
      setChosen([]);
      loadSlots();
    }
  }

  return (
    <section>
      <button className="secondary" onClick={back}>Tilbage til lokationer</button>
      <h1>{selected.name}</h1>
      <p>{selected.location} · {selected.type} · plads til {selected.capacity}</p>
      <DateStrip date={date} onChange={setDate} />
      <h2>1-times tidsrum</h2>
      <div className="slot-grid">
        {slots.map((slot) => (
          <button
            type="button"
            key={slot.start_time}
            disabled={!slot.available}
            className={chosen.includes(slot.start_time) ? "selected" : ""}
            onClick={() => toggleSlot(slot.start_time)}
          >
            {SLOT_LABEL.format(new Date(slot.start_time))}
          </button>
        ))}
      </div>
      {!slots.length && <p>Ingen tider inden for åbningstiden denne dag.</p>}
      <form className="card" onSubmit={submit}>
        <label>Holdnavn<input value={teamName} onChange={(event) => setTeamName(event.target.value)} required /></label>
        {message && <p className="notice">{message}</p>}
        <button disabled={chosen.length === 0}>Send bookingforespørgsel</button>
      </form>
    </section>
  );
}

function MyBookings({ memberId }) {
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState("");

  async function load() {
    const { data, error } = await supabase
      .from("bookings")
      .select("*, venues(name)")
      .eq("member_id", memberId)
      .order("start_time", { ascending: false });
    if (error) setMessage(error.message);
    setBookings(data || []);
  }

  useEffect(() => { load(); }, []);

  async function cancel(id) {
    if (!window.confirm("Vil du annullere denne booking?")) return;
    const { error } = await supabase.rpc("cancel_booking", { p_booking_id: id });
    if (error) setMessage(error.message);
    else load();
  }

  async function editTeamName(booking) {
    const teamName = window.prompt("Holdnavn", booking.team_name);
    if (teamName === null) return;
    if (!teamName.trim()) {
      setMessage("Holdnavn må ikke være tomt.");
      return;
    }
    const { error } = await supabase.rpc("modify_booking_team_name", {
      p_booking_id: booking.id,
      p_team_name: teamName.trim(),
    });
    if (error) setMessage(error.message);
    else load();
  }

  return (
    <section>
      <h1>Mine bookinger</h1>
      {message && <p className="notice">{message}</p>}
      <div className="grid">
        {bookings.map((booking) => (
          <article className="card" key={booking.id}>
            <h2>{booking.team_name}</h2>
            <p>{booking.venues?.name}</p>
            <p>{new Date(booking.start_time).toLocaleString("da-DK")} - {new Date(booking.end_time).toLocaleTimeString("da-DK")}</p>
            <p><strong>{statusLabel(booking.status)}</strong></p>
            {(booking.status === "PENDING" || booking.status === "APPROVED") && (
              <>
                <button onClick={() => editTeamName(booking)}>Rediger holdnavn</button>
                <button className="danger" onClick={() => cancel(booking.id)}>Annuller</button>
              </>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

function statusLabel(status) {
  return { PENDING: "Afventer godkendelse", APPROVED: "Godkendt", REJECTED: "Afvist", CANCELLED: "Annulleret" }[status] || status;
}

function Admin() {
  const [tab, setTab] = useState("members");
  return (
    <section>
      <h1>Administration</h1>
      <nav className="tabs">
        <button className={tab === "members" ? "active" : ""} onClick={() => setTab("members")}>Medlemmer</button>
        <button className={tab === "venues" ? "active" : ""} onClick={() => setTab("venues")}>Lokationer</button>
        <button className={tab === "bookings" ? "active" : ""} onClick={() => setTab("bookings")}>Bookinger</button>
      </nav>
      {tab === "members" && <AdminMembers />}
      {tab === "venues" && <AdminVenues />}
      {tab === "bookings" && <AdminBookings />}
    </section>
  );
}

function AdminMembers() {
  const [members, setMembers] = useState([]);
  const [message, setMessage] = useState("");

  async function load() {
    const { data, error } = await supabase.from("profiles").select("*").order("full_name");
    if (error) setMessage(error.message);
    setMembers(data || []);
  }
  useEffect(() => { load(); }, []);

  async function setStatus(id, status) {
    const { error } = await supabase.rpc("set_member_status", { p_member_id: id, p_status: status });
    if (error) setMessage(error.message);
    else load();
  }

  return (
    <>
      {message && <p className="notice">{message}</p>}
      {members.map((member) => (
        <article className="card list-row" key={member.id}>
          <div><strong>{member.full_name}</strong><p>{member.email}</p></div>
          <div>
            {member.account_status === "PENDING" ? (
              <>
                <button onClick={() => setStatus(member.id, "APPROVED")}>Godkend</button>
                <button className="danger" onClick={() => setStatus(member.id, "REJECTED")}>Afvis</button>
              </>
            ) : <span>{member.account_status}</span>}
          </div>
        </article>
      ))}
    </>
  );
}

function AdminVenues() {
  const [venues, setVenues] = useState([]);
  const [message, setMessage] = useState("");
  const [editing, setEditing] = useState(null);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const venueFormRef = useRef(null);
  const calendarRef = useRef(null);

  async function load() {
    const { data, error } = await supabase.from("venues").select("*, opening_hours(*)").order("name");
    if (error) setMessage(error.message);
    setVenues(data || []);
  }
  useEffect(() => { load(); }, []);
  useEffect(() => {
    if (editing) venueFormRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [editing]);
  useEffect(() => {
    if (selectedVenue) calendarRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [selectedVenue]);

  async function submitVenue(event) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const payload = {
      name: form.get("name").trim(),
      location: form.get("location").trim(),
      type: form.get("type").trim(),
      capacity: Number(form.get("capacity")),
      active: true,
    };
    let result;
    if (editing) result = await supabase.from("venues").update(payload).eq("id", editing.id);
    else result = await supabase.from("venues").insert(payload).select("id").single();
    if (result.error) setMessage(result.error.message);
    else {
      setMessage(editing ? "Lokationen blev opdateret." : "Lokationen blev oprettet.");
      setEditing(null);
      formElement.reset();
      load();
    }
  }

  return (
    <>
      {message && <p className="notice">{message}</p>}
      <form ref={venueFormRef} className="card" key={editing?.id || "new"} onSubmit={submitVenue}>
        <h2>{editing ? "Rediger lokation" : "Ny lokation"}</h2>
        <label>Navn<input name="name" defaultValue={editing?.name || ""} required /></label>
        <label>Lokation<input name="location" defaultValue={editing?.location || ""} required /></label>
        <label>Type<input name="type" defaultValue={editing?.type || ""} required /></label>
        <label>Kapacitet<input name="capacity" type="number" min="1" defaultValue={editing?.capacity || ""} required /></label>
        <button>{editing ? "Gem lokation" : "Opret lokation"}</button>
        {editing && <button type="button" className="secondary" onClick={() => setEditing(null)}>Annuller redigering</button>}
      </form>
      {selectedVenue && (
        <div ref={calendarRef}>
          <AdminVenueCalendar venue={selectedVenue} onClose={() => setSelectedVenue(null)} />
        </div>
      )}
      <h2>Alle lokationer</h2>
      <div className="venue-admin-grid">
        {venues.map((venue) => (
          <article className={`card venue-admin ${selectedVenue?.id === venue.id ? "selected-card" : ""}`} key={venue.id}>
            <h3>{venue.name}</h3>
            <p>{venue.location}</p>
            <p>{venue.type} · {venue.capacity} personer</p>
            <div className="button-row">
              <button onClick={() => setEditing(venue)}>Rediger lokation</button>
              <button className="secondary" onClick={() => setSelectedVenue(venue)}>Vis kalender</button>
            </div>
            <VenueOpeningHours venue={venue} onSaved={() => load()} />
          </article>
        ))}
      </div>
    </>
  );
}

const WEEKDAYS = [
  ["1", "Mandag"],
  ["2", "Tirsdag"],
  ["3", "Onsdag"],
  ["4", "Torsdag"],
  ["5", "Fredag"],
  ["6", "Lørdag"],
  ["7", "Søndag"],
];

function VenueOpeningHours({ venue, onSaved }) {
  const [message, setMessage] = useState("");

  function findHours(weekday) {
    return venue.opening_hours?.find((item) => item.weekday === Number(weekday));
  }

  return (
    <div className="opening-hours">
      <h4>Åbningstider</h4>
      {WEEKDAYS.map(([value, label]) => {
        const hours = findHours(value);
        return (
          <label className="hours-row" key={value}>
            <span>{label}</span>
            <input
              type="hidden"
              name="weekday"
              value={value}
            />
            <input
              name={`opens_${value}`}
              type="time"
              defaultValue={hours?.opens_at || ""}
              aria-label={`Åbningstid ${label}`}
            />
            <span>–</span>
            <input
              name={`closes_${value}`}
              type="time"
              defaultValue={hours?.closes_at || ""}
              aria-label={`Lukketid ${label}`}
            />
            <button
              type="button"
              className="secondary"
              onClick={async (clickEvent) => {
                const row = clickEvent.currentTarget.closest(".hours-row");
                const opens = row.querySelector(`[name="opens_${value}"]`).value;
                const closes = row.querySelector(`[name="closes_${value}"]`).value;
                if (!opens || !closes || opens >= closes) {
                  setMessage("Lukketid skal være efter åbningstid.");
                  return;
                }
                const { error } = await supabase.from("opening_hours").upsert({
                  venue_id: venue.id,
                  weekday: Number(value),
                  opens_at: opens,
                  closes_at: closes,
                }, { onConflict: "venue_id,weekday" });
                setMessage(error?.message || "Åbningstid gemt.");
                if (!error) onSaved();
              }}
            >
              Gem
            </button>
          </label>
        );
      })}
      {message && <p className="notice">{message}</p>}
    </div>
  );
}

function AdminVenueCalendar({ venue, onClose }) {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState("");

  async function load() {
    const [slotResult, bookingResult] = await Promise.all([
      supabase.rpc("available_slots", { p_venue_id: venue.id, p_date: date }),
      supabase
        .from("booking_slots")
        .select("start_time, end_time, bookings(team_name, status, profiles(full_name))")
        .eq("venue_id", venue.id)
        .gte("start_time", `${date}T00:00:00Z`)
        .lt("start_time", `${date}T23:59:59Z`),
    ]);
    if (slotResult.error) setMessage(slotResult.error.message);
    if (bookingResult.error) setMessage(bookingResult.error.message);
    setSlots(slotResult.data || []);
    setBookings(bookingResult.data || []);
  }

  useEffect(() => { load(); }, [date, venue.id]);

  function bookingAt(slotStart) {
    return bookings.find((slot) => new Date(slot.start_time).toISOString() === new Date(slotStart).toISOString());
  }

  return (
    <section className="card calendar-panel">
      <div className="calendar-heading">
        <div>
          <h2>Kalender · {venue.name}</h2>
          <p>{venue.location}</p>
        </div>
        <button className="secondary" onClick={onClose}>Luk kalender</button>
      </div>
      <DateStrip date={date} onChange={setDate} />
      {message && <p className="notice">{message}</p>}
      <div className="slot-grid admin-slot-grid">
        {slots.map((slot) => {
          const booking = bookingAt(slot.start_time);
          return (
            <button
              type="button"
              key={slot.start_time}
              className={booking ? `booked-slot ${booking.bookings?.status?.toLowerCase()}` : "free-slot"}
              title={booking ? `${booking.bookings?.team_name || "Booking"} · ${statusLabel(booking.bookings?.status)}` : "Ledig"}
            >
              <strong>{new Date(slot.start_time).toLocaleTimeString("da-DK", { hour: "2-digit", minute: "2-digit" })}</strong>
              <span>{booking ? booking.bookings?.team_name || "Optaget" : "Ledig"}</span>
            </button>
          );
        })}
      </div>
      {!slots.length && <p>Ingen 1-times tidsrum er defineret for denne dag.</p>}
    </section>
  );
}

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState("");

  async function load() {
    const { data, error } = await supabase
      .from("bookings")
      .select("*, venues(name), profiles(full_name)")
      .order("created_at", { ascending: false });
    if (error) setMessage(error.message);
    setBookings(data || []);
  }
  useEffect(() => { load(); }, []);

  async function decide(id, status) {
    const rpc = status === "APPROVED" ? "approve_booking" : "reject_booking";
    const { error } = await supabase.rpc(rpc, { p_booking_id: id });
    if (error) setMessage(error.message);
    else load();
  }

  return (
    <>
      {message && <p className="notice">{message}</p>}
      {bookings.map((booking) => (
        <article className="card" key={booking.id}>
          <h2>{booking.team_name}</h2>
          <p>{booking.venues?.name} · {booking.profiles?.full_name}</p>
          <p>{new Date(booking.start_time).toLocaleString("da-DK")}</p>
          <p><strong>{statusLabel(booking.status)}</strong></p>
          {booking.status === "PENDING" && (
            <><button onClick={() => decide(booking.id, "APPROVED")}>Godkend</button><button className="danger" onClick={() => decide(booking.id, "REJECTED")}>Afvis</button></>
          )}
        </article>
      ))}
    </>
  );
}

createRoot(document.getElementById("root")).render(<App />);
