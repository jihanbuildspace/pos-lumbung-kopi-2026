/**
 * Lumbung POS - Thermal Receipt Printer Service (58mm)
 * Isolated iframe printing ensuring 100% clean thermal receipt output
 * and pixel-perfect Save as PDF without interference from app layout.
 */

export function printThermalReceipt(receiptElementId: string = 'printable-receipt', title: string = 'Struk_Transaksi') {
  const receiptEl = document.getElementById(receiptElementId);
  if (!receiptEl) {
    console.warn(`[receiptPrinter] Element #${receiptElementId} not found, falling back to window.print()`);
    window.print();
    return;
  }

  // Remove existing print iframe if any left over
  const oldIframe = document.getElementById('lumbung-print-iframe');
  if (oldIframe) {
    oldIframe.remove();
  }

  const iframe = document.createElement('iframe');
  iframe.id = 'lumbung-print-iframe';
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = 'none';
  iframe.style.opacity = '0';
  iframe.style.pointerEvents = 'none';
  iframe.style.zIndex = '-9999';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) {
    window.print();
    return;
  }

  const cleanTitle = title.replace(/[^a-zA-Z0-9_\-]/g, '_');

  doc.open();
  doc.write(`<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <title>${cleanTitle}</title>
  <style>
    @page {
      size: 58mm auto;
      margin: 0mm;
    }
    @media print {
      html, body {
        width: 58mm !important;
        margin: 0 !important;
        padding: 0 !important;
        background: #ffffff !important;
      }
      * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        color-adjust: exact !important;
      }
      .no-print {
        display: none !important;
      }
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: 'JetBrains Mono', 'Courier New', Courier, monospace;
      font-size: 11px;
      line-height: 1.35;
      color: #000000;
      background: #ffffff;
      width: 58mm;
      max-width: 58mm;
      padding: 3mm 2mm 6mm 2mm;
      margin: 0 auto;
    }
    #printable-receipt {
      width: 100% !important;
      max-width: 100% !important;
      box-shadow: none !important;
      border: none !important;
      border-radius: 0 !important;
      padding: 0 !important;
      margin: 0 !important;
      background: #ffffff !important;
    }
    .no-print {
      display: none !important;
    }
  </style>
</head>
<body>
  ${receiptEl.outerHTML}
</body>
</html>`);
  doc.close();

  // Allow browser time to render DOM and calculate styles
  setTimeout(() => {
    try {
      const win = iframe.contentWindow;
      if (win) {
        win.focus();
        win.print();
      } else {
        window.print();
      }
    } catch (err) {
      console.error('[receiptPrinter] Error triggering iframe print:', err);
      window.print();
    } finally {
      setTimeout(() => {
        iframe.remove();
      }, 1500);
    }
  }, 250);
}
