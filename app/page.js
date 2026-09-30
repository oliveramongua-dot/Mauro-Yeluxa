"use client";

import { useEffect, useState } from "react";

const IMAGES = {
  cover: "/portada-mauro-yeluxa.jpg",
  one: "/foto-1.jpg",
  two: "/foto-2.jpg",
  three: "/foto-3.jpg",
  four: "/foto-4.jpg",
};

const COVER_VIDEO = "/video-mauro-yeluxa.mp4";

export default function Home() {
  const [introFinished, setIntroFinished] = useState(false);
  const [name, setName] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [seats, setSeats] = useState(null);

  useEffect(() => {
    if (status !== "confirmed") return;

    const finalUrl =
      window.location.href.split("#")[0] + "#confirmada";

    window.history.pushState(
      { confirmation: true },
      "",
      finalUrl
    );

    const preventBack = () => {
      window.history.pushState(
        { confirmation: true },
        "",
        finalUrl
      );
    };

    window.addEventListener("popstate", preventBack);

    return () => {
      window.removeEventListener("popstate", preventBack);
    };
  }, [status]);

  async function confirmAttendance(event) {
    event.preventDefault();

    const cleanName = name.trim();

    if (!cleanName) {
      setError("Escribe tu nombre completo.");
      return;
    }

    setError("");
    setStatus("loading");

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
        setStatus("error");
        setError(
          data?.message ||
            "No encontramos ese nombre en la lista de invitados."
        );
        return;
      }

      setSeats(data.seats);
      setStatus("confirmed");

      window.scrollTo({
        top: 0,
        behavior: "instant",
      });
    } catch {
      setStatus("error");
      setError(
        "No pudimos procesar la confirmación. Inténtalo nuevamente."
      );
    }
  }

  /* =========================
     PANTALLA FINAL
  ========================= */

  if (status === "confirmed") {
    return (
      <main className="final-only">
        <section className="final-page">
          <img
            src={IMAGES.four}
            alt=""
            className="background-image"
          />

          <div className="seats-container">
            <div className="seats-number">
              {seats}
            </div>

            <div className="seats-text">
              CUPOS ASIGNADOS
            </div>
          </div>
        </section>

        <style jsx global>{`
          * {
            box-sizing: border-box;
          }

          html,
          body {
            margin: 0;
            padding: 0;
            background: #ffffff;
            overflow-x: hidden;
          }

          .final-only {
            width: 100%;
            min-height: 100vh;
            background: #ffffff;
          }

          .final-page {
            position: relative;
            width: 100%;
            aspect-ratio: 9 / 16;
            overflow: hidden;
          }

          .background-image {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            display: block;
            object-fit: cover;
            object-position: center;
          }

          .seats-container {
            position: absolute;
            left: 10%;
            right: 10%;
            top: 64%;
            transform: translateY(-50%);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            color: #5d3038;
          }

          .seats-number {
            font-family:
              "Cormorant Garamond",
              Georgia,
              "Times New Roman",
              serif;
            font-size: clamp(100px, 29vw, 165px);
            line-height: .82;
            font-weight: 400;
          }

          .seats-text {
            margin-top: 18px;
            font-family:
              Arial,
              Helvetica,
              sans-serif;
            font-size: clamp(14px, 4vw, 19px);
            line-height: 1;
            letter-spacing: .16em;
            font-weight: 400;
          }

          @media (min-width: 700px) {
            .final-page {
              width: min(100vw, 540px);
              margin-left: auto;
              margin-right: auto;
            }
          }
        `}</style>
      </main>
    );
  }

  /* =========================
     PORTADA + VIDEO
  ========================= */

  if (!introFinished) {
    return (
      <main className="cover-screen">
        <section className="cover-page">

          {/* PORTADA DE CANVA */}
          <img
            src={IMAGES.cover}
            alt=""
            className="cover-image"
          />

          {/* VIDEO DENTRO DEL ÁREA MARCADA */}
          <video
            className="cover-video"
            src={COVER_VIDEO}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          />

          {/* ZONA INFERIOR TÁCTIL */}
          <button
            type="button"
            className="cover-touch-zone"
            aria-label="Abrir Save the Date"
            onClick={() => setIntroFinished(true)}
          />
        </section>

        <style jsx global>{`
          * {
            box-sizing: border-box;
          }

          html,
          body {
            margin: 0;
            padding: 0;
            background: #ffffff;
            overflow-x: hidden;
          }

          .cover-screen {
            width: 100%;
            min-height: 100vh;
            background: #ffffff;
          }

          .cover-page {
            position: relative;
            width: 100%;
            height: 100vh;
            height: 100svh;
            overflow: hidden;
            background: #ffffff;
          }

          /* PORTADA ORIGINAL */
          .cover-image {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            display: block;
            object-fit: cover;
            object-position: center;
            z-index: 1;
          }

          /* VIDEO */
          .cover-video {
            position: absolute;

            /*
              Posición del rectángulo que marcaste:
              izquierda ~18%
              arriba ~40%
              ancho ~64%
              alto ~25%
            */

            left: 18%;
            top: 40%;
            width: 64%;
            height: 25%;

            display: block;

            /*
              El video llena el área sin deformarse.
            */
            object-fit: cover;
            object-position: center;

            z-index: 2;

            /*
              Evita que el video interfiera
              con el toque inferior.
            */
            pointer-events: none;

            background: transparent;
          }

          /*
            SOLO LA PARTE INFERIOR ES TÁCTIL
          */
          .cover-touch-zone {
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;

            height: 28%;

            margin: 0;
            padding: 0;

            border: 0;
            background: transparent;

            z-index: 5;

            cursor: pointer;

            -webkit-tap-highlight-color: transparent;
          }

          @media (min-width: 700px) {
            .cover-page {
              width: min(100vw, 540px);
              margin-left: auto;
              margin-right: auto;
            }
          }
        `}</style>
      </main>
    );
  }

  /* =========================
     SAVE THE DATE + RSVP
  ========================= */

  return (
    <main className="invitation">

      <section className="page">
        <img
          src={IMAGES.one}
          alt=""
          className="background-image"
        />
      </section>

      <section className="page">
        <img
          src={IMAGES.two}
          alt=""
          className="background-image"
        />
      </section>

      <section className="page confirmation-page">
        <img
          src={IMAGES.three}
          alt=""
          className="background-image"
        />

        <div className="confirmation-form-container">
          <form
            className="confirmation-form"
            onSubmit={confirmAttendance}
          >
            <input
              type="text"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setError("");
                setStatus("idle");
              }}
              placeholder="Escribe tu nombre completo"
              autoComplete="name"
              disabled={status === "loading"}
            />

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
            >
              {status === "loading"
                ? "CONFIRMANDO..."
                : "CONFIRMAR"}
            </button>
          </form>
        </div>
      </section>

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        html {
          margin: 0;
          padding: 0;
          scroll-behavior: smooth;
          background: #ffffff;
        }

        body {
          margin: 0;
          padding: 0;
          background: #ffffff;
        }

        .invitation {
          width: 100%;
          margin: 0;
          padding: 0;
          overflow-x: hidden;
        }

        .page {
          position: relative;
          width: 100%;
          aspect-ratio: 9 / 16;
          overflow: hidden;
          margin: 0;
          padding: 0;
          background: #ffffff;
        }

        .background-image {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          object-position: center;
        }

        .confirmation-form-container {
          position: absolute;
          left: 15%;
          right: 15%;
          top: 66%;
          transform: translateY(-50%);
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .confirmation-form {
          width: 100%;
          max-width: 330px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .confirmation-form input {
          width: 100%;
          height: 50px;
          padding: 0 16px;
          border: 1px solid rgba(80, 45, 45, .35);
          border-radius: 4px;
          outline: none;
          background: rgba(255, 255, 255, .90);
          color: #3f2d2d;
          font-family:
            Arial,
            Helvetica,
            sans-serif;
          font-size: 15px;
          text-align: center;
        }

        .confirmation-form input::placeholder {
          color: rgba(65, 45, 45, .55);
        }

        .confirmation-form input:focus {
          border-color: rgba(80, 45, 45, .65);
        }

        .confirmation-form button {
          margin-top: 14px;
          min-width: 160px;
          height: 44px;
          padding: 0 26px;
          border: none;
          border-radius: 999px;
          background: #5d3038;
          color: #ffffff;
          font-family:
            Arial,
            Helvetica,
            sans-serif;
          font-size: 10px;
          letter-spacing: .14em;
          cursor: pointer;
        }

        .confirmation-form button:disabled {
          opacity: .6;
          cursor: default;
        }

        .error-message {
          width: 100%;
          margin-top: 9px;
          padding: 0 10px;
          color: #8a2935;
          font-family:
            Arial,
            Helvetica,
            sans-serif;
          font-size: 11px;
          line-height: 1.3;
          text-align: center;
        }

        @media (min-width: 700px) {
          .page {
            width: min(100vw, 540px);
            margin-left: auto;
            margin-right: auto;
          }
        }
      `}</style>
    </main>
  );
}
