"use client";

import { useEffect, useMemo, useState } from "react";

const WEDDING_DATE = new Date("2027-03-06T16:00:00-05:00");

const SLIDES = {
  cover: "/portada.png",
  date: "/fecha.png",
  story: "/historia.png",
  dress: "/dress-code.png",
  rsvp: "/rsvp.png",
  confirmation: "/confirmacion.png",
};

function Countdown() {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const values = useMemo(() => {
    const difference = Math.max(
      0,
      WEDDING_DATE.getTime() - now
    );

    const totalSeconds = Math.floor(difference / 1000);

    return {
      days: Math.floor(totalSeconds / 86400),
      hours: Math.floor((totalSeconds % 86400) / 3600),
      minutes: Math.floor((totalSeconds % 3600) / 60),
      seconds: totalSeconds % 60,
    };
  }, [now]);

  return (
    <div className="countdown-overlay">
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

export default function Home() {
  const [started, setStarted] = useState(false);

  const [name, setName] = useState("");
  const [rsvpState, setRsvpState] = useState("idle");
  const [confirmedSeats, setConfirmedSeats] = useState(null);
  const [rsvpError, setRsvpError] = useState("");

  const calendarUrl =
    "https://calendar.google.com/calendar/render" +
    "?action=TEMPLATE" +
    "&text=Mauro%20%26%20Yeluxa%20-%20Nuestra%20Boda" +
    "&dates=20270306T160000/20270307T000000" +
    "&details=Nuestra%20boda%20en%20Cartagena%20de%20Indias." +
    "&location=Cartagena%20de%20Indias%2C%20Colombia";

  function openInvitation() {
    setStarted(true);

    window.setTimeout(() => {
      document
        .getElementById("date-slide")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 100);
  }

  function scrollToDate() {
    document
      .getElementById("date-slide")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  }

  async function submitRsvp(event) {
    event.preventDefault();

    const cleanName = name.trim();

    if (!cleanName) {
      setRsvpError("Escribe tu nombre completo.");
      return;
    }

    setRsvpState("loading");
    setRsvpError("");

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
          "No encontramos ese nombre en nuestra lista. Revisa que esté escrito completo."
        );
        return;
      }

      setConfirmedSeats(data.seats);
      setRsvpState("success");

      window.setTimeout(() => {
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
    <main className="wedding-site">

      {/* ======================================================
          PORTADA
      ====================================================== */}

      {!started && (
        <section className="cover-screen">
          <img
            src={SLIDES.cover}
            alt="Mauro y Yeluxa - Nuestra boda"
            className="slide-image"
          />

          <button
            type="button"
            className="open-button"
            onClick={openInvitation}
            aria-label="Abrir invitación"
          >
            …
          </button>
        </section>
      )}

      {/* ======================================================
          INVITACIÓN
      ====================================================== */}

      <div
        className={`invitation ${
          started ? "invitation-visible" : "invitation-hidden"
        }`}
      >

        {/* ==================================================
            SLIDE 2 - FECHA
        ================================================== */}

        <section
          id="date-slide"
          className="visual-slide date-slide"
        >
          <img
            src={SLIDES.date}
            alt="Nuestra boda - Reserva esta fecha"
            className="slide-image"
          />

          {/* Cuenta regresiva */}
          <Countdown />

          {/* Botón calendario */}
          <a
            href={calendarUrl}
            target="_blank"
            rel="noreferrer"
            className="calendar-hotspot"
          >
            <span>+</span>
            AÑADIR A MI CALENDARIO
          </a>
        </section>


        {/* ==================================================
            SLIDE 3 - HISTORIA
        ================================================== */}

        <section className="visual-slide">
          <img
            src={SLIDES.story}
            alt="Nuestra historia - Mauro y Yeluxa"
            className="slide-image"
          />
        </section>


        {/* ==================================================
            SLIDE 4 - DRESS CODE
        ================================================== */}

        <section className="visual-slide">
          <img
            src={SLIDES.dress}
            alt="Dress code formal"
            className="slide-image"
          />
        </section>


        {/* ==================================================
            SLIDE 5 - RSVP
        ================================================== */}

        <section className="visual-slide rsvp-slide">
          <img
            src={SLIDES.rsvp}
            alt="Confirma asistencia"
            className="slide-image"
          />

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
                type="text"
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  setRsvpState("idle");
                  setRsvpError("");
                }}
                placeholder="Escribe tu nombre"
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
        </section>


        {/* ==================================================
            SLIDE 6 - CONFIRMACIÓN
        ================================================== */}

        {rsvpState === "success" && (
          <section
            id="confirmation-slide"
            className="visual-slide confirmation-slide"
          >
            <img
              src={SLIDES.confirmation}
              alt="Asistencia confirmada"
              className="slide-image"
            />

            <div className="confirmation-overlay">
              <div className="confirmed-seats">
                CUPOS CONFIRMADOS:
                <strong>{confirmedSeats}</strong>
              </div>
            </div>
          </section>
        )}

      </div>


      {/* ======================================================
          ESTILOS
      ====================================================== */}

      <style jsx global>{`

        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          padding: 0;
          background: #f8f5ee;
        }

        button,
        input {
          font: inherit;
        }

        a,
        button {
          -webkit-tap-highlight-color: transparent;
        }

        .wedding-site {
          width: 100%;
          min-height: 100vh;
          overflow-x: hidden;
          background: #f8f5ee;
        }


        /* ====================================================
           IMÁGENES DE CANVA
        ==================================================== */

        .visual-slide,
        .cover-screen {
          position: relative;
          width: 100%;
          aspect-ratio: 9 / 16;
          overflow: hidden;
          background: #f8f5ee;
        }

        .slide-image {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: fill;
        }


        /* ====================================================
           PORTADA
        ==================================================== */

        .cover-screen {
          position: fixed;
          inset: 0;
          z-index: 100;
          width: 100%;
          height: 100svh;
          aspect-ratio: auto;
          background: #f8f5ee;
        }

        .cover-screen .slide-image {
          width: 100%;
          height: 100%;
          object-fit: fill;
        }

        .open-button {
          position: absolute;
          z-index: 10;

          left: 50%;
          bottom: 7%;

          transform: translateX(-50%);

          width: 72px;
          height: 72px;

          border-radius: 50%;

          border: 1px solid rgba(103, 40, 50, 0.45);

          background: rgba(255, 253, 248, 0.9);

          color: #672832;

          font-size: 30px;
          line-height: 1;

          display: flex;
          align-items: center;
          justify-content: center;

          cursor: pointer;

          box-shadow:
            0 5px 20px rgba(50, 30, 20, 0.08);
        }

        .open-button:active {
          transform:
            translateX(-50%)
            scale(0.94);
        }


        /* ====================================================
           INVITACIÓN
        ==================================================== */

        .invitation-hidden {
          display: none;
        }

        .invitation-visible {
          display: block;
        }


        /* ====================================================
           CUENTA REGRESIVA
        ==================================================== */

        .countdown-overlay {
          position: absolute;

          left: 50%;
          bottom: 17%;

          transform: translateX(-50%);

          z-index: 5;

          width: 88%;

          display: grid;
          grid-template-columns: repeat(4, 1fr);

          gap: 0;

          color: #672832;

          text-align: center;

          pointer-events: none;
        }

        .countdown-overlay > div {
          display: flex;
          flex-direction: column;
          align-items: center;

          border-left: 1px solid
            rgba(103, 40, 50, 0.25);
        }

        .countdown-overlay > div:first-child {
          border-left: 0;
        }

        .countdown-overlay strong {
          font-family:
            "Cormorant Garamond",
            Georgia,
            serif;

          font-size: clamp(
            22px,
            6vw,
            38px
          );

          font-weight: 500;

          line-height: 1;
        }

        .countdown-overlay span {
          margin-top: 5px;

          font-family:
            "DM Sans",
            Arial,
            sans-serif;

          font-size: 7px;

          letter-spacing: 0.16em;

          font-weight: 500;
        }


        /* ====================================================
           CALENDARIO
        ==================================================== */

        .calendar-hotspot {
          position: absolute;

          z-index: 6;

          left: 50%;
          bottom: 9%;

          transform: translateX(-50%);

          display: flex;
          align-items: center;
          justify-content: center;

          gap: 8px;

          min-width: 210px;
          min-height: 42px;

          padding: 0 18px;

          border: 1px solid
            rgba(103, 40, 50, 0.55);

          border-radius: 999px;

          background: rgba(
            255,
            253,
            248,
            0.82
          );

          color: #672832;

          text-decoration: none;

          font-family:
            "DM Sans",
            Arial,
            sans-serif;

          font-size: 9px;

          letter-spacing: 0.13em;

          white-space: nowrap;

          backdrop-filter: blur(3px);
        }

        .calendar-hotspot span {
          font-size: 18px;
          line-height: 1;
        }


        /* ====================================================
           RSVP
        ==================================================== */

        .rsvp-slide {
          position: relative;
        }

        .rsvp-overlay {
          position: absolute;

          z-index: 10;

          left: 50%;
          top: 52%;

          transform: translate(
            -50%,
            -50%
          );

          width: 76%;

          max-width: 430px;
        }

        .rsvp-form {
          width: 100%;

          display: flex;
          flex-direction: column;

          align-items: stretch;

          gap: 10px;
        }

        .rsvp-form label {
          color: #672832;

          font-family:
            "DM Sans",
            Arial,
            sans-serif;

          font-size: 9px;

          letter-spacing: 0.2em;

          font-weight: 600;

          text-align: left;
        }

        .rsvp-form input {
          width: 100%;

          height: 48px;

          border: 1px solid
            rgba(103, 40, 50, 0.35);

          border-radius: 14px;

          padding: 0 15px;

          outline: none;

          background:
            rgba(
              255,
              253,
              248,
              0.94
            );

          color: #322b29;

          font-family:
            "DM Sans",
            Arial,
            sans-serif;

          font-size: 14px;

          box-shadow:
            0 3px 15px
            rgba(50, 30, 20, 0.05);
        }

        .rsvp-form input::placeholder {
          color: #8d837c;
        }

        .rsvp-form input:focus {
          border-color: #672832;
          box-shadow:
            0 0 0 3px
            rgba(103, 40, 50, 0.1);
        }

        .rsvp-form button {
          align-self: center;

          margin-top: 8px;

          min-width: 170px;

          height: 48px;

          border: 0;

          border-radius: 999px;

          background: #672832;

          color: #fffdf8;

          font-family:
            "DM Sans",
            Arial,
            sans-serif;

          font-size: 9px;

          letter-spacing: 0.16em;

          cursor: pointer;

          box-shadow:
            0 5px 18px
            rgba(70, 20, 30, 0.15);
        }

        .rsvp-form button:disabled {
          opacity: 0.55;
          cursor: wait;
        }

        .rsvp-error {
          margin: 0;

          color: #672832;

          font-family:
            "DM Sans",
            Arial,
            sans-serif;

          font-size: 11px;

          line-height: 1.4;

          text-align: center;
        }


        /* ====================================================
           CONFIRMACIÓN
        ==================================================== */

        .confirmation-slide {
          position: relative;
        }

        .confirmation-overlay {
          position: absolute;

          z-index: 10;

          left: 50%;
          bottom: 19%;

          transform: translateX(-50%);

          width: 72%;

          max-width: 400px;
        }

        .confirmed-seats {
          display: flex;
          flex-direction: column;

          align-items: center;
          justify-content: center;

          min-height: 58px;

          padding: 10px 15px;

          border: 1px solid
            rgba(103, 40, 50, 0.4);

          border-radius: 16px;

          background:
            rgba(
              255,
              253,
              248,
              0.82
            );

          color: #672832;

          font-family:
            "DM Sans",
            Arial,
            sans-serif;

          font-size: 8px;

          letter-spacing: 0.15em;

          text-align: center;

          backdrop-filter: blur(3px);
        }

        .confirmed-seats strong {
          margin-top: 3px;

          font-family:
            "Cormorant Garamond",
            Georgia,
            serif;

          font-size: 27px;

          font-weight: 500;

          letter-spacing: 0;
        }


        /* ====================================================
           TABLET / ESCRITORIO
        ==================================================== */

        @media (min-width: 700px) {

          .visual-slide {
            width: min(
              100%,
              675px
            );

            margin: 0 auto;
          }

          .cover-screen {
            width: min(
              100%,
              675px
            );

            left: 50%;
            transform: translateX(-50%);
          }

          .countdown-overlay strong {
            font-size: 36px;
          }

          .countdown-overlay span {
            font-size: 8px;
          }

          .rsvp-overlay {
            width: 68%;
          }

          .calendar-hotspot {
            min-width: 240px;
          }
        }


        /* ====================================================
           IPHONE
        ==================================================== */

        @media (max-width: 430px) {

          .open-button {
            width: 66px;
            height: 66px;
            bottom: 6%;
          }

          .countdown-overlay {
            bottom: 18%;
            width: 86%;
          }

          .countdown-overlay strong {
            font-size: 24px;
          }

          .countdown-overlay span {
            font-size: 6px;
          }

          .calendar-hotspot {
            bottom: 9%;
            min-width: 200px;
            min-height: 40px;
            font-size: 8px;
          }

          .rsvp-overlay {
            width: 75%;
            top: 53%;
          }

          .rsvp-form input {
            height: 45px;
          }

          .rsvp-form button {
            height: 45px;
          }

          .confirmation-overlay {
            width: 72%;
            bottom: 18%;
          }
        }


        /* ====================================================
           ACCESIBILIDAD
        ==================================================== */

        @media (
          prefers-reduced-motion: reduce
        ) {
          html {
            scroll-behavior: auto;
          }
        }

      `}</style>
    </main>
  );
}
