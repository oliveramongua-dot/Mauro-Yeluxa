"use client";

import { useEffect, useMemo, useState } from "react";

const WEDDING_DATE = new Date("2027-03-06T16:00:00-05:00");

const SLIDES = {
  cover: "/portada.jpg",
  date: "/fecha.png",
  story: "/historia.png",
  dress: "/dress-code.png",
  rsvp: "/rsvp.png",
  confirmation: "/confirmacion.png",
};

function Countdown() {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const values = useMemo(() => {
    const diff = Math.max(0, WEDDING_DATE.getTime() - now);
    const total = Math.floor(diff / 1000);

    return {
      days: Math.floor(total / 86400),
      hours: Math.floor((total % 86400) / 3600),
      minutes: Math.floor((total % 3600) / 60),
      seconds: total % 60,
    };
  }, [now]);

  return (
    <div className="countdown">
      <div>
        <strong>{String(values.days).padStart(2, "0")}</strong>
        <span>DÍAS</span>
      </div>
      <div>
        <strong>{String(values.hours).padStart(2, "0")}</strong>
        <span>HORAS</span>
      </div>
      <div>
        <strong>{String(values.minutes).padStart(2, "0")}</strong>
        <span>MINUTOS</span>
      </div>
      <div>
        <strong>{String(values.seconds).padStart(2, "0")}</strong>
        <span>SEGUNDOS</span>
      </div>
    </div>
  );
}

function Slide({ src, alt, id, children, className = "" }) {
  return (
    <section id={id} className={`slide ${className}`}>
      <img className="slide-image" src={src} alt={alt} />
      {children}
    </section>
  );
}

