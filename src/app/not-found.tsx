import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#101827] flex items-center justify-center p-4 text-center">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-white">Sayfa Bulunamadı</h2>
        <p className="text-sm text-[#94A3B8]">Aradığınız sayfa mevcut değil.</p>
        <Link
          href="/"
          className="inline-block px-4 py-2 rounded-xl bg-white text-[#101827] font-semibold text-xs shadow-md"
        >
          Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  );
}
