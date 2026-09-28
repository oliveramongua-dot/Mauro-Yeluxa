"use client";

import { useEffect, useMemo, useState } from "react";

const WEDDING_DATE = new Date("2027-03-06T16:00:00-05:00");

const COUPLE_PHOTOS = [
  "/foto-pareja-1.jpg",
  "/foto-pareja-2.jpg",
  "/foto-pareja-3.jpg",
];

const CARTAGENA_PHOTOS = [
  "/cartagena-1.jpg",
  "/cartagena-2.jpg",
  "/cartagena-3.jpg",
];

const PINTEREST_URL = "https://www.pinterest.com/";

function Photo({ src, alt, className = "" }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`photo-fallback ${className}`}
        aria-label={alt}
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}

function PaperTexture({ tone = "paper" }) {
  return (
    <div className={`paper-texture ${tone}`} aria-hidden="true">
      <span className="brush brush-a" />
      <span className="brush brush-b" />
      <span className="brush brush-c" />
      <span className="splatter splatter-a" />
      <span className="splatter splatter-b" />
    </div>
  );
}

function Countdown() {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const values = useMemo(() => {
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
          <strong>
            {String(values[key]).padStart(2, "0")}
          </strong>
          <span>{label}</span>
        </div>
      ))}
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
    "https://calendar.google.com/calendar/render?action=TEMPLATE" +
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
    }, 120);
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

      setTimeout(() => {
        document
          .getElementById("confirmation")
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

      {/* =====================================================
          PORTADA
      ===================================================== */}

      {!started && (
        <section
          className="cover"
          aria-label="Portada de la invitación"
        >
          <PaperTexture />

          <div className="cover-watercolor">
            <div className="cover-photo-bleed" />

            <Photo
              src={COUPLE_PHOTOS[0]}
              alt="Mauro y Yeluxa"
              className="cover-photo"
            />
          </div>

          <div className="cover-copy">

            <div className="cover-title">
              NOS CASAMOS
            </div>

            <h1 className="script cover-names">
              Mauro &amp; Yeluxa
            </h1>

            <div className="cover-save">
              SAVE THE DATE
            </div>

          </div>

          <button
            type="button"
            className="enter-mark"
            onClick={enterInvitation}
            aria-label="Continuar"
          >
            …
          </button>
        </section>
      )}

      <div
        className={`invitation ${
          started ? "is-visible" : ""
        }`}
      >

        {/* =====================================================
            HOJA 2 — SAVE THE DATE
        ===================================================== */}

        <section
          id="save-the-date"
          className="section save-section"
        >
          <PaperTexture />

          <div className="section-inner save-inner">

            <div className="eyebrow">
              NUESTRA BODA
            </div>

            <h2 className="script section-title">
              Reserva
            </h2>

            <div className="reserve-label">
              ESTA FECHA
            </div>

            <div className="date-lockup">

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
              className="calendar-button"
              href={calendarUrl}
              target="_blank"
              rel="noreferrer"
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
                    className={`cartagena-photo photo-${index + 1}`}
                    key={photo}
                  >
                    <Photo
                      src={photo}
                      alt={`Cartagena de Indias ${index + 1}`}
                    />
                  </div>
                )
              )}
            </div>

          </div>
        </section>


        {/* =====================================================
            HOJA 3 — NUESTRA HISTORIA
        ===================================================== */}

        <section className="section story-section">
          <PaperTexture />

          <div className="section-inner story-inner">

            <div className="eyebrow">
              NUESTRA HISTORIA
            </div>

            <h2 className="story-heading">

              <span>
                La vida es más
              </span>

              <strong className="script">
                linda
              </strong>

              <span>
                cuando la compartimos.
              </span>

            </h2>

            <div className="story-collage">

              <div className="story-photo story-photo-one">
                <Photo
                  src={COUPLE_PHOTOS[1]}
                  alt="Mauro y Yeluxa"
                />
              </div>

              <div className="story-photo story-photo-two">
                <Photo
                  src={COUPLE_PHOTOS[2]}
                  alt="Mauro y Yeluxa"
                />
              </div>

              <div className="story-photo story-photo-three">
                <Photo
                  src={COUPLE_PHOTOS[0]}
                  alt="Mauro y Yeluxa"
                />
              </div>

            </div>

          </div>
        </section>


        {/* =====================================================
            HOJA 4 — DRESS CODE
        ===================================================== */}

        <section className="section dress-section">

          <PaperTexture tone="olive" />

          <div className="section-inner dress-inner">

            <div className="eyebrow light">
              DRESS CODE
            </div>

            <h2 className="script dress-title">
              Formal
            </h2>

            <div className="dress-models">

              {/* HOMBRES */}

              <div className="model-panel">

                <div className="model-brush">

                  <div
                    className="model-silhouette man"
                    aria-hidden="true"
                  >

                    <div className="head" />
                    <div className="body" />
                    <div className="leg leg-left" />
                    <div className="leg leg-right" />

                  </div>

                </div>

                <div className="model-label">
                  HOMBRES
                </div>

                <p>
                  Traje formal
                </p>

              </div>


              {/* MUJERES */}

              <div className="model-panel">

                <div className="model-brush">

                  <div
                    className="model-silhouette woman"
                    aria-hidden="true"
                  >

                    <div className="head" />
                    <div className="body" />
                    <div className="dress" />

                  </div>

                </div>

                <div className="model-label">
                  MUJERES
                </div>

                <p>
                  Vestido formal largo
                </p>

              </div>

            </div>

            <div className="dress-note">
              EL BLANCO ESTÁ RESERVADO
              PARA LOS NOVIOS
            </div>

            <a
              className="pinterest-link"
              href={PINTEREST_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="Inspiración de vestuario"
            >
              +
            </a>

          </div>
        </section>


        {/* =====================================================
            HOJA 5 — RSVP
        ===================================================== */}

        <section className="section rsvp-section">

          <PaperTexture tone="wine" />

          <div className="section-inner rsvp-inner">

            <div className="eyebrow light">
              RSVP
            </div>

            <h2 className="rsvp-heading">
              CONFIRMA
              <span className="script">
                asistencia
              </span>
            </h2>

            <p className="rsvp-intro">
              Será un honor compartir
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
                <p className="form-error">
                  {rsvpError}
                </p>
              )}

              <button
                type="submit"
                className="submit-button"
                disabled={rsvpState === "loading"}
              >
                {rsvpState === "loading"
                  ? "VERIFICANDO…"
                  : "CONFIRMAR ASISTENCIA"}
              </button>

            </form>

          </div>
        </section>


        {/* =====================================================
            HOJA 6 — CONFIRMACIÓN OCULTA
        ===================================================== */}

        {rsvpState === "success" && (
          <section
            id="confirmation"
            className="section confirmation-section"
          >

            <PaperTexture />

            <div className="section-inner confirmation-inner">

              <div className="eyebrow">
                ¡GRACIAS!
              </div>

              <h2 className="script confirmation-title">
                Tu asistencia
              </h2>

              <p className="confirmation-subtitle">
                TU ASISTENCIA HA SIDO CONFIRMADA
              </p>

              <div className="confirmation-postcard">

                <Photo
                  src="/postal-cartagena.jpg"
                  alt="Cartagena de Indias en acuarela"
                />

                <div className="postcard-copy">
                  <span>
                    CARTAGENA DE INDIAS
                  </span>

                  <small>
                    06 MARZO · 2027
                  </small>
                </div>

              </div>

              <div className="confirmation-seats">

                <span>
                  CUPOS CONFIRMADOS
                </span>

                <strong>
                  {confirmedSeats}
                </strong>

              </div>

              <p className="confirmation-message">
                Muy pronto te enviaremos
                más detalles.
              </p>

            </div>
          </section>
        )}


        {/* =====================================================
            FOOTER
        ===================================================== */}

        <footer className="footer">

          <span className="script">
            Mauro &amp; Yeluxa
          </span>

          <small>
            CARTAGENA DE INDIAS · 06.03.2027
          </small>

        </footer>

      </div>


      {/* =====================================================
          ESTILOS
      ===================================================== */}

      <style jsx global>{`

        :root {
          --paper: #f7f2e8;
          --paper-light: #fffaf1;
          --wine: #632732;
          --wine-dark: #4e2029;
          --olive: #5b6848;
          --olive-dark: #4c593d;
          --ink: #332c28;
          --white: #fffdf7;

          --script:
            "Slight Script",
            "Brittany Signature",
            "Allura",
            "Great Vibes",
            cursive;

          --serif:
            "Cormorant Garamond",
            Georgia,
            serif;
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


        a,
        button {
          -webkit-tap-highlight-color: transparent;
        }


        .site {
          min-height: 100vh;
          overflow-x: hidden;
          background: var(--paper);
        }


        /* TEXTURA */

        .paper-texture {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          z-index: 0;

          background:
            radial-gradient(
              circle at 12% 20%,
              rgba(100,80,60,.09) 0 1px,
              transparent 1.5px
            ),
            radial-gradient(
              circle at 80% 70%,
              rgba(100,80,60,.06) 0 1px,
              transparent 1.5px
            ),
            var(--paper);

          background-size:
            13px 13px,
            17px 17px,
            auto;
        }


        .brush,
        .splatter {
          position: absolute;
          display: block;
        }


        .brush {
          border-radius:
            48% 52% 55% 45%;
          filter: blur(2px);
        }


        .brush-a {
          width: 320px;
          height: 130px;
          top: -40px;
          left: -100px;
          background:
            rgba(205,157,123,.34);
          transform: rotate(-17deg);
        }


        .brush-b {
          width: 330px;
          height: 120px;
          right: -100px;
          bottom: 8%;
          background:
            rgba(89,99,74,.19);
          transform: rotate(-20deg);
        }


        .brush-c {
          width: 250px;
          height: 100px;
          left: -100px;
          bottom: 4%;
          background:
            rgba(103,40,50,.13);
          transform: rotate(18deg);
        }


        .splatter {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background:
            rgba(103,40,50,.25);
        }


        .splatter-a {
          top: 23%;
          right: 10%;

          box-shadow:
            -35px 18px 0 rgba(205,157,123,.35),
            20px 40px 0 rgba(89,99,74,.25),
            -75px 90px 0 rgba(103,40,50,.18);
        }


        .splatter-b {
          bottom: 22%;
          left: 8%;

          box-shadow:
            35px -25px 0 rgba(205,157,123,.3),
            70px 15px 0 rgba(89,99,74,.22);
        }


        /* PORTADA */

        .cover {
          position: fixed;
          inset: 0;
          z-index: 50;
          min-height: 100svh;

          display: grid;
          place-items: center;

          overflow: hidden;
          background: var(--paper);
        }


        .cover-watercolor {
          position: absolute;
          inset: 12vh 6vw 14vh;

          overflow: visible;

          clip-path:
            polygon(
              4% 1%,
              96% 0,
              100% 5%,
              98% 94%,
              94% 100%,
              5% 98%,
              0 93%,
              2% 6%
            );
        }


        .cover-watercolor::before {
          content: "";
          position: absolute;
          inset: -5%;

          background:
            radial-gradient(
              ellipse at 15% 20%,
              rgba(205,157,123,.65),
              transparent 28%
            ),
            radial-gradient(
              ellipse at 88% 27%,
              rgba(89,99,74,.40),
              transparent 28%
            ),
            radial-gradient(
              ellipse at 20% 92%,
              rgba(103,40,50,.36),
              transparent 30%
            ),
            radial-gradient(
              ellipse at 88% 86%,
              rgba(205,157,123,.48),
              transparent 30%
            );

          filter: blur(10px);
        }


        .cover-photo-bleed {
          position: absolute;
          inset: 3%;
          background:
            rgba(255,255,255,.55);
        }


        .cover-photo {
          position: relative;
          z-index: 2;

          width: 94%;
          height: 94%;
          margin: 3%;

          object-fit: cover;
          display: block;

          clip-path:
            polygon(
              2% 1%,
              97% 0,
              100% 5%,
              98% 94%,
              94% 100%,
              5% 98%,
              0 93%,
              2% 6%
            );
        }


        .cover-copy {
          position: relative;
          z-index: 5;

          width: 90vw;
          text-align: center;

          color: var(--wine);
        }


        .cover-title {
          font-size:
            clamp(1.45rem, 6vw, 3rem);

          letter-spacing:
            .16em;
        }


        .cover-names {
          margin:
            .35rem 0 .9rem;

          font-size:
            clamp(4.1rem, 17vw, 7rem);

          line-height: .82;
          font-weight: 400;
        }


        .cover-save {
          font-size: .7rem;
          letter-spacing: .34em;
        }


        .enter-mark {
          position: absolute;
          z-index: 7;

          left: 50%;
          bottom: 7vh;

          transform:
            translateX(-50%);

          width: 76px;
          height: 76px;

          border:
            1px solid rgba(103,40,50,.5);

          border-radius: 50%;

          background:
            rgba(255,253,248,.9);

          color: var(--wine);

          font-size: 2rem;
          cursor: pointer;
        }


        .enter-mark:active {
          transform:
            translateX(-50%)
            scale(.94);
        }


        /* GENERAL */

        .invitation {
          opacity: 0;
          pointer-events: none;
          min-height: 100vh;
        }


        .invitation.is-visible {
          opacity: 1;
          pointer-events: auto;
        }


        .section {
          position: relative;

          min-height: 100svh;

          display: flex;
          align-items: center;
          justify-content: center;

          overflow: hidden;

          padding:
            5.5rem 1.2rem;
        }


        .section-inner {
          position: relative;
          z-index: 2;

          width: min(100%, 760px);

          text-align: center;
        }


        .eyebrow {
          font-size: .68rem;
          letter-spacing: .34em;
          text-transform: uppercase;
        }


        .light {
          color: var(--white);
        }


        .script {
          font-family: var(--script);
          font-weight: 400;
        }


        /* FECHA */

        .section-title {
          margin:
            .3rem 0 .15rem;

          color: var(--wine);

          font-size:
            clamp(4.5rem, 18vw, 7.5rem);

          line-height: .75;
        }


        .reserve-label {
          color: var(--wine);

          font-size: .72rem;
          letter-spacing: .28em;
          text-transform: uppercase;
        }


        .date-lockup {
          margin-top: 2rem;
          color: var(--wine);
        }


        .date-day,
        .date-month,
        .date-place {
          letter-spacing: .32em;
          text-transform: uppercase;
        }


        .date-day {
          font-size: .78rem;
        }


        .date-number {
          font-size:
            clamp(6rem, 25vw, 10rem);

          line-height: .76;

          margin: .2rem 0;
        }


        .date-month {
          font-size: .88rem;
        }


        .date-place {
          margin-top: 1.7rem;
          font-size: .78rem;
        }


        .countdown {
          display: grid;

          grid-template-columns:
            repeat(4, 1fr);

          width:
            min(100%, 520px);

          margin:
            2.8rem auto 2rem;

          gap: .4rem;
        }


        .count-item {
          border-left:
            1px solid rgba(103,40,50,.3);
        }


        .count-item:first-child {
          border-left: 0;
        }


        .count-item strong {
          display: block;

          color: var(--wine);

          font-size:
            clamp(1.5rem, 6vw, 2.7rem);

          font-weight: 400;
        }


        .count-item span {
          display: block;

          margin-top: .3rem;

          color: #746b63;

          font-size: .44rem;
          letter-spacing: .16em;
        }


        .calendar-button {
          display: inline-flex;

          align-items: center;
          justify-content: center;
          gap: .55rem;

          min-height: 52px;

          padding:
            0 1.3rem;

          border:
            1px solid var(--wine);

          border-radius: 999px;

          color: var(--wine);

          text-decoration: none;

          font-size: .64rem;
          letter-spacing: .17em;
        }


        .calendar-button span {
          font-size: 1.1rem;
        }


        .cartagena-strip {
          display: grid;

          grid-template-columns:
            repeat(3, 1fr);

          gap: 5px;

          margin:
            3.5rem -1.2rem -5.5rem;

          height: 25vh;
          min-height: 180px;
        }


        .cartagena-photo {
          overflow: hidden;
        }


        .cartagena-photo img {
          width: 100%;
          height: 100%;

          object-fit: cover;
          display: block;
        }


        /* HISTORIA */

        .story-heading {
          display: flex;
          flex-direction: column;
          align-items: center;

          margin:
            1rem auto 2.3rem;

          color: var(--wine);

          font-size:
            clamp(1.6rem, 7vw, 3rem);

          line-height: .95;
          font-weight: 400;
        }


        .story-heading strong {
          margin: .1rem 0;

          font-size:
            clamp(5rem, 21vw, 9rem);

          line-height: .72;
        }


        .story-collage {
          position: relative;

          width:
            min(100%, 700px);

          height: 58vh;
          min-height: 500px;

          margin: auto;
        }


        .story-photo {
          position: absolute;
          overflow: hidden;

          box-shadow:
            0 12px 30px rgba(70,50,40,.10);
        }


        .story-photo::before {
          content: "";

          position: absolute;
          inset: -8%;

          background:
            linear-gradient(
              145deg,
              rgba(205,157,123,.55),
              rgba(89,99,74,.28),
              rgba(103,40,50,.35)
            );

          filter: blur(15px);
        }


        .story-photo img {
          position: relative;
          z-index: 1;

          width: 100%;
          height: 100%;

          object-fit: cover;
          display: block;
        }


        .story-photo-one {
          left: 0;
          top: 0;

          width: 55%;
          height: 46%;

          transform: rotate(-2deg);

          clip-path:
            polygon(
              3% 2%,
              97% 0,
              100% 94%,
              94% 100%,
              2% 96%,
              0 8%
            );
        }


        .story-photo-two {
          right: 0;
          top: 11%;

          width: 48%;
          height: 48%;

          transform: rotate(2deg);

          clip-path:
            polygon(
              4% 0,
              97% 2%,
              100% 95%,
              93% 100%,
              1% 97%,
              0 5%
            );
        }


        .story-photo-three {
          left: 14%;
          bottom: 0;

          width: 73%;
          height: 47%;

          transform: rotate(-1deg);

          clip-path:
            polygon(
              3% 0,
              97% 2%,
              100% 94%,
              94% 100%,
              2% 98%,
              0 5%
            );
        }


        /* DRESS CODE */

        .dress-section {
          background: var(--olive);
          color: var(--white);
          min-height: 110svh;
        }


        .paper-texture.olive {
          background: var(--olive);
        }


        .paper-texture.olive .brush-a {
          width: 430px;
          height: 140px;

          top: -25px;
          left: -100px;

          background:
            rgba(255,255,255,.16);

          transform: rotate(12deg);
        }


        .paper-texture.olive .brush-b {
          width: 480px;
          height: 180px;

          right: -150px;
          top: 32%;

          background:
            rgba(255,255,255,.12);

          transform: rotate(-19deg);
        }


        .paper-texture.olive .brush-c {
          width: 500px;
          height: 170px;

          left: -180px;
          bottom: 4%;

          background:
            rgba(255,255,255,.13);

          transform: rotate(-11deg);
        }


        .dress-title {
          margin:
            .4rem 0 1.2rem;

          font-size:
            clamp(4.5rem, 18vw, 7.5rem);

          line-height: .75;
        }


        .dress-models {
          display: grid;

          grid-template-columns:
            1fr 1fr;

          gap: 1rem;

          max-width: 700px;

          margin: auto;
        }


        .model-panel {
          text-align: center;
        }


        .model-brush {
          position: relative;

          height: 43vh;
          min-height: 330px;

          display: flex;
          align-items: center;
          justify-content: center;
        }


        .model-brush::before {
          content: "";

          position: absolute;

          inset:
            4% 4%;

          background:
            rgba(255,253,248,.92);

          clip-path:
            polygon(
              5% 2%,
              96% 0,
              100% 8%,
              95% 94%,
              88% 100%,
              4% 96%,
              0 10%
            );

          transform: rotate(-2deg);
        }


        .model-silhouette {
          position: relative;
          z-index: 2;

          width: 76%;
          height: 86%;
        }


        .model-silhouette .head {
          position: absolute;

          top: 3%;
          left: 50%;

          width: 24%;
          aspect-ratio: 1;

          transform: translateX(-50%);

          border-radius: 50%;
        }


        .model-silhouette .body {
          position: absolute;

          top: 19%;
          left: 50%;

          transform: translateX(-50%);

          width: 46%;
          height: 48%;
        }


        .model-silhouette.man .head {
          background: #1e1e1d;
        }


        .model-silhouette.man .body {
          background:
            linear-gradient(
              90deg,
              #111 0 44%,
              #f1eee5 45% 55%,
              #111 56%
            );

          clip-path:
            polygon(
              22% 0,
              78% 0,
              100% 100%,
              0 100%
            );
        }


        .model-silhouette .leg {
          position: absolute;

          top: 63%;

          width: 20%;
          height: 34%;

          background: #171717;
        }


        .model-silhouette .leg-left {
          left: 29%;
          transform: rotate(2deg);
        }


        .model-silhouette .leg-right {
          right: 29%;
          transform: rotate(-2deg);
        }


        .model-silhouette.woman .head {
          background: #c98762;
        }


        .model-silhouette.woman .body {
          width: 30%;
          height: 28%;

          background: #d89368;

          clip-path:
            polygon(
              25% 0,
              75% 0,
              100% 100%,
              0 100%
            );
        }


        .model-silhouette.woman .dress {
          position: absolute;

          top: 37%;
          left: 50%;

          transform: translateX(-50%);

          width: 82%;
          height: 61%;

          background:
            linear-gradient(
              160deg,
              #e29a70,
              #c97857
            );

          clip-path:
            polygon(
              39% 0,
              61% 0,
              70% 18%,
              100% 100%,
              0 100%,
              30% 18%
            );
        }


        .model-label {
          margin-top: .2rem;

          letter-spacing: .3em;
          font-size: .68rem;
        }


        .model-panel p {
          margin:
            .4rem 0 0;

          font-size: 1rem;
          font-style: italic;
       
