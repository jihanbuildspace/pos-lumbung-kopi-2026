import * as XLSX from 'xlsx';

interface SummaryData {
  omzet: number;
  countLunas: number;
  avgTrx: number;
  countVoid: number;
  labaKotor?: number;
  margin?: string;
  isOwner: boolean;
  branchName: string;
}

export function exportReportToExcel(
  transactions: any[],
  shifts: any[],
  summary: SummaryData
) {
  const wb = XLSX.utils.book_new();

  // 1. Sheet Ringkasan
  const summaryRows: any[] = [
    ['LAPORAN PENJUALAN - LUMBUNG KOPI DAN ROTI'],
    ['Cabang:', summary.branchName],
    ['Tanggal Ekspor:', new Date().toLocaleString('id-ID')],
    [],
    ['METRIK UTAMA', 'NILAI'],
    ['Total Omzet (Lunas)', summary.omzet],
    ['Jumlah Transaksi Lunas', summary.countLunas],
    ['Rata-rata per Transaksi', summary.avgTrx],
    ['Total Transaksi Void', summary.countVoid],
  ];

  if (summary.isOwner && summary.labaKotor !== undefined) {
    summaryRows.push(['Laba Kotor (Gross Profit)', summary.labaKotor]);
    summaryRows.push(['Margin Laba Kotor (%)', `${summary.margin}%`]);
  }

  const wsSummary = XLSX.utils.aoa_to_sheet(summaryRows);
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Ringkasan');

  // 2. Sheet Transaksi
  const trxRows = transactions.map((t) => ({
    'No. Struk': t.nomor_struk,
    'Tanggal/Waktu': new Date(t.dibuat_pada).toLocaleString('id-ID'),
    'Cabang': t.cabang?.nama || '-',
    'Kasir': t.kasir?.nama_lengkap || '-',
    'Metode Bayar': t.metode_bayar?.toUpperCase(),
    'Subtotal': t.subtotal,
    'Diskon': t.diskon,
    'Alasan Diskon': t.alasan_diskon || '-',
    'Total (Rp)': t.total,
    'Status': t.status?.toUpperCase(),
    'Alasan Void': t.alasan_void || '-',
  }));
  const wsTrx = XLSX.utils.json_to_sheet(trxRows);
  XLSX.utils.book_append_sheet(wb, wsTrx, 'Daftar Transaksi');

  // 3. Sheet Shift & Rekonsiliasi Kas
  const shiftRows = shifts.map((s) => ({
    'Tanggal Shift': new Date(s.dibuka_pada).toLocaleDateString('id-ID'),
    'Waktu Buka': new Date(s.dibuka_pada).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    'Cabang': s.cabang?.nama || '-',
    'Kasir': s.kasir?.nama_lengkap || '-',
    'Kas Awal': s.kas_awal,
    'Total Tunai': s.total_tunai || 0,
    'Kas Seharusnya': s.kas_seharusnya || 0,
    'Uang Fisik': s.uang_fisik || 0,
    'Selisih Kas': s.selisih || 0,
    'Status': s.status?.toUpperCase(),
    'Catatan Kasir': s.catatan_tutup || '-',
    'Catatan Verifikasi': s.catatan_verifikasi || '-',
  }));
  const wsShift = XLSX.utils.json_to_sheet(shiftRows);
  XLSX.utils.book_append_sheet(wb, wsShift, 'Rekonsiliasi Shift');

  // Generate filename
  const cleanBranch = summary.branchName.replace(/[^a-zA-Z0-9]/g, '_');
  const dateStr = new Date().toISOString().slice(0, 10);
  const filename = `Laporan_Lumbung_${cleanBranch}_${dateStr}.xlsx`;

  XLSX.writeFile(wb, filename);
}
