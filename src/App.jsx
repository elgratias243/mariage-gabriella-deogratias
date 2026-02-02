import { useState, useEffect, useRef } from "react";

const C = {
  cream: "#F9F5EF",
  creamDark: "#EDE6D9",
  gold: "#C9A84C",
  goldLight: "#E2D4A0",
  charcoal: "#1E1E1E",
  soft: "#6B6055",
  white: "#FFFFFF",
  blush: "#C9908A",
};

const timeline = [
  { time: "13h00", title: "Cérémonie Civile", icon: "⚖️", lieu: "Mairie de Bezons", desc: "L'union officielle devant le maire — le premier chapitre de notre histoire à deux." },
  { time: "13h45", title: "Photos Famille & Amis", icon: "📷", lieu: "Mairie de Bezons", desc: "Des portraits précieux avec tous ceux qui comptent." },
  { time: "14h30", title: "Bénédiction Nuptiale", icon: "✨", lieu: "Restaurant 3M — Cormeilles-en-Parisis", desc: "Une cérémonie religieuse empreinte de recueillement et de sérénité." },
  { time: "16h00", title: "Vin d'Honneur", lieu: "Restaurant 3M — Cormeilles-en-Parisis", icon: "🥂", desc: "Mignardises, cocktails, éclats de rire et beaux moments partagés. Pas de repas formel — juste la convivialité, les bonnes conversations et la joie d'être ensemble." },
  { time: "21h00", title: "Fin de Soirée", icon: "🌙", lieu: "", desc: "On se sépare sur une note douce. Merci d'avoir partagé cette journée avec nous." },
];

const drinks = ["Champagne", "Vin Rouge", "Vin Blanc", "Cocktail Signature", "Jus Frais", "Eau Pétillante"];
const allergens = ["Gluten", "Lactose", "Noix", "Fruits de Mer", "Œufs", "Soja", "Aucune allergie"];

const biblQuote = {
  fr: "« Où que tu ailles, j'irai. Où que tu t'arrêtes, je m'arrêterai.\nTon peuple sera mon peuple et ton Dieu sera mon Dieu. »",
  ref: "— Ruth 1:16",
};

// Photos du couple (à remplacer par vos vraies photos)
const HERO_PHOTO = "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80"; // Photo principale
const BG_PHOTOS = [
  "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1200&q=80",
  "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=1200&q=80",
  "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1200&q=80",
  "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=1200&q=80",
];

const STORAGE_KEY = "wedding-rsvp-responses";
const VISITS_KEY = "wedding-visit-count";

async function saveRSVP(guestData, accepted) {
  try {
    let responses = [];
    try {
      const existing = await window.storage.get(STORAGE_KEY, true);
      if (existing?.value) responses = JSON.parse(existing.value);
    } catch (e) {}
    const entry = { id: Date.now(), timestamp: new Date().toISOString(), accepted, guests: guestData };
    responses.push(entry);
    await window.storage.set(STORAGE_KEY, JSON.stringify(responses), true);
    return true;
  } catch (e) {
    console.error("Storage error:", e);
    return false;
  }
}

async function incrementVisits() {
  try {
    let count = 0;
    try {
      const v = await window.storage.get(VISITS_KEY, true);
      if (v?.value) count = parseInt(v.value, 10);
    } catch (e) {}
    count++;
    await window.storage.set(VISITS_KEY, String(count), true);
  } catch (e) { console.error(e); }
}

