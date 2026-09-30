"use client";

import { useState } from "react";

const IMAGES = {
  one: "/foto-1.jpg",
  two: "/foto-2.jpg",
  three: "/foto-3.jpg",
  four: "/foto-4.jpg",
};

export default function Home() {
  const [name, setName] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [seats, setSeats] = useState(null);

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

      setTimeout(() => {
        document
          .getElementById("confirmation")
          ?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
      }, 250);
    } catch {
      setStatus("error");
      setError(
        "No pudimos procesar la confirmación. Inténtalo nuevamente."
      );
    }
  }

  return (
    <main className="invitation">

      {/* ==================================================
          FOTO 1
      ================================================== */}

      <section className="page">
        <img
          src={IMAGES.one}
          alt=""
          className="background-image"
        />
      </section>


      {/* ==================================================
          FOTO 2
      ================================================== */}

      <section className="page">
        <img
          src={IMAGES.two}
          alt=""
          className="background-image"
        />
      </section>


      {/* ==================================================
          FOTO 3 — CONFIRMACIÓN
      ================================================== */}

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


      {/* ==================================================
          FOTO 4 — OCULTA HASTA CONFIRMAR
      ================================================== */}

      {status === "confirmed" && (
        <section
          id="confirmation"
          className="page final-page"
        >

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
      )}

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


        /* ================================================
           CADA IMAGEN ES UNA LÁMINA COMPLETA 9:16
        ================================================= */

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


        /* ================================================
           FOTO 3
        ================================================= */

        .confirmation-page {
          position: relative;
        }

        .confirmation-form-container {
          position: absolute;

          left: 9%;
          right: 9%;

          top: 50%;

          transform: translateY(-50%);

          display: flex;

          justify-content: center;

          align-items: center;
        }

        .confirmation-form {
          width: 100%;
          max-width: 380px;

          display: flex;

          flex-direction: column;

          align-items: center;
        }

        .confirmation-form input {
          width: 100%;

          height: 48px;

          padding: 0 16px;

          border: 1px solid rgba(80, 45, 45, 0.35);

          border-radius: 4px;

          outline: none;

          background: rgba(255, 255, 255, 0.88);

          color: #3f2d2d;

          font-family:
            Arial,
            sans-serif;

          font-size: 15px;

          text-align: center;
        }

        .confirmation-form input::placeholder {
          color: rgba(65, 45, 45, 0.55);
        }

        .confirmation-form input:focus {
          border-color: rgba(80, 45, 45, 0.65);
        }

        .confirmation-form button {
          margin-top: 14px;

          min-width: 150px;

          height: 42px;

          padding: 0 25px;

          border: none;

          border-radius: 999px;

          background: #5d3038;

          color: white;

          font-family:
            Arial,
            sans-serif;

          font-size: 10px;

          letter-spacing: 0.14em;

          cursor: pointer;
        }

        .confirmation-form button:disabled {
          opacity: 0.6;

          cursor: default;
        }

        .error-message {
          width: 100%;

          margin-top: 9px;

          padding: 0 10px;

          color: #8a2935;

          font-family:
            Arial,
            sans-serif;

          font-size: 11px;

          line-height: 1.3;

          text-align: center;
        }


        /* ================================================
           FOTO 4
        ================================================= */

        .final-page {
          position: relative;
        }

        .seats-container {
          position: absolute;

          left: 10%;
          right: 10%;

          top: 50%;

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
            serif;

          font-size: clamp(
            70px,
            20vw,
            120px
          );

          line-height: 1;

          font-weight: 400;
        }

        .seats-text {
          margin-top: 10px;

          font-family:
            Arial,
            sans-serif;

          font-size: 11px;

          letter-spacing: 0.16em;
        }


        /* ================================================
           PANTALLAS GRANDES
        ================================================= */

        @media (min-width: 700px) {

          .page {
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
