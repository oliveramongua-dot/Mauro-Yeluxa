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

function PaperTexture({ tone = "white" }) {
  return (
    <div
      className={`paper-texture ${tone}`}
      aria-hidden="true"
    >
      <span className="watercolor watercolor-one" />
      <span className="watercolor watercolor-two" />
      <span className="watercolor watercolor-three" />
      <span className="watercolor watercolor-four" />
      <span className="paper-grain" />
    </div>
  );
}

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

    return {
      days: Math.floor(difference / 86400000),
      hours: Math.floor(difference / 3600000) % 24,
      minutes: Math.floor(difference / 60000) % 60,
      seconds: Math.floor(difference / 1000) % 60,
    };
  }, [now]);

  return (
    <div className="countdown">
      <div>
        <strong>{String(values.days).padStart(3, "0")}</strong>
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

function WatercolorPhoto({ src, alt, className = "" }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className={`watercolor-photo-fallback ${className}`} />
    );
  }

  return (
    <div className={`watercolor-photo ${className}`}>
      <span className="photo-wash wash-one" />
      <span className="photo-wash wash-two" />
      <span className="photo-wash wash-three" />

      <img
        src={src}
        alt={alt}
        onError={() => setFailed(true)}
      />

      <span className="brush-edge brush-top" />
      <span className="brush-edge brush-left" />
      <span className="brush-edge brush-right" />
      <span className="brush-edge brush-bottom" />
    </div>
  );
}

function DressIllustration({ type }) {
  return (
    <div
      className={`dress-illustration ${
        type === "man" ? "dress-man" : "dress-woman"
      }`}
    >
      <div className="figure-head" />
      <div className="figure-body" />

      {type === "man" ? (
        <>
          <div className="figure-jacket" />
          <div className="figure-shirt" />
          <div className="figure-tie" />
          <div className="figure-leg left" />
          <div className="figure-leg right" />
        </>
      ) : (
        <>
          <div className="figure-dress" />
          <div className="figure-arm left" />
          <div className="figure-arm right" />
        </>
      )}
    </div>
  );
}

