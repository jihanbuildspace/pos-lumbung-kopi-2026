import ExcelJS from 'exceljs';

export interface SummaryData {
  omzet: number;
  countLunas: number;
  avgTrx: number;
  countVoid: number;
  labaKotor?: number;
  margin?: string;
  totalHPP?: number;
  isOwner: boolean;
  branchName: string;
  paymentStats?: {
    tunaiTotal: number;
    qrisTotal: number;
    tunaiPct: number;
    qrisPct: number;
  };
  topProducts?: Array<{
    nama: string;
    qty: number;
    omzet: number;
  }>;
}

// Brand Colors (Lumbung Kopi & Roti Theme)
const COLORS = {
  brandPrimary: 'FF3B2219',     // Deep Coffee Roast
  brandAccent: 'FF78350F',      // Warm Coffee Amber
  brandGold: 'FFFDE68A',        // Warm Golden Amber text
  headerDark: 'FF1E293B',       // Slate 800
  headerMedium: 'FF334155',     // Slate 700
  headerLight: 'FF475569',      // Slate 600
  zebraEven: 'FFFFFFFF',        // White
  zebraOdd: 'FFF8FAFC',         // Slate 50
  borderLight: 'FFE2E8F0',      // Slate 200
  borderDark: 'FF94A3B8',       // Slate 400
  totalBg: 'FFFEF3C7',          // Amber 100
  totalText: 'FF78350F',        // Amber 900
  successBg: 'FFDCFCE7',        // Emerald 100
  successText: 'FF166534',      // Emerald 800
  dangerBg: 'FFFEE2E2',         // Red 100
  dangerText: 'FF991B1B',       // Red 800
  warningBg: 'FFFEF9C3',        // Yellow 100
  warningText: 'FF854D0E',      // Yellow 800
  infoBg: 'FFDBEAFE',           // Blue 100
  infoText: 'FF1E40AF',         // Blue 800
};

const BORDER_CELL: Partial<ExcelJS.Borders> = {
  top: { style: 'thin', color: { argb: COLORS.borderLight } },
  left: { style: 'thin', color: { argb: COLORS.borderLight } },
  bottom: { style: 'thin', color: { argb: COLORS.borderLight } },
  right: { style: 'thin', color: { argb: COLORS.borderLight } },
};

const BORDER_TOTAL: Partial<ExcelJS.Borders> = {
  top: { style: 'thin', color: { argb: COLORS.borderDark } },
  left: { style: 'thin', color: { argb: COLORS.borderLight } },
  bottom: { style: 'double', color: { argb: 'FF0F172A' } },
  right: { style: 'thin', color: { argb: COLORS.borderLight } },
};

/**
 * Format currency number or fallback
 */
function toNum(val: any): number {
  const n = Number(val);
  return isNaN(n) ? 0 : n;
}

