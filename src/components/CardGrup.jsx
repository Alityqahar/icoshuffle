import { useState } from 'react';

export default function CardGrup({ no, anggota, shuffling = false, delay = 0 }) {
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
		text += (anggota || []).join(', ');
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

	// add shuffle class when shuffling; set animationDelay for stagger
	const cardClass = `card card-custom h-100 ${shuffling ? 'shuffle' : ''}`;
	const style = shuffling ? { animationDelay: `${delay}ms` } : undefined;

	return (
		<article className={cardClass} style={style} aria-labelledby={`grup-${no}`}>
			<header className="card-header d-flex justify-content-between align-items-center">
				<div>
					<h5 id={`grup-${no}`} className="mb-0">Grup {no}</h5>
					<small className="text-light">Anggota: {anggota?.length ?? 0}</small>
				</div>

				<div className="btn-group" role="group" aria-label={`Kontrol grup ${no}`}>
					<button
						type="button"
						className="btn btn-sm btn-outline-secondary"
						onClick={handleCopy}
						disabled={!anggota || anggota.length === 0}
						aria-label={`Salin anggota grup ${no}`}
					>
						{copied ? 'Tersalin' : 'Salin'}
					</button>
				</div>
			</header>

			<ul className="list-unstyled member-list mb-0 p-3" role="list" aria-live="polite">
				{(anggota && anggota.length > 0) ? (
					anggota.map((member) => (
						<li key={member} className="d-flex align-items-center member-item">
							<span className="member-bubble">{member}</span>
							<span className="member-text">Absen #{member}</span>
						</li>
					))
				) : (
					<li className="text-muted">(Kosong)</li>
				)}
			</ul>
		</article>
	);
}