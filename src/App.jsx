import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Analytics } from '@vercel/analytics/react';

// ============ STYLES ============
const styles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }

  .navbar {
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, #02367B 0%, #0657A6 100%);
    color: white;
    padding: 20px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }

  .title {
    font-size: 28px;
    font-weight: 700;
    letter-spacing: 2px;
  }

  .hero {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 70vh;
    padding: 40px 20px;
    text-align: center;
  }

  .hero-title {
    font-size: 64px;
    font-weight: 800;
    background: linear-gradient(135deg, #02367B 0%, #0657A6 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 20px;
    animation: fadeInUp 0.8s ease;
  }

  .hero-subtitle {
    font-size: 24px;
    color: #555;
    margin-bottom: 40px;
    animation: fadeInUp 0.8s ease 0.2s backwards;
  }

  .btn-hero {
    padding: 16px 48px;
    font-size: 20px;
    font-weight: 600;
    border: none;
    border-radius: 50px;
    background: linear-gradient(135deg, #02367B 0%, #0657A6 100%);
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 8px 24px rgba(2, 54, 123, 0.3);
    animation: fadeInUp 0.8s ease 0.4s backwards;
  }

  .btn-hero:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(2, 54, 123, 0.4);
  }

  .container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 32px 20px;
  }

  .content-wrapper {
    display: grid;
    grid-template-columns: 380px 1fr;
    gap: 32px;
    align-items: start;
  }

  .input-section {
    position: sticky;
    top: 20px;
  }

  .input-form {
    background: white;
    padding: 28px;
    border-radius: 20px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.08);
  }

  .form-title {
    font-size: 24px;
    font-weight: 700;
    color: #02367B;
    margin-bottom: 24px;
    text-align: center;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 16px;
  }

  .form-group {
    margin-bottom: 20px;
  }

  .form-group label {
    display: block;
    font-size: 14px;
    font-weight: 600;
    color: #333;
    margin-bottom: 8px;
  }

  .form-input {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid #e0e0e0;
    border-radius: 12px;
    font-size: 15px;
    transition: all 0.3s ease;
    outline: none;
  }

  .form-input:focus {
    border-color: #02367B;
    box-shadow: 0 0 0 4px rgba(2, 54, 123, 0.1);
  }

  .btn-primary, .btn-secondary {
    width: 100%;
    padding: 14px;
    border: none;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-bottom: 12px;
  }

  .btn-primary {
    background: linear-gradient(135deg, #02367B 0%, #0657A6 100%);
    color: white;
    box-shadow: 0 4px 16px rgba(2, 54, 123, 0.3);
  }

  .btn-primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(2, 54, 123, 0.4);
  }

  .btn-primary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn-secondary {
    background: #f0f0f0;
    color: #333;
  }

  .btn-secondary:hover {
    background: #e0e0e0;
  }

  .text-muted {
    display: block;
    font-size: 12px;
    color: #666;
    margin-top: 6px;
  }

  .alert-error {
    background: #fee;
    color: #c33;
    padding: 12px;
    border-radius: 8px;
    margin-top: 12px;
    font-size: 14px;
  }

  .results-section {
    min-height: 400px;
  }

  .grup-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 24px;
  }

  .card-custom {
    background: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 16px rgba(0,0,0,0.08);
    transition: all 0.3s ease;
  }

  .card-custom:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.12);
  }

  .card-header {
    background: linear-gradient(135deg, #02367B 0%, #0657A6 100%);
    color: white;
    padding: 16px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .card-header h5 {
    font-size: 18px;
    font-weight: 600;
  }

  .btn-copy {
    padding: 6px 14px;
    border: 2px solid rgba(255,255,255,0.3);
    background: rgba(255,255,255,0.1);
    color: white;
    border-radius: 8px;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-weight: 500;
  }

  .btn-copy:hover:not(:disabled) {
    background: rgba(255,255,255,0.2);
    border-color: rgba(255,255,255,0.5);
  }

  .btn-copy:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .member-list {
    list-style: none;
    padding: 16px 20px;
    max-height: 400px;
    overflow-y: auto;
  }

  .member-item {
    display: flex;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #f0f0f0;
  }

  .member-item:last-child {
    border-bottom: none;
  }

  .member-bubble {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: linear-gradient(135deg, #0d6efd 0%, #3a8dff 100%);
    color: white;
    font-weight: 600;
    margin-right: 12px;
    font-size: 14px;
  }

  .member-text {
    color: #333;
    font-size: 15px;
  }

  .empty-state {
    text-align: center;
    padding: 60px 20px;
    color: #999;
  }

  .empty-icon {
    font-size: 64px;
    margin-bottom: 16px;
  }

  @keyframes shuffle {
    0% { transform: translateY(0) rotate(0deg); opacity: 0.9; }
    20% { transform: translateY(-10px) rotate(-3deg); }
    45% { transform: translateY(10px) rotate(4deg); }
    70% { transform: translateY(-6px) rotate(-2deg); }
    100% { transform: translateY(0) rotate(0deg); opacity: 1; }
  }

  .card-custom.shuffle {
    animation: shuffle 640ms cubic-bezier(.2,.9,.3,1) both;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 1024px) {
    .content-wrapper {
      grid-template-columns: 1fr;
    }

    .input-section {
      position: static;
    }

    .input-form {
      max-width: 600px;
      margin: 0 auto;
    }
  }

  @media (max-width: 768px) {
    .hero-title {
      font-size: 42px;
    }

    .hero-subtitle {
      font-size: 18px;
    }

    .title {
      font-size: 22px;
    }

    .form-row {
      grid-template-columns: 1fr;
    }

    .grup-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 480px) {
    .hero-title {
      font-size: 32px;
    }

    .btn-hero {
      padding: 12px 32px;
      font-size: 16px;
    }

    .container {
      padding: 20px 12px;
    }
  }
`;

// ============ ClickSpark Component ============
const ClickSpark = ({
  sparkColor = '#fff',
  sparkSize = 10,
  sparkRadius = 15,
  sparkCount = 8,
  duration = 400,
  easing = 'ease-out',
  extraScale = 1.0,
  children
}) => {
  const canvasRef = useRef(null);
  const sparksRef = useRef([]);
  const startTimeRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    let resizeTimeout;

    const resizeCanvas = () => {
      const { width, height } = parent.getBoundingClientRect();
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
    };

    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resizeCanvas, 100);
    };

    const ro = new ResizeObserver(handleResize);
    ro.observe(parent);

    resizeCanvas();

    return () => {
      ro.disconnect();
      clearTimeout(resizeTimeout);
    };
  }, []);

  const easeFunc = useCallback(
    t => {
      switch (easing) {
        case 'linear':
          return t;
        case 'ease-in':
          return t * t;
        case 'ease-in-out':
          return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        default:
          return t * (2 - t);
      }
    },
    [easing]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationId;

    const draw = timestamp => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      sparksRef.current = sparksRef.current.filter(spark => {
        const elapsed = timestamp - spark.startTime;
        if (elapsed >= duration) {
          return false;
        }

        const progress = elapsed / duration;
        const eased = easeFunc(progress);

        const distance = eased * sparkRadius * extraScale;
        const lineLength = sparkSize * (1 - eased);

        const x1 = spark.x + distance * Math.cos(spark.angle);
        const y1 = spark.y + distance * Math.sin(spark.angle);
        const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle);
        const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle);

        ctx.strokeStyle = sparkColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        return true;
      });

      animationId = requestAnimationFrame(draw);
    };

    animationId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [sparkColor, sparkSize, sparkRadius, sparkCount, duration, easeFunc, extraScale]);

  const handleClick = e => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const now = performance.now();
    const newSparks = Array.from({ length: sparkCount }, (_, i) => ({
      x,
      y,
      angle: (2 * Math.PI * i) / sparkCount,
      startTime: now
    }));

    sparksRef.current.push(...newSparks);
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%'
      }}
      onClick={handleClick}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          userSelect: 'none',
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none'
        }}
      />
      {children}
    </div>
  );
};

// ============ Navbar Component ============
const Navbar = () => {
  return (
    <nav className="navbar">
      <span className="title">ICO SHUFFLE</span>
    </nav>
  );
};

// ============ Hero Component ============
const Hero = ({ onStart }) => {
  return (
    <div className="hero">
      <h1 className="hero-title">ICO SHUFFLE</h1>
      <p className="hero-subtitle">For Fast and Fair Decision</p>
      <button className="btn-hero" onClick={onStart}>
        🎲 Mulai Shuffle!
      </button>
    </div>
  );
};

// ======= DATA ABSEN PER KELAS =======
const daftarKelas = {
  '12.1': [
    "Adel", "Adib", "Faidzul", "Albania", "Arini", "Dina", "Fawaaz", "Galang", "Hala", "Ikhtiara",
    "Lovely", "Chikal", "Nadhif", "Daffa", "Marsa", "Medina", "Nasyida", "Naura", "Nayla", "Raihana",
    "Rania", "Syifa", "Zafira"
  ],
  '12.2': [
    "Alifah", "Nabilah", "Amirah", "Fairuz", "Fakhri", "Farras", "Hanna", "Hasna", "Ichsan", "Izza",
    "Kirana", "Luna", "Rahdika", "Rizki", "Nailah", "Noura", "Qobus", "Rayyan", "Salwa", "Shafira",
    "Syifa", "Zahra"
  ],
  '12.3': [
    "Aisyah N.", "Aisyah Z.", "Arum", "Azka", "Bunga", "Sela", "Chelin", "Faiha", "Faiza", "Fauzan",
    "Ilham", "Jihan", "Saka", "Algi", "Afiq", "Zabran", "Ratu", "Safa", "Saskia", "Shyfa",
    "Nabilah", "Tata", "Zia"
  ],
  '12.4': [
    "Affan", "Aliyyah", "Nadyah", "Arief", "Bulan", "Dendy", "Dhia Salma", "Falih", "Hafsah", "Sami",
    "Laisyah", "Marsya", "Abyan", "Izzun", "Faqih", "Farrel", "Rafif", "Nabilla", "Nailah", "Naofal",
    "Agha", "Sigit", "Raisya", "Naya"
  ],
  '12.5': [
    "Afifah", "Ahmed", "Nabil F.", "Acha", "Ality", "Anisa", "Aulia", "Chalesa", "Chaterine", "Fauzan",
    "Ammar", "Raul", "Nabil M.", "Syaid", "Marchel", "Hafidz", "Bevis", "Isio", "Parrel", "Sheva",
    "Naira", "Najihah", "Jinan", "Raviv"
  ]
};

// ============ CardGrup Component ============
const CardGrup = ({ no, anggota, anggotaNames, shuffling = false, delay = 0 }) => {
  const [copied, setCopied] = useState(false);

  const fallbackCopyTextToClipboard = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
    } catch (err) {
      // ignore
    }
    document.body.removeChild(textArea);
  };

  const handleCopy = async () => {
    let text = `Grup ${no} : \n`;
    text += (anggotaNames && anggotaNames.length > 0 ? anggotaNames : anggota || []).join(', ');
    text += '\n';
    if (!text) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        fallbackCopyTextToClipboard(text);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      fallbackCopyTextToClipboard(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const cardClass = `card-custom ${shuffling ? 'shuffle' : ''}`;
  const style = shuffling ? { animationDelay: `${delay}ms` } : undefined;

  return (
    <article className={cardClass} style={style}>
      <header className="card-header">
        <div>
          <h5 className="mb-0">Grup {no}</h5>
          <small style={{ opacity: 0.9 }}>Anggota: {anggota?.length ?? 0}</small>
        </div>
        <button
          type="button"
          className="btn-copy"
          onClick={handleCopy}
          disabled={!anggota || anggota.length === 0}
        >
          {copied ? '✓ Tersalin' : '📋 Salin'}
        </button>
      </header>
      <ul className="member-list">
        {(anggota && anggota.length > 0) ? (
          anggota.map((member, idx) => (
            <li key={member} className="member-item">
              <span className="member-bubble">{anggotaNames && anggotaNames[idx] ? anggotaNames[idx] : member}</span>
              <span className="member-text">
                Absen #{member}
                {anggotaNames && anggotaNames[idx] ? ` - ${anggotaNames[idx]}` : ''}
              </span>
            </li>
          ))
        ) : (
          <li className="text-muted">(Kosong)</li>
        )}
      </ul>
    </article>
  );
};

// ============ GrupContainer Component ============
const GrupContainer = ({
  jmlhsiswa,
  jmlhgrup,
  shuffleKey,
  onChange,
  exclude = [],
  useKelas = false,
  kelas = '',
  daftarKelas = {}
}) => {
  const [grup, setGrup] = useState([]);
  const [isShuffling, setIsShuffling] = useState(false);

  const validExclude = Array.isArray(exclude) ? exclude.filter(n => Number.isInteger(n) && n >= 1 && n <= jmlhsiswa) : [];
  const excludeSet = new Set(validExclude);
  const remainingCount = jmlhsiswa ? Array.from({ length: jmlhsiswa }, (_, i) => i + 1).filter(n => !excludeSet.has(n)).length : 0;

  const excludeStr = validExclude.join(',');

  useEffect(() => {
    if (!jmlhgrup || !jmlhsiswa) {
      setGrup([]);
      if (onChange) onChange([]);
      return;
    }

    let siswa = Array.from({ length: jmlhsiswa }, (_, i) => i + 1).filter(n => !excludeSet.has(n));

    if (siswa.length === 0) {
      setGrup([]);
      if (onChange) onChange([]);
      return;
    }

    for (let i = siswa.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [siswa[i], siswa[j]] = [siswa[j], siswa[i]];
    }

    let temp = Array.from({ length: jmlhgrup }, () => []);
    let index = 0;
    for (let num of siswa) {
      temp[index].push(num);
      index = (index + 1) % jmlhgrup;
    }

    setGrup(temp);
    if (onChange) onChange(temp);
  }, [jmlhgrup, jmlhsiswa, shuffleKey, excludeStr]);

  useEffect(() => {
    if (typeof shuffleKey === 'undefined' || !jmlhgrup || !jmlhsiswa) return;
    setIsShuffling(true);
    const t = setTimeout(() => setIsShuffling(false), 720);
    return () => clearTimeout(t);
  }, [shuffleKey, jmlhgrup, jmlhsiswa]);

  // Jika sistem kelas aktif, siapkan nama absen sesuai grup
  let grupNames = [];
  if (useKelas && kelas && daftarKelas[kelas]) {
    const absenList = daftarKelas[kelas];
    grupNames = grup.map(group =>
      group.map(n => absenList[n - 1] ? absenList[n - 1] : n)
    );
  }

  if (!jmlhgrup || !jmlhsiswa) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🎲</div>
        <p>Masukkan jumlah siswa dan grup lalu tekan Shuffle</p>
      </div>
    );
  }

  if (jmlhgrup > remainingCount) {
    return (
      <div className="alert-error">
        <strong>⚠️ Error:</strong> Jumlah grup tidak boleh lebih besar dari jumlah siswa tersisa setelah exclude.
      </div>
    );
  }

  if (remainingCount === 0) {
    return (
      <div className="empty-state">
        <p>Semua siswa dikecualikan</p>
      </div>
    );
  }

  return (
    <div className="grup-grid">
      {grup.map((group, i) => (
        <CardGrup
          key={i}
          no={i + 1}
          anggota={group}
          anggotaNames={useKelas && grupNames[i] ? grupNames[i] : undefined}
          shuffling={isShuffling}
          delay={i * 80}
        />
      ))}
    </div>
  );
};

// ============ InputForm Component ============
const InputForm = ({
  siswa,
  setSiswa,
  grup,
  setGrup,
  excludeInput,
  setExcludeInput,
  excludeArr,
  error,
  hasilGrup,
  onSubmit,
  onCopyAll,
  useKelas,
  setUseKelas,
  kelas,
  setKelas,
  daftarKelas
}) => {
  return (
    <div className="input-form">
      <h2 className="form-title">Input Data</h2>
      <div className="form-group" style={{ marginBottom: 16 }}>
        <label>
          <input
            type="checkbox"
            checked={useKelas}
            onChange={e => setUseKelas(e.target.checked)}
            style={{ marginRight: 8 }}
          />
          Aktifkan Sistem Kelas
        </label>
      </div>
      {useKelas && (
        <div className="form-group">
          <label htmlFor="kelas">Pilih Kelas</label>
          <select
            id="kelas"
            className="form-input"
            value={kelas}
            onChange={e => setKelas(e.target.value)}
          >
            <option value="">-- Pilih Kelas --</option>
            {Object.keys(daftarKelas).map(k => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
        </div>
      )}
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="siswa">Jumlah Siswa</label>
          <input
            className="form-input"
            id="siswa"
            type="number"
            placeholder="Masukkan jumlah"
            min="0"
            value={siswa}
            onChange={(e) => {
              const val = e.target.value;
              if (val === '') {
                setSiswa('');
                return;
              }
              const n = Math.max(0, parseInt(val, 10) || 0);
              setSiswa(n);
            }}
            disabled={useKelas && kelas}
          />
        </div>
        <div className="form-group">
          <label htmlFor="group">Jumlah Grup</label>
          <input
            className="form-input"
            id="group"
            type="number"
            placeholder="Masukkan jumlah"
            min="0"
            value={grup}
            onChange={(e) => {
              const val = e.target.value;
              if (val === '') {
                setGrup('');
                return;
              }
              const n = Math.max(0, parseInt(val, 10) || 0);
              setGrup(n);
            }}
          />
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="exclude">Exclude Nomor Absen (opsional)</label>
        <input
          id="exclude"
          type="text"
          className="form-input"
          placeholder="Contoh: 2,5,8 atau 1-3"
          value={excludeInput}
          onChange={(e) => setExcludeInput(e.target.value)}
        />
        {excludeArr && excludeArr.length > 0 && (
          <small className="text-muted">Dikecualikan: {excludeArr.join(', ')}</small>
        )}
      </div>
      <button
        className="btn-primary"
        onClick={onSubmit}
        disabled={
          useKelas
            ? !(kelas && grup > 0)
            : !(Number(siswa) > 0 && Number(grup) > 0)
        }
      >
        🎲 Shuffle Sekarang
      </button>
      {(hasilGrup && hasilGrup.length > 0) && (
        <button className="btn-secondary" onClick={onCopyAll}>
          📋 Copy Semua Grup
        </button>
      )}
      {error && (
        <div className="alert-error">
          {error}
        </div>
      )}
    </div>
  );
};

// ============ Content Component ============
const Content = () => {
  const [grup, setGrup] = useState('');
  const [siswa, setSiswa] = useState('');
  const [fixSiswa, setFixSiswa] = useState();
  const [fixGrup, setFixGrup] = useState();
  const [error, setError] = useState(null);
  const [excludeInput, setExcludeInput] = useState('');
  const [excludeArr, setExcludeArr] = useState([]);
  const [shuffleKey, setShuffleKey] = useState(0);
  const [hasilGrup, setHasilGrup] = useState([]);
  const [useKelas, setUseKelas] = useState(false);
  const [kelas, setKelas] = useState('');

  const parseExclude = (str, max) => {
    if (!str) return [];
    const parts = str.split(/[,;\s]+/).map(p => p.trim()).filter(Boolean);
    const nums = new Set();
    for (const part of parts) {
      if (part.includes('-')) {
        const [a, b] = part.split('-').map(x => parseInt(x, 10)).filter(n => !isNaN(n));
        if (!isNaN(a) && !isNaN(b)) {
          const start = Math.min(a, b), end = Math.max(a, b);
          for (let k = start; k <= end; k++) if (k >= 1 && (!max || k <= max)) nums.add(k);
        }
      } else {
        const n = parseInt(part, 10);
        if (!isNaN(n) && n >= 1 && (!max || n <= max)) nums.add(n);
      }
    }
    return Array.from(nums).sort((a, b) => a - b);
  };

  const handleSubmit = () => {
    let s = Number(siswa);
    let g = Number(grup);

    if (useKelas && kelas && daftarKelas[kelas]) {
      s = daftarKelas[kelas].length;
    }

    if (!s || !g) {
      setError('Jumlah siswa dan grup harus lebih dari 0');
      return;
    }

    const ex = parseExclude(excludeInput, s);
    const remaining = s - ex.length;
    if (g > remaining) {
      setError('Jumlah grup tidak boleh lebih besar dari jumlah siswa tersisa setelah exclude.');
      return;
    }

    setError(null);
    setFixSiswa(s);
    setFixGrup(g);
    setExcludeArr(ex);
    setShuffleKey(k => k + 1);
  };

  const handleCopyAll = async () => {
    if (!hasilGrup || hasilGrup.length === 0) return;
    let text;
    if (useKelas && kelas && daftarKelas[kelas]) {
      text = hasilGrup.map((g, i) => {
        const absenList = daftarKelas[kelas];
        const names = g.map(n => absenList[n - 1] ? absenList[n - 1] : n);
        return `Grup ${i + 1}: ${names.join(', ')}`;
      }).join('\n');
    } else {
      text = hasilGrup.map((g, i) => `Grup ${i + 1}: ${g.join(', ')}`).join('\n');
    }
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
    } catch {
      // ignore
    }
  };

  return (
    <div className="container">
      <div className="content-wrapper">
        <div className="input-section">
          <InputForm
            siswa={siswa}
            setSiswa={setSiswa}
            grup={grup}
            setGrup={setGrup}
            excludeInput={excludeInput}
            setExcludeInput={setExcludeInput}
            excludeArr={excludeArr}
            error={error}
            hasilGrup={hasilGrup}
            onSubmit={handleSubmit}
            onCopyAll={handleCopyAll}
            useKelas={useKelas}
            setUseKelas={setUseKelas}
            kelas={kelas}
            setKelas={setKelas}
            daftarKelas={daftarKelas}
          />
        </div>
        <div className="results-section">
          <GrupContainer
            jmlhgrup={fixGrup}
            jmlhsiswa={fixSiswa}
            shuffleKey={shuffleKey}
            onChange={setHasilGrup}
            exclude={excludeArr}
            useKelas={useKelas}
            kelas={kelas}
            daftarKelas={daftarKelas}
          />
        </div>
      </div>
    </div>
  );
};

// ============ Main App Component ============
export default function App() {
  const [showContent, setShowContent] = useState(false);

  return (
    <>
      <style>{styles}</style>
      <ClickSpark sparkColor='#02367B' sparkSize={10} sparkRadius={15} sparkCount={8} duration={400}>
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
          <Navbar />
          <Analytics /> 
          
          {!showContent ? (
            <Hero onStart={() => setShowContent(true)} />
          ) : (
            <Content />
          )}
        </div>
      </ClickSpark>
    </>
  );
}