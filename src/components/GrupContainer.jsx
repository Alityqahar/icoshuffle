import { useEffect, useState } from 'react'
import CardGrup from './CardGrup'
import Error from './Error'

export default function GrupContainer({ jmlhsiswa, jmlhgrup, shuffleKey, onChange, exclude = [] }) {
    const [grup, setGrup] = useState([]);
    const [isShuffling, setIsShuffling] = useState(false);

    // compute valid exclude set and remainingCount for rendering
    const validExclude = Array.isArray(exclude) ? exclude.filter(n => Number.isInteger(n) && n >= 1 && n <= jmlhsiswa) : [];
    const excludeSet = new Set(validExclude);
    const remainingCount = jmlhsiswa ? Array.from({ length: jmlhsiswa }, (_, i) => i + 1).filter(n => !excludeSet.has(n)).length : 0;

    useEffect(() => {
        // jika belum di-set, kosongkan dan jangan lakukan apa-apa
        if (!jmlhgrup || !jmlhsiswa) {
            setGrup([]);
            if (onChange) onChange([]);
            return;
        }

        // buat array siswa [1..jmlhsiswa] lalu filter exclude
        let siswa = Array.from({ length: jmlhsiswa }, (_, i) => i + 1).filter(n => !excludeSet.has(n));

        // jika tidak ada siswa tersisa
        if (siswa.length === 0) {
            setGrup([]);
            if (onChange) onChange([]);
            return;
        }

        // Shuffle dengan Fisher-Yates
        for (let i = siswa.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [siswa[i], siswa[j]] = [siswa[j], siswa[i]];
        }

        // Bagi ke grup (gunakan panjang jmlhgrup)
        let temp = Array.from({ length: jmlhgrup }, () => []);
        let index = 0;
        for (let num of siswa) {
            temp[index].push(num);
            index = (index + 1) % jmlhgrup;
        }

        setGrup(temp);
        if (onChange) onChange(temp); // inform parent about new groups
    }, [jmlhgrup, jmlhsiswa, shuffleKey, onChange, /* include excludeSet via exclude prop */ exclude]);

    useEffect(() => {
        if (typeof shuffleKey === 'undefined' || !jmlhgrup || !jmlhsiswa) return;
        setIsShuffling(true);
        const t = setTimeout(() => setIsShuffling(false), 720); // durasi sedikit di atas CSS animation
        return () => clearTimeout(t);
    }, [shuffleKey, jmlhgrup, jmlhsiswa]);

    if (!jmlhgrup || !jmlhsiswa) {
        return <p className="text-muted">Masukkan jumlah siswa dan grup lalu tekan Shuffle.</p>;
    }

    // jika jumlah grup lebih besar dari sisa siswa setelah exclude -> Error
    if (jmlhgrup > remainingCount) {
        return <Error message="Jumlah grup tidak boleh lebih besar dari jumlah siswa tersisa setelah exclude." />;
    }

    // jika tidak ada siswa tersisa setelah exclude
    if (remainingCount === 0) {
        return <p className="text-muted">Semua siswa dikecualikan.</p>;
    }

    return (
        <>
            {jmlhgrup > jmlhsiswa ? (
                <Error />
            ) : (
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-2 g-4">
                    {grup.map((group, i) => (
                        <div className="col" key={i}>
                            <CardGrup no={i + 1} anggota={group} shuffling={isShuffling} delay={i * 80} />
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}