// Carrousel de photos en arrière-plan
function BackgroundCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % BG_PHOTOS.length);
    }, 8000); // Change toutes les 8 secondes
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: -1, overflow: "hidden" }}>
      {BG_PHOTOS.map((photo, i) => (
        <div key={i} style={{
          position: "absolute", inset: 0,
          backgroundImage: `url(${photo})`,
          backgroundSize: "cover", backgroundPosition: "center",
          opacity: i === currentIndex ? 0.08 : 0,
          transition: "opacity 2s ease-in-out",
          filter: "grayscale(0.3) blur(2px)",
        }} />
      ))}
      {/* Overlay pour assurer la lisibilité */}
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${C.cream}f5 0%, ${C.cream}dd 100%)` }} />
    </div>
  );
}

function Particles() {
  const [pts] = useState(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i, x: Math.random() * 100, y: Math.random() * 100,
      s: 3 + Math.random() * 10, d: 5 + Math.random() * 7, del: Math.random() * 5,
    }))
  );
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1, overflow: "hidden" }}>
      {pts.map((p) => (
        <div key={p.id} style={{
          position: "absolute", left: `${p.x}%`, top: `${p.y}%`,
          width: p.s, height: p.s, borderRadius: "50%",
          background: `radial-gradient(circle, ${C.goldLight}66, transparent)`,
          animation: `drift ${p.d}s ease-in-out ${p.del}s infinite alternate`,
        }} />
      ))}
      <style>{`@keyframes drift { 0%{transform:translateY(0) scale(1);opacity:.25} 100%{transform:translateY(-50px) scale(1.4);opacity:.65} }`}</style>
    </div>
  );
}

function Divider({ tight }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, margin: tight ? "16px 0" : "28px 0" }}>
      <div style={{ width: 52, height: 1, background: `linear-gradient(90deg, transparent, ${C.gold})` }} />
      <div style={{ width: 7, height: 7, border: `1.5px solid ${C.gold}`, borderRadius: 1.5, transform: "rotate(45deg)" }} />
      <div style={{ width: 52, height: 1, background: `linear-gradient(270deg, transparent, ${C.gold})` }} />
    </div>
  );
}

function Label({ children, top = 0 }) {
  return <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 13.5, color: C.soft, letterSpacing: 1.2, textTransform: "uppercase", margin: `${top}px 0 10px` }}>{children}</p>;
}

function Chips({ options, selected, onTog, color }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {options.map((o) => {
        const sel = selected.includes(o);
        return (
          <button key={o} onClick={() => onTog(o)} style={{
            fontFamily: "'Cormorant Garamond',serif", fontSize: 14.5, padding: "8px 17px", borderRadius: 30,
            background: sel ? color : C.cream, color: sel ? C.white : C.soft,
            border: `1px solid ${sel ? color : C.goldLight}`, cursor: "pointer", transition: "all .25s ease",
          }}>{o}</button>
        );
      })}
    </div>
  );
}

// NOUVELLE SECTION : Photo pleine page du couple
function CouplePhoto({ onContinue }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 300);
  }, []);

  return (
    <section style={{
      position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      overflow: "hidden", background: "#0a0a0a",
    }}>
      {/* Photo principale */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `url(${HERO_PHOTO})`,
        backgroundSize: "cover", backgroundPosition: "center",
        opacity: visible ? 0.85 : 0,
        transition: "opacity 1.8s ease-out",
        filter: "brightness(0.75)",
      }} />

      {/* Overlay gradient */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(180deg, rgba(10,10,10,0.3) 0%, rgba(10,10,10,0.6) 100%)",
      }} />

      {/* Vignette subtile */}
      <div style={{
        position: "absolute", inset: 0,
        boxShadow: "inset 0 0 200px rgba(0,0,0,0.4)",
      }} />

      {/* Contenu centré */}
      <div style={{
        position: "relative", zIndex: 2, textAlign: "center", padding: "0 24px",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(30px)",
        transition: "all 1.5s cubic-bezier(.22,1,.36,1) 0.5s",
      }}>
        <p style={{
          fontFamily: "'Cormorant Garamond',serif", fontSize: 15, letterSpacing: 6,
          textTransform: "uppercase", color: `${C.goldLight}dd`, marginBottom: 24,
          textShadow: "0 2px 12px rgba(0,0,0,0.8)",
        }}>
          10 Avril 2026
        </p>

        <h1 style={{
          fontFamily: "'Playfair Display',serif", fontSize: "clamp(36px,8vw,64px)",
          fontWeight: 400, color: C.white, lineHeight: 1.3, margin: 0,
          textShadow: "0 4px 30px rgba(0,0,0,0.9)",
        }}>
          Gabriella & Deogratias
        </h1>

        <button onClick={onContinue} style={{
          marginTop: 48, fontFamily: "'Cormorant Garamond',serif", fontSize: 14, letterSpacing: 4,
          textTransform: "uppercase", background: "rgba(201,168,76,0.15)", backdropFilter: "blur(10px)",
          border: `1.5px solid ${C.gold}`, color: C.gold, padding: "14px 40px", borderRadius: 40,
          cursor: "pointer", transition: "all .4s ease",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        }}
          onMouseEnter={e => { e.currentTarget.style.background = C.gold; e.currentTarget.style.color = C.white; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(201,168,76,0.15)"; e.currentTarget.style.color = C.gold; }}
        >
          Continuer
        </button>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)",
        opacity: visible ? 0.6 : 0, transition: "opacity 2s ease 2s",
      }}>
        <div style={{
          width: 22, height: 36, border: `2px solid ${C.goldLight}88`, borderRadius: 12,
          display: "flex", justifyContent: "center", paddingTop: 8,
        }}>
          <div style={{
            width: 3, height: 8, borderRadius: 2, background: C.goldLight,
            animation: "scrollBounce 1.8s ease infinite",
          }} />
        </div>
      </div>
      <style>{`@keyframes scrollBounce { 0%{opacity:1;transform:translateY(0)} 100%{opacity:0;transform:translateY(12px)} }`}</style>
    </section>
  );
}

function Hero({ onOpen }) {
  const [in_, setIn] = useState(false);
  useEffect(() => { setTimeout(() => setIn(true), 120); }, []);

  return (
    <section style={{
      position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", overflow: "hidden",
      background: "linear-gradient(160deg, #1a1612 0%, #2e2620 35%, #3d3228 60%, #231f1a 100%)",
    }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 80% 60% at 50% 40%, rgba(201,168,76,.12) 0%, transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 60% 50% at 30% 70%, rgba(201,168,76,.07) 0%, transparent 60%)`, pointerEvents: "none" }} />
      <Particles />

      <div style={{
        position: "relative", zIndex: 2, textAlign: "center", padding: "0 24px",
        opacity: in_ ? 1 : 0, transform: in_ ? "translateY(0)" : "translateY(28px)",
        transition: "opacity 1.4s cubic-bezier(.22,1,.36,1), transform 1.4s cubic-bezier(.22,1,.36,1)",
      }}>
        <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 13, letterSpacing: 5, textTransform: "uppercase", color: `${C.goldLight}aa`, marginBottom: 20 }}>
          Vous êtes invités à célébrer
        </p>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 400, lineHeight: 1.2, margin: 0, color: C.white }}>
          <span style={{ display: "block", fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(18px,4vw,24px)", color: C.goldLight, marginBottom: 10 }}>le mariage de</span>
          <span style={{ display: "block", fontSize: "clamp(52px,13vw,96px)", textShadow: "0 2px 40px rgba(0,0,0,.3)" }}>Gabriella</span>
          <span style={{ display: "inline-block", fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(22px,5vw,32px)", color: C.gold, margin: "2px 0", letterSpacing: 4 }}>&</span>
          <span style={{ display: "block", fontSize: "clamp(52px,13vw,96px)", textShadow: "0 2px 40px rgba(0,0,0,.3)" }}>Deogratias</span>
        </h1>
        <Divider />
        <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(16px,3vw,19px)", color: `${C.goldLight}cc`, letterSpacing: 2, marginBottom: 4 }}>10 Avril 2026</p>
        <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 15, color: `${C.goldLight}88`, letterSpacing: 1 }}>À partir de 13h00</p>

        <button onClick={onOpen} style={{
          marginTop: 44, fontFamily: "'Cormorant Garamond',serif", fontSize: 14, letterSpacing: 4, textTransform: "uppercase",
          background: "transparent", border: `1px solid ${C.gold}`, color: C.gold,
          padding: "13px 42px", borderRadius: 40, cursor: "pointer", transition: "all .35s ease",
        }}
          onMouseEnter={e => { e.currentTarget.style.background = C.gold; e.currentTarget.style.color = C.white; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.gold; }}
        >Découvrir</button>
      </div>

      <div style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", zIndex: 2, opacity: in_ ? .5 : 0, transition: "opacity 2s ease 1.5s" }}>
        <div style={{ width: 20, height: 34, border: `1.5px solid ${C.goldLight}66`, borderRadius: 10, display: "flex", justifyContent: "center", paddingTop: 6 }}>
          <div style={{ width: 3, height: 8, borderRadius: 2, background: C.gold, animation: "scrollDot 1.6s ease infinite" }} />
        </div>
      </div>
      <style>{`@keyframes scrollDot { 0%{opacity:1;transform:translateY(0)} 100%{opacity:0;transform:translateY(10px)} }`}</style>
    </section>
  );
}