export default function Home() {
  const [slide, setSlide] = useState(0);

  const [guestName, setGuestName] = useState("");
  const [confirmedSeats, setConfirmedSeats] = useState(null);
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [rsvpError, setRsvpError] = useState("");

  const scrollToSection = (id) => {
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const openInvitation = () => {
    setSlide(1);

    setTimeout(() => {
      window.scrollTo({
        top: window.innerHeight,
        behavior: "smooth",
      });
    }, 100);
  };

  const submitRsvp = async (event) => {
    event.preventDefault();

    const name = guestName.trim();

    if (!name) {
      setRsvpError("Escribe tu nombre completo.");
      return;
    }

    setRsvpLoading(true);
    setRsvpError("");

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.valid) {
        setRsvpError(
          data.message ||
            "No encontramos tu nombre en nuestra lista."
        );
        return;
      }

      setConfirmedSeats(data.seats || 1);
    } catch {
      setRsvpError(
        "No pudimos confirmar en este momento. Inténtalo nuevamente."
      );
    } finally {
      setRsvpLoading(false);
    }
  };

  return (
    <main className="wedding-page">
      <style>{`
        :global(*) {
          box-sizing: border-box;
        }

        :global(html) {
          scroll-behavior: smooth;
        }

        :global(body) {
          margin: 0;
          background: #ffffff;
          color: #3a2928;
        }

        :global(button),
        :global(input) {
          font: inherit;
        }

        .wedding-page {
          width: 100%;
          overflow-x: hidden;
          background: #ffffff;
        }

        /* =========================
           SHARED PAPER
        ========================= */

        .paper-section {
          position: relative;
          overflow: hidden;
          background: #ffffff;
        }

        .paper-texture {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .paper-grain {
          position: absolute;
          inset: 0;
          opacity: .18;
          background-image:
            radial-gradient(
              rgba(75,55,45,.08) .65px,
              transparent .65px
            );
          background-size: 6px 6px;
        }

        .watercolor {
          position: absolute;
          display: block;
          border-radius: 50%;
          filter: blur(1px);
          opacity: .35;
          mix-blend-mode: multiply;
        }

        .watercolor-one {
          width: 260px;
          height: 190px;
          top: -80px;
          left: -80px;
          background: #e7b9a5;
          transform: rotate(-18deg);
        }

        .watercolor-two {
          width: 250px;
          height: 190px;
          right: -100px;
          top: 10px;
          background: #aeb8a0;
          transform: rotate(22deg);
        }

        .watercolor-three {
          width: 220px;
          height: 170px;
          left: -90px;
          bottom: -70px;
          background: #8e4d58;
          opacity: .22;
          transform: rotate(25deg);
        }

        .watercolor-four {
          width: 260px;
          height: 170px;
          right: -110px;
          bottom: -60px;
          background: #e4b49e;
          opacity: .28;
          transform: rotate(-20deg);
        }

        /* =========================
           COVER
        ========================= */

        .cover {
          position: relative;
          min-height: 100svh;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          padding:
            max(7vh, 52px)
            18px
            35px;
          text-align: center;
        }

        .cover-content {
          position: relative;
          z-index: 4;
          width: 100%;
          max-width: 520px;
        }

        .cover-kicker {
          margin: 0 0 13px;
          color: #6c3039;
          font-family:
            var(--font-dm-sans),
            Arial,
            sans-serif;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: .42em;
          text-transform: uppercase;
        }

        .cover-names {
          margin: 0;
          color: #6a2731;
          font-family:
            "Slight Script",
            "Brittany Signature",
            "Allura",
            "Great Vibes",
            cursive;
          font-size: clamp(55px, 17vw, 92px);
          font-weight: 400;
          line-height: .78;
          letter-spacing: -.035em;
        }

        .cover-names span {
          display: block;
        }

        .cover-subtitle {
          margin: 23px 0 0;
          color: #6a2731;
          font-family:
            var(--font-dm-sans),
            Arial,
            sans-serif;
          font-size: 9px;
          letter-spacing: .42em;
          text-transform: uppercase;
        }

        .cover-photo-area {
          position: relative;
          width: min(94vw, 520px);
          margin-top: 32px;
          flex: 1;
          min-height: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .watercolor-photo {
          position: relative;
          width: 100%;
          max-height: 57vh;
          aspect-ratio: 4 / 5;
          overflow: hidden;
          isolation: isolate;

          /*
            Organic painted edge rather than
            a rectangular/polaroid frame.
          */
          -webkit-mask-image:
            radial-gradient(
              ellipse at center,
              #000 72%,
              rgba(0,0,0,.95) 78%,
              transparent 94%
            );
          mask-image:
            radial-gradient(
              ellipse at center,
              #000 72%,
              rgba(0,0,0,.95) 78%,
              transparent 94%
            );
        }

        .watercolor-photo img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 48%;
          display: block;
          z-index: 1;
          filter: saturate(.96) contrast(.98);
        }

        .photo-wash {
          position: absolute;
          z-index: 2;
          pointer-events: none;
          filter: blur(8px);
          mix-blend-mode: screen;
          opacity: .42;
        }

        .wash-one {
          width: 40%;
          height: 35%;
          left: -12%;
          top: -10%;
          background: #efc0aa;
          transform: rotate(-18deg);
        }

        .wash-two {
          width: 40%;
          height: 32%;
          right: -14%;
          top: 8%;
          background: #aeb89f;
          transform: rotate(18deg);
        }

        .wash-three {
          width: 45%;
          height: 28%;
          left: 25%;
          bottom: -12%;
          background: #d8a190;
          transform: rotate(-8deg);
        }

        .brush-edge {
          position: absolute;
          z-index: 4;
          pointer-events: none;
          background:
            repeating-linear-gradient(
              105deg,
              rgba(255,255,255,.95) 0 5px,
              rgba(255,255,255,.55) 6px 11px,
              transparent 12px 18px
            );
          filter: blur(1px);
          opacity: .92;
        }

        .brush-top {
          top: -3%;
          left: -5%;
          width: 110%;
          height: 12%;
          transform: rotate(-1deg);
        }

        .brush-bottom {
          bottom: -4%;
          left: -5%;
          width: 110%;
          height: 13%;
          transform: rotate(1deg);
        }

        .brush-left {
          left: -4%;
          top: 3%;
          width: 10%;
          height: 94%;
          background:
            repeating-linear-gradient(
              180deg,
              rgba(255,255,255,.9) 0 7px,
              rgba(255,255,255,.55) 8px 14px,
              transparent 15px 22px
            );
        }

        .brush-right {
          right: -4%;
          top: 3%;
          width: 10%;
          height: 94%;
          background:
            repeating-linear-gradient(
              180deg,
              rgba(255,255,255,.9) 0 7px,
              rgba(255,255,255,.55) 8px 14px,
              transparent 15px 22px
            );
        }

        .photo-fallback,
        .watercolor-photo-fallback {
          width: 100%;
          aspect-ratio: 4 / 5;
          background:
            linear-gradient(
              145deg,
              #ddd4c7,
              #b7aa99
            );
        }

        .cover-button {
          position: relative;
          z-index: 8;
          width: 78px;
          height: 78px;
          margin-top: -3px;
          border-radius: 50%;
          border: 1px solid rgba(106,39,49,.38);
          background: rgba(255,255,255,.96);
          color: #6a2731;
          box-shadow:
            0 10px 25px rgba(74,42,38,.08);
          font-size: 21px;
          letter-spacing: .15em;
          padding-left: 6px;
          cursor: pointer;
        }

        /* =========================
           SAVE THE DATE
        ========================= */

        .save-date {
          min-height: 100svh;
          padding:
            100px 22px
            80px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .section-kicker {
          position: relative;
          z-index: 2;
          margin: 0 0 16px;
          color: #6a2731;
          font-family:
            var(--font-dm-sans),
            Arial,
            sans-serif;
          font-size: 9px;
          letter-spacing: .36em;
          text-transform: uppercase;
        }

        .script-title {
          position: relative;
          z-index: 2;
          margin: 0;
          color: #6a2731;
          font-family:
            "Slight Script",
            "Brittany Signature",
            "Allura",
            "Great Vibes",
            cursive;
          font-size: clamp(58px, 16vw, 88px);
          font-weight: 400;
          line-height: .85;
        }

        .save-label {
          position: relative;
          z-index: 2;
          margin: 14px 0 32px;
          color: #6a2731;
          font-family:
            var(--font-dm-sans),
            Arial,
            sans-serif;
          font-size: 9px;
          letter-spacing: .4em;
          text-transform: uppercase;
        }

        .date-day {
          position: relative;
          z-index: 2;
          margin: 0;
          color: #6a2731;
          font-family:
            var(--font-dm-sans),
            Arial,
            sans-serif;
          font-size: 11px;
          letter-spacing: .42em;
          text-transform: uppercase;
        }

        .date-number {
          position: relative;
          z-index: 2;
          margin: 4px 0;
          color: #6a2731;
          font-family:
            "Slight Script",
            "Brittany Signature",
            "Allura",
            cursive;
          font-size: 86px;
          line-height: .8;
        }

        .date-month {
          position: relative;
          z-index: 2;
          color: #6a2731;
          font-family:
            var(--font-dm-sans),
            Arial,
            sans-serif;
          font-size: 10px;
          letter-spacing: .35em;
          text-transform: uppercase;
        }

        .location-small {
          position: relative;
          z-index: 2;
          margin-top: 25px;
          color: #69645d;
          font-family:
            var(--font-dm-sans),
            Arial,
            sans-serif;
          font-size: 9px;
          letter-spacing: .28em;
        }

        .countdown {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: repeat(4, auto);
          gap: 17px;
          margin: 34px 0 25px;
        }

        .countdown div {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .countdown strong {
          color: #6a2731;
          font-family:
            var(--font-cormorant),
            Georgia,
            serif;
          font-size: 25px;
          font-weight: 400;
        }

        .countdown span {
          color: #777169;
          font-family:
            var(--font-dm-sans),
            Arial,
            sans-serif;
          font-size: 7px;
          letter-spacing: .15em;
        }

        .calendar-button {
          position: relative;
          z-index: 2;
          border: 1px solid rgba(106,39,49,.35);
          background: transparent;
          color: #6a2731;
          padding: 13px 20px;
          font-family:
            var(--font-dm-sans),
            Arial,
            sans-serif;
          font-size: 8px;
          letter-spacing: .2em;
          text-transform: uppercase;
        }

        .cartagena-strip {
          position: relative;
          z-index: 2;
          width: min(100%, 560px);
          margin-top: 45px;
          display: grid;
          grid-template-columns: 1.1fr .9fr .8fr;
          gap: 7px;
        }

        .cartagena-strip img {
          width: 100%;
          aspect-ratio: 1 / 1.15;
          object-fit: cover;
          display: block;
          filter: saturate(.85);
        }

        /* =========================
           STORY
        ========================= */

        .story {
          position: relative;
          padding: 105px 20px 120px;
          text-align: center;
        }

        .story-copy {
          position: relative;
          z-index: 2;
          width: min(100%, 680px);
          margin: 0 auto;
        }

        .story-title {
          position: relative;
          z-index: 2;
          margin: 0;
          color: #6a2731;
          font-family:
            "Slight Script",
            "Brittany Signature",
            "Allura",
            cursive;
          font-size: clamp(50px, 14vw, 78px);
          font-weight: 400;
          line-height: .88;
        }

        .story-quote {
          position: relative;
          z-index: 2;
          margin: 22px auto 48px;
          max-width: 390px;
          color: #4d4943;
          font-family:
            var(--font-cormorant),
            Georgia,
            serif;
          font-size: 25px;
          font-style: italic;
          line-height: 1.25;
        }

        .story-photos {
          position: relative;
          z-index: 2;
          width: min(100%, 650px);
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1.05fr .85fr;
          gap: 18px;
          align-items: start;
        }

        .story-photo {
          position: relative;
          overflow: hidden;
        }

        .story-photo:nth-child(2) {
          margin-top: 50px;
        }

        .story-photo:nth-child(3) {
          grid-column: 1 / -1;
          width: 72%;
          margin: -5px auto 0;
        }

        .story-photo img {
          width: 100%;
          display: block;
          aspect-ratio: 4 / 5;
          object-fit: cover;
        }

        /* =========================
           DRESS CODE
        ========================= */

        .dress {
          position: relative;
          min-height: 100svh;
          padding: 100px 20px;
          background: #59634a;
          color: #ffffff;
          overflow: hidden;
          text-align: center;
        }

        .dress::before {
          content: "";
          position: absolute;
          inset: -10%;
          opacity: .13;
          background:
            radial-gradient(
              ellipse at 20% 20%,
              #d4d9c8 0 10%,
              transparent 32%
            ),
            radial-gradient(
              ellipse at 85% 75%,
              #b7c1a8 0 8%,
              transparent 30%
            );
          filter: blur(8px);
        }

        .dress-content {
          position: relative;
          z-index: 2;
          width: min(100%, 720px);
          margin: 0 auto;
        }

        .dress .section-kicker {
          color: #f5f1e8;
        }

        .dress-title {
          margin: 0;
          font-family:
            "Slight Script",
            "Brittany Signature",
            "Allura",
            cursive;
          font-size: clamp(65px, 18vw, 100px);
          font-weight: 400;
          line-height: .8;
        }

        .dress-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
          margin-top: 45px;
        }

        .dress-person {
          min-height: 390px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
        }

        .dress-illustration {
          position: relative;
          width: 150px;
          height: 270px;
          margin-bottom: 15px;
          opacity: .92;
          filter:
            drop-shadow(
              0 5px 5px rgba(0,0,0,.08)
            );
        }

        .figure-head {
          position: absolute;
          top: 0;
          left: 50%;
          width: 35px;
          height: 43px;
          transform: translateX(-50%);
          border-radius: 48% 48% 45% 45%;
          background: #d8b39d;
        }

        .figure-body {
          position: absolute;
          top: 37px;
          left: 50%;
          width: 48px;
          height: 75px;
          transform: translateX(-50%);
          background: rgba(42,42,35,.9);
          border-radius: 18px 18px 8px 8px;
        }

        .dress-woman .figure-body {
          background: #d99472;
        }

        .figure-jacket {
          position: absolute;
          top: 41px;
          left: 50%;
          width: 64px;
          height: 85px;
          transform: translateX(-50%);
          background: #262823;
          clip-path: polygon(
            20% 0,
            80% 0,
            100% 100%,
            0 100%
          );
        }

        .figure-shirt {
          position: absolute;
          top: 43px;
          left: 50%;
          width: 28px;
          height: 52px;
          transform: translateX(-50%);
          background: #f5f1e8;
          clip-path: polygon(
            50% 0,
            100% 25%,
            72% 100%,
            28% 100%,
            0 25%
          );
        }

        .figure-tie {
          position: absolute;
          z-index: 2;
          top: 44px;
          left: 50%;
          width: 7px;
          height: 52px;
          transform: translateX(-50%);
          background: #6a2731;
          clip-path: polygon(
            50% 0,
            100% 18%,
            62% 100%,
            38% 100%,
            0 18%
          );
        }

        .figure-leg {
          position: absolute;
          top: 113px;
          width: 20px;
          height: 125px;
          background: #24251f;
        }

        .figure-leg.left {
          left: 51px;
          transform: rotate(2deg);
        }

        .figure-leg.right {
          right: 51px;
          transform: rotate(-2deg);
        }

        .figure-dress {
          position: absolute;
          top: 70px;
          left: 50%;
          width: 118px;
          height: 190px;
          transform: translateX(-50%);
          background: #d99472;
          clip-path: polygon(
            38% 0,
            62% 0,
            72% 35%,
            100% 100%,
            0 100%,
            28% 35%
          );
        }

        .figure-arm {
          position: absolute;
          top: 77px;
          width: 12px;
          height: 105px;
          border-radius: 12px;
          background: #d8b39d;
        }

        .figure-arm.left {
          left: 28px;
          transform: rotate(8deg);
        }

        .figure-arm.right {
          right: 28px;
          transform: rotate(-8deg);
        }

        .dress-person h3 {
          margin: 0;
          font-family:
            var(--font-dm-sans),
            Arial,
            sans-serif;
          font-size: 9px;
          letter-spacing: .32em;
          text-transform: uppercase;
        }

        .dress-person p {
          margin: 9px 0 0;
          color: rgba(255,255,255,.82);
          font-family:
            var(--font-cormorant),
            Georgia,
            serif;
          font-size: 21px;
        }

        .dress-note {
          margin-top: 42px;
          padding: 20px 10px;
          border-top: 1px solid rgba(255,255,255,.28);
          border-bottom: 1px solid rgba(255,255,255,.28);
          font-family:
            var(--font-dm-sans),
            Arial,
            sans-serif;
          font-size: 8px;
          letter-spacing: .22em;
          line-height: 1.8;
        }

        .pinterest-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 42px;
          height: 42px;
          margin-top: 25px;
          border: 1px solid rgba(255,255,255,.5);
          border-radius: 50%;
          color: white;
          text-decoration: none;
          font-family: Georgia, serif;
          font-size: 18px;
        }

        /* =========================
           RSVP
        ========================= */

        .rsvp-section {
          position: relative;
          min-height: 100svh;
          padding: 100px 22px;
          background: #6a2731;
          color: #ffffff;
          text-align: center;
          overflow: hidden;
        }

        .rsvp-section::before {
          content: "";
          position: absolute;
          inset: -15%;
          background:
            radial-gradient(
              ellipse at 10% 20%,
              rgba(255,200,180,.16),
              transparent 30%
            ),
            radial-gradient(
              ellipse at 85% 75%,
              rgba(160,180,140,.13),
              transparent 30%
            );
          filter: blur(12px);
        }

        .rsvp-content {
          position: relative;
          z-index: 2;
          width: min(100%, 470px);
          margin: auto;
        }

        .rsvp-kicker {
          margin: 0 0 15px;
          font-family:
            var(--font-dm-sans),
            Arial,
            sans-serif;
          font-size: 9px;
          letter-spacing: .35em;
        }

        .rsvp-title {
          margin: 0;
          font-family:
            "Slight Script",
            "Brittany Signature",
            "Allura",
            cursive;
          font-size: clamp(52px, 15vw, 80px);
          font-weight: 400;
          line-height: .85;
        }

        .rsvp-text {
          margin: 25px auto;
          max-width: 360px;
          color: rgba(255,255,255,.82);
          font-family:
            var(--font-cormorant),
            Georgia,
            serif;
          font-size: 20px;
          line-height: 1.35;
        }

        .rsvp-form {
          margin-top: 35px;
          text-align: left;
        }

        .rsvp-form label {
          display: block;
        }

        .rsvp-form label span {
          display: block;
          margin-bottom: 8px;
          color: rgba(255,255,255,.72);
          font-family:
            var(--font-dm-sans),
            Arial,
            sans-serif;
          font-size: 8px;
          letter-spacing: .2em;
          text-transform: uppercase;
        }

        .rsvp-form input {
          width: 100%;
          border: none;
          border-bottom: 1px solid rgba(255,255,255,.5);
          outline: none;
          background: transparent;
          color: white;
          padding: 12px 2px;
          font-family:
            var(--font-cormorant),
            Georgia,
            serif;
          font-size: 22px;
        }

        .rsvp-form input::placeholder {
          color: rgba(255,255,255,.45);
        }

        .rsvp-submit {
          width: 100%;
          margin-top: 30px;
          border: 1px solid rgba(255,255,255,.65);
          background: white;
          color: #6a2731;
          padding: 15px;
          font-family:
            var(--font-dm-sans),
            Arial,
            sans-serif;
          font-size: 9px;
          letter-spacing: .2em;
          text-transform: uppercase;
        }

        .rsvp-error {
          margin-top: 18px;
          color: #ffd7ca;
          font-family:
            var(--font-dm-sans),
            Arial,
            sans-serif;
          font-size: 11px;
          line-height: 1.5;
          text-align: center;
        }

        .confirmation {
          padding: 50px 0 10px;
        }

        .confirmation-card {
          padding: 35px 22px;
          background: rgba(255,255,255,.08);
          border: 1px solid rgba(255,255,255,.22);
        }

        .confirmation-thanks {
          margin: 0;
          font-family:
            "Slight Script",
            "Brittany Signature",
            "Allura",
            cursive;
          font-size: 62px;
          line-height: .8;
        }

        .confirmation-main {
          margin: 25px 0 10px;
          font-family:
            var(--font-dm-sans),
            Arial,
            sans-serif;
          font-size: 9px;
          letter-spacing: .25em;
          line-height: 1.8;
        }

        .confirmation-seats {
          margin: 22px 0 0;
          font-family:
            var(--font-cormorant),
            Georgia,
            serif;
          font-size: 25px;
        }

        /* =========================
           FOOTER
        ========================= */

        .footer {
          padding: 65px 20px;
          background: #ffffff;
          text-align: center;
        }

        .footer-names {
          margin: 0;
          color: #6a2731;
          font-family:
            "Slight Script",
            "Brittany Signature",
            "Allura",
            cursive;
          font-size: 52px;
          font-weight: 400;
        }

        .footer-date {
          margin: 15px 0 0;
          color: #777169;
          font-family:
            var(--font-dm-sans),
            Arial,
            sans-serif;
          font-size: 8px;
          letter-spacing: .25em;
          text-transform: uppercase;
        }

        /* =========================
           MOBILE
        ========================= */

        @media (max-width: 600px) {
          .cover {
            padding-top: 54px;
          }

          .cover-photo-area {
            margin-top: 27px;
            width: 100%;
          }

          .watercolor-photo {
            max-height: 56vh;
          }

          .cover-button {
            width: 72px;
            height: 72px;
          }

          .save-date {
            padding-top: 90px;
          }

          .cartagena-strip {
            grid-template-columns: 1fr 1fr 1fr;
          }

          .dress-grid {
            gap: 4px;
          }

          .dress-person {
            min-height: 350px;
          }

          .dress-illustration {
            transform: scale(.85);
            transform-origin: bottom center;
            margin-bottom: 0;
          }

          .dress-person p {
            font-size: 18px;
          }

          .story-photos {
            gap: 10px;
          }
        }
      `}</style>

      {/* =========================
          PORTADA
      ========================= */}

      <section className="cover paper-section">
        <PaperTexture />

        <div className="cover-content">
          <p className="cover-kicker">
            NOS CASAMOS
          </p>

          <h1 className="cover-names">
            <span>Mauro &</span>
            <span>Yeluxa</span>
          </h1>

          <p className="cover-subtitle">
            SAVE THE DATE
          </p>
        </div>

        <div className="cover-photo-area">
          <WatercolorPhoto
            src={COUPLE_PHOTOS[0]}
            alt="Mauro y Yeluxa"
          />
        </div>

        <button
          type="button"
          className="cover-button"
          onClick={openInvitation}
          aria-label="Abrir invitación"
        >
          ···
        </button>
      </section>

      {/* =========================
          SAVE THE DATE
      ========================= */}

      <section
        id="fecha"
        className="save-date paper-section"
      >
        <PaperTexture />

        <p className="section-kicker">
          NUESTRA BODA
        </p>

        <h2 className="script-title">
          Reserva
        </h2>

        <p className="save-label">
          ESTA FECHA
        </p>

        <p className="date-day">
          SÁBADO
        </p>

        <p className="date-number">
          06
        </p>

        <p className="date-month">
          MARZO · 2027
        </p>

        <p className="location-small">
          CARTAGENA DE INDIAS
        </p>

        <Countdown />

        <button
          type="button"
          className="calendar-button"
          onClick={() => {
            const start =
              "20270306T210000Z";
            const end =
              "20270307T020000Z";

            const url =
              `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Mauro%20%26%20Yeluxa%20-%20Nuestra%20Boda&dates=${start}%2F${end}&location=Cartagena%20de%20Indias`;

            window.open(url, "_blank");
          }}
        >
          AÑADIR A MI CALENDARIO
        </button>

        <div className="cartagena-strip">
          {CARTAGENA_PHOTOS.map((photo, index) => (
            <Photo
              key={photo}
              src={photo}
              alt={`Cartagena de Indias ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* =========================
          HISTORIA
      ========================= */}

      <section
        id="historia"
        className="story paper-section"
      >
        <PaperTexture />

        <div className="story-copy">
          <p className="section-kicker">
            NUESTRA HISTORIA
          </p>

          <h2 className="story-title">
            Juntos
          </h2>

          <p className="story-quote">
            “La vida es más linda cuando la compartimos.”
          </p>

          <div className="story-photos">
            <div className="story-photo">
              <Photo
                src={COUPLE_PHOTOS[1]}
                alt="Mauro y Yeluxa"
              />
            </div>

            <div className="story-photo">
              <Photo
                src={COUPLE_PHOTOS[2]}
                alt="Mauro y Yeluxa"
              />
            </div>

            <div className="story-photo">
              <Photo
                src={COUPLE_PHOTOS[0]}
                alt="Mauro y Yeluxa"
              />
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          DRESS CODE
      ========================= */}

      <section
        id="dress"
        className="dress"
      >
        <div className="dress-content">
          <p className="section-kicker">
            DRESS CODE
          </p>

          <h2 className="dress-title">
            Formal
          </h2>

          <div className="dress-grid">
            <div className="dress-person">
              <DressIllustration type="man" />

              <h3>HOMBRES</h3>

              <p>
                Traje formal
              </p>
            </div>

            <div className="dress-person">
              <DressIllustration type="woman" />

              <h3>MUJERES</h3>

              <p>
                Vestido formal largo
              </p>
            </div>
          </div>

          <div className="dress-note">
            EL BLANCO ESTÁ RESERVADO
            <br />
            PARA LOS NOVIOS
          </div>

          <a
            className="pinterest-button"
            href={PINTEREST_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="Ver inspiración en Pinterest"
          >
            +
          </a>
        </div>
      </section>

      {/* =========================
          RSVP
      ========================= */}

      <section
        id="rsvp"
        className="rsvp-section"
      >
        <div className="rsvp-content">
          {!confirmedSeats ? (
            <>
              <p className="rsvp-kicker">
                TU LUGAR CON NOSOTROS
              </p>

              <h2 className="rsvp-title">
                Confirma
                <br />
                asistencia
              </h2>

              <p className="rsvp-text">
                Será un honor compartir este día
                contigo.
              </p>

              <form
                className="rsvp-form"
                onSubmit={submitRsvp}
              >
                <label>
                  <span>
                    NOMBRE COMPLETO
                  </span>

                  <input
                    value={guestName}
                    onChange={(event) =>
                      setGuestName(
                        event.target.value
                      )
                    }
                    placeholder="Escribe tu nombre"
                    autoComplete="name"
                  />
                </label>

                <button
                  type="submit"
                  className="rsvp-submit"
                  disabled={rsvpLoading}
                >
                  {rsvpLoading
                    ? "VERIFICANDO..."
                    : "CONFIRMAR ASISTENCIA"}
                </button>
              </form>

              {rsvpError && (
                <p className="rsvp-error">
                  {rsvpError}
                </p>
              )}
            </>
          ) : (
            <div className="confirmation">
              <div className="confirmation-card">
                <h2 className="confirmation-thanks">
                  ¡Gracias!
                </h2>

                <p className="confirmation-main">
                  TU ASISTENCIA HA SIDO
                  <br />
                  CONFIRMADA
                </p>

                <p className="confirmation-seats">
                  CUPOS CONFIRMADOS:{" "}
                  {confirmedSeats}
                </p>

                <p>
                  Muy pronto te enviaremos
                  más detalles.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      <footer className="footer">
        <p className="footer-names">
          Mauro & Yeluxa
        </p>

        <p className="footer-date">
          CARTAGENA DE INDIAS ·
          06 MARZO 2027
        </p>
      </footer>
    </main>
  );
}
