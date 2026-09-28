'use client';

import { useEffect, useMemo, useState } from 'react';

/* =========================================================
   CONFIGURACIÓN
========================================================= */

const WEDDING_DATE = new Date('2027-03-06T16:00:00-05:00');

/*
  Cuando subamos las fotos de ustedes a /public,
  cambia solamente estos nombres.
*/
const COUPLE_PHOTOS = [
  '/foto-pareja-1.jpg',
  '/foto-pareja-2.jpg',
  '/foto-pareja-3.jpg',
];

/*
  Lista de invitados.
  MÁS ADELANTE reemplazaremos estos ejemplos por la lista real.
*/
const GUESTS = [
  {
    name: 'Mauro Olivera',
    seats: 2,
  },
  {
    name: 'Juan Perez',
    seats: 1,
  },
  {
    name: 'Maria Gonzalez',
    seats: 2,
  },
];

/* =========================================================
   UTILIDADES
========================================================= */

function normalizeName(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

/* =========================================================
   CUENTA REGRESIVA
========================================================= */

function Countdown() {
  const calculate = () => {
    const difference = Math.max(
      0,
      WEDDING_DATE.getTime() - Date.now()
    );

    return {
      days: Math.floor(difference / 86400000),
      hours: Math.floor(difference / 3600000) % 24,
      minutes: Math.floor(difference / 60000) % 60,
      seconds: Math.floor(difference / 1000) % 60,
    };
  };

  const [time, setTime] = useState(calculate);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(calculate());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="countdown">
      <div>
        <strong>{String(time.days).padStart(2, '0')}</strong>
        <span>DÍAS</span>
      </div>

      <div>
        <strong>{String(time.hours).padStart(2, '0')}</strong>
        <span>HORAS</span>
      </div>

      <div>
        <strong>{String(time.minutes).padStart(2, '0')}</strong>
        <span>MINUTOS</span>
      </div>

      <div>
        <strong>{String(time.seconds).padStart(2, '0')}</strong>
        <span>SEGUNDOS</span>
      </div>
    </div>
  );
}

/* =========================================================
   FOTO CON FALLBACK
========================================================= */

function CouplePhoto({ src, className = '' }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className={`couple-placeholder ${className}`}>
        <span>M&Y</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt="Mauro y Yeluxa"
      className={`couple-photo ${className}`}
      onError={() => setFailed(true)}
    />
  );
}

/* =========================================================
   APP
========================================================= */