function TeaserSection() {
  const [vis, setVis] = useState(false);
  const ref = useRef();
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.25 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} style={{ padding: "90px 24px", background: C.cream, position: "relative" }}>
      <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
        <div style={{ opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(24px)", transition: "all .9s cubic-bezier(.22,1,.36,1)" }}>
          <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(17px,3.2vw,20px)", color: C.soft, lineHeight: 1.85, margin: 0 }}>
            Parce que les moments les plus précieux se partagent en toute intimité, nous avons imaginé une journée à notre image : <em style={{ color: C.gold }}>simple, joyeuse</em> et entourée de ceux qui comptent vraiment.
          </p>
          <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(17px,3.2vw,20px)", color: C.soft, lineHeight: 1.85, margin: "18px 0 0" }}>
            De la mairie aux éclats de rire du vin d'honneur, jusqu'à la douceur du soir — rejoignez-nous pour écrire cette nouvelle page.
          </p>
        </div>
        <Divider />
        <div style={{
          opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(18px)",
          transition: "all 1s cubic-bezier(.22,1,.36,1) .25s",
          background: C.creamDark, borderRadius: 20, padding: "36px 32px", marginTop: 8,
          border: `1px solid ${C.goldLight}55`, position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", top: -18, left: -18, width: 60, height: 60, borderRadius: "50%", background: `radial-gradient(circle, ${C.goldLight}33, transparent)` }} />
          <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 38, color: C.gold, lineHeight: 0.6, display: "block", marginBottom: 12 }}>"</span>
          <p style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", fontSize: "clamp(17px,3vw,20px)", color: C.charcoal, lineHeight: 1.75, margin: 0, whiteSpace: "pre-line" }}>
            {biblQuote.fr}
          </p>
          <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 14, color: C.gold, letterSpacing: 1, marginTop: 16, marginBottom: 0 }}>{biblQuote.ref}</p>
        </div>
      </div>
    </section>
  );
}

