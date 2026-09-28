"use client";

import { useEffect, useMemo, useState } from "react";

const WEDDING_DATE = new Date("2027-03-06T16:00:00-05:00");

const CARTAGENA_PHOTOS = [
  "/cartagena-1.jpg",
  "/cartagena-2.jpg",
  "/cartagena-3.jpg",
];

const COUPLE_PHOTOS = [
  "/foto-pareja-1.jpg",
  "/foto-pareja-2.jpg",
  "/foto-pareja-3.jpg",
];

function Countdown() {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const time = useMemo(() => {
    const difference = Math.max(
      0,
      WEDDING_DATE.getTime() - now
    );

    const total = Math.floor(difference / 1000);

    return {
      days: Math.floor(total / 86400),
      hours: Math.floor((total % 86400) / 3600),
      minutes: Math.floor((total % 3600) / 60),
      seconds: total % 60,
    };
  }, [now]);

  const items = [
    ["days", "DÍAS"],
    ["hours", "HORAS"],
    ["minutes", "MINUTOS"],
    ["seconds", "SEGUNDOS"],
  ];

  return (
    <div className="countdown">
      {items.map(([key, label]) => (
        <div className="count-item" key={key}>
          <strong>{String(time[key]).padStart(2, "0")}</strong>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}

function ImageWithFallback({
  src,
  alt,
  className = "",
}) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className={`image-fallback ${className}`}>
        <span>M &amp; Y</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
    />
  );
}

function WatercolorTexture() {
  return (
    <>
      <div className="paper-texture" />
      <div className="watercolor watercolor-one" />
      <div className="watercolor watercolor-two" />
      <div className="watercolor watercolor-three" />
    </>
  );
}

export default function Home() {
  const [started, setStarted] = useState(false);

  const [name, setName] = useState("");
  const [rsvpStatus, setRsvpStatus] = useState("idle");
  const [rsvpError, setRsvpError] = useState("");
  const [confirmedSeats, setConfirmedSeats] = useState(null);

  const calendarUrl =
    "https://calendar.google.com/calendar/render" +
    "?action=TEMPLATE" +
    "&text=Mauro%20%26%20Yeluxa%20-%20Nuestra%20Boda" +
    "&dates=20270306T160000/20270307T000000" +
    "&details=Nuestra%20boda%20en%20Cartagena%20de%20Indias." +
    "&location=Cartagena%20de%20Indias%2C%20Colombia";

  function enterInvitation() {
    setStarted(true);

    setTimeout(() => {
      document
        .getElementById("save-the-date")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 100);
  }

  async function submitRsvp(event) {
    event.preventDefault();

    const cleanName = name.trim();

    if (!cleanName) {
      setRsvpError("Escribe tu nombre completo.");
      return;
    }

    setRsvpStatus("loading");
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
        setRsvpStatus("error");
        setRsvpError(
          "No encontramos ese nombre en nuestra lista. Revisa que esté escrito completo."
        );
        return;
      }

      setConfirmedSeats(data.seats);
      setRsvpStatus("success");

      setTimeout(() => {
        document
          .getElementById("confirmation")
          ?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
      }, 150);
    } catch {
      setRsvpStatus("error");
      setRsvpError(
        "No pudimos procesar la confirmación. Inténtalo nuevamente."
      );
    }
  }

  return (
    <main className="site">

      {/* =====================================================
          PORTADA
      ====================================================== */}

      {!started && (
        <section className="cover">

          <WatercolorTexture />

          <div className="cover-image">
            <ImageWithFallback
              src={COUPLE_PHOTOS[0]}
              alt="Mauro y Yeluxa"
            />

            <div className="cover-overlay" />
          </div>

          <div className="cover-content">

            <div className="cover-small">
              NUESTRA BODA
            </div>

            <h1 className="script cover-names">
              Mauro &amp; Yeluxa
            </h1>

            <div className="cover-main">
              NOS CASAMOS
            </div>

            <div className="cover-save">
              SAVE THE DATE
            </div>

            <button
              type="button"
              className="cover-enter"
              onClick={enterInvitation}
              aria-label="Entrar a la invitación"
            >
              …
            </button>

          </div>
        </section>
      )}

      {/* =====================================================
          INVITACIÓN
      ====================================================== */}

      <div
        className={`invitation ${
          started ? "invitation-visible" : ""
        }`}
      >

        {/* ===================================================
            SLIDE 2 — RESERVA ESTA FECHA
        ==================================================== */}

        <section
          id="save-the-date"
          className="section save-section"
        >

          <WatercolorTexture />

          <div className="section-content">

            <div className="eyebrow">
              NUESTRA BODA
            </div>

            {/* Se conserva exactamente.
                Solo se eliminó SAVE THE DATE. */}

            <h2 className="display-title">
              Reserva esta fecha
            </h2>

            <div className="date-block">

              <div className="date-day">
                SÁBADO
              </div>

              <div className="date-number">
                06
              </div>

              <div className="date-month">
                MARZO · 2027
              </div>

              <div className="date-place">
                CARTAGENA DE INDIAS
              </div>

            </div>

            <Countdown />

            <a
              href={calendarUrl}
              target="_blank"
              rel="noreferrer"
              className="calendar-button"
            >
              <span>+</span>
              AÑADIR A MI CALENDARIO
            </a>

            <div
              className="cartagena-strip"
              aria-label="Cartagena de Indias"
            >

              {CARTAGENA_PHOTOS.map(
                (photo, index) => (
                  <div
                    className="cartagena-photo"
                    key={photo}
                  >
                    <ImageWithFallback
                      src={photo}
                      alt={`Cartagena de Indias en acuarela ${
                        index + 1
                      }`}
                    />
                  </div>
                )
              )}

            </div>

          </div>
        </section>

        {/* ===================================================
            SLIDE 3 — NUESTRA HISTORIA
        ==================================================== */}

        <section className="section story-section">

          <WatercolorTexture />

          <div className="section-content story-content">

            <div className="eyebrow">
              NUESTRA HISTORIA
            </div>

            <h2 className="script story-title">
              La vida es más linda
              <br />
              cuando la compartimos.
            </h2>

            <div className="story-gallery">

              <div className="story-photo story-photo-main">
                <ImageWithFallback
                  src={COUPLE_PHOTOS[1]}
                  alt="Mauro y Yeluxa"
                />
              </div>

              <div className="story-photo story-photo-small">
                <ImageWithFallback
                  src={COUPLE_PHOTOS[2]}
                  alt="Mauro y Yeluxa"
                />
              </div>

              <span className="botanical botanical-one">
                ❧
              </span>

              <span className="botanical botanical-two">
                ❧
              </span>

            </div>

            <p className="story-text">
              Dos caminos que se encontraron, una
              historia que seguimos escribiendo y un
              nuevo capítulo que queremos celebrar junto
              a quienes hacen parte de nuestra vida.
            </p>

          </div>
        </section>

        {/* ===================================================
            SLIDE 4 — DRESS CODE
        ==================================================== */}

        <section className="section dress-section">

          <WatercolorTexture />

          <div className="section-content dress-content">

            <div className="eyebrow light">
              DRESS CODE
            </div>

            <h2 className="display-title light">
              Formal
            </h2>

            <div className="dress-art">

              <ImageWithFallback
                src="/dress-code.png"
                alt="Dress code formal en acuarela"
              />

            </div>

            <div className="dress-options">

              {/* HOMBRES */}

              <div className="dress-option">

                <div className="dress-diamond">
                  ◇
                </div>

                <h3>
                  Hombres
                </h3>

                <p>
                  Traje formal
                </p>

                <button
                  type="button"
                  className="plus-button"
                  aria-label="Ideas para hombres"
                >
                  +
                </button>

              </div>

              {/* MUJERES */}

              <div className="dress-option">

                <div className="dress-diamond">
                  ◇
                </div>

                <h3>
                  Mujeres
                </h3>

                <p>
                  Vestido formal largo
                </p>

                <button
                  type="button"
                  className="plus-button"
                  aria-label="Ideas para mujeres"
                >
                  +
                </button>

              </div>

            </div>

            <div className="dress-note">
              EL BLANCO ESTÁ RESERVADO
              <br />
              PARA LOS NOVIOS
            </div>

          </div>
        </section>

        {/* ===================================================
            SLIDE 5 — RSVP
        ==================================================== */}

        <section className="section rsvp-section">

          <WatercolorTexture />

          <div className="section-content rsvp-content">

            <div className="eyebrow">
              RSVP
            </div>

            <h2 className="display-title">
              Confirma asistencia
            </h2>

            <p className="rsvp-text">
              Queremos celebrar este día contigo.
              <br />
              Escribe tu nombre tal como aparece
              en tu invitación.
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
                  setRsvpStatus("idle");
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
                className="confirm-button"
                disabled={rsvpStatus === "loading"}
              >
                {rsvpStatus === "loading"
                  ? "VERIFICANDO…"
                  : "CONFIRMAR"}
              </button>

            </form>

          </div>
        </section>

        {/* ===================================================
            SLIDE OCULTO — CONFIRMACIÓN
        ==================================================== */}

        {rsvpStatus === "success" && (
          <section
            id="confirmation"
            className="section confirmation-section"
          >

            <WatercolorTexture />

            <div className="section-content confirmation-content">

              <div className="eyebrow">
                CONFIRMACIÓN RECIBIDA
              </div>

              <div className="confirmation-monogram">
                M &amp; Y
              </div>

              <h2 className="script confirmation-title">
                CUPOS CONFIRMADOS:{" "}
                {confirmedSeats}
              </h2>

              <p className="confirmation-text">
                Muy pronto te enviaremos más detalles.
              </p>

            </div>
          </section>
        )}

        {/* ===================================================
            FOOTER
        ==================================================== */}

        <footer className="footer">

          <div className="script footer-names">
            Mauro &amp; Yeluxa
          </div>

          <small>
            CARTAGENA DE INDIAS · 06.03.2027
          </small>

        </footer>

      </div>

      {/* =====================================================
          ESTILOS
      ====================================================== */}

      <style jsx global>{`

        :root {
          --paper: #f5f1e8;
          --paper-light: #faf7f0;

          --olive: #59634a;
          --olive-dark: #46503c;

          --burgundy: #572932;
          --burgundy-soft: #6d3a42;

          --ink: #2d2a25;
          --muted: #716a60;

          --white: #f8f5ed;

          /*
            Combinación tipográfica:
            - serif recta para información
            - script para nombres y frases protagonistas
          */

          --serif:
            "Cormorant Garamond",
            "Times New Roman",
            serif;

          --script:
            "Snell Roundhand",
            "Brittany Signature",
            "Brush Script MT",
            cursive;
        }

        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          background: var(--paper);
          color: var(--ink);
          font-family: var(--serif);
        }

        button,
        input {
          font: inherit;
        }

        button {
          -webkit-tap-highlight-color: transparent;
        }

        .site {
          min-height: 100vh;
          overflow-x: hidden;
          background: var(--paper);
        }

        /* ===================================================
           TEXTURA DE PAPEL
        ==================================================== */

        .paper-texture {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          opacity: 0.48;

          background-image:
            radial-gradient(
              circle at 15% 20%,
              rgba(82, 68, 48, 0.08) 0 1px,
              transparent 1.5px
            ),
            radial-gradient(
              circle at 78% 72%,
              rgba(82, 68, 48, 0.06) 0 1px,
              transparent 1.5px
            ),
            radial-gradient(
              circle at 45% 50%,
              rgba(82, 68, 48, 0.035) 0 1px,
              transparent 1.5px
            );

          background-size:
            19px 19px,
            23px 23px,
            31px 31px;

          mix-blend-mode: multiply;
        }

        .watercolor {
          position: absolute;
          pointer-events: none;
          z-index: 0;
          filter: blur(2px);
          opacity: 0.32;
          border-radius: 50%;
        }

        .watercolor-one {
          width: 270px;
          height: 170px;
          left: -120px;
          top: 12%;
          background:
            radial-gradient(
              ellipse,
              rgba(89, 99, 74, 0.3),
              transparent 70%
            );
          transform: rotate(-25deg);
        }

        .watercolor-two {
          width: 320px;
          height: 180px;
          right: -150px;
          top: 55%;
          background:
            radial-gradient(
              ellipse,
              rgba(87, 41, 50, 0.22),
              transparent 70%
            );
          transform: rotate(30deg);
        }

        .watercolor-three {
          width: 260px;
          height: 150px;
          left: 35%;
          bottom: -100px;
          background:
            radial-gradient(
              ellipse,
              rgba(196, 137, 83, 0.22),
              transparent 70%
            );
        }

        /* ===================================================
           PORTADA
        ==================================================== */

        .cover {
          position: fixed;
          inset: 0;
          z-index: 100;
          min-height: 100svh;
          overflow: hidden;

          display: grid;
          place-items: center;

          background: var(--paper);
          animation: coverIn 0.8s ease both;
        }

        .cover-image {
          position: absolute;
          inset: 6vh 5vw 11vh;
          overflow: hidden;

          clip-path: polygon(
            3% 1%,
            97% 0,
            100% 5%,
            98% 96%,
            94% 100%,
            3% 98%,
            0 93%,
            2% 5%
          );
        }

        .cover-image img,
        .cover-image .image-fallback {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .cover-overlay {
          position: absolute;
          inset: 0;

          background:
            linear-gradient(
              180deg,
              rgba(245, 241, 232, 0.25),
              rgba(87, 41, 50, 0.12) 50%,
              rgba(245, 241, 232, 0.55)
            );

          mix-blend-mode: multiply;
        }

        .cover-content {
          position: relative;
          z-index: 3;

          width: min(90vw, 650px);

          text-align: center;

          color: var(--burgundy);

          text-shadow:
            0 1px 20px
            rgba(245, 241, 232, 0.8);
        }

        .cover-small {
          font-size: 0.72rem;
          letter-spacing: 0.35em;
        }

        .cover-names {
          margin: 0.5rem 0 0;

          font-size:
            clamp(4rem, 16vw, 8rem);

          line-height: 0.85;
          font-weight: 400;
        }

        .cover-main {
          margin-top: 1.4rem;

          font-size:
            clamp(1.8rem, 7vw, 3.8rem);

          letter-spacing: 0.1em;
        }

        .cover-save {
          margin-top: 0.8rem;

          font-size: 0.7rem;
          letter-spacing: 0.3em;
        }

        .cover-enter {
          width: 72px;
          height: 72px;

          margin: 7vh auto 0;

          display: grid;
          place-items: center;

          border: 1px solid
            rgba(87, 41, 50, 0.35);

          border-radius: 50%;

          background:
            rgba(245, 241, 232, 0.75);

          color: var(--burgundy);

          font-size: 2.2rem;
          line-height: 1;

          cursor: pointer;

          transition:
            transform 0.25s ease,
            background 0.25s ease;
        }

        .cover-enter:active {
          transform: scale(0.92);
        }

        /* ===================================================
           INVITACIÓN
        ==================================================== */

        .invitation {
          min-height: 100vh;

          opacity: 0;
          pointer-events: none;

          transition:
            opacity 0.5s ease;
        }

        .invitation-visible {
          opacity: 1;
          pointer-events: auto;
        }

        .section {
          position: relative;

          min-height: 100svh;

          overflow: hidden;

          display: flex;
          align-items: center;
          justify-content: center;

          padding:
            6rem
            1.35rem;
        }

        .section-content {
          position: relative;
          z-index: 2;

          width: min(100%, 760px);

          text-align: center;
        }

        /* ===================================================
           TIPOGRAFÍA
        ==================================================== */

        .script {
          font-family: var(--script);
          font-weight: 400;
        }

        .eyebrow {
          font-family: var(--serif);

          font-size: 0.72rem;

          letter-spacing: 0.34em;

          text-transform: uppercase;

          color: var(--burgundy);
        }

        .display-title {
          margin:
            0.9rem
            0
            2.5rem;

          font-family: var(--serif);

          font-size:
            clamp(2.8rem, 10vw, 5.5rem);

          line-height: 0.95;

          font-weight: 400;

          color: var(--ink);
        }

        /* ===================================================
           SAVE THE DATE
        ==================================================== */

        .save-section {
          background:
            linear-gradient(
              150deg,
              rgba(89, 99, 74, 0.035),
              transparent 45%,
              rgba(87, 41, 50, 0.04)
            ),
            var(--paper);
        }

        .date-block {
          margin-top: 2rem;
        }

        .date-day {
          font-size: 0.9rem;
          letter-spacing: 0.34em;
        }

        .date-number {
          margin: 0.15rem 0;

          color: var(--burgundy);

          font-size:
            clamp(6rem, 27vw, 11rem);

          line-height: 0.78;

          letter-spacing: -0.05em;
        }

        .date-month {
          font-size: 0.92rem;
          letter-spacing: 0.32em;
        }

        .date-place {
          margin-top: 2rem;

          font-size: 0.9rem;

          letter-spacing: 0.25em;
        }

        .countdown {
          display: grid;

          grid-template-columns:
            repeat(4, 1fr);

          gap: 0.8rem;

          width: min(100%, 500px);

          margin:
            4rem
            auto
            2.5rem;
        }

        .count-item strong {
          display: block;

          font-size:
            clamp(1.6rem, 6vw, 2.8rem);

          line-height: 1;

          font-weight: 400;
        }

        .count-item span {
          display: block;

          margin-top: 0.45rem;

          color: var(--muted);

          font-size: 0.48rem;

          letter-spacing: 0.2em;
        }

        .calendar-button {
          display: inline-flex;

          align-items: center;
          justify-content: center;

          min-height: 58px;

          padding:
            0
            1.5rem;

          border:
            1px solid
            var(--burgundy);

          color: var(--burgundy);

          text-decoration: none;

          font-size: 0.75rem;

          letter-spacing: 0.17em;

          background:
            rgba(255,255,255,0.18);
        }

        .calendar-button span {
          margin-right: 0.45rem;
          font-size: 1.2rem;
        }

        /* ===================================================
           FOTOS CARTAGENA
        ==================================================== */

        .cartagena-strip {
          display: grid;

          grid-template-columns:
            repeat(3, 1fr);

          gap: 5px;

          height: 19vh;
          min-height: 125px;

          margin:
            5rem
            -1.35rem
            -6rem;
        }

        .cartagena-photo {
          overflow: hidden;

          background:
            linear-gradient(
              135deg,
              #c9c0ae,
              #ddd1bc
            );
        }

        .cartagena-photo img,
        .cartagena-photo .image-fallback {
          width: 100%;
          height: 100%;

          display: block;

          object-fit: cover;

          filter:
            saturate(0.84)
            sepia(0.06);
        }

        /* ===================================================
           FALLBACK DE IMÁGENES
        ==================================================== */

        .image-fallback {
          display: grid;
          place-items: center;

          background:
            linear-gradient(
              135deg,
              rgba(89, 99, 74, 0.25),
              rgba(191, 143, 91, 0.2)
            );

          color:
            rgba(87, 41, 50, 0.55);

          font-family: var(--serif);

          font-size: 0.75rem;

          letter-spacing: 0.18em;
        }

        /* ===================================================
           HISTORIA
        ==================================================== */

        .story-section {
          background: var(--paper-light);
        }

        .story-title {
          margin:
            1.2rem
            0
            3rem;

          color: var(--burgundy);

          font-size:
            clamp(3.3rem, 12vw, 6.5rem);

          line-height: 0.9;
        }

        .story-gallery {
          position: relative;

          width: min(90vw, 680px);

          min-height: 500px;

          margin:
            0
            auto;
        }

        .story-photo {
          position: absolute;

          overflow: hidden;

          background: #ddd5c7;

          box-shadow:
            0 20px 50px
            rgba(44,42,37,0.13);
        }

        .story-photo img,
        .story-photo .image-fallback {
          width: 100%;
          height: 100%;

          object-fit: cover;
        }

        .story-photo-main {
          left: 2%;
          top: 0;

          width: 73%;
          height: 430px;

          transform:
            rotate(-2.5deg);
        }

        .story-photo-small {
          right: 0;
          bottom: 0;

          width: 40%;
          height: 250px;

          transform:
            rotate(4deg);

          border:
            9px solid
            var(--paper-light);
        }

        .botanical {
          position: absolute;

          color: var(--olive);

          font-size: 3rem;

          opacity: 0.6;
        }

        .botanical-one {
          right: 12%;
          top: -2rem;

          transform:
            rotate(20deg);
        }

        .botanical-two {
          left: -2%;
          bottom: 10%;

          transform:
            rotate(-35deg);
        }

        .story-text {
          width: min(100%, 600px);

          margin:
            3.5rem
            auto
            0;

          color: var(--muted);

          font-size: 1.12rem;

          line-height: 1.7;
        }

        /* ===================================================
           DRESS CODE
        ==================================================== */

        .dress-section {
          background: var(--olive);

          color: var(--white);

          min-height: 110svh;
        }

        .dress-section .watercolor-one {
          background:
            radial-gradient(
              ellipse,
              rgba(255,255,255,0.3),
              transparent 70%
            );
        }

        .dress-section .watercolor-two {
          background:
            radial-gradient(
              ellipse,
              rgba(180,108,80,0.35),
              transparent 70%
            );
        }

        .light {
          color: var(--white);
        }

        .dress-art {
          width: min(92vw, 640px);

          margin:
            0.5rem
            auto
            0;

          mix-blend-mode: multiply;
        }

        .dress-art img,
        .dress-art .image-fallback {
          display: block;

          width: 100%;

          max-height: 48vh;

          object-fit: contain;
        }

        .dress-options {
          display: grid;

          grid-template-columns:
            repeat(2, 1fr);

          gap: 1rem;

          width: min(100%, 680px);

          margin:
            0
            auto
            2.5rem;
        }

        .dress-option {
          padding: 0.8rem;
        }

        .dress-diamond {
          font-size: 2rem;

          line-height: 1;

          margin-bottom: 0.5rem;
        }

        .dress-option h3 {
          margin: 0;

          font-size:
            clamp(2rem, 7vw, 3.4rem);

          line-height: 1;

          font-weight: 400;
        }

        .dress-option p {
          margin:
            0.8rem
            0
            0;

          font-size: 0.95rem;

          opacity: 0.92;
        }

        .plus-button {
          width: 50px;
          height: 50px;

          margin:
            0.7rem
            auto
            0;

          display: grid;
          place-items: center;

          border: 0;

          background: transparent;

          color: var(--white);

          font-size: 2.4rem;

          cursor: default;
        }

        .dress-note {
          padding:
            1.25rem
            0;

          border-top:
            1px solid
            rgba(248,245,237,0.35);

          border-bottom:
            1px solid
            rgba(248,245,237,0.35);

          font-size: 0.7rem;

          line-height: 1.8;

          letter-spacing: 0.28em;
        }

        /* ===================================================
           RSVP
        ==================================================== */

        .rsvp-section {
          background: var(--paper);
        }

        .rsvp-content {
          width: min(100%, 620px);
        }

        .rsvp-text {
          margin:
            1.5rem
            auto
            2.5rem;

          color: var(--muted);

          font-size: 1.05rem;

          line-height: 1.6;
        }

        .rsvp-form {
          display: grid;

          gap: 0.8rem;

          text-align: left;
        }

        .rsvp-form label {
          color: var(--burgundy);

          font-size: 0.7rem;

          letter-spacing: 0.2em;
        }

        .rsvp-form input {
          width: 100%;

          padding:
            1rem
            0;

          border: 0;

          border-bottom:
            1px solid
            rgba(87,41,50,0.45);

          outline: none;

          background: transparent;

          color: var(--ink);

          font-family: var(--serif);

          font-size: 1.25rem;
        }

        .rsvp-form input:focus {
          border-bottom-color:
            var(--burgundy);
        }

        .rsvp-form input::placeholder {
          color: rgba(45,42,37,0.45);
        }

        .rsvp-error {
          margin: 0.2rem 0;

          color: var(--burgundy);

          font-size: 0.9rem;
        }

        .confirm-button {
          width: 100%;

          min-height: 58px;

          margin-top: 1rem;

          border:
            1px solid
            var(--burgundy);

          background: var(--burgundy);

          color: var(--white);

          cursor: pointer;

          letter-spacing: 0.16em;

          text-transform: uppercase;
        }

        .confirm-button:disabled {
          opacity: 0.55;
        }

        /* ===================================================
           CONFIRMACIÓN
        ==================================================== */

        .confirmation-section {
          min-height: 85svh;

          background:
            linear-gradient(
              145deg,
              rgba(89,99,74,0.1),
              transparent 45%,
              rgba(87,41,50,0.08)
            ),
            var(--paper);
        }

        .confirmation-monogram {
          margin:
            2rem
            0;

          color: var(--burgundy);

          font-family: var(--script);

          font-size: 5rem;
        }

        .confirmation-title {
          max-width: 700px;

          margin: 0 auto;

          color: var(--burgundy);

          font-size:
            clamp(3.2rem, 12vw, 6.3rem);

          line-height: 0.9;
        }

        .confirmation-text {
          margin-top: 2rem;

          color: var(--muted);

          font-size: 1.15rem;
        }

        /* ===================================================
           FOOTER
        ==================================================== */

        .footer {
          display: flex;

          flex-direction: column;

          align-items: center;

          gap: 0.8rem;

          padding:
            4rem
            1rem
            5rem;

          background: var(--paper);

          color: var(--burgundy);

          text-align: center;
        }

        .footer-names {
          font-size: 3.2rem;
        }

        .footer small {
          font-size: 0.55rem;

          letter-spacing: 0.18em;
        }

        /* ===================================================
           ANIMACIÓN
        ==================================================== */

        @keyframes coverIn {
          from {
            opacity: 0;
            transform: scale(1.015);
          }

          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        /* ===================================================
           TABLET / DESKTOP
        ==================================================== */

        @media (min-width: 700px) {

          .section {
            padding-left: 3rem;
            padding-right: 3rem;
          }

          .cartagena-strip {
            margin-left: -3rem;
            margin-right: -3rem;
          }

          .dress-art img,
          .dress-art .image-fallback {
            max-height: 52vh;
          }
        }

        /* ===================================================
           REDUCIR ANIMACIONES
        ==================================================== */

        @media (prefers-reduced-motion: reduce) {

          html {
            scroll-behavior: auto;
          }

          * {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }

      `}</style>

    </main>
  );
}