export default function Home() {
  const [started, setStarted] = useState(false);
  const [name, setName] = useState("");
  const [rsvpState, setRsvpState] = useState("idle");
  const [rsvpError, setRsvpError] = useState("");
  const [confirmedSeats, setConfirmedSeats] = useState(null);

  const calendarUrl = useMemo(() => {
    const title = encodeURIComponent("Mauro & Yeluxa — Nuestra boda");
    const location = encodeURIComponent("Cartagena de Indias, Colombia");

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=20270306T210000Z/20270307T030000Z&location=${location}`;
  }, []);

  function openInvitation() {
    setStarted(true);

    setTimeout(() => {
      document.getElementById("date-slide")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 50);
  }

  async function submitRsvp(event) {
    event.preventDefault();
    setRsvpError("");

    const cleanName = name.trim();

    if (!cleanName) {
      setRsvpError("Escribe tu nombre completo.");
      return;
    }

    setRsvpState("loading");

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: cleanName,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.valid) {
        setRsvpState("error");
        setRsvpError(
          data?.message ||
            "No encontramos ese nombre en la lista de invitados."
        );
        return;
      }

      setConfirmedSeats(data.seats);
      setRsvpState("success");

      setTimeout(() => {
        document
          .getElementById("confirmation-slide")
          ?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
      }, 100);
    } catch {
      setRsvpState("error");
      setRsvpError(
        "No pudimos procesar la confirmación. Inténtalo nuevamente."
      );
    }
  }

  return (
    <main className="site">
      {!started && (
        <section className="cover">
          <img
            className="slide-image"
            src={SLIDES.cover}
            alt="Mauro y Yeluxa — Nuestra boda"
          />

          <button
            className="enter-button"
            onClick={openInvitation}
            aria-label="Abrir invitación"
          >
            …
          </button>
        </section>
      )}

      <div className={started ? "invitation visible" : "invitation"}>
        <Slide
          id="date-slide"
          src={SLIDES.date}
          alt="Nuestra boda — Reserva esta fecha"
          className="date-slide"
        >
          <div className="date-overlay">
            <Countdown />

            <a
              className="calendar-button"
              href={calendarUrl}
              target="_blank"
              rel="noreferrer"
            >
              AÑADIR A MI CALENDARIO
            </a>
          </div>
        </Slide>

        <Slide src={SLIDES.story} alt="Nuestra historia" />

        <Slide src={SLIDES.dress} alt="Dress code — Formal" />

        <Slide
          id="rsvp-slide"
          src={SLIDES.rsvp}
          alt="Confirma asistencia"
          className="rsvp-slide"
        >
          <div className="rsvp-overlay">
            <form className="rsvp-form" onSubmit={submitRsvp}>
              <label htmlFor="guest-name">NOMBRE COMPLETO</label>

              <input
                id="guest-name"
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  setRsvpState("idle");
                  setRsvpError("");
                }}
                placeholder="Tu nombre"
                autoComplete="name"
              />

              {rsvpError && (
                <p className="rsvp-error">{rsvpError}</p>
              )}

              <button
                type="submit"
                disabled={rsvpState === "loading"}
              >
                {rsvpState === "loading"
                  ? "VERIFICANDO…"
                  : "CONFIRMAR"}
              </button>
            </form>
          </div>
        </Slide>

        {rsvpState === "success" && (
          <Slide
            id="confirmation-slide"
            src={SLIDES.confirmation}
            alt="Asistencia confirmada"
            className="confirmation-slide"
          >
            <div className="confirmation-overlay">
              <div className="confirmed-seats">
                CUPOS CONFIRMADOS: {confirmedSeats}
              </div>
            </div>
          </Slide>
        )}
      </div>

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          background: #f8f6f0;
        }

        button,
        input {
          font: inherit;
        }

        .site {
          width: 100%;
          min-height: 100vh;
          overflow-x: hidden;
          background: #f8f6f0;
        }

        .cover,
        .slide {
          position: relative;
          width: 100%;
          min-height: 100svh;
          overflow: hidden;
          background: #f8f6f0;
        }

        .slide-image {
          display: block;
          width: 100%;
          height: 100svh;
          object-fit: cover;
          object-position: center;
        }

        .enter-button {
          position: absolute;
          left: 50%;
          bottom: 7%;
          transform: translateX(-50%);
          width: 58px;
          height: 58px;
          border-radius: 50%;
          border: 1px solid rgba(90, 50, 55, 0.35);
          background: rgba(255, 253, 248, 0.9);
          color: #5d3038;
          font-size: 25px;
          cursor: pointer;
          box-shadow: 0 5px 20px rgba(40, 25, 20, 0.12);
        }

        .invitation {
          display: none;
        }

        .invitation.visible {
          display: block;
        }

        .date-overlay,
        .rsvp-overlay,
        .confirmation-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .date-overlay {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          padding: 0 8% 7%;
        }

        .countdown {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 7px;
          width: min(92%, 430px);
          padding: 10px 12px;
          border-radius: 18px;
          background: rgba(255, 253, 248, 0.9);
          backdrop-filter: blur(7px);
          box-shadow: 0 5px 25px rgba(45, 30, 25, 0.12);
        }

        .countdown > div {
          display: flex;
          flex-direction: column;
          align-items: center;
          color: #4f3032;
        }

        .countdown strong {
          font-family: Georgia, serif;
          font-size: clamp(19px, 5vw, 30px);
          line-height: 1;
        }

        .countdown span {
          margin-top: 5px;
          font-family: Arial, sans-serif;
          font-size: 8px;
          letter-spacing: 0.08em;
        }

        .calendar-button {
          pointer-events: auto;
          margin-top: 12px;
          padding: 11px 17px;
          border-radius: 999px;
          background: #5d3038;
          color: #fffdf8;
          text-decoration: none;
          font-family: Arial, sans-serif;
          font-size: 10px;
          letter-spacing: 0.08em;
        }

        .rsvp-overlay {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 12% 11%;
        }

        .rsvp-form {
          width: min(90%, 390px);
          margin-top: 12%;
          padding: 22px;
          border-radius: 22px;
          background: rgba(255, 253, 248, 0.94);
          box-shadow: 0 10px 35px rgba(40, 20, 25, 0.16);
          pointer-events: auto;
        }

        .rsvp-form label {
          display: block;
          margin-bottom: 8px;
          color: #5d3038;
          font-family: Arial, sans-serif;
          font-size: 10px;
          letter-spacing: 0.1em;
        }

        .rsvp-form input {
          width: 100%;
          padding: 13px 12px;
          border: 1px solid rgba(93, 48, 56, 0.28);
          border-radius: 10px;
          outline: none;
          background: #fffdf8;
          color: #332b29;
        }

        .rsvp-form button {
          width: 100%;
          margin-top: 12px;
          padding: 13px;
          border: 0;
          border-radius: 999px;
          background: #5d3038;
          color: #fffdf8;
          cursor: pointer;
        }

        .rsvp-form button:disabled {
          opacity: 0.6;
        }

        .rsvp-error {
          margin: 8px 0 0;
          color: #7a2430;
          font-family: Arial, sans-serif;
          font-size: 12px;
        }

        .confirmation-overlay {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .confirmed-seats {
          margin-top: 17%;
          padding: 13px 20px;
          border-radius: 14px;
          background: rgba(255, 253, 248, 0.93);
          color: #5d3038;
          font-family: Arial, sans-serif;
          font-size: 12px;
          letter-spacing: 0.08em;
          text-align: center;
          box-shadow: 0 8px 30px rgba(40, 25, 20, 0.12);
        }

        @media (min-width: 700px) {
          .cover,
          .slide {
            width: min(100%, 540px);
            margin: 0 auto;
          }

          .site {
            background: #e9e4da;
          }
        }
      `}</style>
    </main>
  );
}
