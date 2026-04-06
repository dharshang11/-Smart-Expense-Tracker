import { useState } from 'react';
import { useExpenses } from '../../hooks/useExpenses';
import { useMetrics } from '../../hooks/useMetrics';
import { useCurrency } from '../../hooks/useCurrency';
import { setSetting } from '../../data/settingsService';
import { exportToCSV, exportToPDF } from '../../data/exportService';
import { initSync, pushToCloud, pullFromCloud, isSyncAvailable } from '../../data/syncService';
import { parseSMS, SAMPLE_SMS } from '../../logic/smsParser';
import { addExpense } from '../../data/expenseService';
import { CURRENCIES } from '../../constants/currencies';
import { getCategoryById } from '../../constants/categories';
import {
  Settings, Globe, Download, FileText, FileSpreadsheet,
  Cloud, CloudUpload, CloudDownload, MessageSquare,
  Check, AlertTriangle, Loader, Plus, Trash2, Smartphone
} from 'lucide-react';
import './SettingsPage.css';

export default function SettingsPage() {
  const expenses = useExpenses();
  const metrics = useMetrics();
  const currency = useCurrency();

  const [syncStatus, setSyncStatus] = useState('');
  const [syncLoading, setSyncLoading] = useState(false);
  const [smsText, setSmsText] = useState('');
  const [parsedSMS, setParsedSMS] = useState([]);
  const [addedCount, setAddedCount] = useState(0);

  // === Currency ===
  async function handleCurrencyChange(code) {
    await setSetting('currency', code);
  }

  // === Export ===
  function handleExportCSV() {
    exportToCSV(expenses, currency.code);
  }

  function handleExportPDF() {
    exportToPDF(expenses, metrics, currency.code);
  }

  // === Cloud Sync ===
  async function handlePush() {
    setSyncLoading(true);
    setSyncStatus('');
    const initResult = await initSync();
    if (!initResult.success) {
      setSyncStatus(`Error: ${initResult.error}`);
      setSyncLoading(false);
      return;
    }
    const result = await pushToCloud();
    setSyncStatus(result.success ? `✓ Pushed ${result.count} expenses to cloud` : `Error: ${result.error}`);
    setSyncLoading(false);
  }

  async function handlePull() {
    setSyncLoading(true);
    setSyncStatus('');
    const initResult = await initSync();
    if (!initResult.success) {
      setSyncStatus(`Error: ${initResult.error}`);
      setSyncLoading(false);
      return;
    }
    const result = await pullFromCloud();
    setSyncStatus(result.success ? `✓ Pulled ${result.count} expenses from cloud` : `Error: ${result.error}`);
    setSyncLoading(false);
  }

  // === SMS Parser ===
  function handleParseSMS() {
    const lines = smsText.split('\n').filter(l => l.trim());
    const results = lines.map(line => {
      const parsed = parseSMS(line);
      return parsed ? { ...parsed, originalText: line, selected: true } : null;
    }).filter(Boolean);
    setParsedSMS(results);
  }

  function handleLoadSamples() {
    setSmsText(SAMPLE_SMS.join('\n'));
  }

  function toggleParsedItem(idx) {
    setParsedSMS(prev => prev.map((item, i) =>
      i === idx ? { ...item, selected: !item.selected } : item
    ));
  }

  async function handleAddParsedExpenses() {
    const toAdd = parsedSMS.filter(p => p.selected);
    for (const item of toAdd) {
      await addExpense({
        amount: item.amount,
        category: item.category,
        date: item.date,
        notes: item.notes,
        source: item.source,
      });
    }
    setAddedCount(toAdd.length);
    setParsedSMS([]);
    setSmsText('');
    setTimeout(() => setAddedCount(0), 3000);
  }

  return (
    <div className="settings-page" id="settings-page">
      <header className="settings-page__header animate-fade-in-up">
        <h1 className="settings-page__title">
          <Settings size={22} />
          Settings
        </h1>
      </header>

      {/* Currency Selection */}
      <section className="settings-section glass-card-static animate-fade-in-up stagger-1">
        <h3 className="settings-section__title">
          <Globe size={18} /> Currency
        </h3>
        <div className="currency-grid">
          {CURRENCIES.map(cur => (
            <button
              key={cur.code}
              className={`currency-option ${currency.code === cur.code ? 'currency-option--active' : ''}`}
              onClick={() => handleCurrencyChange(cur.code)}
            >
              <span className="currency-option__symbol">{cur.symbol}</span>
              <span className="currency-option__code">{cur.code}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Export */}
      <section className="settings-section glass-card-static animate-fade-in-up stagger-2">
        <h3 className="settings-section__title">
          <Download size={18} /> Export Data
        </h3>
        <p className="settings-section__desc">
          Download your expense data ({expenses.length} entries)
        </p>
        <div className="settings-section__actions">
          <button className="btn btn-secondary" onClick={handleExportCSV} disabled={expenses.length === 0}>
            <FileSpreadsheet size={16} /> Export CSV
          </button>
          <button className="btn btn-primary" onClick={handleExportPDF} disabled={expenses.length === 0}>
            <FileText size={16} /> Export PDF
          </button>
        </div>
      </section>

      {/* SMS Auto-Detection */}
      <section className="settings-section glass-card-static animate-fade-in-up stagger-3">
        <h3 className="settings-section__title">
          <MessageSquare size={18} /> SMS Auto-Detection
        </h3>
        <p className="settings-section__desc">
          Paste bank SMS messages to auto-detect expenses
        </p>
        <textarea
          className="sms-textarea"
          placeholder="Paste SMS messages here (one per line)..."
          value={smsText}
          onChange={e => setSmsText(e.target.value)}
          rows={4}
        />
        <div className="settings-section__actions">
          <button className="btn btn-secondary btn-sm" onClick={handleLoadSamples}>
            <Smartphone size={14} /> Load Samples
          </button>
          <button className="btn btn-primary btn-sm" onClick={handleParseSMS} disabled={!smsText.trim()}>
            <MessageSquare size={14} /> Parse SMS
          </button>
        </div>

        {parsedSMS.length > 0 && (
          <div className="parsed-results">
            <h4 className="parsed-results__title">
              Detected {parsedSMS.length} transactions
            </h4>
            {parsedSMS.map((item, idx) => (
              <div
                key={idx}
                className={`parsed-item ${item.selected ? 'parsed-item--selected' : ''}`}
                onClick={() => toggleParsedItem(idx)}
              >
                <div className="parsed-item__check">
                  {item.selected ? <Check size={14} /> : <Plus size={14} />}
                </div>
                <div className="parsed-item__details">
                  <div className="parsed-item__top">
                    <span className="parsed-item__category">{getCategoryById(item.category).label}</span>
                    <span className="parsed-item__amount">{currency.format(item.amount)}</span>
                  </div>
                  <span className="parsed-item__meta">{item.source} · {item.notes} · {item.date}</span>
                </div>
              </div>
            ))}
            <button className="btn btn-primary btn-block" onClick={handleAddParsedExpenses}>
              <Plus size={16} /> Add {parsedSMS.filter(p => p.selected).length} Expenses
            </button>
          </div>
        )}

        {addedCount > 0 && (
          <div className="settings-success">
            <Check size={16} /> Added {addedCount} expenses successfully!
          </div>
        )}
      </section>

      {/* Cloud Sync */}
      <section className="settings-section glass-card-static animate-fade-in-up stagger-4">
        <h3 className="settings-section__title">
          <Cloud size={18} /> Cloud Sync
        </h3>
        {isSyncAvailable() ? (
          <>
            <p className="settings-section__desc">
              Sync your data across devices using Firebase
            </p>
            <div className="settings-section__actions">
              <button className="btn btn-secondary" onClick={handlePush} disabled={syncLoading}>
                {syncLoading ? <Loader size={16} className="spin" /> : <CloudUpload size={16} />}
                Push to Cloud
              </button>
              <button className="btn btn-primary" onClick={handlePull} disabled={syncLoading}>
                {syncLoading ? <Loader size={16} className="spin" /> : <CloudDownload size={16} />}
                Pull from Cloud
              </button>
            </div>
          </>
        ) : (
          <div className="settings-info">
            <AlertTriangle size={16} />
            <div>
              <p>Firebase not configured yet.</p>
              <p className="settings-info__sub">
                Add your Firebase config to <code>src/data/firebaseConfig.js</code> to enable cloud sync.
              </p>
            </div>
          </div>
        )}
        {syncStatus && (
          <div className={`sync-status ${syncStatus.startsWith('✓') ? 'sync-status--success' : 'sync-status--error'}`}>
            {syncStatus}
          </div>
        )}
      </section>

      {/* App Info */}
      <section className="settings-section glass-card-static animate-fade-in-up stagger-5">
        <div className="app-info">
          <p className="app-info__name">Smart Expense Tracker</p>
          <p className="app-info__version">v1.0.0 · PWA Ready · Capacitor Ready</p>
          <p className="app-info__tech">React + Vite · Dexie.js · Recharts · Firebase</p>
        </div>
      </section>
    </div>
  );
}
