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

      <i />

      <div>
        <strong>{String(values.hours).padStart(2, "0")}</strong>
        <span>HORAS</span>
      </div>

      <i />

      <div>
        <strong>{String(values.minutes).padStart(2, "0")}</strong>
        <span>MINUTOS</span>
      </div>

      <i />

      <div>
        <strong>{String(values.seconds).padStart(2, "0")}</strong>
        <span>SEGUNDOS</span>
      </div>
    </div>
  );
}

function Slide({ id, image, children, className = "" }) {
  return (
    <section id={id} className={`slide ${className}`}>
      <img className="background" src={image} alt="" />
      {children}
    </section>
  );
}

export default function Home() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmedSeats, setConfirmedSeats] = useState(null);
  const [error, setError] = useState("");

  function openInvitation() {
    setTimeout(() => {
      document
        .getElementById("date-slide")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }

  async function submitRsvp(e) {
    e.preventDefault();

    const cleanName = name.trim();

    if (!cleanName) {
      setError("Por favor escribe tu nombre completo.");
      return;
    }

    setLoading(true);
    setError("");

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
        setError("No encontramos ese nombre en la lista de invitados.");
        setLoading(false);
        return;
      }

      setConfirmedSeats(data.seats);
      setLoading(false);

      setTimeout(() => {
        document
          .getElementById("confirmation-slide")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 200);
    } catch (err) {
      setError("No pudimos confirmar tu asistencia. Intenta nuevamente.");
      setLoading(false);
    }
  }

  function addToCalendar() {
    const start = "20270306T210000Z";
    const end = "20270307T030000Z";

    const calendarUrl =
      "https://calendar.google.com/calendar/render?action=TEMPLATE" +
      "&text=" +
      encodeURIComponent("Boda Mauro & Yeluxa") +
      "&dates=" +
      start +
      "/" +
      end +
      "&details=" +
      encodeURIComponent("Nuestra boda 💍") +
      "&location=" +
      encodeURIComponent("Cartagena de Indias, Colombia");

    window.open(calendarUrl, "_blank");
  }

  return (
    <main className="wedding-page">

      {/* ================= PORTADA ================= */}

      <Slide
        id="cover-slide"
        image={SLIDES.cover}
        className="cover-slide"
      >
        <div className="cover-text">
          <div className="eyebrow">NOS CASAMOS</div>

          <h1>
            Mauro <span>&</span> Yeluxa
          </h1>

          <div className="cover-save">SAVE THE DATE</div>
        </div>

        <button
          className="next-button"
          onClick={openInvitation}
          aria-label="Abrir invitación"
        >
          <span>•••</span>
        </button>
      </Slide>


      {/* ================= FECHA ================= */}

      <Slide
        id="date-slide"
        image={SLIDES.date}
        className="date-slide"
      >
        <div className="date-content">

          <div className="section-title">
            N U E S T R A&nbsp;&nbsp; B O D A
          </div>

          <div className="small-line" />

          <h2 className="script-title">
            Reserva
          </h2>

          <div className="subtitle">
            E S T A&nbsp;&nbsp; F E C H A
          </div>

          <div className="small-line lower" />

          <div className="date-block">

            <div className="weekday">
              S Á B A D O
            </div>

            <div className="day">
              06
            </div>

            <div className="month">
              M A R Z O&nbsp;&nbsp;·&nbsp;&nbsp;2 0 2 7
            </div>

          </div>

          <div className="city">
            C A R T A G E N A&nbsp;&nbsp; D E&nbsp;&nbsp; I N D I A S
          </div>

          <Countdown />

          <button
            className="calendar-button"
            onClick={addToCalendar}
          >
            <span className="calendar-icon">□</span>
            A Ñ A D I R&nbsp;&nbsp; A&nbsp;&nbsp; M I&nbsp;&nbsp; C A L E N D A R I O
          </button>

        </div>
      </Slide>


      {/* ================= HISTORIA ================= */}

      <Slide
        id="story-slide"
        image={SLIDES.story}
        className="story-slide"
      >
        <div className="story-content">

          <div className="section-title">
            N U E S T R A&nbsp;&nbsp; H I S T O R I A
          </div>

          <div className="small-line" />

          <div className="story-quote">
            <span>La vida es más</span>

            <strong>linda</strong>

            <span>cuando la</span>

            <span>compartimos.</span>
          </div>

        </div>
      </Slide>


      {/* ================= DRESS CODE ================= */}

      <Slide
        id="dress-slide"
        image={SLIDES.dress}
        className="dress-slide"
      >
        <div className="dress-content">

          <div className="dress-title">
            D R E S S&nbsp;&nbsp; C O D E
          </div>

          <div className="dress-line" />

          <h2 className="dress-script">
            Formal
          </h2>

          <div className="dress-people">

            <div className="person-column">
              <div className="person-space" />

              <div className="person-label">
                H O M B R E S
              </div>

              <div className="person-description">
                Traje formal
              </div>
            </div>

            <div className="person-column">
              <div className="person-space" />

              <div className="person-label">
                M U J E R E S
              </div>

              <div className="person-description">
                Vestido formal largo
              </div>
            </div>

          </div>

          <div className="white-note">
            <div className="note-line" />

            E L&nbsp;&nbsp; B L A N C O&nbsp;&nbsp; E S T Á&nbsp;&nbsp; R E S E R V A D O
            <br />
            P A R A&nbsp;&nbsp; L O S&nbsp;&nbsp; N O V I O S

            <div className="note-line bottom" />
          </div>

        </div>
      </Slide>


      {/* ================= RSVP ================= */}

      <Slide
        id="rsvp-slide"
        image={SLIDES.rsvp}
        className="rsvp-slide"
      >
        <form
          className="rsvp-content"
          onSubmit={submitRsvp}
        >

          <div className="rsvp-title">
            C O N F I R M A
          </div>

          <div className="rsvp-line" />

          <h2 className="rsvp-script">
            Asistencia
          </h2>

          <p className="rsvp-text">
            Será un honor
            <br />
            compartir este día
            <br />
            contigo.
          </p>

          <div className="rsvp-separator" />

          <label>
            N O M B R E&nbsp;&nbsp; C O M P L E T O
          </label>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Escribe tu nombre"
            autoComplete="name"
          />

          {error && (
            <div className="rsvp-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="confirm-button"
            disabled={loading}
          >
            {loading ? "CONFIRMANDO..." : "C O N F I R M A R"}
          </button>

        </form>
      </Slide>


      {/* ================= CONFIRMACIÓN ================= */}

      {confirmedSeats !== null && (
        <Slide
          id="confirmation-slide"
          image={SLIDES.confirmation}
          className="confirmation-slide"
        >
          <div className="confirmation-content">

            <div className="confirmation-title">
              ¡ G R A C I A S !
            </div>

            <div className="confirmation-line" />

            <h2>
              T U&nbsp;&nbsp; A S I S T E N C I A
              <br />
              H A&nbsp;&nbsp; S I D O&nbsp;&nbsp; C O N F I R M A D A
            </h2>

            <div className="seat-box">
              <span>CUPOS CONFIRMADOS</span>

              <strong>
                {confirmedSeats}
              </strong>

              <span>
                {confirmedSeats === 1 ? "PERSONA" : "PERSONAS"}
              </span>
            </div>

            <p>
              Muy pronto te enviaremos
              <br />
              más detalles.
            </p>

          </div>
        </Slide>
      )}


      <style jsx global>{`

        @import url('https://fonts.googleapis.com/css2?family=Allura&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap');

        :root {
          --wine: #64151e;
          --wine-dark: #4d1018;
          --paper: #f8f5ef;
          --olive: #60764b;
          --cream: #f7f1e8;

          --serif: "Cormorant Garamond", Georgia, serif;

          --script:
            "Slight Script",
            "Brittany Signature",
            "Allura",
            "Great Vibes",
            cursive;
        }

        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
          background: var(--paper);
        }

        body {
          margin: 0;
          padding: 0;
          background: var(--paper);
          color: var(--wine);
          font-family: var(--serif);
        }

        button,
        input {
          font-family: inherit;
        }

        .wedding-page {
          width: 100%;
          overflow-x: hidden;
          background: var(--paper);
        }

        .slide {
          position: relative;
          width: 100%;
          min-height: 100svh;
          overflow: hidden;
          isolation: isolate;
        }

        .background {
          position: absolute;
          inset: 0;
          z-index: -2;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        /* PORTADA */

        .cover-text {
          position: absolute;
          top: 9%;
          left: 50%;
          width: 90%;
          transform: translateX(-50%);
          text-align: center;
          color: var(--wine);
        }

        .eyebrow {
          font-family: var(--serif);
          font-size: clamp(13px, 3.5vw, 24px);
          letter-spacing: .42em;
          margin-right: -.42em;
          font-weight: 500;
        }

        .cover-text h1 {
          margin: 15px 0 10px;
          font-family: var(--script);
          font-size: clamp(54px, 15vw, 115px);
          font-weight: 400;
          line-height: .9;
          white-space: nowrap;
        }

        .cover-text h1 span {
          font-family: var(--serif);
          font-size: .45em;
          font-style: italic;
          margin: 0 5px;
        }

        .cover-save {
          font-family: var(--serif);
          font-size: clamp(13px, 3vw, 21px);
          letter-spacing: .32em;
          margin-right: -.32em;
        }

        .next-button {
          position: absolute;
          left: 50%;
          bottom: 6.5%;
          transform: translateX(-50%);
          width: 74px;
          height: 74px;
          border-radius: 50%;
          border: 1px solid rgba(100,21,30,.35);
          background: rgba(255,255,255,.82);
          color: var(--wine);
          box-shadow: 0 12px 30px rgba(70,30,20,.15);
          cursor: pointer;
        }

        .next-button span {
          font-size: 20px;
          letter-spacing: 3px;
          margin-left: 3px;
        }

        /* FECHA */

        .date-content {
          position: absolute;
          top: 5%;
          left: 50%;
          width: 92%;
          transform: translateX(-50%);
          text-align: center;
          color: var(--wine);
        }

        .section-title,
        .dress-title,
        .rsvp-title {
          font-family: var(--serif);
          font-weight: 500;
          letter-spacing: .38em;
          margin-right: -.38em;
          font-size: clamp(14px, 3.5vw, 24px);
        }

        .small-line,
        .dress-line,
        .rsvp-line,
        .confirmation-line {
          width: 76px;
          height: 1px;
          background: currentColor;
          opacity: .55;
          margin: 17px auto 13px;
        }

        .script-title {
          margin: 0;
          font-family: var(--script);
          font-size: clamp(70px, 19vw, 145px);
          font-weight: 400;
          line-height: .8;
        }

        .subtitle {
          margin-top: 2px;
          font-family: var(--serif);
          font-size: clamp(18px, 5vw, 32px);
          font-weight: 600;
          letter-spacing: .25em;
          margin-right: -.25em;
        }

        .lower {
          margin-top: 20px;
        }

        .date-block {
          margin-top: 16px;
        }

        .weekday {
          font-family: var(--serif);
          font-size: clamp(14px, 3.5vw, 22px);
          letter-spacing: .35em;
          margin-right: -.35em;
        }

        .day {
          margin: -2px 0 -7px;
          font-family: var(--serif);
          font-size: clamp(68px, 17vw, 120px);
          line-height: 1;
          font-weight: 500;
        }

        .month {
          font-family: var(--serif);
          font-size: clamp(14px, 3.7vw, 23px);
          letter-spacing: .25em;
          margin-right: -.25em;
        }

        .city {
          margin-top: 28px;
          font-family: var(--serif);
          font-size: clamp(14px, 3.7vw, 23px);
          letter-spacing: .28em;
          margin-right: -.28em;
          font-weight: 500;
        }

        .countdown {
          margin: 25px auto 0;
          width: min(92%, 680px);
          display: flex;
          justify-content: center;
          align-items: center;
          gap: clamp(9px, 3vw, 25px);
        }

        .countdown div {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 58px;
        }

        .countdown strong {
          font-family: var(--serif);
          font-size: clamp(27px, 7vw, 46px);
          line-height: 1;
          font-weight: 500;
        }

        .countdown span {
          margin-top: 7px;
          font-size: clamp(8px, 2vw, 13px);
          letter-spacing: .18em;
        }

        .countdown i {
          width: 1px;
          height: 46px;
          background: var(--wine);
          opacity: .45;
        }

        .calendar-button {
          margin-top: 25px;
          padding: 13px 25px;
          border: 1px solid var(--wine);
          border-radius: 40px;
          background: rgba(255,255,255,.35);
          color: var(--wine);
          font-size: clamp(9px, 2.4vw, 14px);
          letter-spacing: .2em;
          cursor: pointer;
        }

        .calendar-icon {
          display: inline-block;
          margin-right: 8px;
          font-size: 15px;
        }

        /* HISTORIA */

        .story-content {
          position: absolute;
          top: 5%;
          left: 50%;
          width: 90%;
          transform: translateX(-50%);
          text-align: center;
          color: var(--wine);
        }

        .story-quote {
          margin-top: 14px;
          display: flex;
          flex-direction: column;
          align-items: center;
          font-family: var(--serif);
          font-style: italic;
          font-size: clamp(23px, 6vw, 40px);
          line-height: .95;
        }

        .story-quote strong {
          margin: -8px 0 -4px;
          font-family: var(--script);
          font-size: clamp(90px, 23vw, 165px);
          line-height: .8;
          font-weight: 400;
          font-style: normal;
        }

        /* DRESS CODE */

        .dress-content {
          position: absolute;
          inset: 0;
          color: var(--cream);
          text-align: center;
        }

        .dress-title {
          position: absolute;
          top: 4.5%;
          left: 50%;
          transform: translateX(-50%);
          width: 90%;
        }

        .dress-line {
          position: absolute;
          top: 9%;
          left: 50%;
          transform: translateX(-50%);
          margin: 0;
        }

        .dress-script {
          position: absolute;
          top: 10%;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          margin: 0;
          font-family: var(--script);
          font-size: clamp(90px, 24vw, 175px);
          font-weight: 400;
          line-height: .8;
        }

        .dress-people {
          position: absolute;
          left: 8%;
          right: 8%;
          top: 51%;
          display: flex;
          justify-content: space-between;
        }

        .person-column {
          width: 44%;
          text-align: center;
        }

        .person-space {
          height: 120px;
        }

        .person-label {
          font-family: var(--serif);
          font-size: clamp(13px, 3.3vw, 22px);
          letter-spacing: .32em;
          margin-right: -.32em;
        }

        .person-description {
          margin-top: 8px;
          font-family: var(--serif);
          font-size: clamp(18px, 4.7vw, 29px);
          font-style: italic;
        }

        .white-note {
          position: absolute;
          left: 10%;
          right: 10%;
          bottom: 7%;
          color: #566444;
          font-family: var(--serif);
          font-size: clamp(11px, 3vw, 18px);
          letter-spacing: .28em;
          line-height: 1.8;
        }

        .note-line {
          width: 50px;
          height: 1px;
          background: currentColor;
          margin: 0 auto 10px;
          opacity: .65;
        }

        .note-line.bottom {
          margin: 10px auto 0;
        }

        /* RSVP */

        .rsvp-content {
          position: absolute;
          top: 16%;
          left: 50%;
          transform: translateX(-50%);
          width: 86%;
          text-align: center;
          color: var(--cream);
        }

        .rsvp-script {
          margin: 0;
          font-family: var(--script);
          font-size: clamp(92px, 25vw, 180px);
          font-weight: 400;
          line-height: .78;
        }

        .rsvp-text {
          margin: 28px 0 22px;
          font-family: var(--serif);
          font-size: clamp(21px, 5.5vw, 34px);
          line-height: 1.15;
          font-style: italic;
        }

        .rsvp-separator {
          width: 80px;
          height: 1px;
          background: currentColor;
          opacity: .7;
          margin: 20px auto 22px;
        }

        .rsvp-content label {
          display: block;
          margin-bottom: 10px;
          font-family: var(--serif);
          font-size: clamp(11px, 3vw, 17px);
          letter-spacing: .3em;
        }

        .rsvp-content input {
          display: block;
          width: 100%;
          height: 65px;
          border: 0;
          outline: none;
          border-radius: 32px;
          background: rgba(248,240,232,.88);
          color: #555;
          text-align: center;
          font-family: var(--serif);
          font-size: 21px;
          font-style: italic;
          padding: 0 20px;
        }

        .rsvp-content input::placeholder {
          color: #777;
          opacity: .9;
        }

        .confirm-button {
          margin-top: 25px;
          min-width: 220px;
          padding: 16px 30px;
          border: 0;
          border-radius: 40px;
          background: var(--cream);
          color: var(--wine);
          font-family: var(--serif);
          font-size: 14px;
          letter-spacing: .25em;
          cursor: pointer;
        }

        .confirm-button:disabled {
          opacity: .65;
        }

        .rsvp-error {
          margin-top: 12px;
          font-family: var(--serif);
          font-size: 16px;
          color: #ffe4e4;
        }

        /* CONFIRMACIÓN */

        .confirmation-content {
          position: absolute;
          top: 15%;
          left: 50%;
          transform: translateX(-50%);
          width: 88%;
          text-align: center;
          color: var(--wine);
        }

        .confirmation-title {
          font-family: var(--script);
          font-size: clamp(75px, 20vw, 145px);
          line-height: .8;
        }

        .confirmation-content h2 {
          font-family: var(--serif);
          font-size: clamp(17px, 4.5vw, 27px);
          letter-spacing: .2em;
          line-height: 1.5;
          font-weight: 500;
        }

        .seat-box {
          margin: 40px auto;
          padding: 22px;
          width: min(90%, 370px);
          border: 1px solid rgba(100,21,30,.35);
          border-radius: 5px;
          display: flex;
          flex-direction: column;
          gap: 7px;
          font-family: var(--serif);
        }

        .seat-box span:first-child {
          font-size: 13px;
          letter-spacing: .22em;
        }

        .seat-box strong {
          font-size: 60px;
          font-weight: 500;
        }

        .seat-box span:last-child {
          font-size: 13px;
          letter-spacing: .18em;
        }

        .confirmation-content p {
          font-family: var(--serif);
          font-size: 23px;
          font-style: italic;
          line-height: 1.25;
        }

        @media (min-width: 700px) {
          .slide {
            width: 540px;
            margin: 0 auto;
          }

          body {
            background: #222;
          }

          .wedding-page {
            background: var(--paper);
          }
        }

      `}</style>
    </main>
  );
}
