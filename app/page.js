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
      const diff = Math.max(0, WEDDING_DATE.getTime() - Date.now());

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
      {[
        ['DÍAS', left.d],
        ['HORAS', left.h],
        ['MINUTOS', left.m],
        ['SEGUNDOS', left.s],
      ].map(([label, value]) => (
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

  const openInvitation = () => {
    if (opening) return;

    setOpening(true);

    setTimeout(() => {
      setShowIntro(false);

      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: 'instant',
        });
      }, 50);
    }, 1100);
  };

  const submit = (e) => {
    e.preventDefault();

    if (!answer) return;

    setSent(true);
  };

  if (showIntro) {
    return (
      <>
        <main
          className={`invitation-opening ${
            opening ? 'is-opening' : ''
          }`}
          onClick={openInvitation}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              openInvitation();
            }
          }}
        >
          <div className="opening-photo">
            <img
              src="/4F54E911-D943-4FBF-9EC9-FECC9EB0FF70.png"
              alt="Sobre de invitación de Mauro y Yeluxa"
            />
          </div>

          <div className="opening-caption">
            <span className="opening-title">Ábreme...</span>

            <div className="opening-divider">
              <span></span>
              <b>♥</b>
              <span></span>
            </div>

            <small>Toca para abrir</small>
          </div>

          <div className="opening-hint">
            <span className="heart">♥</span>
          </div>
        </main>

        <style>{`
          .invitation-opening {
            position: fixed;
            inset: 0;
            z-index: 9999;
            overflow: hidden;
            background:
              radial-gradient(
                circle at center,
                rgba(255,255,255,.35),
                rgba(245,241,232,.96)
              );
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 24px 18px 70px;
            cursor: pointer;
            color: #3f4037;
          }

          .opening-photo {
            width: min(92vw, 520px);
            aspect-ratio: 9 / 16;
            display: flex;
            align-items: center;
            justify-content: center;
            transform-origin: center;
            transition:
              transform 1.05s cubic-bezier(.22,.61,.36,1),
              opacity .8s ease,
              filter .8s ease;
          }

          .opening-photo img {
            display: block;
            width: 100%;
            height: 100%;
            object-fit: contain;
            object-position: center;
            filter: drop-shadow(
              0 20px 30px rgba(62, 55, 43, .16)
            );
          }

          .opening-caption {
            position: absolute;
            bottom: 7.5vh;
            left: 0;
            right: 0;
            text-align: center;
            pointer-events: none;
            transition:
              opacity .45s ease,
              transform .45s ease;
          }

          .opening-title {
            display: block;
            font-family: var(--font-cormorant), Georgia, serif;
            font-style: italic;
            font-size: clamp(34px, 9vw, 52px);
            line-height: 1;
            color: #3e4734;
            letter-spacing: .01em;
          }

          .opening-divider {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 13px;
            margin: 13px auto 0;
          }

          .opening-divider span {
            display: block;
            width: 42px;
            height: 1px;
            background: #9a8a76;
          }

          .opening-divider b {
            color: #572932;
            font-size: 13px;
            font-weight: 400;
          }

          .opening-caption small {
            display: block;
            margin-top: 14px;
            font-family: var(--font-dm-sans), sans-serif;
            font-size: 9px;
            text-transform: uppercase;
            letter-spacing: .24em;
            color: #777264;
          }

          .opening-hint {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 90px;
            height: 90px;
            transform: translate(-50%, -50%);
            border-radius: 50%;
            border: 1px solid rgba(87,41,50,.12);
            opacity: 0;
            pointer-events: none;
          }

          .heart {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #572932;
            font-size: 17px;
          }

          .invitation-opening.is-opening .opening-photo {
            transform:
              scale(1.12)
              translateY(-3%);
            opacity: 0;
            filter: blur(4px);
          }

          .invitation-opening.is-opening .opening-caption {
            opacity: 0;
            transform: translateY(15px);
          }

          @media (max-width: 600px) {
            .invitation-opening {
              padding-top: 15px;
              padding-bottom: 65px;
            }

            .opening-photo {
              width: 100vw;
              height: 72vh;
              aspect-ratio: auto;
            }

            .opening-photo img {
              width: 100%;
              height: 100%;
              object-fit: contain;
            }

            .opening-caption {
              bottom: 6.5vh;
            }

            .opening-title {
              font-size: 43px;
            }
          }
        `}</style>
      </>
    );
  }

  return (
    <>
      <main>
        <nav className="nav">
          <span className="monogram">M&Y</span>

          <div className="nav-links">
            <a href="#fecha">Fecha</a>
            <a href="#cartagena">Cartagena</a>
            <a href="#historia">Historia</a>
            <a href="#dress">Dress code</a>
            <a href="#rsvp">RSVP</a>
          </div>
        </nav>

        <section className="hero">
          <div className="hero-overlay"></div>

          <div className="hero-content">
            <p className="eyebrow">NUESTRA BODA</p>

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

          <h2>Reserva esta fecha</h2>

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
                'En la siguiente etapa conectaremos tu calendario.'
              )
            }
          >
            + AÑADIR A MI CALENDARIO
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
              Queremos compartir este momento contigo en el
              corazón de Cartagena de Indias, entre murallas,
              historia, arquitectura y el encanto de una ciudad
              que significa tanto para nosotros.
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
              de comenzar un nuevo capítulo juntos.
            </p>

            <div className="photo-grid">
              <div className="photo-placeholder photo-one"></div>
              <div className="photo-placeholder photo-two"></div>
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

            <h2>Formal</h2>

            <div className="dress-grid">
              <div>
                <div className="dress-icon">♢</div>
                <h3>Hombres</h3>
                <p>
                  Traje formal
                  <br />
                  Preferiblemente oscuro
                </p>
              </div>

              <div>
                <div className="dress-icon">♢</div>
                <h3>Mujeres</h3>
                <p>
                  Vestido formal largo
                </p>
              </div>
            </div>

            <div className="notice">
              EL BLANCO ESTÁ RESERVADO
              <br />
              PARA LOS NOVIOS.
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
              Estamos preparando este día con mucho cariño
              y queremos saber si podremos celebrarlo contigo.
            </p>

            <p className="rsvp-deadline">
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
                        ? 'choice selected'
                        : 'choice'
                    }
                  >
                    <input
                      type="radio"
                      name="rsvp"
                      value="yes"
                      checked={answer === 'yes'}
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
                        ? 'choice selected'
                        : 'choice'
                    }
                  >
                    <input
                      type="radio"
                      name="rsvp"
                      value="no"
                      checked={answer === 'no'}
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
                <span>♥</span>

                <h3>
                  Gracias por respondernos.
                </h3>

                <p>
                  Guardaremos tu respuesta con mucho
                  cariño.
                </p>
              </div>
            )}
          </div>
        </section>

        <footer className="footer">
          <span>M&Y</span>

          <p>
            NOS VEMOS EN CARTAGENA · MARZO 2027
          </p>
        </footer>
      </main>

      <style>{`
        :global(*) {
          box-sizing: border-box;
        }

        :global(html) {
          scroll-behavior: smooth;
        }

        :global(body) {
          margin: 0;
          background: #f5f1e8;
          color: #27261f;
        }

        :global(button),
        :global(input) {
          font: inherit;
        }

        .nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 22px 30px;
          color: white;
          mix-blend-mode: normal;
          pointer-events: none;
        }

        .monogram {
          font-family:
            var(--font-cormorant),
            Georgia,
            serif;
          font-size: 25px;
          font-style: italic;
          pointer-events: auto;
        }

        .nav-links {
          display: flex;
          gap: 24px;
          pointer-events: auto;
        }

        .nav-links a {
          color: white;
          text-decoration: none;
          font-family:
            var(--font-dm-sans),
            sans-serif;
          font-size: 10px;
          letter-spacing: .16em;
          text-transform: uppercase;
        }

        .hero {
          position: relative;
          min-height: 100svh;
          display: flex;
          align-items: center;
          justify-content: center;
          background:
            linear-gradient(
              rgba(25,25,20,.25),
              rgba(25,25,20,.48)
            ),
            linear-gradient(
              135deg,
              #59634a,
              #3e4734
            );
          overflow: hidden;
        }

        .hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(
              circle at center,
              transparent 0,
              rgba(0,0,0,.2) 100%
            );
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              to bottom,
              rgba(0,0,0,.12),
              rgba(0,0,0,.38)
            );
        }

        .hero-content {
          position: relative;
          z-index: 2;
          text-align: center;
          color: white;
          padding: 24px;
        }

        .eyebrow {
          margin: 0 0 18px;
          font-family:
            var(--font-dm-sans),
            sans-serif;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: .32em;
          text-transform: uppercase;
        }

        .hero h1 {
          margin: 0;
          font-family:
            var(--font-cormorant),
            Georgia,
            serif;
          font-size: clamp(52px, 14vw, 110px);
          font-weight: 400;
          line-height: .9;
          letter-spacing: .02em;
        }

        .hero h1 em {
          font-style: italic;
          font-weight: 400;
        }

        .location {
          margin: 24px 0 0;
          font-family:
            var(--font-dm-sans),
            sans-serif;
          font-size: 10px;
          letter-spacing: .28em;
        }

        .scroll {
          display: block;
          margin-top: 80px;
          font-family:
            var(--font-dm-sans),
            sans-serif;
          font-size: 9px;
          letter-spacing: .25em;
        }

        .section {
          padding: 110px 24px;
        }

        .ivory {
          background: #f5f1e8;
        }

        .olive {
          background: #59634a;
        }

        .centered {
          text-align: center;
        }

        .narrow {
          width: min(100%, 720px);
          margin: 0 auto;
        }

        .section h2 {
          margin: 0 0 22px;
          font-family:
            var(--font-cormorant),
            Georgia,
            serif;
          font-size: clamp(42px, 8vw, 70px);
          font-weight: 400;
          line-height: .95;
        }

        .section p {
          font-family:
            var(--font-dm-sans),
            sans-serif;
          font-size: 14px;
          line-height: 1.8;
          color: #58564d;
        }

        .olive-text {
          color: #59634a;
        }

        .burgundy-text {
          color: #572932;
        }

        .light-text {
          color: #f5f1e8;
        }

        .light-text p {
          color: rgba(245,241,232,.85);
        }

        .date {
          margin: 30px 0 8px !important;
          font-family:
            var(--font-cormorant),
            Georgia,
            serif !important;
          font-size: 28px !important;
          letter-spacing: .12em;
        }

        .smallcaps {
          font-size: 9px !important;
          letter-spacing: .22em;
        }

        .countdown {
          display: flex;
          justify-content: center;
          gap: clamp(16px, 5vw, 45px);
          margin: 42px 0;
        }

        .time {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .time strong {
          font-family:
            var(--font-cormorant),
            Georgia,
            serif;
          font-size: 34px;
          font-weight: 400;
        }

        .time span {
          font-family:
            var(--font-dm-sans),
            sans-serif;
          font-size: 8px;
          letter-spacing: .16em;
        }

        .outline-btn,
        .primary-btn {
          border: 1px solid #572932;
          background: transparent;
          color: #572932;
          padding: 15px 25px;
          font-family:
            var(--font-dm-sans),
            sans-serif;
          font-size: 9px;
          letter-spacing: .18em;
          cursor: pointer;
        }

        .primary-btn {
          background: #572932;
          color: #fff;
        }

        .split {
          display: grid;
          grid-template-columns: 1fr 1fr;
          padding: 0;
        }

        .image-card {
          min-height: 650px;
          position: relative;
          display: flex;
          align-items: flex-end;
          padding: 35px;
          background:
            linear-gradient(
              135deg,
              #c7bba6,
              #e4ddce
            );
        }

        .image-card span {
          color: white;
          font-family:
            var(--font-cormorant),
            Georgia,
            serif;
          font-size: 34px;
          position: relative;
          z-index: 2;
        }

        .copy-card {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: clamp(50px, 8vw, 110px);
          background: #eee9dc;
        }

        .copy-card h2 {
          font-size: clamp(38px, 5vw, 62px);
        }

        .script {
          font-family:
            var(--font-cormorant),
            Georgia,
            serif !important;
          font-size: 30px !important;
          font-style: italic;
          color: #572932 !important;
        }

        .photo-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin: 50px 0;
        }

        .photo-placeholder {
          aspect-ratio: 4 / 5;
          background:
            linear-gradient(
              145deg,
              #cfc7b7,
              #aaa18f
            );
        }

        .photo-two {
          transform: translateY(35px);
        }

        .quote {
          font-family:
            var(--font-cormorant),
            Georgia,
            serif !important;
          font-size: 27px !important;
          font-style: italic;
          color: #572932 !important;
        }

        .dress-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          margin: 55px 0;
        }

        .dress-icon {
          font-size: 30px;
          margin-bottom: 10px;
        }

        .dress-grid h3 {
          margin: 0 0 8px;
          font-family:
            var(--font-cormorant),
            Georgia,
            serif;
          font-size: 34px;
          font-weight: 400;
        }

        .dress-grid p {
          font-size: 12px !important;
        }

        .notice {
          border-top: 1px solid rgba(245,241,232,.35);
          border-bottom: 1px solid rgba(245,241,232,.35);
          padding: 20px 10px;
          font-family:
            var(--font-dm-sans),
            sans-serif;
          font-size: 9px;
          letter-spacing: .18em;
          line-height: 1.8;
        }

        .rsvp-deadline {
          margin-bottom: 40px;
        }

        .rsvp {
          max-width: 500px;
          margin: 0 auto;
          text-align: left;
        }

        .rsvp label > span {
          display: block;
          margin-bottom: 8px;
          font-family:
            var(--font-dm-sans),
            sans-serif;
          font-size: 9px;
          letter-spacing: .15em;
          text-transform: uppercase;
        }

        .rsvp input[type="text"],
        .rsvp input:not([type]) {
          width: 100%;
          border: 0;
          border-bottom: 1px solid #aaa294;
          background: transparent;
          padding: 14px 2px;
          outline: none;
        }

        .choices {
          display: grid;
          gap: 10px;
          margin: 30px 0;
        }

        .choice {
          display: flex;
          align-items: center;
          gap: 10px;
          border: 1px solid #d3cbbd;
          padding: 15px;
          cursor: pointer;
        }

        .choice.selected {
          border-color: #572932;
          background: rgba(87,41,50,.06);
        }

        .choice input {
          accent-color: #572932;
        }

        .choice span {
          margin: 0 !important;
          font-size: 9px !important;
        }

        .success {
          padding: 50px 20px;
        }

        .success > span {
          color: #572932;
          font-size: 25px;
        }

        .success h3 {
          font-family:
            var(--font-cormorant),
            Georgia,
            serif;
          font-size: 38px;
          font-weight: 400;
        }

        .footer {
          padding: 60px 24px;
          background: #572932;
          color: #f5f1e8;
          text-align: center;
        }

        .footer > span {
          font-family:
            var(--font-cormorant),
            Georgia,
            serif;
          font-size: 40px;
          font-style: italic;
        }

        .footer p {
          margin: 15px 0 0;
          font-family:
            var(--font-dm-sans),
            sans-serif;
          font-size: 8px;
          letter-spacing: .2em;
        }

        @media (max-width: 760px) {
          .nav {
            padding: 18px;
          }

          .nav-links {
            display: none;
          }

          .section {
            padding: 85px 22px;
          }

          .split {
            grid-template-columns: 1fr;
          }

          .image-card {
            min-height: 480px;
          }

          .copy-card {
            padding: 75px 28px;
          }

          .dress-grid {
            gap: 25px;
          }

          .photo-grid {
            gap: 10px;
          }

          .hero h1 {
            font-size: 56px;
          }
        }
      `}</style>
    </>
  );
}