function TimelineSection() {
  const [visItems, setVisItems] = useState([]);
  const refs = useRef([]);

  useEffect(() => {
    const obs = timeline.map((_, i) => {
      const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisItems((p) => [...new Set([...p, i])]); }, { threshold: 0.18 });
      if (refs.current[i]) o.observe(refs.current[i]);
      return o;
    });
    return () => obs.forEach((o) => o.disconnect());
  }, []);

  return (
    <section style={{ padding: "80px 24px 90px", background: `linear-gradient(180deg, ${C.cream} 0%, ${C.creamDark} 100%)`, position: "relative" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(26px,5.5vw,38px)", fontWeight: 400, color: C.charcoal, textAlign: "center", margin: "0 0 6px" }}>
          Le déroulé de la journée
        </h2>
        <Divider />
        <div style={{ position: "relative", marginTop: 48 }}>
          <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1.5, transform: "translateX(-50%)", background: `linear-gradient(180deg, ${C.goldLight}44, ${C.gold}, ${C.goldLight}44)` }} />
          {timeline.map((ev, i) => {
            const left = i % 2 === 0;
            const vis = visItems.includes(i);
            return (
              <div key={i} ref={(el) => (refs.current[i] = el)} style={{ display: "flex", justifyContent: left ? "flex-start" : "flex-end", marginBottom: 36, position: "relative" }}>
                <div style={{
                  width: "calc(50% - 36px)", padding: "24px 22px", borderRadius: 18,
                  background: C.white, border: `1px solid ${C.goldLight}44`, boxShadow: "0 6px 28px rgba(30,30,30,.07)",
                  opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : (left ? "translateX(-18px) translateY(16px)" : "translateX(18px) translateY(16px)"),
                  transition: `all .75s cubic-bezier(.22,1,.36,1) ${i * 0.08}s`, textAlign: left ? "right" : "left",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexDirection: left ? "row-reverse" : "row", marginBottom: 6 }}>
                    <span style={{ fontSize: 20 }}>{ev.icon}</span>
                    <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 12.5, letterSpacing: 2.5, color: C.gold, textTransform: "uppercase", fontWeight: 600 }}>{ev.time}</span>
                  </div>
                  <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 400, color: C.charcoal, margin: "0 0 4px" }}>{ev.title}</h3>
                  {ev.lieu && <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 13, color: C.gold, margin: "0 0 6px" }}>📍 {ev.lieu}</p>}
                  <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 15, color: C.soft, margin: 0, lineHeight: 1.5 }}>{ev.desc}</p>
                </div>
                <div style={{
                  position: "absolute", left: "50%", top: 28, width: 14, height: 14, borderRadius: "50%",
                  background: C.white, border: `2.5px solid ${C.gold}`, transform: "translateX(-50%)",
                  boxShadow: `0 0 0 4px ${C.gold}22`, zIndex: 1,
                  opacity: vis ? 1 : 0, transition: `opacity .5s ease ${i * 0.08 + 0.18}s`,
                }} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function RSVPSection({ submitted, setSubmitted }) {
  const [step, setStep] = useState(0);
  const [accepted, setAccepted] = useState(null);
  const [guests, setGuests] = useState([{ name: "", drinks: [], allergies: [], song: "" }]);
  const [anim, setAnim] = useState(false);
  const [saving, setSaving] = useState(false);

  const transition = (fn) => { setAnim(true); setTimeout(() => { fn(); setAnim(false); }, 320); };
  const upd = (i, k, v) => { const g = [...guests]; g[i] = { ...g[i], [k]: v }; setGuests(g); };
  const tog = (i, k, v) => { const arr = guests[i][k]; upd(i, k, arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]); };
  const addGuest = () => setGuests([...guests, { name: "", drinks: [], allergies: [], song: "" }]);

  const handleSubmit = async () => {
    setSaving(true);
    await saveRSVP(guests, accepted);
    setSaving(false);
    setStep(2);
    setSubmitted(true);
  };

  return (
    <section style={{ minHeight: "100vh", padding: "80px 24px 100px", background: `linear-gradient(180deg, ${C.creamDark} 0%, ${C.cream} 100%)`, display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
      <div style={{ maxWidth: 660, width: "100%", textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(24px,5vw,36px)", fontWeight: 400, color: C.charcoal, margin: "0 0 6px" }}>
          Répondre à l'invitation
        </h2>
        <Divider />

        {step === 0 && (
          <div style={{ opacity: anim ? 0 : 1, transform: anim ? "translateY(10px)" : "translateY(0)", transition: "all .32s ease", marginTop: 40 }}>
            <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 19, color: C.soft, marginBottom: 40 }}>
              Souhaitez-vous nous faire l'honneur de votre présence ?
            </p>
            <div style={{ display: "flex", gap: 18, justifyContent: "center", flexWrap: "wrap" }}>
              {[{ lbl: "Avec joie !", val: true, ico: "💐" }, { lbl: "Désolé, absent", val: false, ico: "🌹" }].map((o) => {
                const sel = accepted === o.val;
                return (
                  <button key={String(o.val)} onClick={() => setAccepted(o.val)} style={{
                    fontFamily: "'Cormorant Garamond',serif", fontSize: 17, width: 210, padding: "30px 20px", borderRadius: 22,
                    background: sel ? (o.val ? C.gold : C.blush) : C.white,
                    color: sel ? C.white : C.charcoal,
                    border: `1.5px solid ${sel ? (o.val ? C.gold : C.blush) : C.goldLight}`,
                    cursor: "pointer", transition: "all .3s ease",
                    boxShadow: sel ? `0 8px 32px ${o.val ? C.gold : C.blush}44` : "0 4px 16px rgba(0,0,0,.06)",
                  }}>
                    <div style={{ fontSize: 30, marginBottom: 8 }}>{o.ico}</div>
                    {o.lbl}
                  </button>
                );
              })}
            </div>
            {accepted !== null && (
              <div style={{ marginTop: 38, animation: "pop .4s cubic-bezier(.22,1,.36,1)" }}>
                <button onClick={() => { if (accepted) transition(() => setStep(1)); else { saveRSVP([{ name: "Invité anonyme", drinks: [], allergies: [], song: "" }], false); setStep(2); setSubmitted(true); } }}
                  style={{
                    fontFamily: "'Cormorant Garamond',serif", fontSize: 15, letterSpacing: 3.5, textTransform: "uppercase",
                    background: C.gold, color: C.white, border: "none", padding: "13px 44px", borderRadius: 40, cursor: "pointer",
                    boxShadow: `0 4px 22px ${C.gold}44`, transition: "transform .2s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                >{accepted ? "Continuer" : "Confirmer"}</button>
              </div>
            )}
            <style>{`@keyframes pop { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }`}</style>
          </div>
        )}

        {step === 1 && (
          <div style={{ opacity: anim ? 0 : 1, transform: anim ? "translateY(10px)" : "translateY(0)", transition: "all .32s ease", marginTop: 36, textAlign: "left" }}>
            <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, color: C.soft, textAlign: "center", marginBottom: 34 }}>
              Complétez les détails pour chaque invité
            </p>
            {guests.map((g, i) => (
              <div key={i} style={{ background: C.white, borderRadius: 22, padding: "28px 24px", marginBottom: 18, border: `1px solid ${C.goldLight}44`, boxShadow: "0 4px 22px rgba(0,0,0,.05)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                  <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, color: C.gold }}>Invité {i + 1}</span>
                  {i > 0 && <button onClick={() => setGuests(guests.filter((_, x) => x !== i))} style={{ background: "none", border: "none", color: C.blush, cursor: "pointer", fontSize: 20 }}>✕</button>}
                </div>
                <input type="text" placeholder="Prénom & Nom" value={g.name} onChange={(e) => upd(i, "name", e.target.value)}
                  style={{ width: "100%", boxSizing: "border-box", padding: "12px 16px", borderRadius: 14, border: `1px solid ${C.goldLight}88`, fontFamily: "'Cormorant Garamond',serif", fontSize: 16, color: C.charcoal, background: C.cream, outline: "none", marginBottom: 22 }} />
                <Label>🥂 Préférence de boisson</Label>
                <Chips options={drinks} selected={g.drinks} onTog={(v) => tog(i, "drinks", v)} color={C.gold} />
                <Label top={22}>⚠️ Allergies alimentaires</Label>
                <Chips options={allergens} selected={g.allergies} onTog={(v) => tog(i, "allergies", v)} color={C.blush} />
                <Label top={22}>🎶 Une chanson qui vous ferait obligatoirement danser ?</Label>
                <input type="text" placeholder="Le titre de la chanson…" value={g.song} onChange={(e) => upd(i, "song", e.target.value)}
                  style={{ width: "100%", boxSizing: "border-box", padding: "11px 16px", borderRadius: 14, border: `1px solid ${C.goldLight}88`, fontFamily: "'Cormorant Garamond',serif", fontSize: 16, color: C.charcoal, background: C.cream, outline: "none", marginTop: 8 }} />
              </div>
            ))}
            <div style={{ textAlign: "center", marginTop: 8 }}>
              <button onClick={addGuest} style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 15, background: "transparent", border: `1px dashed ${C.gold}`, color: C.gold, padding: "10px 26px", borderRadius: 32, cursor: "pointer" }}>
                + Ajouter un invité
              </button>
            </div>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", marginTop: 38 }}>
              <button onClick={() => transition(() => setStep(0))} style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 15, background: "transparent", border: `1px solid ${C.goldLight}`, color: C.soft, padding: "11px 30px", borderRadius: 40, cursor: "pointer" }}>Retour</button>
              <button onClick={handleSubmit} disabled={saving}
                style={{
                  fontFamily: "'Cormorant Garamond',serif", fontSize: 15, letterSpacing: 3, textTransform: "uppercase",
                  background: saving ? C.goldLight : C.gold, color: C.white, border: "none", padding: "13px 40px", borderRadius: 40, cursor: saving ? "wait" : "pointer",
                  boxShadow: `0 4px 22px ${C.gold}44`, transition: "transform .2s",
                }}
                onMouseEnter={e => { if (!saving) e.currentTarget.style.transform = "scale(1.05)"; }}
                onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
              >{saving ? "Sauvegarde…" : "Confirmer"}</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={{ marginTop: 64, animation: "pop .6s cubic-bezier(.22,1,.36,1)", textAlign: "center" }}>
            <div style={{ fontSize: 60, marginBottom: 18 }}>{accepted ? "💐" : "🌹"}</div>
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 400, color: C.charcoal, margin: "0 0 14px" }}>
              {accepted ? "Merci !" : "Nous le regrettons"}
            </h3>
            <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, color: C.soft, maxWidth: 440, margin: "0 auto", lineHeight: 1.7 }}>
              {accepted ? "Votre présence nous fera beaucoup de joie. À bientôt le 10 avril !" : "Nous espérons vous revoir bientôt. Encore merci pour votre message."}
            </p>
            <Divider tight />
            <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 16, color: C.gold, letterSpacing: 2, marginTop: 18 }}>Gabriella & Deogratias</p>
          </div>
        )}
      </div>
    </section>
  );
}

