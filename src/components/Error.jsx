export default function Error({ message, onRetry }) {
	return (
		<div className="alert alert-danger d-flex justify-content-between align-items-center" role="alert">
			<div>
				<strong>Error:</strong> {message ?? 'Jumlah grup tidak boleh lebih besar dari jumlah siswa.'}
			</div>
			{onRetry ? (
				<button type="button" className="btn btn-sm btn-light" onClick={onRetry}>
					Reset
				</button>
			) : null}
		</div>
	);
}