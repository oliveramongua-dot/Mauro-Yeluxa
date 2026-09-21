'use client';

import { useEffect, useState } from 'react';

const WEDDING_DATE = new Date('2027-03-14T16:00:00-05:00');
const RSVP_DEADLINE = '15 de noviembre de 2026';

function Countdown() {
  const [left, setLeft] = useState({
    d: 0,
    h: 0,
    m: 0,
    s: 0,
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
        s: Math.floor(diff / 1000) % 60,
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
        SEGUNDOS: left.s,
      }).map(([label, value]) => (
        <div className="time" key={label}>
          <strong>{String(value).padStart(2, '0')}</strong>
          <span>{label}</span>
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
    document.body.style.overflow = showIntro
      ? 'hidden'
      : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [showIntro]);

  const openInvitation = () => {
    if (opening) return;

    setOpening(true);

    setTimeout(() => {
      setShowIntro(false);
    }, 1100);
  };

  const submit = (e) => {
    e.preventDefault();

    if (!answer) return;

    setSent(true);
  };

  return (
    <>
      {/* =====================================================
          PORTADA / SOBRE
      ====================================================== */}

      {showIntro && (
        <div
          className={`invitation-intro ${
            opening ? 'invitation-opening' : ''
          }`}
        >
          <div className="intro-cover">

            <img
              src="/sobre-mauro-yeluxa.png"
              alt="Mauro & Yeluxa - Nuestra Boda"
              className="intro-cover-image"
            />

            {/* Zona invisible sobre el sello */}
            <button
              type="button"
              className="seal-hotspot"
              onClick={openInvitation}
              aria-label="Abrir invitación"
            />

          </div>
        </div>
      )}

      {/* =====================================================
          INVITACIÓN
      ====================================================== */}

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

        {/* =====================================================
            HERO
        ====================================================== */}

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

        {/* =====================================================
            SAVE THE DATE
        ====================================================== */}

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
            type="button"
            onClick={() =>
              alert(
                'En la siguiente etapa conectaremos este botón con Google y Apple Calendar.'
              )
            }
          >
            ＋ AÑADIR A MI CALENDARIO
          </button>

        </section>

        {/* =====================================================
            CARTAGENA
        ====================================================== */}

        <section
          id="cartagena"
          className="section split"
        >

          <div className="image-card cartagena-image">
            <span>
              Cartagena de Indias
            </span>
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

        {/* =====================================================
            NUESTRA HISTORIA
        ====================================================== */}

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

        {/* =====================================================
            DRESS CODE
        ====================================================== */}

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

        {/* =====================================================
            RSVP
        ====================================================== */}

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
              <strong>
                {RSVP_DEADLINE}
              </strong>.
            </p>

            {!sent ? (

              <form
                className="rsvp"
                onSubmit={submit}
              >

                <label>

                  <span>
                    Tu nombre
                  </span>

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
                      SÍ, QUIERO ACOMPAÑARLOS
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
                      NO PODRÉ ACOMPAÑARLOS
                    </span>

                  </label>

                </div>

                <button
                  className="primary-btn"
                  type="submit"
                >
                  ENVIAR RESPUESTA
                </button>

              </form>

            ) : (

              <div className="success">

                <span>
                  ✓
                </span>

                <h3>
                  Gracias por respondernos.
                </h3>

                <p>
                  Tu respuesta quedó registrada
                  en esta primera versión.
                </p>

              </div>

            )}

          </div>

        </section>

        {/* =====================================================
            FOOTER
        ====================================================== */}

        <footer className="footer">

          <span>
            M&Y
          </span>

          <p>
            NOS VEMOS EN CARTAGENA · MARZO 2027
          </p>

        </footer>

      </main>

      {/* =====================================================
          ESTILOS DE LA APERTURA
      ====================================================== */}

      <style jsx>{`

        .invitation-intro {
          position: fixed;
          inset: 0;
          z-index: 99999;
          background: #f5f1e8;
          overflow: hidden;
          opacity: 1;
          visibility: visible;
          transition:
            opacity 0.9s ease,
            visibility 0.9s ease;
        }

        .invitation-opening {
          opacity: 0;
          visibility: hidden;
        }

        .intro-cover {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .intro-cover-image {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          object-position: center center;
          transform: scale(1);
          transition:
            transform 1.1s
              cubic-bezier(.2,.75,.2,1),
            filter 1.1s ease;
        }

        /*
         * Zona invisible que coincide con el
         * sello de lacre de la imagen.
         */

        .seal-hotspot {
          position: absolute;
          left: 50%;
          top: 54%;
          width: 105px;
          height: 105px;
          transform: translate(-50%, -50%);
          border: 0;
          border-radius: 50%;
          background: transparent;
          cursor: pointer;
          padding: 0;
          -webkit-tap-highlight-color: transparent;
          z-index: 10;
        }

        .seal-hotspot::after {
          content: '';
          position: absolute;
          inset: 18px;
          border-radius: 50%;
          box-shadow:
            0 0 0 0
            rgba(87, 41, 50, 0.28);
          animation:
            sealPulse 2.4s infinite;
        }

        .invitation-opening
        .intro-cover-image {
          transform:
            scale(1.12);
          filter:
            brightness(1.08)
            blur(1px);
        }

        .invitation-opening
        .seal-hotspot {
          opacity: 0;
          transform:
            translate(-50%, -50%)
            scale(0.75);
          transition:
            opacity 0.3s ease,
            transform 0.3s ease;
        }

        @keyframes sealPulse {

          0%,
          100% {
            box-shadow:
              0 0 0 0
              rgba(87, 41, 50, 0.25);
          }

          50% {
            box-shadow:
              0 0 0 13px
              rgba(87, 41, 50, 0);
          }

        }

        @media (max-width: 760px) {

          .intro-cover-image {
            object-position: center center;
          }

          .seal-hotspot {
            width: 96px;
            height: 96px;
            top: 54%;
          }

        }

      `}</style>

    </>
  );
}
