"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";

const inputClass =
  "rounded-lg border border-black/10 px-4 py-2 dark:border-white/15";

export function QrCodeGenerator({ defaultUrl }: { defaultUrl: string }) {
  const [url, setUrl] = useState(defaultUrl);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !url.trim()) {
      setError(url.trim() ? null : "Bir URL girin");
      return;
    }
    QRCode.toCanvas(canvasRef.current, url.trim(), {
      width: 320,
      margin: 2,
      errorCorrectionLevel: "H",
    })
      .then(() => setError(null))
      .catch(() => setError("Geçersiz URL, QR kod üretilemedi"));
  }, [url]);

  async function handleDownload() {
    if (!url.trim() || error) return;
    const dataUrl = await QRCode.toDataURL(url.trim(), {
      width: 1024,
      margin: 2,
      errorCorrectionLevel: "H",
    });
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "esnafi-lokanta-menu-qr.png";
    link.click();
  }

  return (
    <div className="flex flex-col gap-6">
      <label className="flex flex-col gap-1 max-w-md">
        <span className="text-sm font-medium">Menü URL&apos;i</span>
        <input
          type="url"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          className={inputClass}
        />
        <span className="text-xs text-black/50 dark:text-white/50">
          Yayına alınan production adresi burada varsayılan olarak geliyor;
          özel alan adını (domain) bağladıktan sonra burayı güncelleyip yeni
          kodu indirebilirsin. Tüm masalarda aynı kod kullanılır.
        </span>
      </label>

      <div className="flex flex-col items-start gap-4 rounded-2xl border border-black/10 bg-white p-6 dark:border-white/15 dark:bg-black">
        <canvas ref={canvasRef} className="rounded-lg" />
        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        <button
          type="button"
          onClick={handleDownload}
          disabled={!!error || !url.trim()}
          className="rounded-full bg-black px-6 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-black"
        >
          PNG olarak indir (baskı için)
        </button>
      </div>
    </div>
  );
}
