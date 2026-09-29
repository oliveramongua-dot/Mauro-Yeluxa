"use client";

import { useEffect, useMemo, useState } from "react";

const WEDDING_DATE = new Date("2027-03-06T16:00:00-05:00");

const SLIDES = {
  cover: "/portada.jpg",
  date: "/fecha.jpg",
  story: "/historia.jpg",
  dress: "/dress-code.jpg",
  rsvp: "/rsvp.jpg",
  confirmation: "/confirmacion.jpg",
};

function Countdown() {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const time = useMemo(() => {
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

  const format = (number) =>
    String(number).padStart(2, "0");

  return (
    <div className="countdown">
      <div className="count-item">
        <strong>{format(time.days)}</strong>
        <span>DÍAS</span>
      </div>

      <div className="count-item">
        <strong>{format(time.hours)}</strong>
        <span>HORAS</span>
      </div>

      <div className="count-item">
        <strong>{format(time.minutes)}</strong>
        <span>MINUTOS</span>
      </div>

      <div className="count-item">
        <strong>{format(time.seconds)}</strong>
        <span>SEGUNDOS</span>
      </div>
    </div>
  );
}

function Slide({ children, image, id, className = "" }) {
  return (
    <section
      id={id}
      className={`slide ${className}`}
    >
      <img
        src={image}
        className="slide-background"
        alt=""
      />

      <div className="slide-content">
        {children}
      </div>
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
    const title = encodeURIComponent(
      "Mauro & Yeluxa — Nuestra boda"
    );

    const location = encodeURIComponent(
      "Cartagena de Indias, Colombia"
    );

    return (
      "https://calendar.google.com/calendar/render" +
      "?action=TEMPLATE" +
      `&text=${title}` +
      "&dates=20270306T210000Z/20270307T030000Z" +
      `&location=${location}`
    );
  }, []);

  function openInvitation() {
    setStarted(true);

    setTimeout(() => {
      document
        .getElementById("date-slide")
        ?.scrollIntoView({
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
      setRsvpError(
        "Por favor escribe tu nombre completo."
      );
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
      }, 300);
    } catch (error) {
      setRsvpState("error");

      setRsvpError(
        "No pudimos procesar la confirmación. Inténtalo nuevamente."
      );
    }
  }

  return (
    <main className="wedding-site">

      {/* =====================================================
          PORTADA
      ====================================================== */}

      {!started && (
        <section className="cover">
          <img
            src={SLIDES.cover}
            className="slide-background"
            alt="Mauro & Yeluxa"
          />

          <button
            className="open-dots"
            onClick={openInvitation}
            aria-label="Abrir invitación"
          >
            •••
          </button>
        </section>
      )}

      {/* =====================================================
          INVITACIÓN
      ====================================================== */}

      <div
        className={
          started
            ? "invitation invitation-visible"
            : "invitation"
        }
      >

        {/* =================================================
            FECHA
        ================================================= */}

        <Slide
          id="date-slide"
          image={SLIDES.date}
          className="date-slide"
        >
          <div className="date-text">

            <div className="date-kicker">
              NUESTRA BODA
            </div>

            <div className="script-title">
              Reserva
            </div>

            <div className="date-subtitle">
              ESTA FECHA
            </div>

            <div className="wedding-date">
              <div className="date-day-name">
                SÁBADO
              </div>

              <div className="date-number">
                06
              </div>

              <div className="date-month">
                MARZO · 2027
              </div>
            </div>

            <div className="date-city">
              CARTAGENA DE INDIAS
            </div>

          </div>

          <div className="date-bottom">

            <Countdown />

            <a
              href={calendarUrl}
              target="_blank"
              rel="noreferrer"
              className="calendar-link"
            >
              AÑADIR A MI CALENDARIO
            </a>

          </div>
        </Slide>


        {/* =================================================
            HISTORIA
        ================================================= */}

        <Slide
          image={SLIDES.story}
          className="story-slide"
        >
          <div className="story-text">

            <div className="section-kicker">
              NUESTRA HISTORIA
            </div>

            <div className="story-quote">
              La vida es más{" "}
              <span className="script-inline">
                linda
              </span>{" "}
              cuando la compartimos.
            </div>

          </div>
        </Slide>


        {/* =================================================
            DRESS CODE
        ================================================= */}

        <Slide
          image={SLIDES.dress}
          className="dress-slide"
        >
          <div className="dress-text">

            <div className="section-kicker dress-kicker">
              DRESS CODE
            </div>

            <div className="dress-script">
              Formal
            </div>

            <div className="dress-details">

              <div className="dress-column">
                <div className="dress-label">
                  HOMBRES
                </div>

                <div className="dress-description">
                  Traje formal
                </div>
              </div>

              <div className="dress-column">
                <div className="dress-label">
                  MUJERES
                </div>

                <div className="dress-description">
                  Vestido formal largo
                </div>
              </div>

            </div>

            <div className="dress-note">
              EL BLANCO ESTÁ RESERVADO
              <br />
              PARA LOS NOVIOS
            </div>

            <a
              href="#"
              className="dress-plus"
              aria-label="Ver inspiración de vestuario"
              onClick={(event) => {
                event.preventDefault();
              }}
            >
              +
            </a>

          </div>
        </Slide>


        {/* =================================================
            RSVP
        ================================================= */}

        <Slide
          id="rsvp-slide"
          image={SLIDES.rsvp}
          className="rsvp-slide"
        >
          <div className="rsvp-content">

            <div className="section-kicker rsvp-kicker">
              CONFIRMA
            </div>

            <div className="rsvp-script">
              Asistencia
            </div>

            <p className="rsvp-message">
              Será un honor compartir
              <br />
              este día contigo.
            </p>

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
                className="confirm-button"
              >
                {rsvpState === "loading"
                  ? "VERIFICANDO…"
                  : "CONFIRMAR"}
              </button>

            </form>

          </div>
        </Slide>


        {/* =================================================
            CONFIRMACIÓN
        ================================================= */}

        {rsvpState === "success" && (
          <Slide
            id="confirmation-slide"
            image={SLIDES.confirmation}
            className="confirmation-slide"
          >
            <div className="confirmation-content">

              <div className="confirmation-title">
                ¡GRACIAS!
              </div>

              <div className="confirmation-main">
                TU ASISTENCIA HA SIDO
                <br />
                CONFIRMADA
              </div>

              <div className="seat-box">
                CUPOS CONFIRMADOS:{" "}
                <strong>
                  {confirmedSeats}
                </strong>
              </div>

              <div className="confirmation-message">
                Muy pronto te enviaremos
                <br />
                más detalles.
              </div>

            </div>
          </Slide>
        )}

      </div>


      {/* =====================================================
          ESTILOS
      ====================================================== */}

      <style jsx global>{`

        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
          background: #f7f3eb;
        }

        body {
          margin: 0;
          padding: 0;
          background: #f7f3eb;
          color: #3e302c;
        }

        button,
        input {
          font: inherit;
        }

        .wedding-site {
          width: 100%;
          min-height: 100vh;
          overflow-x: hidden;
          background: #f7f3eb;
        }


        /* =================================================
           IMÁGENES
        ================================================= */

        .cover,
        .slide {
          position: relative;
          width: 100%;
          aspect-ratio: 9 / 16;
          overflow: hidden;
        }

        .slide-background {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          display: block;
        }

        .slide-content {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }


        /* =================================================
           PORTADA
        ================================================= */

        .cover {
          background: #f7f3eb;
        }

        /*
          IMPORTANTE:
          Este botón NO tiene fondo,
          NO tiene círculo,
          NO tiene borde,
          NO tiene sombra.
        */

        .open-dots {
          position: absolute;

          left: 50%;
          bottom: 6.5%;

          transform: translateX(-50%);

          width: auto;
          height: auto;

          padding: 0;
          margin: 0;

          border: none;
          outline: none;

          background: transparent;

          color: #5a3035;

          font-family:
            Georgia,
            "Times New Roman",
            serif;

          font-size: 22px;
          line-height: 1;

          letter-spacing: 4px;

          cursor: pointer;

          -webkit-tap-highlight-color: transparent;

          transition:
            opacity .25s ease,
            transform .25s ease;
        }

        .open-dots:active {
          opacity: .55;
          transform:
            translateX(-50%)
            scale(.94);
        }


        /* =================================================
           INVITACIÓN
        ================================================= */

        .invitation {
          display: none;
        }

        .invitation-visible {
          display: block;
        }


        /* =================================================
           TIPOGRAFÍA
        ================================================= */

        .section-kicker,
        .date-kicker,
        .date-subtitle,
        .date-city,
        .date-day-name,
        .date-month,
        .dress-label,
        .dress-description,
        .dress-note,
        .rsvp-message,
        .rsvp-form label,
        .confirmation-main,
        .confirmation-message,
        .calendar-link,
        .seat-box {

          font-family:
            "Cormorant Garamond",
            Georgia,
            "Times New Roman",
            serif;
        }

        /*
          Si Slight Script está instalada,
          se utilizará primero.
          Después se mantienen alternativas
          elegantes de escritura.
        */

        .script-title,
        .script-inline,
        .dress-script,
        .rsvp-script {

          font-family:
            "Slight Script",
            "Brittany Signature",
            "Allura",
            "Great Vibes",
            "Brush Script MT",
            cursive;

          font-weight: 400;
        }


        /* =================================================
           FECHA
        ================================================= */

        .date-text {
          position: absolute;

          top: 9%;
          left: 0;
          right: 0;

          text-align: center;

          color: #4e3431;
        }

        .date-kicker {
          font-size: clamp(
            13px,
            3.5vw,
            19px
          );

          letter-spacing: .16em;
          font-weight: 500;
        }

        .script-title {
          margin-top: 1.2%;

          font-size: clamp(
            53px,
            14vw,
            82px
          );

          line-height: .88;

          color: #63363a;
        }

        .date-subtitle {
          margin-top: 2.5%;

          font-size: clamp(
            12px,
            3.1vw,
            17px
          );

          letter-spacing: .19em;
        }

        .wedding-date {
          margin-top: 6%;
        }

        .date-day-name {
          font-size: clamp(
            13px,
            3.5vw,
            18px
          );

          letter-spacing: .18em;
        }

        .date-number {
          margin-top: -2%;

          font-family:
            "Cormorant Garamond",
            Georgia,
            serif;

          font-size: clamp(
            82px,
            22vw,
            132px
          );

          line-height: .9;

          font-weight: 400;

          color: #5a3035;
        }

        .date-month {
          margin-top: 1%;

          font-size: clamp(
            15px,
            4vw,
            21px
          );

          letter-spacing: .13em;
        }

        .date-city {
          margin-top: 4%;

          font-size: clamp(
            11px,
            2.8vw,
            16px
          );

          letter-spacing: .16em;
        }


        /* =================================================
           CONTADOR
        ================================================= */

        .date-bottom {
          position: absolute;

          left: 7%;
          right: 7%;
          bottom: 6%;

          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .countdown {
          width: 100%;
          max-width: 410px;

          display: grid;
          grid-template-columns:
            repeat(4, 1fr);

          gap: 2px;

          color: #503532;
        }

        .count-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .count-item strong {
          font-family:
            "Cormorant Garamond",
            Georgia,
            serif;

          font-size: clamp(
            21px,
            5.5vw,
            31px
          );

          line-height: 1;

          font-weight: 500;
        }

        .count-item span {
          margin-top: 5px;

          font-family:
            Arial,
            sans-serif;

          font-size: 7px;

          letter-spacing: .09em;
        }

        .calendar-link {
          margin-top: 13px;

          display: inline-flex;
          align-items: center;
          justify-content: center;

          min-height: 34px;

          padding:
            8px 17px;

          border:
            1px solid
            rgba(86, 48, 50, .55);

          border-radius: 999px;

          color: #593136;

          text-decoration: none;

          font-family:
            Arial,
            sans-serif;

          font-size: 9px;

          letter-spacing: .11em;

          background:
            rgba(255,255,255,.12);
        }


        /* =================================================
           HISTORIA
        ================================================= */

        .story-text {
          position: absolute;

          left: 8%;
          right: 8%;

          top: 10%;

          text-align: center;

          color: #503432;
        }

        .story-slide .section-kicker {
          font-size: clamp(
            13px,
            3.5vw,
            19px
          );

          letter-spacing: .15em;
        }

        .story-quote {
          margin: 5% auto 0;

          max-width: 370px;

          font-family:
            "Cormorant Garamond",
            Georgia,
            serif;

          font-size: clamp(
            21px,
            5.5vw,
            31px
          );

          line-height: 1.18;
        }

        .script-inline {
          color: #68383c;

          font-size: 1.35em;

          white-space: nowrap;
        }


        /* =================================================
           DRESS CODE
        ================================================= */

        .dress-text {
          position: absolute;

          inset: 0;

          text-align: center;

          color: #f8f3e8;
        }

        .dress-kicker {
          position: absolute;

          top: 8%;

          left: 0;
          right: 0;

          font-size: clamp(
            13px,
            3.5vw,
            19px
          );

          letter-spacing: .18em;
        }

        .dress-script {
          position: absolute;

          top: 11%;

          left: 0;
          right: 0;

          font-size: clamp(
            57px,
            15vw,
            90px
          );

          line-height: .9;

          color: #f7f1e4;
        }

        .dress-details {
          position: absolute;

          left: 10%;
          right: 10%;

          bottom: 14%;

          display: grid;

          grid-template-columns:
            1fr 1fr;

          gap: 15%;
        }

        .dress-column {
          text-align: center;
        }

        .dress-label {
          font-family:
            Arial,
            sans-serif;

          font-size: clamp(
            9px,
            2.4vw,
            12px
          );

          letter-spacing: .17em;

          font-weight: 600;
        }

        .dress-description {
          margin-top: 7px;

          font-size: clamp(
            14px,
            3.5vw,
            19px
          );

          line-height: 1.05;
        }

        .dress-note {
          position: absolute;

          left: 10%;
          right: 10%;

          bottom: 5.5%;

          font-family:
            Arial,
            sans-serif;

          font-size: clamp(
            7px,
            2vw,
            10px
          );

          letter-spacing: .12em;

          line-height: 1.5;
        }

        .dress-plus {
          position: absolute;

          right: 7%;
          top: 7%;

          color: #f8f3e8;

          text-decoration: none;

          font-family:
            Arial,
            sans-serif;

          font-size: 27px;

          line-height: 1;
        }


        /* =================================================
           RSVP
        ================================================= */

        .rsvp-content {
          position: absolute;

          left: 9%;
          right: 9%;

          top: 10%;

          text-align: center;

          color: #5c3037;
        }

        .rsvp-kicker {
          font-size: clamp(
            13px,
            3.5vw,
            19px
          );

          letter-spacing: .16em;
        }

        .rsvp-script {
          margin-top: 1%;

          font-size: clamp(
            55px,
            15vw,
            88px
          );

          line-height: .9;

          color: #6a343b;
        }

        .rsvp-message {
          margin:
            5% auto 0;

          font-size: clamp(
            17px,
            4.3vw,
            23px
          );

          line-height: 1.25;
        }

        .rsvp-form {
          width: 100%;
          max-width: 340px;

          margin:
            9% auto 0;

          text-align: left;
        }

        .rsvp-form label {
          display: block;

          margin-bottom: 6px;

          font-family:
            Arial,
            sans-serif;

          font-size: 9px;

          letter-spacing: .13em;

          color: #63343a;
        }

        .rsvp-form input {
          width: 100%;

          height: 43px;

          padding:
            0 13px;

          border:
            1px solid
            rgba(93,48,56,.35);

          border-radius: 4px;

          outline: none;

          background:
            rgba(255,255,255,.70);

          color: #4c3330;

          font-family:
            "Cormorant Garamond",
            Georgia,
            serif;

          font-size: 17px;
        }

        .rsvp-form input::placeholder {
          color:
            rgba(85,55,50,.55);
        }

        .confirm-button {
          width: 100%;

          height: 40px;

          margin-top: 10px;

          border: none;

          border-radius: 999px;

          background: #65353b;

          color: #fffaf2;

          font-family:
            Arial,
            sans-serif;

          font-size: 9px;

          letter-spacing: .12em;

          cursor: pointer;
        }

        .confirm-button:disabled {
          opacity: .6;
        }

        .rsvp-error {
          margin:
            7px 0 0;

          font-family:
            Arial,
            sans-serif;

          font-size: 11px;

          color: #8b2834;

          text-align: center;
        }


        /* =================================================
           CONFIRMACIÓN
        ================================================= */

        .confirmation-content {
          position: absolute;

          left: 8%;
          right: 8%;

          top: 11%;

          text-align: center;

          color: #5c3434;
        }

        .confirmation-title {
          font-family:
            "Cormorant Garamond",
            Georgia,
            serif;

          font-size: clamp(
            30px,
            8vw,
            45px
          );

          letter-spacing: .08em;
        }

        .confirmation-main {
          margin-top: 8%;

          font-family:
            Arial,
            sans-serif;

          font-size: clamp(
            11px,
            2.8vw,
            15px
          );

          letter-spacing: .12em;

          line-height: 1.5;
        }

        .seat-box {
          display: inline-flex;

          margin-top: 8%;

          padding:
            10px 16px;

          border:
            1px solid
            rgba(92,52,52,.28);

          background:
            rgba(255,255,255,.45);

          font-family:
            Arial,
            sans-serif;

          font-size: 10px;

          letter-spacing: .08em;
        }

        .confirmation-message {
          margin-top: 7%;

          font-size: clamp(
            15px,
            3.8vw,
            20px
          );

          line-height: 1.3;
        }


        /* =================================================
           ESCRITORIO
        ================================================= */

        @media (min-width: 700px) {

          .wedding-site {
            background: #e8e1d6;
          }

          .cover,
          .slide {
            width: min(
              100vw,
              540px
            );

            margin-left: auto;
            margin-right: auto;
          }

        }

      `}</style>
    </main>
  );
}
