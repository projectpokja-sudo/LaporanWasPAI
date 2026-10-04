import { FullReport, PengawasIdentity, DEFAULT_IDENTITY, INITIAL_REPORT } from '../types/report';

const DRAFT_STORAGE_KEY = 'generator_laporan_pai_draft';
const HISTORY_STORAGE_KEY = 'generator_laporan_pai_history';
const DEFAULT_ID_STORAGE_KEY = 'generator_laporan_pai_default_id';

export function loadDraftReport(): FullReport {
  try {
    const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (!raw) return { ...INITIAL_REPORT };
    const parsed = JSON.parse(raw);
    // Ensure all 3 photos slots exist
    if (!parsed.photos || parsed.photos.length < 3) {
      parsed.photos = INITIAL_REPORT.photos;
    }
    return parsed;
  } catch (e) {
    console.error('Failed to load draft from localStorage:', e);
    return { ...INITIAL_REPORT };
  }
}

export function saveDraftReport(report: FullReport): void {
  try {
    const toSave = {
      ...report,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(toSave));
  } catch (e) {
    console.error('Failed to save draft to localStorage:', e);
  }
}

export function loadDefaultIdentity(): PengawasIdentity {
  try {
    const raw = localStorage.getItem(DEFAULT_ID_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_IDENTITY };
    return JSON.parse(raw);
  } catch (e) {
    return { ...DEFAULT_IDENTITY };
  }
}

export function saveDefaultIdentity(identity: PengawasIdentity): void {
  try {
    localStorage.setItem(DEFAULT_ID_STORAGE_KEY, JSON.stringify(identity));
  } catch (e) {
    console.error('Failed to save default identity:', e);
  }
}

export function getReportHistory(): FullReport[] {
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

export function saveReportToHistory(report: FullReport): FullReport[] {
  try {
    const history = getReportHistory();
    const existingIndex = history.findIndex((item) => item.id === report.id);
    const newEntry: FullReport = {
      ...report,
      id: report.id === 'draft-current' ? `rep-${Date.now()}` : report.id,
      updatedAt: new Date().toISOString(),
    };

    let updatedHistory: FullReport[];
    if (existingIndex >= 0) {
      updatedHistory = [...history];
      updatedHistory[existingIndex] = newEntry;
    } else {
      updatedHistory = [newEntry, ...history];
    }

    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
    return updatedHistory;
  } catch (e) {
    console.error('Failed to save to history:', e);
    return [];
  }
}

export function deleteReportFromHistory(id: string): FullReport[] {
  try {
    const history = getReportHistory().filter((item) => item.id !== id);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    return history;
  } catch (e) {
    return [];
  }
}