export default function Home() {
  const [slide, setSlide] = useState(0);

  const [guestName, setGuestName] = useState('');
  const [guestError, setGuestError] = useState('');
  const [guest, setGuest] = useState(null);

  const normalizedInput = useMemo(
    () => normalizeName(guestName),
    [guestName]
  );

  const goToSlide = (number) => {
    setSlide(number);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const validateGuest = () => {
    setGuestError('');

    if (!normalizedInput) {
      setGuestError('Escribe tu nombre completo.');
      return;
    }

    const found = GUESTS.find(
      (item) => normalizeName(item.name) === normalizedInput
    );

    if (!found) {
      setGuestError(
        'No encontramos este nombre en nuestra lista de invitados. Verifica cómo lo escribiste.'
      );
      setGuest(null);
      return;
    }

    setGuest(found);
  };

  const confirmAttendance = () => {
    if (!guest) return;

    goToSlide(6);
  };

  return (
    <main className="wedding">

      {/* =====================================================
          SLIDE 1 — PORTADA
      ===================================================== */}

      {slide === 0 && (
        <section className="slide cover-slide">

          <div className="cover-background">
            <CouplePhoto
              src={COUPLE_PHOTOS[0]}
              className="cover-main-photo"
            />

            <div className="cover-overlay" />
          </div>

          <div className="cover-content">

            <p className="cover-small">
              NOS CASAMOS
            </p>

            <h1>
              Mauro <em>&</em> Yeluxa
            </h1>

            <div className="cover-line" />

            <p className="save-title">
              SAVE THE DATE
            </p>

          </div>

          <button
            className="follow-button"
            onClick={() => goToSlide(1)}
          >
            síguenos..
          </button>

        </section>
      )}

      {/* =====================================================
          SLIDE 2 — SAVE THE DATE
      ===================================================== */}

      {slide === 1 && (
        <section className="slide date-slide">

          <div className="top-label">
            SAVE THE DATE
          </div>

          <div className="date-content">

            <p className="eyebrow">
              NUESTRA BODA
            </p>

            <h2>
              Reserva esta fecha
            </h2>

            <div className="calendar-date">
              <span>SÁBADO</span>
              <strong>06</strong>
              <span>MARZO · 2027</span>
            </div>

            <p className="location">
              CARTAGENA DE INDIAS
            </p>

            <Countdown />

            <button
              className="outline-button"
              onClick={() => {
                const calendarUrl =
                  'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Mauro%20%26%20Yeluxa%20-%20Nuestra%20Boda&dates=20270306T160000/20270306T235900&details=Nos%20vemos%20en%20Cartagena%20de%20Indias.&location=Cartagena%20de%20Indias';

                window.open(
                  calendarUrl,
                  '_blank'
                );
              }}
            >
              + AÑADIR A MI CALENDARIO
            </button>

          </div>

          <div className="cartagena-strip">

            <div className="cartagena-photo photo-one">
              <div />
            </div>

            <div className="cartagena-photo photo-two">
              <div />
            </div>

            <div className="cartagena-photo photo-three">
              <div />
            </div>

          </div>

          <button
            className="next-arrow"
            onClick={() => goToSlide(2)}
            aria-label="Continuar"
          >
            ↓
          </button>

        </section>
      )}

      {/* =====================================================
          SLIDE 3 — NUESTRA HISTORIA
      ===================================================== */}

      {slide === 2 && (
        <section className="slide story-slide">

          <div className="story-header">
            <p className="eyebrow">
              NUESTRA HISTORIA
            </p>

            <h2>
              Un nuevo capítulo
            </h2>

            <p className="story-text">
              Después de tantos momentos
              compartidos, viajes, sueños y
              aventuras, llegó el momento de
              comenzar un nuevo capítulo juntos.
            </p>
          </div>

          <div className="story-photos">

            <CouplePhoto
              src={COUPLE_PHOTOS[1]}
              className="story-photo large"
            />

            <CouplePhoto
              src={COUPLE_PHOTOS[2]}
              className="story-photo small"
            />

          </div>

          <p className="story-quote">
            “La vida es más linda cuando
            la compartimos.”
          </p>

          <button
            className="next-arrow dark"
            onClick={() => goToSlide(3)}
            aria-label="Continuar"
          >
            ↓
          </button>

        </section>
      )}

      {/* =====================================================
          SLIDE 4 — DRESS CODE
      ===================================================== */}

      {slide === 3 && (
        <section className="slide dress-slide">

          <div className="dress-content">

            <p className="eyebrow light">
              DRESS CODE
            </p>

            <h2>
              Formal
            </h2>

            <div className="dress-grid">

              <div className="dress-column">
                <span className="dress-symbol">
                  ♢
                </span>

                <h3>
                  Hombres
                </h3>

                <p>
                  Traje formal
                  <br />
                  Preferiblemente oscuro
                </p>
              </div>

              <div className="dress-column">
                <span className="dress-symbol">
                  ♢
                </span>

                <h3>
                  Mujeres
                </h3>

                <p>
                  Vestido formal
                </p>
              </div>

            </div>

            <div className="white-note">
              EL BLANCO ESTÁ RESERVADO
              <br />
              PARA LOS NOVIOS
            </div>

          </div>

          <button
            className="next-arrow light-arrow"
            onClick={() => goToSlide(4)}
            aria-label="Continuar"
          >
            ↓
          </button>

        </section>
      )}

      {/* =====================================================
          SLIDE 5 — CONFIRMA ASISTENCIA
      ===================================================== */}

      {slide === 4 && (
        <section className="slide rsvp-slide">

          <div className="rsvp-content">

            <p className="eyebrow burgundy">
              CONFIRMA ASISTENCIA
            </p>

            <h2>
              Queremos contar contigo
            </h2>

            <p className="rsvp-intro">
              Escribe tu nombre completo para
              confirmar tu invitación.
            </p>

            <div className="name-form">

              <label htmlFor="guest-name">
                NOMBRE COMPLETO
              </label>

              <input
                id="guest-name"
                type="text"
                value={guestName}
                onChange={(e) => {
                  setGuestName(e.target.value);
                  setGuestError('');
                  setGuest(null);
                }}
                placeholder="Escribe tu nombre"
                autoComplete="name"
              />

              {guestError && (
                <p className="guest-error">
                  {guestError}
                </p>
              )}

              {!guest && (
                <button
                  className="primary-button"
                  onClick={validateGuest}
                >
                  CONTINUAR
                </button>
              )}

              {guest && (
                <div className="guest-found">

                  <div className="check">
                    ✓
                  </div>

                  <p>
                    Invitación encontrada
                  </p>

                  <strong>
                    {guest.name}
                  </strong>

                  <button
                    className="primary-button"
                    onClick={confirmAttendance}
                  >
                    ENVIAR CONFIRMACIÓN
                  </button>

                </div>
              )}

            </div>

          </div>

        </section>
      )}

      {/* =====================================================
          SLIDE 6 — OCULTO HASTA CONFIRMACIÓN
      ===================================================== */}

      {slide === 6 && guest && (
        <section className="slide confirmed-slide">

          <div className="confirmed-content">

            <span className="confirmed-heart">
              ♥
            </span>

            <p className="eyebrow">
              CONFIRMACIÓN RECIBIDA
            </p>

            <h2>
              Nos vemos en Cartagena
            </h2>

            <div className="confirmed-line" />

            <p className="confirmed-seats">
              CUPOS CONFIRMADOS
            </p>

            <strong className="seat-number">
              {guest.seats}
            </strong>

            <p className="confirmed-message">
              Muy pronto te enviaremos
              más detalles.
            </p>

          </div>

        </section>
      )}

      {/* =====================================================
          NAVEGACIÓN LATERAL
      ===================================================== */}

      {slide > 0 && slide < 6 && (
        <button
          className="back-button"
          onClick={() =>
            goToSlide(slide - 1)
          }
          aria-label="Regresar"
        >
          ←
        </button>
      )}

      {/* =====================================================
          ESTILOS
      ===================================================== */}

      <style>{`

        :root {
          --ivory: #f5f1e8;
          --paper: #eee8dc;
          --olive: #59634a;
          --deep: #3e4734;
          --burgundy: #572932;
          --ink: #27261f;
          --muted: #777267;
          --line: rgba(62,71,52,.2);
        }

        * {
          box-sizing: border-box;
        }

        html,
        body {
          margin: 0;
          padding: 0;
          background: var(--ivory);
          color: var(--ink);
        }

        body {
          overflow-x: hidden;
        }

        button,
        input {
          font: inherit;
        }

        button {
          -webkit-tap-highlight-color: transparent;
        }

        .wedding {
          min-height: 100svh;
          background: var(--ivory);
        }

        .slide {
          min-height: 100svh;
          width: 100%;
          position: relative;
          overflow: hidden;
        }

        /* =====================================================
           PORTADA
        ===================================================== */

        .cover-slide {
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          background: var(--deep);
        }

        .cover-background {
          position: absolute;
          inset: 0;
        }

        .cover-main-photo {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          display: block;
        }

        .cover-overlay {
          position: absolute;
          inset: 0;

          background:
            linear-gradient(
              to bottom,
              rgba(20,28,18,.18),
              rgba(20,28,18,.42)
            );
        }

        .cover-content {
          position: relative;
          z-index: 2;
          width: 90%;
          max-width: 700px;
          text-align: center;
        }

        .cover-small {
          margin: 0 0 20px;

          font-family:
            var(--font-cormorant),
            Georgia,
            serif;

          font-size: 18px;
          letter-spacing: .25em;
        }

        .cover-content h1 {
          margin: 0;

          font-family:
            var(--font-cormorant),
            Georgia,
            serif;

          font-size: clamp(
            54px,
            14vw,
            105px
          );

          font-weight: 400;
          line-height: .9;
        }

        .cover-content h1 em {
          font-style: italic;
        }

        .cover-line {
          width: 65px;
          height: 1px;
          margin: 30px auto 20px;

          background: rgba(255,255,255,.7);
        }

        .save-title {
          margin: 0;

          font-family:
            var(--font-cormorant),
            Georgia,
            serif;

          font-size: 19px;
          letter-spacing: .3em;
        }

        .follow-button {
          position: absolute;
          z-index: 5;
          bottom: 7vh;
          left: 50%;
          transform: translateX(-50%);

          border: 0;
          padding: 8px 14px;

          background: transparent;
          color: white;

          font-family:
            var(--font-parfumerie),
            cursive;

          font-size: 22px;
          cursor: pointer;
        }

        .follow-button::after {
          content: '';
          display: block;

          width: 100%;
          height: 1px;
          margin-top: 3px;

          background: rgba(255,255,255,.65);
        }

        /* =====================================================
           SAVE THE DATE
        ===================================================== */

        .date-slide {
          min-height: 100svh;
          display: flex;
          flex-direction: column;
          align-items: center;
          background: var(--ivory);
          text-align: center;
        }

        .top-label {
          padding-top: 8vh;

          font-family:
            var(--font-cormorant),
            Georgia,
            serif;

          font-size: 15px;
          letter-spacing: .28em;
          color: var(--burgundy);
        }

        .date-content {
          width: min(90%, 650px);
          padding: 8vh 0 5vh;
        }

        .eyebrow {
          margin: 0 0 15px;

          font-family:
            var(--font-cormorant),
            Georgia,
            serif;

          font-size: 16px;
          letter-spacing: .2em;
          text-transform: uppercase;
          color: var(--burgundy);
        }

        .date-content h2,
        .story-header h2,
        .rsvp-content h2,
        .confirmed-content h2 {
          margin: 0;

          font-family:
            var(--font-cormorant),
            Georgia,
            serif;

          font-weight: 400;
          font-size: clamp(
            42px,
            10vw,
            72px
          );

          line-height: .95;
        }

        .calendar-date {
          margin: 38px auto 18px;

          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .calendar-date span {
          font-family:
            var(--font-cormorant),
            Georgia,
            serif;

          font-size: 16px;
          letter-spacing: .25em;
        }

        .calendar-date strong {
          margin: 5px 0;

          font-family:
            var(--font-cormorant),
            Georgia,
            serif;

          font-size: 92px;
          line-height: .8;
          font-weight: 400;

          color: var(--burgundy);
        }

        .location {
          margin: 0;

          font-family:
            var(--font-cormorant),
            Georgia,
            serif;

          font-size: 17px;
          letter-spacing: .25em;
        }

        .countdown {
          display: flex;
          justify-content: center;
          gap: clamp(
            18px,
            6vw,
            50px
          );

          margin: 35px 0;
        }

        .countdown div {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .countdown strong {
          font-family:
            var(--font-cormorant),
            Georgia,
            serif;

          font-size: 31px;
          font-weight: 400;

          color: var(--deep);
        }

        .countdown span {
          margin-top: 4px;

          font-family:
            var(--font-cormorant),
            Georgia,
            serif;

          font-size: 8px;
          letter-spacing: .16em;
        }

        .outline-button {
          border: 1px solid var(--burgundy);
          background: transparent;
          color: var(--burgundy);

          padding: 13px 20px;

          font-family:
            var(--font-cormorant),
            Georgia,
            serif;

          font-size: 13px;
          letter-spacing: .13em;

          cursor: pointer;
        }

        .cartagena-strip {
          width: 100%;
          height: 30vh;
          min-height: 190px;

          display: grid;
          grid-template-columns:
            1fr 1.25fr 1fr;

          gap: 4px;

          margin-top: auto;
        }

        .cartagena-photo {
          position: relative;
          overflow: hidden;
        }

        /*
          Estas tres áreas quedan preparadas para las
          fotos reales de Cartagena.
        */

        .cartagena-photo::before {
          content: '';
          position: absolute;
          inset: 0;
        }

        .photo-one::before {
          background:
            linear-gradient(
              145deg,
              #817761,
              #c5b59a
            );
        }

        .photo-two::before {
          background:
            linear-gradient(
              145deg,
              #a58a6d,
              #dfcdb1
            );
        }

        .photo-three::before {
          background:
            linear-gradient(
              145deg,
              #59634a,
              #b6a88f
            );
        }

        /* =====================================================
           HISTORIA
        ===================================================== */

        .story-slide {
          background: var(--paper);
          padding: 10vh 7vw;
          text-align: center;
        }

        .story-header {
          max-width: 680px;
          margin: 0 auto;
        }

        .story-text {
          max-width: 560px;
          margin: 25px auto 0;

          font-family:
            var(--font-dm-sans),
            sans-serif;

          font-size: 14px;
          line-height: 1.8;
          color: var(--muted);
        }

        .story-photos {
          max-width: 700px;
          margin: 55px auto 45px;

          display: grid;
          grid-template-columns: 1.2fr .8fr;
          gap: 14px;

          align-items: end;
        }

        .couple-photo {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .story-photo.large {
          height: 420px;
        }

        .story-photo.small {
          height: 330px;
        }

        .couple-placeholder {
          display: flex;
          align-items: center;
          justify-content: center;

          background:
            linear-gradient(
              145deg,
              #c6bca9,
              #8c8779
            );

          color: rgba(255,255,255,.9);
        }

        .couple-placeholder span {
          font-family:
            var(--font-cormorant),
            Georgia,
            serif;

          font-size: 55px;
          font-style: italic;
        }

        .story-quote {
          margin: 0;

          font-family:
            var(--font-parfumerie),
            cursive;

          font-size: 28px;
          color: var(--burgundy);
        }

        /* =====================================================
           DRESS CODE
        ===================================================== */

        .dress-slide {
          display: flex;
          align-items: center;
          justify-content: center;

          background: var(--olive);
          color: var(--ivory);

          text-align: center;
        }

        .dress-content {
          width: min(90%, 700px);
        }

        .eyebrow.light {
          color: var(--ivory);
        }

        .dress-content h2 {
          margin: 0;

          font-family:
            var(--font-cormorant),
            Georgia,
            serif;

          font-size: clamp(
            55px,
            13vw,
            90px
          );

          font-weight: 400;
        }

        .dress-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 50px;

          margin: 60px 0;
        }

        .dress-symbol {
          font-size: 28px;
        }

        .dress-column h3 {
          margin: 10px 0;

          font-family:
            var(--font-cormorant),
            Georgia,
            serif;

          font-size: 34px;
          font-weight: 400;
        }

        .dress-column p {
          margin: 0;

          font-family:
            var(--font-dm-sans),
            sans-serif;

          font-size: 12px;
          line-height: 1.8;

          color: rgba(245,241,232,.8);
        }

        .white-note {
          padding: 18px;

          border-top: 1px solid
            rgba(245,241,232,.3);

          border-bottom: 1px solid
            rgba(245,241,232,.3);

          font-family:
            var(--font-dm-sans),
            sans-serif;

          font-size: 9px;
          line-height: 1.8;
          letter-spacing: .2em;
        }

        /* =====================================================
           RSVP
        ===================================================== */

        .rsvp-slide {
          background: var(--ivory);

          display: flex;
          align-items: center;
          justify-content: center;

          text-align: center;
          padding: 10vh 24px;
        }

        .rsvp-content {
          width: min(100%, 560px);
        }

        .burgundy {
          color: var(--burgundy);
        }

        .rsvp-intro {
          margin: 28px auto 40px;
          max-width: 440px;

          font-family:
            var(--font-dm-sans),
            sans-serif;

          font-size: 14px;
          line-height: 1.8;

          color: var(--muted);
        }

        .name-form {
          text-align: left;
        }

        .name-form label {
          display: block;

          margin-bottom: 8px;

          font-family:
            var(--font-cormorant),
            Georgia,
            serif;

          font-size: 13px;
          letter-spacing: .14em;
          color: var(--burgundy);
        }

        .name-form input {
          width: 100%;

          border: 0;
          border-bottom: 1px solid
            rgba(62,71,52,.35);

          background: transparent;

          padding: 14px 2px;

          outline: none;

          font-family:
            var(--font-cormorant),
            Georgia,
            serif;

          font-size: 21px;

          color: var(--ink);
        }

        .name-form input:focus {
          border-color: var(--burgundy);
        }

        .primary-button {
          width: 100%;

          margin-top: 28px;

          border: 1px solid var(--burgundy);

          background: var(--burgundy);
          color: white;

          padding: 16px;

          font-family:
            var(--font-cormorant),
            Georgia,
            serif;

          font-size: 13px;
          letter-spacing: .16em;

          cursor: pointer;
        }

        .guest-error {
          margin: 12px 0 0;

          font-family:
            var(--font-dm-sans),
            sans-serif;

          font-size: 12px;
          line-height: 1.5;

          color: var(--burgundy);
        }

        .guest-found {
          margin-top: 25px;
          padding: 25px;

          border: 1px solid
            rgba(87,41,50,.2);

          background: rgba(87,41,50,.035);

          text-align: center;
        }

        .check {
          width: 34px;
          height: 34px;

          margin: 0 auto 10px;

          border-radius: 50%;

          display: flex;
          align-items: center;
          justify-content: center;

          background: var(--olive);
          color: white;
        }

        .guest-found p {
          margin: 0 0 4px;

          font-family:
            var(--font-dm-sans),
            sans-serif;

          font-size: 11px;
          color: var(--muted);
        }

        .guest-found strong {
          font-family:
            var(--font-cormorant),
            Georgia,
            serif;

          font-size: 27px;
          font-weight: 400;
        }

        /* =====================================================
           CONFIRMACIÓN OCULTA
        ===================================================== */

        .confirmed-slide {
          background: var(--burgundy);

          display: flex;
          align-items: center;
          justify-content: center;

          color: var(--ivory);
          text-align: center;
        }

        .confirmed-content {
          width: min(90%, 600px);
        }

        .confirmed-heart {
          display: block;

          margin-bottom: 30px;

          font-size: 28px;
        }

        .confirmed-content .eyebrow {
          color: var(--ivory);
        }

        .confirmed-content h2 {
          color: var(--ivory);
        }

        .confirmed-line {
          width: 55px;
          height: 1px;

          margin: 30px auto;

          background: rgba(245,241,232,.5);
        }

        .confirmed-seats {
          margin: 0;

          font-family:
            var(--font-dm-sans),
            sans-serif;

          font-size: 9px;
          letter-spacing: .25em;
        }

        .seat-number {
          display: block;

          margin-top: 5px;

          font-family:
            var(--font-cormorant),
            Georgia,
            serif;

          font-size: 80px;
          font-weight: 400;
        }

        .confirmed-message {
          margin-top: 25px;

          font-family:
            var(--font-parfumerie),
            cursive;

          font-size: 29px;
        }

        /* =====================================================
           NAVEGACIÓN
        ===================================================== */

        .next-arrow {
          position: absolute;
          z-index: 20;

          left: 50%;
          bottom: 25px;

          transform: translateX(-50%);

          border: 0;
          background: transparent;

          color: var(--burgundy);

          font-size: 24px;

          cursor: pointer;

          animation: arrowFloat 2s ease-in-out infinite;
        }

        .next-arrow.dark {
          color: var(--burgundy);
        }

        .light-arrow {
          color: var(--ivory);
        }

        .back-button {
          position: fixed;
          z-index: 100;

          top: 20px;
          left: 18px;

          width: 35px;
          height: 35px;

          border: 1px solid
            rgba(87,41,50,.25);

          border-radius: 50%;

          background: rgba(245,241,232,.7);

          color: var(--burgundy);

          cursor: pointer;
        }

        @keyframes arrowFloat {
          0%,
          100% {
            transform:
              translateX(-50%)
              translateY(0);
          }

          50% {
            transform:
              translateX(-50%)
              translateY(5px);
          }
        }

        /* =====================================================
           MÓVIL
        ===================================================== */

        @media (max-width: 600px) {

          .cover-content h1 {
            font-size: 59px;
          }

          .cover-small {
            font-size: 15px;
          }

          .save-title {
            font-size: 16px;
          }

          .date-content {
            padding-top: 6vh;
          }

          .calendar-date strong {
            font-size: 82px;
          }

          .cartagena-strip {
            height: 25vh;
            min-height: 160px;
          }

          .story-slide {
            padding: 9vh 22px;
          }

          .story-photos {
            margin-top: 40px;
            grid-template-columns: 1.1fr .9fr;
          }

          .story-photo.large {
            height: 310px;
          }

          .story-photo.small {
            height: 250px;
          }

          .dress-grid {
            gap: 18px;
            margin: 45px 0;
          }

          .dress-column h3 {
            font-size: 28px;
          }

          .follow-button {
            bottom: 6vh;
          }
        }

        @media (max-width: 380px) {

          .cover-content h1 {
            font-size: 51px;
          }

          .calendar-date strong {
            font-size: 70px;
          }

          .countdown {
            gap: 13px;
          }

          .countdown strong {
            font-size: 26px;
          }

          .countdown span {
            font-size: 7px;
          }
        }

      `}</style>
    </main>
  );
}
