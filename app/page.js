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
    }, 80);
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
      }, 150);
    } catch {
      setRsvpState("error");
      setRsvpError(
        "No pudimos procesar la confirmación. Inténtalo nuevamente."
      );
    }
  }

  return (
    <main className="site">

      {/* =========================
          PORTADA
      ========================== */}

      {!started && (
        <section className="cover">

          <img
            className="slide-image cover-image"
            src={SLIDES.cover}
            alt="Mauro y Yeluxa"
          />

          <div className="cover-text">

            <div className="cover-eyebrow">
              NOS CASAMOS
            </div>

            <h1 className="cover-names">
              Mauro &amp; Yeluxa
            </h1>

            <div className="cover-save">
              SAVE THE DATE
            </div>

          </div>

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

        {/* =========================
            FECHA
        ========================== */}

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

        {/* =========================
            HISTORIA
        ========================== */}

        <Slide
          src={SLIDES.story}
          alt="Nuestra historia"
        />

        {/* =========================
            DRESS CODE
        ========================== */}

        <Slide
          src={SLIDES.dress}
          alt="Dress code — Formal"
        />

        {/* =========================
            RSVP
        ========================== */}

        <Slide
          id="rsvp-slide"
          src={SLIDES.rsvp}
          alt="Confirma asistencia"
          className="rsvp-slide"
        >
          <div className="rsvp-overlay">

            <form
              className="rsvp-form"
              onSubmit={submitRsvp}
            >

              <label htmlFor="guest-name">
                NOMBRE COMPLETO
              </label>

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
                <p className="rsvp-error">
                  {rsvpError}
                </p>
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

        {/* =========================
            CONFIRMACIÓN
        ========================== */}

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
          background: #f5f1e8;
        }

        button,
        input {
          font: inherit;
        }

        .site {
          width: 100%;
          min-height: 100vh;
          overflow-x: hidden;
          background: #f5f1e8;
        }

        /* =========================
           SLIDES
        ========================== */

        .cover,
        .slide {
          position: relative;
          width: 100%;
          min-height: 100svh;
          overflow: hidden;
          background: #f5f1e8;
        }

        .slide-image {
          display: block;
          width: 100%;
          height: 100svh;
          object-fit: cover;
          object-position: center;
        }

        /* =========================
           PORTADA
        ========================== */

        .cover {
          position: relative;
        }

        .cover-image {
          position: absolute;
          inset: 0;
          z-index: 1;
        }

        .cover-text {
          position: absolute;
          z-index: 3;
          top: 7%;
          left: 50%;
          transform: translateX(-50%);
          width: 90%;
          text-align: center;
          pointer-events: none;
        }

        .cover-eyebrow {
          font-family: "Cormorant Garamond", Georgia, serif;
          font-size: clamp(16px, 4.5vw, 25px);
          letter-spacing: 0.25em;
          color: #4d3b32;
          margin-bottom: 16px;
        }

        .cover-names {
          margin: 0;
          font-family:
            "Slight Script",
            "Brittany Signature",
            "Allura",
            "Great Vibes",
            cursive;
          font-weight: 400;
          font-size: clamp(46px, 13vw, 86px);
          line-height: 0.95;
          color: #5d3038;
          white-space: nowrap;
        }

        .cover-save {
          margin-top: 22px;
          font-family: Arial, sans-serif;
          font-size: clamp(11px, 3vw, 16px);
          letter-spacing: 0.25em;
          color: #4d3b32;
        }

        .enter-button {
          position: absolute;
          z-index: 5;
          left: 50%;
          bottom: 7%;
          transform: translateX(-50%);

          width: 60px;
          height: 60px;

          border-radius: 50%;
          border: 1px solid rgba(93, 48, 56, 0.35);

          background: rgba(255, 253, 248, 0.92);

          color: #5d3038;
          font-size: 25px;

          cursor: pointer;

          box-shadow:
            0 5px 20px rgba(40, 25, 20, 0.12);
        }

        /* =========================
           INVITACIÓN
        ========================== */

        .invitation {
          display: none;
        }

        .invitation.visible {
          display: block;
        }

        /* =========================
           CONTADOR
        ========================== */

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

          box-shadow:
            0 5px 25px rgba(45, 30, 25, 0.12);
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

        /* =========================
           RSVP
        ========================== */

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

          box-shadow:
            0 10px 35px rgba(40, 20, 25, 0.16);

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

          border:
            1px solid
            rgba(93, 48, 56, 0.28);

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

        /* =========================
           CONFIRMACIÓN
        ========================== */

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

          box-shadow:
            0 8px 30px rgba(40, 25, 20, 0.12);
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
