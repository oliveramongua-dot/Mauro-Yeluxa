'use client';

import { useEffect, useState } from 'react';

const WEDDING_DATE = new Date('2027-03-14T16:00:00-05:00');
const RSVP_DEADLINE = '15 de noviembre de 2026';

function Countdown() {
  const [left, setLeft] = useState({
    d: 0,
    h: 0,
    m: 0,
    s: 0
  });

  useEffect(() => {
    const tick = () => {
      const diff = Math.max(
        0,
        WEDDING_DATE.getTime() - Date.now()
      );

      setLeft({
        d: Math.floor(diff / 86400000),
        h: Math.floor(diff / 3600000) % 24,
        m: Math.floor(diff / 60000) % 60,
        s: Math.floor(diff / 1000) % 60
      });
    };

    tick();

    const id = setInterval(tick, 1000);

    return () => clearInterval(id);
  }, []);

  return (
    <div className="countdown">
      {Object.entries({
        DÍAS: left.d,
        HORAS: left.h,
        MINUTOS: left.m,
        SEGUNDOS: left.s
      }).map(([k, v]) => (
        <div className="time" key={k}>
          <strong>{String(v).padStart(2, '0')}</strong>
          <span>{k}</span>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const [answer, setAnswer] = useState('');
  const [sent, setSent] = useState(false);

  const [showIntro, setShowIntro] = useState(true);
  const [opening, setOpening] = useState(false);

  useEffect(() => {
    document.body.style.overflow = showIntro ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [showIntro]);

  const openInvitation = () => {
    if (opening) return;

    setOpening(true);

    setTimeout(() => {
      setShowIntro(false);
    }, 1300);
  };

  const submit = (e) => {
    e.preventDefault();

    if (!answer) return;

    setSent(true);
  };

  return (
    <>
      {showIntro && (
        <div
          className={`invitation-intro ${
            opening ? 'invitation-opening' : ''
          }`}
        >
          <div className="intro-glow" />

          <div className="envelope-stage">

            <div className="envelope">

              <div className="envelope-back" />

              <div className="envelope-letter">
                <div className="letter-monogram">
                  M&Y
                </div>

                <div className="letter-names">
                  MAURO & YELUXA
                </div>

                <div className="letter-line" />

                <div className="letter-title">
                  NUESTRA BODA
                </div>

                <div className="letter-place">
                  CARTAGENA DE INDIAS
                </div>

                <div className="letter-date">
                  14 · MARZO · 2027
                </div>
              </div>

              <div className="envelope-flap">
                <div className="flap-inner" />
              </div>

              <div className="envelope-front" />

              <button
                className="wax-seal"
                onClick={openInvitation}
                aria-label="Abrir invitación"
              >
                <span>M&Y</span>
              </button>

            </div>

            <button
              className="open-invitation"
              onClick={openInvitation}
            >
              Ábreme…
            </button>

          </div>
        </div>
      )}

      <main>

        <nav className="nav">
          <span className="monogram">M&Y</span>

          <div>
            <a href="#fecha">Fecha</a>
            <a href="#cartagena">Cartagena</a>
            <a href="#historia">Nosotros</a>
            <a href="#dress">Dress code</a>
            <a href="#rsvp">RSVP</a>
          </div>
        </nav>

        <section className="hero">

          <div className="hero-overlay" />

          <div className="hero-content">

            <p className="eyebrow">
              NUESTRA BODA
            </p>

            <h1>
              MAURO <em>&</em> YELUXA
            </h1>

            <p className="location">
              CARTAGENA DE INDIAS · MARZO 2027
            </p>

            <span className="scroll">
              GUARDA ESTA FECHA ↓
            </span>

          </div>

        </section>

        <section
          id="fecha"
          className="section ivory centered"
        >
          <p className="eyebrow olive-text">
            SAVE THE DATE
          </p>

          <h2>
            Reserva esta fecha
          </h2>

          <p className="date">
            14 · MARZO · 2027
          </p>

          <p className="smallcaps">
            CARTAGENA DE INDIAS · CENTRO HISTÓRICO
          </p>

          <Countdown />

          <button
            className="outline-btn"
            onClick={() =>
              alert(
                'En la siguiente etapa conectaremos este botón con Google/Apple Calendar.'
              )
            }
          >
            ＋ Añadir a mi calendario
          </button>

        </section>

        <section
          id="cartagena"
          className="section split"
        >

          <div className="image-card cartagena-image">
            <span>Cartagena de Indias</span>
          </div>

          <div className="copy-card">

            <p className="eyebrow olive-text">
              EL LUGAR
            </p>

            <h2>
              Una fecha en el
              <br />
              Centro Histórico
            </h2>

            <p>
              Queremos compartir este momento contigo
              en el corazón de Cartagena de Indias,
              entre murallas, historia, arquitectura y
              el encanto de una ciudad que significa tanto
              para nosotros.
            </p>

            <p className="script">
              Allí nos veremos.
            </p>

          </div>

        </section>

        <section
          id="historia"
          className="section ivory"
        >

          <div className="narrow centered">

            <p className="eyebrow burgundy-text">
              NUESTRA HISTORIA
            </p>

            <h2>
              El comienzo de un nuevo capítulo
            </h2>

            <p>
              Después de tantos momentos compartidos,
              viajes, sueños y aventuras, llegó el momento
              de celebrar nuestro próximo capítulo junto a
              las personas que más queremos.
            </p>

            <div className="photo-grid">
              <div />
              <div />
              <div />
            </div>

            <p className="quote">
              “La vida es más linda cuando la compartimos.”
            </p>

          </div>

        </section>

        <section
          id="dress"
          className="section olive"
        >

          <div className="narrow centered light-text">

            <p className="eyebrow">
              DRESS CODE
            </p>

            <h2>
              Formal
            </h2>

            <div className="dress-grid">

              <div>
                <div className="dress-icon">
                  ♢
                </div>

                <h3>
                  Hombres
                </h3>

                <p>
                  Traje formal
                  <br />
                  <small>
                    Preferiblemente traje oscuro.
                  </small>
                </p>
              </div>

              <div>
                <div className="dress-icon">
                  ♢
                </div>

                <h3>
                  Mujeres
                </h3>

                <p>
                  Vestido formal largo
                </p>
              </div>

            </div>

            <div className="notice">
              EL BLANCO ESTÁ RESERVADO PARA LOS NOVIOS.
            </div>

          </div>

        </section>

        <section
          id="rsvp"
          className="section ivory centered"
        >

          <div className="narrow">

            <p className="eyebrow burgundy-text">
              PRIMERA ETAPA
            </p>

            <h2>
              ¿Podemos contar contigo?
            </h2>

            <p>
              Estamos preparando este día con mucho
              cariño y queremos saber si podremos
              celebrarlo contigo.
            </p>

            <p className="deadline">
              Confirma tu intención de asistir antes del{' '}
              <strong>{RSVP_DEADLINE}</strong>.
            </p>

            {!sent ? (

              <form
                className="rsvp"
                onSubmit={submit}
              >

                <label>
                  <span>Tu nombre</span>

                  <input
                    required
                    placeholder="Escribe tu nombre"
                  />
                </label>

                <div className="choices">

                  <label
                    className={
                      answer === 'yes'
                        ? 'selected'
                        : ''
                    }
                  >

                    <input
                      type="radio"
                      name="rsvp"
                      value="yes"
                      onChange={(e) =>
                        setAnswer(e.target.value)
                      }
                    />

                    <span>
                      Sí, quiero acompañarlos
                    </span>

                  </label>

                  <label
                    className={
                      answer === 'no'
                        ? 'selected'
                        : ''
                    }
                  >

                    <input
                      type="radio"
                      name="rsvp"
                      value="no"
                      onChange={(e) =>
                        setAnswer(e.target.value)
                      }
                    />

                    <span>
                      No podré acompañarlos
                    </span>

                  </label>

                </div>

                <button
                  className="primary-btn"
                  type="submit"
                >
                  Enviar respuesta
                </button>

              </form>

            ) : (

              <div className="success">

                <span>✓</span>

                <h3>
                  Gracias por respondernos.
                </h3>

                <p>
                  Tu respuesta quedó registrada
                  en esta primera versión.
                  En la siguiente etapa conectaremos
                  este formulario con la base de invitados.
                </p>

              </div>

            )}

          </div>

        </section>

        <footer className="footer">
          <span>M&Y</span>

          <p>
            Nos vemos en Cartagena · Marzo 2027
          </p>
        </footer>

      </main>

      <style jsx>{`

        .invitation-intro {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background:
            radial-gradient(
              circle at center,
              #faf7ef 0%,
              #f1eadc 100%
            );
          transition:
            opacity 0.8s ease,
            visibility 0.8s ease;
        }

        .invitation-opening {
          opacity: 0;
          visibility: hidden;
        }

        .intro-glow {
          position: absolute;
          width: 70vw;
          height: 70vw;
          max-width: 600px;
          max-height: 600px;
          border-radius: 50%;
          background: rgba(255,255,255,0.35);
          filter: blur(50px);
        }

        .envelope-stage {
          position: relative;
          width: min(88vw, 430px);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 28px;
        }

        .envelope {
          position: relative;
          width: 100%;
          aspect-ratio: 1.45 / 1;
          perspective: 1000px;
          filter:
            drop-shadow(
              0 25px 35px rgba(72,54,39,0.18)
            );
        }

        .envelope-back,
        .envelope-front {
          position: absolute;
          inset: 0;
          border-radius: 3px;
        }

        .envelope-back {
          background:
            linear-gradient(
              145deg,
              #fffdf7,
              #e9dfce
            );
          border: 1px solid rgba(110,90,60,0.14);
        }

        .envelope-letter {
          position: absolute;
          z-index: 2;
          left: 8%;
          right: 8%;
          top: 8%;
          height: 84%;
          background: #fcfaf3;
          border: 1px solid rgba(100,80,50,0.1);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #4c5140;
          transition:
            transform 1.1s cubic-bezier(.2,.8,.2,1);
        }

        .letter-monogram {
          font-family: var(--font-cormorant), serif;
          font-size: 52px;
          font-style: italic;
          margin-bottom: 8px;
        }

        .letter-names {
          font-family: var(--font-dm-sans), sans-serif;
          font-size: 8px;
          letter-spacing: 0.35em;
        }

        .letter-line {
          width: 42px;
          height: 1px;
          background: #b7ab94;
          margin: 14px 0;
        }

        .letter-title {
          font-family: var(--font-cormorant), serif;
          font-size: 22px;
          letter-spacing: 0.12em;
        }

        .letter-place,
        .letter-date {
          font-family: var(--font-dm-sans), sans-serif;
          font-size: 7px;
          letter-spacing: 0.2em;
          margin-top: 8px;
        }

        .envelope-flap {
          position: absolute;
          z-index: 5;
          inset: 0;
          height: 62%;
          transform-origin: top center;
          transform-style: preserve-3d;
          transition:
            transform 1s cubic-bezier(.2,.8,.2,1);
        }

        .flap-inner {
          position: absolute;
          inset: 0;
          clip-path: polygon(
            0 0,
            100% 0,
            50% 100%
          );
          background:
            linear-gradient(
              145deg,
              #fffdf8,
              #e6dccb
            );
          border-top: 1px solid rgba(110,90,60,0.1);
        }

        .envelope-front {
          z-index: 6;
          background: transparent;
          pointer-events: none;
        }

        .wax-seal {
          position: absolute;
          z-index: 10;
          left: 50%;
          top: 57%;
          transform: translate(-50%, -50%);
          width: 76px;
          height: 76px;
          border-radius: 50%;
          border: 0;
          background:
            radial-gradient(
              circle at 35% 30%,
              #8a4143,
              #572932 58%,
              #421e26
            );
          color: #e7d6b5;
          box-shadow:
            0 8px 14px rgba(50,20,20,0.25),
            inset 0 2px 4px rgba(255,255,255,0.15);
          cursor: pointer;
          transition:
            transform 0.35s ease,
            box-shadow 0.35s ease;
        }

        .wax-seal span {
          font-family: var(--font-cormorant), serif;
          font-size: 25px;
          font-style: italic;
        }

        .wax-seal:hover {
          transform: translate(-50%, -50%) scale(1.06);
        }

        .open-invitation {
          border: 0;
          background: transparent;
          color: #4b5140;
          font-family: var(--font-cormorant), serif;
          font-size: 27px;
          font-style: italic;
          cursor: pointer;
          padding: 6px 15px;
          letter-spacing: 0.03em;
        }

        .open-invitation::after {
          content: '';
          display: block;
          width: 35px;
          height: 1px;
          margin: 7px auto 0;
          background: #9b8c72;
          transition: width 0.3s ease;
        }

        .open-invitation:hover::after {
          width: 55px;
        }

        .invitation-opening .envelope-flap {
          transform: rotateX(180deg);
        }

        .invitation-opening .envelope-letter {
          transform: translateY(-38%) scale(1.04);
        }

        .invitation-opening .wax-seal {
          transform:
            translate(-50%, -50%)
            scale(0.7);
          opacity: 0;
          transition:
            transform 0.45s ease,
            opacity 0.45s ease;
        }

        @media (max-width: 760px) {

          .envelope-stage {
            width: 88vw;
          }

          .envelope {
            aspect-ratio: 1.32 / 1;
          }

          .letter-monogram {
            font-size: 43px;
          }

          .letter-title {
            font-size: 19px;
          }

          .wax-seal {
            width: 68px;
            height: 68px;
          }

          .open-invitation {
            font-size: 25px;
          }

        }

      `}</style>
    </>
  );
}
