import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useState } from "react";

function BarcodeScannerWithButton() {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState(null);

  useEffect(() => {
    if (!open) return;

    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: { width: 250, height: 150 },
      },
      false
    );

    scanner.render(
      (decodedText) => {
        console.log("BARCODE:", decodedText);
        setCode(decodedText);
        scanner.clear(); // سد الكاميرا ملي يقرا
        setOpen(false);
      },
      () => {}
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, [open]);

  return (
    <div className="p-4">
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Scan Barcode
        </button>
      )}

      {open && (
        <div id="reader" className="mt-4"></div>
      )}

      {code && (
        <p className="mt-4 text-center font-bold">
          Code: {code}
        </p>
      )}
    </div>
  );
}

export default BarcodeScannerWithButton;
