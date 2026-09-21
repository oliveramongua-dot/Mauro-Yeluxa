'use client';

import { useEffect, useState } from 'react';

const WEDDING_DATE = new Date('2027-03-14T16:00:00-05:00');
const RSVP_DEADLINE = '15 de noviembre de 2026';

function Countdown() {
  const [left, setLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });
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
  return <div className="countdown">{Object.entries({DÍAS:left.d,HORAS:left.h,MINUTOS:left.m,SEGUNDOS:left.s}).map(([k,v]) => <div className="time" key={k}><strong>{String(v).padStart(2,'0')}</strong><span>{k}</span></div>)}</div>;
}

export default function Home() {
  const [answer, setAnswer] = useState('');
  const [sent, setSent] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (!answer) return;
    setSent(true);
  };

  return (
    <main>
      <nav className="nav"><span className="monogram">M&Y</span><div><a href="#fecha">Fecha</a><a href="#cartagena">Cartagena</a><a href="#historia">Nosotros</a><a href="#dress">Dress code</a><a href="#rsvp">RSVP</a></div></nav>

      <section className="hero">
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="eyebrow">NOS CASAMOS</p>
          <h1>MAURO <em>&</em> YELUXA</h1>
          <p className="location">CARTAGENA DE INDIAS · MARZO 2027</p>
          <span className="scroll">GUARDA ESTA FECHA ↓</span>
        </div>
      </section>

      <section id="fecha" className="section ivory centered">
        <p className="eyebrow olive-text">SAVE THE DATE</p>
        <h2>Reserva esta fecha</h2>
        <p className="date">14 · MARZO · 2027</p>
        <p className="smallcaps">CARTAGENA DE INDIAS · CENTRO HISTÓRICO</p>
        <Countdown />
        <button className="outline-btn" onClick={() => alert('En la siguiente etapa conectaremos este botón con Google/Apple Calendar.')}>＋ Añadir a mi calendario</button>
      </section>

      <section id="cartagena" className="section split">
        <div className="image-card cartagena-image"><span>Cartagena de Indias</span></div>
        <div className="copy-card">
          <p className="eyebrow olive-text">EL LUGAR</p>
          <h2>Una fecha en el<br/>Centro Histórico</h2>
          <p>Queremos compartir este momento contigo en el corazón de Cartagena de Indias, entre murallas, historia, arquitectura y el encanto de una ciudad que significa tanto para nosotros.</p>
          <p className="script">Allí nos veremos.</p>
        </div>
      </section>

      <section id="historia" className="section ivory">
        <div className="narrow centered">
          <p className="eyebrow burgundy-text">NUESTRA HISTORIA</p>
          <h2>El comienzo de un nuevo capítulo</h2>
          <p>Después de tantos momentos compartidos, viajes, sueños y aventuras, llegó el momento de celebrar nuestro próximo capítulo junto a las personas que más queremos.</p>
          <div className="photo-grid"><div/><div/><div/></div>
          <p className="quote">“La vida es más linda cuando la compartimos.”</p>
        </div>
      </section>

      <section id="dress" className="section olive">
        <div className="narrow centered light-text">
          <p className="eyebrow">DRESS CODE</p>
          <h2>Formal</h2>
          <div className="dress-grid">
            <div><div className="dress-icon">♢</div><h3>Hombres</h3><p>Traje formal<br/><small>Preferiblemente traje oscuro.</small></p></div>
            <div><div className="dress-icon">♢</div><h3>Mujeres</h3><p>Vestido formal largo</p></div>
          </div>
          <div className="notice">EL BLANCO ESTÁ RESERVADO PARA LOS NOVIOS.</div>
        </div>
      </section>

      <section id="rsvp" className="section ivory centered">
        <div className="narrow">
          <p className="eyebrow burgundy-text">PRIMERA ETAPA</p>
          <h2>¿Podemos contar contigo?</h2>
          <p>Estamos preparando este día con mucho cariño y queremos saber si podremos celebrarlo contigo.</p>
          <p className="deadline">Confirma tu intención de asistir antes del <strong>{RSVP_DEADLINE}</strong>.</p>
          {!sent ? <form className="rsvp" onSubmit={submit}>
            <label><span>Tu nombre</span><input required placeholder="Escribe tu nombre" /></label>
            <div className="choices">
              <label className={answer==='yes'?'selected':''}><input type="radio" name="rsvp" value="yes" onChange={e=>setAnswer(e.target.value)}/><span>Sí, quiero acompañarlos</span></label>
              <label className={answer==='no'?'selected':''}><input type="radio" name="rsvp" value="no" onChange={e=>setAnswer(e.target.value)}/><span>No podré acompañarlos</span></label>
            </div>
            <button className="primary-btn" type="submit">Enviar respuesta</button>
          </form> : <div className="success"><span>✓</span><h3>Gracias por respondernos.</h3><p>Tu respuesta quedó registrada en esta primera versión. En la siguiente etapa conectaremos este formulario con la base de invitados.</p></div>}
        </div>
      </section>

      <footer className="footer"><span>M&Y</span><p>Nos vemos en Cartagena · Marzo 2027</p></footer>
    </main>
  );
}
