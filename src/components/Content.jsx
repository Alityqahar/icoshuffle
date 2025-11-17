import { useState } from "react"
import GrupContainer from "./GrupContainer";

export default function Content(){
	const [grup,setGrup] = useState('');
	const [siswa,setSiswa] = useState('');
	const [fixSiswa,setFixSiswa] = useState();
	const [fixGrup,setFixGrup] = useState();
	const [error,setError] = useState(null);

	// exclude input & parsed array
	const [excludeInput, setExcludeInput] = useState('');
	const [excludeArr, setExcludeArr] = useState([]);

	// add shuffle key
	const [shuffleKey, setShuffleKey] = useState(0);

	// store groups from child
	const [hasilGrup, setHasilGrup] = useState([]);

	// parse exclude string like "1,3,5" or "2-4" into unique valid integers
	const parseExclude = (str, max) => {
		if (!str) return [];
		const parts = str.split(/[,;\s]+/).map(p => p.trim()).filter(Boolean);
		const nums = new Set();
		for (const part of parts) {
			if (part.includes('-')) {
				const [a,b] = part.split('-').map(x => parseInt(x,10)).filter(n => !isNaN(n));
				if (!isNaN(a) && !isNaN(b)) {
					const start = Math.min(a,b), end = Math.max(a,b);
					for (let k = start; k <= end; k++) if (k >= 1 && (!max || k <= max)) nums.add(k);
				}
			} else {
				const n = parseInt(part,10);
				if (!isNaN(n) && n >= 1 && (!max || n <= max)) nums.add(n);
			}
		}
		return Array.from(nums).sort((a,b)=>a-b);
	};

	function handleSubmit(){
		const s = Number(siswa);
		const g = Number(grup);

		if (!s || !g) {
			setError('Jumlah siswa dan grup harus lebih dari 0');
			return;
		}

		// parse exclude against s
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

		// trigger reshuffle even if s/g sama with previous
		setShuffleKey(k => k + 1);
	}

	// copy all grouped text
	const handleCopyAll = async () => {
		if (!hasilGrup || hasilGrup.length === 0) return;
		const text = hasilGrup.map((g, i) => `Grup ${i+1}: ${g.join(', ')}`).join('\n');
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

	return(
		<div className="container">
			<div className="row mt-4">
				<img className="logo-bg" src="/src/img/logomanic.png" alt="" aria-hidden="true" />
				<div className="col-8 main-content">
					{/* pass onChange to receive hasil grup and pass excludeArr */}
					<GrupContainer
						jmlhgrup={fixGrup}
						jmlhsiswa={fixSiswa}
						shuffleKey={shuffleKey}
						onChange={setHasilGrup}
						exclude={excludeArr}
					/>
				</div>
				<div className="col-4 ">
					<div className="input-form shadow rounded p-3">
						<h2 className="text-center">INPUT</h2>
						<div className="row g-2">
							<div className="col-6">
								<label htmlFor="siswa">Jumlah Siswa:</label>
								<input 
									className="form-control"
									id="siswa" 
									type="number" 
									placeholder="Jumlah Siswa"
									min="0"
									value={siswa}
									onChange={(e) => {
										const val = e.target.value;
										if (val === '') { setSiswa(''); setFixSiswa(undefined); return; }
										const n = Math.max(0, parseInt(val, 10) || 0);
										setSiswa(n);
									}}
								/>
							</div>
							<div className="col-6">
								<label htmlFor="group">Jumlah Grup:</label>
								<input 
									className="form-control" 
									id="group" 
									type="number" 
									placeholder="Jumlah Grup" 
									min="0"
									value={grup}
									onChange={(e) => {
										const val = e.target.value;
										if (val === '') { setGrup(''); setFixGrup(undefined); return; }
										const n = Math.max(0, parseInt(val, 10) || 0);
										setGrup(n);
									}}
									aria-label="default input example" 
								/>
							</div>

							{/* NEW: Exclude input */}
							<div className="col-12">
								<label htmlFor="exclude">Exclude (mis. 2,5,8 atau 1-3):</label>
								<input
									id="exclude"
									type="text"
									className="form-control"
									placeholder="Masukkan nomor yang dikecualikan"
									value={excludeInput}
									onChange={(e) => setExcludeInput(e.target.value)}
								/>
								{excludeArr && excludeArr.length > 0 && (
									<small className="text-muted">Excluded: {excludeArr.join(', ')}</small>
								)}
							</div>

							<div className="col-12 mt-3">
								<button 
									className="btn btn-primary w-100" 
									onClick={handleSubmit}
									disabled={!(Number(siswa) > 0 && Number(grup) > 0)}
								>
									<strong>Shuffle</strong>
								</button>

								{(hasilGrup && hasilGrup.length > 0) && (
									<button className="btn btn-secondary w-100 mt-1" onClick={handleCopyAll}>
										Copy All
									</button>
								)}
							</div>
							{error && (
								<div className="col-12 mt-2">
									<div className="alert alert-danger p-2 m-0">{error}</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}