function StickyRSVP({ onClick, show }) {
  return (
    <div style={{
      position: "fixed", bottom: 28, right: 28, zIndex: 999,
      opacity: show ? 1 : 0, transform: show ? "translateY(0) scale(1)" : "translateY(20px) scale(.9)",
      transition: "all .45s cubic-bezier(.22,1,.36,1)", pointerEvents: show ? "auto" : "none",
    }}>
      <button onClick={onClick} style={{
        fontFamily: "'Cormorant Garamond',serif", fontSize: 15, letterSpacing: 3, textTransform: "uppercase",
        background: C.charcoal, color: C.goldLight, border: "none", padding: "15px 32px", borderRadius: 40, cursor: "pointer",
        boxShadow: "0 6px 30px rgba(30,30,30,.35)", transition: "all .3s ease", display: "flex", alignItems: "center", gap: 10,
      }}
        onMouseEnter={e => { e.currentTarget.style.background = C.gold; e.currentTarget.style.color = C.white; }}
        onMouseLeave={e => { e.currentTarget.style.background = C.charcoal; e.currentTarget.style.color = C.goldLight; }}
      >
        <span style={{ fontSize: 18 }}>💌</span> RSVP
      </button>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("photo"); // photo → hero → main
  const [tab, setTab] = useState("teaser");
  const [submitted, setSubmitted] = useState(false);
  const rsvpRef = useRef(null);

  useEffect(() => { incrementVisits(); }, []);

  const goRSVP = () => {
    setTab("rsvp");
    setTimeout(() => rsvpRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
  };

  return (
    <div style={{ fontFamily: "'Cormorant Garamond',serif", background: C.cream, minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');
        * { -webkit-font-smoothing: antialiased; box-sizing: border-box; }
        input::placeholder { color: #9B9185; }
        html { scroll-behavior: smooth; }
      `}</style>

      {/* Photo du couple en premier */}
      {page === "photo" && <CouplePhoto onContinue={() => setPage("hero")} />}

      {/* Page Hero classique */}
      {page === "hero" && <Hero onOpen={() => setPage("main")} />}

      {/* Page principale avec carrousel en arrière-plan */}
      {page === "main" && (
        <>
          <BackgroundCarousel />
          
          <nav style={{ position: "sticky", top: 0, zIndex: 100, background: `${C.cream}ee`, backdropFilter: "blur(14px)", borderBottom: `1px solid ${C.goldLight}55`, padding: "15px 0" }}>
            <div style={{ display: "flex", justifyContent: "center", gap: 36 }}>
              {[
                { k: "teaser", lbl: "Notre histoire", ico: "🌸" },
                { k: "timeline", lbl: "Déroulé", ico: "✨" },
                { k: "rsvp", lbl: "RSVP", ico: "💌" },
              ].map((t) => (
                <button key={t.k} onClick={() => setTab(t.k)} style={{
                  fontFamily: "'Cormorant Garamond',serif", fontSize: 15.5, letterSpacing: 1.8, textTransform: "uppercase",
                  background: "none", border: "none", cursor: "pointer", padding: "6px 0", position: "relative",
                  color: tab === t.k ? C.gold : C.soft, transition: "color .3s",
                }}>
                  <span style={{ marginRight: 6 }}>{t.ico}</span>{t.lbl}
                  <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: tab === t.k ? "100%" : 0, height: 2, background: C.gold, borderRadius: 1, transition: "width .38s ease" }} />
                </button>
              ))}
            </div>
          </nav>

          {tab === "teaser" && <TeaserSection />}
          {tab === "timeline" && <TimelineSection />}
          {tab === "rsvp" && <div ref={rsvpRef}><RSVPSection submitted={submitted} setSubmitted={setSubmitted} /></div>}

          <footer style={{ textAlign: "center", padding: "52px 24px 64px", background: C.cream, position: "relative" }}>
            <Divider />
            <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 400, color: C.charcoal, margin: "18px 0 4px" }}>Gabriella & Deogratias</p>
            <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 15, color: C.soft, margin: 0 }}>10 Avril 2026</p>
          </footer>

          <StickyRSVP show={tab !== "rsvp" && !submitted} onClick={goRSVP} />
        </>
      )}
    </div>
  );
}