export async function exportReportToExcel(
  transactions: any[],
  shifts: any[],
  summary: SummaryData
): Promise<void> {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'POS Lumbung Kopi dan Roti';
  wb.lastModifiedBy = 'POS Lumbung Kopi dan Roti';
  wb.created = new Date();
  wb.modified = new Date();

  const exportDateStr = new Date().toLocaleString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  // =========================================================================
  // 1. SHEET: RINGKASAN EKSEKUTIF
  // =========================================================================
  const wsSummary = wb.addWorksheet('Ringkasan Eksekutif', {
    views: [{ showGridLines: true }],
  });

  // Banner Utama
  wsSummary.mergeCells('A1:E1');
  const bannerTitle = wsSummary.getCell('A1');
  bannerTitle.value = 'LUMBUNG KOPI DAN ROTI - LAPORAN EKSEKUTIF PENJUALAN';
  bannerTitle.font = { name: 'Segoe UI', size: 14, bold: true, color: { argb: 'FFFFFFFF' } };
  bannerTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.brandPrimary } };
  bannerTitle.alignment = { vertical: 'middle', horizontal: 'center' };
  wsSummary.getRow(1).height = 36;

  // Banner Sub-judul
  wsSummary.mergeCells('A2:E2');
  const bannerSub = wsSummary.getCell('A2');
  bannerSub.value = `Cabang: ${summary.branchName}   |   Waktu Ekspor: ${exportDateStr} WIB   |   Dokumen Resmi Sistem POS`;
  bannerSub.font = { name: 'Segoe UI', size: 10, italic: true, color: { argb: COLORS.brandGold } };
  bannerSub.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.brandAccent } };
  bannerSub.alignment = { vertical: 'middle', horizontal: 'center' };
  wsSummary.getRow(2).height = 24;

  // Space row
  wsSummary.getRow(3).height = 14;

  // --- BAGIAN A: METRIK UTAMA ---
  let currentRow = 4;
  wsSummary.mergeCells(`A${currentRow}:E${currentRow}`);
  const secA = wsSummary.getCell(`A${currentRow}`);
  secA.value = 'A. INDIKATOR KINERJA UTAMA (KEY PERFORMANCE INDICATORS)';
  secA.font = { name: 'Segoe UI', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
  secA.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.headerDark } };
  secA.alignment = { vertical: 'middle', indent: 1 };
  wsSummary.getRow(currentRow).height = 26;

  currentRow++;
  const kpiHeaders = ['No.', 'Indikator Metrik', 'Nilai Capaian', 'Satuan', 'Keterangan Operasional'];
  const kpiHeaderRow = wsSummary.getRow(currentRow);
  kpiHeaderRow.height = 24;
  kpiHeaders.forEach((h, idx) => {
    const c = kpiHeaderRow.getCell(idx + 1);
    c.value = h;
    c.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
    c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.headerLight } };
    c.alignment = { vertical: 'middle', horizontal: idx === 1 ? 'left' : 'center' };
    c.border = BORDER_CELL;
  });

  const kpis: Array<[number, string, number, string, string, string]> = [
    [1, 'Total Omzet Penjualan (Lunas)', summary.omzet, '"Rp"#,##0', 'IDR', 'Akumulasi seluruh transaksi berhasil'],
    [2, 'Volume Transaksi Lunas', summary.countLunas, '#,##0', 'Struk', 'Jumlah nota transaksi berhasil diterbitkan'],
    [3, 'Rata-rata Nilai Transaksi (Basket Size)', summary.avgTrx, '"Rp"#,##0', 'IDR', 'Rata-rata nilai belanja per pelanggan'],
    [4, 'Total Transaksi Dibatalkan (Void)', summary.countVoid, '#,##0', 'Struk', 'Nota dibatalkan dengan otorisasi supervisor'],
  ];

  if (summary.isOwner) {
    if (summary.totalHPP !== undefined) {
      kpis.push([5, 'Total Beban Pokok Penjualan (HPP)', summary.totalHPP, '"Rp"#,##0', 'IDR', 'Estimasi total biaya pokok barang terjual']);
    }
    if (summary.labaKotor !== undefined) {
      kpis.push([6, 'Laba Kotor Usaha (Gross Profit)', summary.labaKotor, '"Rp"#,##0', 'IDR', 'Omzet dikurangi HPP (Hak Owner)']);
    }
    if (summary.margin !== undefined) {
      const marginNum = parseFloat(summary.margin) / 100;
      kpis.push([7, 'Margin Laba Kotor Usaha', isNaN(marginNum) ? 0 : marginNum, '0.0%', 'Persen', 'Persentase margin laba kotor terhadap omzet']);
    }
  }

  kpis.forEach((k, i) => {
    currentRow++;
    const r = wsSummary.getRow(currentRow);
    r.height = 22;
    const isOdd = i % 2 !== 0;
    const bg = isOdd ? COLORS.zebraOdd : COLORS.zebraEven;

    r.getCell(1).value = k[0];
    r.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };

    r.getCell(2).value = k[1];
    r.getCell(2).alignment = { horizontal: 'left', vertical: 'middle' };
    r.getCell(2).font = { name: 'Segoe UI', size: 10, bold: k[0] === 1 || k[0] === 6 };

    r.getCell(3).value = k[2];
    r.getCell(3).numFmt = k[3];
    r.getCell(3).alignment = { horizontal: 'right', vertical: 'middle' };
    r.getCell(3).font = {
      name: 'Segoe UI',
      size: 10,
      bold: true,
      color: { argb: k[0] === 6 ? COLORS.successText : (k[0] === 4 && k[2] > 0 ? COLORS.dangerText : 'FF0F172A') },
    };

    r.getCell(4).value = k[4];
    r.getCell(4).alignment = { horizontal: 'center', vertical: 'middle' };

    r.getCell(5).value = k[5];
    r.getCell(5).alignment = { horizontal: 'left', vertical: 'middle' };

    for (let col = 1; col <= 5; col++) {
      const cell = r.getCell(col);
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
      cell.border = BORDER_CELL;
    }
  });

  // --- BAGIAN B: METODE PEMBAYARAN ---
  currentRow += 2;
  wsSummary.mergeCells(`A${currentRow}:E${currentRow}`);
  const secB = wsSummary.getCell(`A${currentRow}`);
  secB.value = 'B. KOMPOSISI METODE PEMBAYARAN';
  secB.font = { name: 'Segoe UI', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
  secB.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.headerDark } };
  secB.alignment = { vertical: 'middle', indent: 1 };
  wsSummary.getRow(currentRow).height = 26;

  currentRow++;
  const payHeaders = ['No.', 'Metode Pembayaran', 'Total Nominal (Rp)', 'Porsi Omzet (%)', 'Keterangan'];
  const payHeaderRow = wsSummary.getRow(currentRow);
  payHeaderRow.height = 24;
  payHeaders.forEach((h, idx) => {
    const c = payHeaderRow.getCell(idx + 1);
    c.value = h;
    c.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
    c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.headerLight } };
    c.alignment = { vertical: 'middle', horizontal: idx === 1 ? 'left' : 'center' };
    c.border = BORDER_CELL;
  });

  const tunaiTotal = summary.paymentStats?.tunaiTotal || 0;
  const qrisTotal = summary.paymentStats?.qrisTotal || 0;
  const totalNominal = tunaiTotal + qrisTotal;
  const tunaiPct = totalNominal > 0 ? tunaiTotal / totalNominal : 0;
  const qrisPct = totalNominal > 0 ? qrisTotal / totalNominal : 0;

  const paymentRows = [
    [1, 'TUNAI (Cash)', tunaiTotal, tunaiPct, 'Uang tunai kasir disetorkan'],
    [2, 'QRIS (Non-Tunai)', qrisTotal, qrisPct, 'Otomatis masuk rekening merchant'],
  ];

  paymentRows.forEach((p, idx) => {
    currentRow++;
    const r = wsSummary.getRow(currentRow);
    r.height = 22;
    const bg = idx % 2 === 0 ? COLORS.zebraEven : COLORS.zebraOdd;

    r.getCell(1).value = p[0];
    r.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };

    r.getCell(2).value = p[1];
    r.getCell(2).alignment = { horizontal: 'left', vertical: 'middle' };
    r.getCell(2).font = { name: 'Segoe UI', size: 10, bold: true };

    r.getCell(3).value = p[2];
    r.getCell(3).numFmt = '"Rp"#,##0';
    r.getCell(3).alignment = { horizontal: 'right', vertical: 'middle' };
    r.getCell(3).font = { name: 'Segoe UI', size: 10, bold: true };

    r.getCell(4).value = p[3];
    r.getCell(4).numFmt = '0.0%';
    r.getCell(4).alignment = { horizontal: 'right', vertical: 'middle' };

    r.getCell(5).value = p[4];
    r.getCell(5).alignment = { horizontal: 'left', vertical: 'middle' };

    for (let c = 1; c <= 5; c++) {
      const cell = r.getCell(c);
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
      cell.border = BORDER_CELL;
    }
  });

  // Total Payment Row
  currentRow++;
  const payTotalRow = wsSummary.getRow(currentRow);
  payTotalRow.height = 24;
  payTotalRow.getCell(1).value = '';
  payTotalRow.getCell(2).value = 'TOTAL KONSOLIDASI';
  payTotalRow.getCell(2).font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: COLORS.totalText } };
  payTotalRow.getCell(3).value = totalNominal;
  payTotalRow.getCell(3).numFmt = '"Rp"#,##0';
  payTotalRow.getCell(3).font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: COLORS.totalText } };
  payTotalRow.getCell(3).alignment = { horizontal: 'right', vertical: 'middle' };
  payTotalRow.getCell(4).value = 1;
  payTotalRow.getCell(4).numFmt = '0.0%';
  payTotalRow.getCell(4).font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: COLORS.totalText } };
  payTotalRow.getCell(4).alignment = { horizontal: 'right', vertical: 'middle' };
  payTotalRow.getCell(5).value = '100% penerimaan kasir';
  for (let c = 1; c <= 5; c++) {
    const cell = payTotalRow.getCell(c);
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.totalBg } };
    cell.border = BORDER_TOTAL;
  }

  // --- BAGIAN C: TOP PRODUK TERLARIS ---
  if (summary.topProducts && summary.topProducts.length > 0) {
    currentRow += 2;
    wsSummary.mergeCells(`A${currentRow}:E${currentRow}`);
    const secC = wsSummary.getCell(`A${currentRow}`);
    secC.value = 'C. 10 MENU TERLARIS (TOP PRODUCT RANKING)';
    secC.font = { name: 'Segoe UI', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
    secC.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.headerDark } };
    secC.alignment = { vertical: 'middle', indent: 1 };
    wsSummary.getRow(currentRow).height = 26;

    currentRow++;
    const topHeaders = ['Peringkat', 'Nama Menu / Produk', 'Kuantitas Terjual', 'Total Omzet (Rp)', 'Kontribusi (%)'];
    const topHeaderRow = wsSummary.getRow(currentRow);
    topHeaderRow.height = 24;
    topHeaders.forEach((h, idx) => {
      const c = topHeaderRow.getCell(idx + 1);
      c.value = h;
      c.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
      c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.headerLight } };
      c.alignment = { vertical: 'middle', horizontal: idx === 1 ? 'left' : 'center' };
      c.border = BORDER_CELL;
    });

    summary.topProducts.forEach((p, idx) => {
      currentRow++;
      const r = wsSummary.getRow(currentRow);
      r.height = 22;
      const bg = idx % 2 === 0 ? COLORS.zebraEven : COLORS.zebraOdd;
      const share = summary.omzet > 0 ? p.omzet / summary.omzet : 0;

      r.getCell(1).value = idx + 1;
      r.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
      r.getCell(1).font = { name: 'Segoe UI', size: 10, bold: idx < 3 };

      r.getCell(2).value = p.nama;
      r.getCell(2).alignment = { horizontal: 'left', vertical: 'middle' };
      r.getCell(2).font = { name: 'Segoe UI', size: 10, bold: idx < 3 };

      r.getCell(3).value = p.qty;
      r.getCell(3).numFmt = '#,##0" pcs"';
      r.getCell(3).alignment = { horizontal: 'right', vertical: 'middle' };
      r.getCell(3).font = { name: 'Segoe UI', size: 10, bold: true };

      r.getCell(4).value = p.omzet;
      r.getCell(4).numFmt = '"Rp"#,##0';
      r.getCell(4).alignment = { horizontal: 'right', vertical: 'middle' };
      r.getCell(4).font = { name: 'Segoe UI', size: 10, bold: true };

      r.getCell(5).value = share;
      r.getCell(5).numFmt = '0.0%';
      r.getCell(5).alignment = { horizontal: 'right', vertical: 'middle' };

      for (let c = 1; c <= 5; c++) {
        const cell = r.getCell(c);
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
        cell.border = BORDER_CELL;
      }
    });
  }

  // Atur Lebar Kolom Sheet 1
  wsSummary.columns = [
    { width: 10 },
    { width: 38 },
    { width: 26 },
    { width: 16 },
    { width: 44 },
  ];

  // =========================================================================
  // 2. SHEET: DAFTAR TRANSAKSI (DETIL TRANSAKSI)
  // =========================================================================
  const wsTrx = wb.addWorksheet('Daftar Transaksi', {
    views: [{ state: 'frozen', xSplit: 0, ySplit: 4, showGridLines: true }],
  });

  // Banner Judul
  wsTrx.mergeCells('A1:M1');
  const trxTitle = wsTrx.getCell('A1');
  trxTitle.value = 'LUMBUNG KOPI DAN ROTI - DAFTAR LENGKAP TRANSAKSI PENJUALAN';
  trxTitle.font = { name: 'Segoe UI', size: 13, bold: true, color: { argb: 'FFFFFFFF' } };
  trxTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.brandPrimary } };
  trxTitle.alignment = { vertical: 'middle', horizontal: 'center' };
  wsTrx.getRow(1).height = 32;

  // Banner Sub-judul
  wsTrx.mergeCells('A2:M2');
  const trxSub = wsTrx.getCell('A2');
  trxSub.value = `Cabang: ${summary.branchName}   |   Total: ${transactions.length} Transaksi Tercatat   |   Waktu Unduh: ${exportDateStr} WIB`;
  trxSub.font = { name: 'Segoe UI', size: 9.5, italic: true, color: { argb: COLORS.brandGold } };
  trxSub.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.brandAccent } };
  trxSub.alignment = { vertical: 'middle', horizontal: 'center' };
  wsTrx.getRow(2).height = 22;

  wsTrx.getRow(3).height = 10;

  // Header Tabel
  const trxHeaders = [
    'No.',
    'No. Struk',
    'Tanggal & Waktu',
    'Cabang',
    'Kasir Bertugas',
    'Metode Bayar',
    'Rincian Menu / Item Dibeli',
    'Subtotal (Rp)',
    'Diskon (Rp)',
    'Alasan Diskon',
    'Total Akhir (Rp)',
    'Status',
    'Alasan Void (Jika Batal)',
  ];

  const trxHeaderRow = wsTrx.getRow(4);
  trxHeaderRow.height = 28;
  trxHeaders.forEach((h, idx) => {
    const c = trxHeaderRow.getCell(idx + 1);
    c.value = h;
    c.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
    c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.headerDark } };
    c.alignment = {
      vertical: 'middle',
      horizontal: [1, 2, 3, 4, 6, 12].includes(idx + 1) ? 'center' : [8, 9, 11].includes(idx + 1) ? 'right' : 'left',
      wrapText: true,
    };
    c.border = BORDER_CELL;
  });

  // Enable AutoFilter di Excel
  wsTrx.autoFilter = {
    from: { row: 4, column: 1 },
    to: { row: 4, column: trxHeaders.length },
  };

  const startTrxRow = 5;
  transactions.forEach((t, index) => {
    const rowIdx = startTrxRow + index;
    const r = wsTrx.getRow(rowIdx);
    r.height = 24;
    const isOdd = index % 2 !== 0;
    const isVoid = t.status?.toLowerCase() === 'void';
    const bg = isVoid ? 'FFFFF1F2' : (isOdd ? COLORS.zebraOdd : COLORS.zebraEven);

    // Format item summary
    let itemSummary = '-';
    if (t.items && Array.isArray(t.items) && t.items.length > 0) {
      itemSummary = t.items.map((it: any) => `${it.jumlah}x ${it.nama_produk}`).join(', ');
    }

    // Tanggal
    let formattedDate = '-';
    const rawDate = t.dibuat_pada || t.dibayar_pada || t.created_at || (typeof t.void_oleh === 'string' && t.void_oleh.includes('T') ? t.void_oleh : null);
    if (rawDate) {
      try {
        const d = new Date(rawDate);
        if (!isNaN(d.getTime())) {
          formattedDate = d.toLocaleString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });
        }
      } catch {
        formattedDate = '-';
      }
    }

    r.getCell(1).value = index + 1;
    r.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };

    r.getCell(2).value = t.nomor_struk || '-';
    r.getCell(2).alignment = { horizontal: 'center', vertical: 'middle' };
    r.getCell(2).font = { name: 'Segoe UI', size: 9.5, bold: true };

    r.getCell(3).value = formattedDate;
    r.getCell(3).alignment = { horizontal: 'center', vertical: 'middle' };

    r.getCell(4).value = t.cabang?.nama || t.cabang?.kode || '-';
    r.getCell(4).alignment = { horizontal: 'center', vertical: 'middle' };

    r.getCell(5).value = t.kasir?.nama_lengkap || '-';
    r.getCell(5).alignment = { horizontal: 'left', vertical: 'middle' };

    r.getCell(6).value = t.metode_bayar ? t.metode_bayar.toUpperCase() : '-';
    r.getCell(6).alignment = { horizontal: 'center', vertical: 'middle' };
    r.getCell(6).font = { name: 'Segoe UI', size: 9.5, bold: true };

    r.getCell(7).value = itemSummary;
    r.getCell(7).alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };

    r.getCell(8).value = toNum(t.subtotal);
    r.getCell(8).numFmt = '"Rp"#,##0';
    r.getCell(8).alignment = { horizontal: 'right', vertical: 'middle' };

    r.getCell(9).value = toNum(t.diskon);
    r.getCell(9).numFmt = '"Rp"#,##0';
    r.getCell(9).alignment = { horizontal: 'right', vertical: 'middle' };
    if (toNum(t.diskon) > 0) {
      r.getCell(9).font = { name: 'Segoe UI', size: 9.5, color: { argb: COLORS.dangerText } };
    }

    r.getCell(10).value = t.alasan_diskon || '-';
    r.getCell(10).alignment = { horizontal: 'left', vertical: 'middle' };

    r.getCell(11).value = toNum(t.total);
    r.getCell(11).numFmt = '"Rp"#,##0';
    r.getCell(11).alignment = { horizontal: 'right', vertical: 'middle' };
    r.getCell(11).font = { name: 'Segoe UI', size: 10, bold: true };

    const statusVal = t.status ? t.status.toUpperCase() : 'LUNAS';
    r.getCell(12).value = statusVal;
    r.getCell(12).alignment = { horizontal: 'center', vertical: 'middle' };
    r.getCell(12).font = {
      name: 'Segoe UI',
      size: 9.5,
      bold: true,
      color: { argb: isVoid ? COLORS.dangerText : COLORS.successText },
    };
    r.getCell(12).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: isVoid ? COLORS.dangerBg : COLORS.successBg },
    };

    let alasanVoidDisplay = '-';
    if (isVoid) {
      if (t.alasan_void && !t.alasan_void.includes('T') && !t.alasan_void.includes('+')) {
        alasanVoidDisplay = t.alasan_void;
      } else {
        alasanVoidDisplay = 'Dibatalkan oleh kasir/supervisor';
      }
    }
    r.getCell(13).value = alasanVoidDisplay;
    r.getCell(13).alignment = { horizontal: 'left', vertical: 'middle' };
    if (isVoid) {
      r.getCell(13).font = { name: 'Segoe UI', size: 9.5, italic: true, color: { argb: COLORS.dangerText } };
    }

    // Border & cell fill (kecuali status sudah di-fill)
    for (let c = 1; c <= trxHeaders.length; c++) {
      const cell = r.getCell(c);
      if (c !== 12) {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
      }
      cell.border = BORDER_CELL;
    }
  });

  // Total Baris Akhir
  const endTrxRow = startTrxRow + transactions.length;
  const trxTotalRow = wsTrx.getRow(endTrxRow);
  trxTotalRow.height = 26;

  trxTotalRow.getCell(1).value = '';
  trxTotalRow.getCell(2).value = 'TOTAL KESELURUHAN';
  trxTotalRow.getCell(2).font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: COLORS.totalText } };
  trxTotalRow.getCell(2).alignment = { horizontal: 'center', vertical: 'middle' };

  // Rumus Excel SUM jika ada data
  if (transactions.length > 0) {
    trxTotalRow.getCell(8).value = { formula: `SUM(H${startTrxRow}:H${endTrxRow - 1})` };
    trxTotalRow.getCell(9).value = { formula: `SUM(I${startTrxRow}:I${endTrxRow - 1})` };
    trxTotalRow.getCell(11).value = { formula: `SUMIF(L${startTrxRow}:L${endTrxRow - 1},"LUNAS",K${startTrxRow}:K${endTrxRow - 1})` };
  } else {
    trxTotalRow.getCell(8).value = 0;
    trxTotalRow.getCell(9).value = 0;
    trxTotalRow.getCell(11).value = 0;
  }

  [8, 9, 11].forEach((col) => {
    const c = trxTotalRow.getCell(col);
    c.numFmt = '"Rp"#,##0';
    c.alignment = { horizontal: 'right', vertical: 'middle' };
    c.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: COLORS.totalText } };
  });

  for (let c = 1; c <= trxHeaders.length; c++) {
    const cell = trxTotalRow.getCell(c);
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.totalBg } };
    cell.border = BORDER_TOTAL;
  }

  // Atur Lebar Kolom Sheet 2
  wsTrx.columns = [
    { width: 7 },   // No
    { width: 22 },  // Struk
    { width: 19 },  // Tanggal
    { width: 18 },  // Cabang
    { width: 22 },  // Kasir
    { width: 15 },  // Metode
    { width: 36 },  // Items
    { width: 17 },  // Subtotal
    { width: 15 },  // Diskon
    { width: 20 },  // Alasan Diskon
    { width: 19 },  // Total Akhir
    { width: 14 },  // Status
    { width: 26 },  // Alasan Void
  ];

  // =========================================================================
  // 3. SHEET: REKONSILIASI SHIFT & KAS KASIR
  // =========================================================================
  const wsShift = wb.addWorksheet('Rekonsiliasi Shift', {
    views: [{ state: 'frozen', xSplit: 0, ySplit: 4, showGridLines: true }],
  });

  // Banner Judul
  wsShift.mergeCells('A1:O1');
  const shiftTitle = wsShift.getCell('A1');
  shiftTitle.value = 'LUMBUNG KOPI DAN ROTI - REKAPITULASI SHIFT & REKONSILIASI KAS KASIR';
  shiftTitle.font = { name: 'Segoe UI', size: 13, bold: true, color: { argb: 'FFFFFFFF' } };
  shiftTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.brandPrimary } };
  shiftTitle.alignment = { vertical: 'middle', horizontal: 'center' };
  wsShift.getRow(1).height = 32;

  // Banner Sub-judul
  wsShift.mergeCells('A2:O2');
  const shiftSub = wsShift.getCell('A2');
  shiftSub.value = `Cabang: ${summary.branchName}   |   Total: ${shifts.length} Shift Kasir   |   Waktu Unduh: ${exportDateStr} WIB`;
  shiftSub.font = { name: 'Segoe UI', size: 9.5, italic: true, color: { argb: COLORS.brandGold } };
  shiftSub.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.brandAccent } };
  shiftSub.alignment = { vertical: 'middle', horizontal: 'center' };
  wsShift.getRow(2).height = 22;

  wsShift.getRow(3).height = 10;

  // Header Tabel
  const shiftHeaders = [
    'No.',
    'Tanggal Shift',
    'Jam Buka',
    'Jam Tutup',
    'Cabang',
    'Kasir Bertugas',
    'Kas Awal Laci (Rp)',
    'Penjualan Tunai (Rp)',
    'Kas Seharusnya (Rp)',
    'Uang Fisik Kasir (Rp)',
    'Selisih Kas (Rp)',
    'Status Audit Kas',
    'Status Shift',
    'Catatan Kasir Tutup Shift',
    'Catatan Verifikasi Supervisor',
  ];

  const shiftHeaderRow = wsShift.getRow(4);
  shiftHeaderRow.height = 28;
  shiftHeaders.forEach((h, idx) => {
    const c = shiftHeaderRow.getCell(idx + 1);
    c.value = h;
    c.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
    c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.headerDark } };
    c.alignment = {
      vertical: 'middle',
      horizontal: [1, 2, 3, 4, 5, 12, 13].includes(idx + 1) ? 'center' : [7, 8, 9, 10, 11].includes(idx + 1) ? 'right' : 'left',
      wrapText: true,
    };
    c.border = BORDER_CELL;
  });

  // Enable AutoFilter
  wsShift.autoFilter = {
    from: { row: 4, column: 1 },
    to: { row: 4, column: shiftHeaders.length },
  };

  const startShiftRow = 5;
  shifts.forEach((s, index) => {
    const rowIdx = startShiftRow + index;
    const r = wsShift.getRow(rowIdx);
    r.height = 24;
    const isOdd = index % 2 !== 0;
    const selisih = toNum(s.selisih);
    const hasDiscrepancy = s.selisih !== null && Math.abs(selisih) > 0;
    const bg = isOdd ? COLORS.zebraOdd : COLORS.zebraEven;

    const tglShift = s.dibuka_pada ? new Date(s.dibuka_pada).toLocaleDateString('id-ID') : '-';
    const jamBuka = s.dibuka_pada
      ? new Date(s.dibuka_pada).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      : '-';
    const jamTutup = s.ditutup_pada
      ? new Date(s.ditutup_pada).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      : (s.status === 'buka' ? 'Masih Aktif' : '-');

    r.getCell(1).value = index + 1;
    r.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };

    r.getCell(2).value = tglShift;
    r.getCell(2).alignment = { horizontal: 'center', vertical: 'middle' };

    r.getCell(3).value = jamBuka;
    r.getCell(3).alignment = { horizontal: 'center', vertical: 'middle' };

    r.getCell(4).value = jamTutup;
    r.getCell(4).alignment = { horizontal: 'center', vertical: 'middle' };

    r.getCell(5).value = s.cabang?.nama || s.cabang?.kode || '-';
    r.getCell(5).alignment = { horizontal: 'center', vertical: 'middle' };

    r.getCell(6).value = s.kasir?.nama_lengkap || '-';
    r.getCell(6).alignment = { horizontal: 'left', vertical: 'middle' };

    r.getCell(7).value = toNum(s.kas_awal);
    r.getCell(7).numFmt = '"Rp"#,##0';
    r.getCell(7).alignment = { horizontal: 'right', vertical: 'middle' };

    r.getCell(8).value = toNum(s.total_tunai);
    r.getCell(8).numFmt = '"Rp"#,##0';
    r.getCell(8).alignment = { horizontal: 'right', vertical: 'middle' };

    r.getCell(9).value = toNum(s.kas_seharusnya);
    r.getCell(9).numFmt = '"Rp"#,##0';
    r.getCell(9).alignment = { horizontal: 'right', vertical: 'middle' };

    r.getCell(10).value = toNum(s.uang_fisik);
    r.getCell(10).numFmt = '"Rp"#,##0';
    r.getCell(10).alignment = { horizontal: 'right', vertical: 'middle' };

    r.getCell(11).value = selisih;
    r.getCell(11).numFmt = '"Rp"#,##0;[Red]("-Rp"#,##0);"-"';
    r.getCell(11).alignment = { horizontal: 'right', vertical: 'middle' };
    r.getCell(11).font = {
      name: 'Segoe UI',
      size: 10,
      bold: true,
      color: { argb: selisih < 0 ? COLORS.dangerText : (selisih > 0 ? COLORS.infoText : COLORS.successText) },
    };

    let auditText = 'SESUAI (PAS)';
    let auditBg = COLORS.successBg;
    let auditFg = COLORS.successText;
    if (selisih < 0) {
      auditText = `SELISIH KURANG (${Math.abs(selisih).toLocaleString('id-ID')})`;
      auditBg = COLORS.dangerBg;
      auditFg = COLORS.dangerText;
    } else if (selisih > 0) {
      auditText = `SELISIH LEBIH (+${selisih.toLocaleString('id-ID')})`;
      auditBg = COLORS.infoBg;
      auditFg = COLORS.infoText;
    }

    r.getCell(12).value = auditText;
    r.getCell(12).alignment = { horizontal: 'center', vertical: 'middle' };
    r.getCell(12).font = { name: 'Segoe UI', size: 9, bold: true, color: { argb: auditFg } };
    r.getCell(12).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: auditBg } };

    const statusShift = s.status ? s.status.toUpperCase() : 'SELESAI';
    r.getCell(13).value = statusShift;
    r.getCell(13).alignment = { horizontal: 'center', vertical: 'middle' };
    r.getCell(13).font = { name: 'Segoe UI', size: 9.5, bold: true };

    r.getCell(14).value = s.catatan_tutup || '-';
    r.getCell(14).alignment = { horizontal: 'left', vertical: 'middle' };

    r.getCell(15).value = s.catatan_verifikasi || '-';
    r.getCell(15).alignment = { horizontal: 'left', vertical: 'middle' };

    // Set border and background
    for (let c = 1; c <= shiftHeaders.length; c++) {
      const cell = r.getCell(c);
      if (c !== 12) {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: (c === 11 && hasDiscrepancy) ? COLORS.dangerBg : bg },
        };
      }
      cell.border = BORDER_CELL;
    }
  });

  // Total Row Shift
  const endShiftRow = startShiftRow + shifts.length;
  const shiftTotalRow = wsShift.getRow(endShiftRow);
  shiftTotalRow.height = 26;

  shiftTotalRow.getCell(1).value = '';
  shiftTotalRow.getCell(2).value = 'TOTAL KONSOLIDASI SHIFT';
  shiftTotalRow.getCell(2).font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: COLORS.totalText } };
  shiftTotalRow.getCell(2).alignment = { horizontal: 'center', vertical: 'middle' };

  if (shifts.length > 0) {
    shiftTotalRow.getCell(7).value = { formula: `SUM(G${startShiftRow}:G${endShiftRow - 1})` };
    shiftTotalRow.getCell(8).value = { formula: `SUM(H${startShiftRow}:H${endShiftRow - 1})` };
    shiftTotalRow.getCell(9).value = { formula: `SUM(I${startShiftRow}:I${endShiftRow - 1})` };
    shiftTotalRow.getCell(10).value = { formula: `SUM(J${startShiftRow}:J${endShiftRow - 1})` };
    shiftTotalRow.getCell(11).value = { formula: `SUM(K${startShiftRow}:K${endShiftRow - 1})` };
  } else {
    shiftTotalRow.getCell(7).value = 0;
    shiftTotalRow.getCell(8).value = 0;
    shiftTotalRow.getCell(9).value = 0;
    shiftTotalRow.getCell(10).value = 0;
    shiftTotalRow.getCell(11).value = 0;
  }

  [7, 8, 9, 10, 11].forEach((col) => {
    const c = shiftTotalRow.getCell(col);
    c.numFmt = '"Rp"#,##0';
    c.alignment = { horizontal: 'right', vertical: 'middle' };
    c.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: COLORS.totalText } };
  });

  for (let c = 1; c <= shiftHeaders.length; c++) {
    const cell = shiftTotalRow.getCell(c);
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.totalBg } };
    cell.border = BORDER_TOTAL;
  }

  // Atur Lebar Kolom Sheet 3
  wsShift.columns = [
    { width: 7 },   // No
    { width: 15 },  // Tanggal
    { width: 12 },  // Buka
    { width: 13 },  // Tutup
    { width: 16 },  // Cabang
    { width: 22 },  // Kasir
    { width: 18 },  // Kas Awal
    { width: 20 },  // Total Tunai
    { width: 20 },  // Kas Seharusnya
    { width: 20 },  // Uang Fisik
    { width: 18 },  // Selisih
    { width: 24 },  // Status Audit
    { width: 15 },  // Status Shift
    { width: 30 },  // Catatan Tutup
    { width: 30 },  // Catatan Verifikasi
  ];

  // =========================================================================
  // 4. SHEET: DETAIL PENJUALAN PER PRODUK
  // =========================================================================
  if (summary.topProducts && summary.topProducts.length > 0) {
    const wsProd = wb.addWorksheet('Penjualan Menu', {
      views: [{ state: 'frozen', xSplit: 0, ySplit: 4, showGridLines: true }],
    });

    wsProd.mergeCells('A1:E1');
    const prodTitle = wsProd.getCell('A1');
    prodTitle.value = 'LUMBUNG KOPI DAN ROTI - REKAPITULASI PENJUALAN PRODUK / MENU';
    prodTitle.font = { name: 'Segoe UI', size: 13, bold: true, color: { argb: 'FFFFFFFF' } };
    prodTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.brandPrimary } };
    prodTitle.alignment = { vertical: 'middle', horizontal: 'center' };
    wsProd.getRow(1).height = 32;

    wsProd.mergeCells('A2:E2');
    const prodSub = wsProd.getCell('A2');
    prodSub.value = `Cabang: ${summary.branchName}   |   Waktu Unduh: ${exportDateStr} WIB`;
    prodSub.font = { name: 'Segoe UI', size: 9.5, italic: true, color: { argb: COLORS.brandGold } };
    prodSub.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.brandAccent } };
    prodSub.alignment = { vertical: 'middle', horizontal: 'center' };
    wsProd.getRow(2).height = 22;

    wsProd.getRow(3).height = 10;

    const prodHeaders = [
      'Peringkat',
      'Nama Menu / Produk',
      'Kuantitas Terjual',
      'Total Omzet Penjualan (Rp)',
      'Kontribusi Omzet (%)',
    ];

    const prodHeaderRow = wsProd.getRow(4);
    prodHeaderRow.height = 28;
    prodHeaders.forEach((h, idx) => {
      const c = prodHeaderRow.getCell(idx + 1);
      c.value = h;
      c.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
      c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.headerDark } };
      c.alignment = {
        vertical: 'middle',
        horizontal: idx === 0 ? 'center' : [2, 3, 4].includes(idx) ? 'right' : 'left',
      };
      c.border = BORDER_CELL;
    });

    wsProd.autoFilter = {
      from: { row: 4, column: 1 },
      to: { row: 4, column: prodHeaders.length },
    };

    const startProdRow = 5;
    summary.topProducts.forEach((p, idx) => {
      const rowIdx = startProdRow + idx;
      const r = wsProd.getRow(rowIdx);
      r.height = 24;
      const isOdd = idx % 2 !== 0;
      const bg = isOdd ? COLORS.zebraOdd : COLORS.zebraEven;
      const share = summary.omzet > 0 ? p.omzet / summary.omzet : 0;

      r.getCell(1).value = idx + 1;
      r.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
      r.getCell(1).font = { name: 'Segoe UI', size: 10, bold: idx < 3 };

      r.getCell(2).value = p.nama;
      r.getCell(2).alignment = { horizontal: 'left', vertical: 'middle' };
      r.getCell(2).font = { name: 'Segoe UI', size: 10, bold: idx < 3 };

      r.getCell(3).value = p.qty;
      r.getCell(3).numFmt = '#,##0" pcs"';
      r.getCell(3).alignment = { horizontal: 'right', vertical: 'middle' };
      r.getCell(3).font = { name: 'Segoe UI', size: 10, bold: true };

      r.getCell(4).value = p.omzet;
      r.getCell(4).numFmt = '"Rp"#,##0';
      r.getCell(4).alignment = { horizontal: 'right', vertical: 'middle' };
      r.getCell(4).font = { name: 'Segoe UI', size: 10, bold: true };

      r.getCell(5).value = share;
      r.getCell(5).numFmt = '0.0%';
      r.getCell(5).alignment = { horizontal: 'right', vertical: 'middle' };

      for (let c = 1; c <= prodHeaders.length; c++) {
        const cell = r.getCell(c);
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
        cell.border = BORDER_CELL;
      }
    });

    const endProdRow = startProdRow + summary.topProducts.length;
    const prodTotalRow = wsProd.getRow(endProdRow);
    prodTotalRow.height = 26;

    prodTotalRow.getCell(1).value = '';
    prodTotalRow.getCell(2).value = 'TOTAL KONSOLIDASI PRODUK';
    prodTotalRow.getCell(2).font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: COLORS.totalText } };
    prodTotalRow.getCell(3).value = { formula: `SUM(C${startProdRow}:C${endProdRow - 1})` };
    prodTotalRow.getCell(3).numFmt = '#,##0" pcs"';
    prodTotalRow.getCell(3).font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: COLORS.totalText } };
    prodTotalRow.getCell(3).alignment = { horizontal: 'right', vertical: 'middle' };

    prodTotalRow.getCell(4).value = { formula: `SUM(D${startProdRow}:D${endProdRow - 1})` };
    prodTotalRow.getCell(4).numFmt = '"Rp"#,##0';
    prodTotalRow.getCell(4).font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: COLORS.totalText } };
    prodTotalRow.getCell(4).alignment = { horizontal: 'right', vertical: 'middle' };

    prodTotalRow.getCell(5).value = { formula: `SUM(E${startProdRow}:E${endProdRow - 1})` };
    prodTotalRow.getCell(5).numFmt = '0.0%';
    prodTotalRow.getCell(5).font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: COLORS.totalText } };
    prodTotalRow.getCell(5).alignment = { horizontal: 'right', vertical: 'middle' };

    for (let c = 1; c <= prodHeaders.length; c++) {
      const cell = prodTotalRow.getCell(c);
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.totalBg } };
      cell.border = BORDER_TOTAL;
    }

    wsProd.columns = [
      { width: 12 },  // Rank
      { width: 36 },  // Nama Menu
      { width: 22 },  // Qty Terjual
      { width: 26 },  // Total Omzet
      { width: 22 },  // Share %
    ];
  }

  // =========================================================================
  // EKSEKUSI PENGUNDUHAN FILE DI BROWSER
  // =========================================================================
  const cleanBranch = summary.branchName.replace(/[^a-zA-Z0-9]/g, '_');
  const dateStr = new Date().toISOString().slice(0, 10);
  const filename = `Laporan_Lumbung_${cleanBranch}_${dateStr}.xlsx`;

  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  const downloadUrl = window.URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = downloadUrl;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  window.URL.revokeObjectURL(downloadUrl);
}
