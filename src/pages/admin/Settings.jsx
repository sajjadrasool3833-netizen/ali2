import { useEffect, useState } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext.jsx';

const emptySettings = {
  // General
  siteName: 'Ali Hamza Digital Hub',
  siteTagline: 'Premium Digital Agency',
  siteDescription: 'Premium digital marketing & IT services. Serving ambitious brands worldwide.',

  // Contact
  email: 'info@alihamzadigital.com',
  phone: '+92 300 1234567',
  whatsapp: '923001234567',
  address: 'Lahore, Pakistan',
  workingHours: 'Mon-Sat: 9:00 AM - 8:00 PM',

  // Social
  facebook: 'https://facebook.com/alihamzadigital',
  instagram: 'https://instagram.com/alihamzadigital',
  tiktok: 'https://tiktok.com/@alihamzadigital',
  youtube: 'https://youtube.com/@alihamzadigital',
  linkedin: '',
  twitter: '',

  // SEO
  metaTitle: 'Ali Hamza Digital Hub | Premium Digital Agency',
  metaDescription: 'Premium digital marketing, web development, and design services.',
  metaKeywords: 'digital marketing, web development, social media, graphic design',
  googleAnalyticsId: '',

  // Payment
  bankName: '',
  accountTitle: '',
  accountNumber: '',
  jazzcash: '',
  easypaisa: '',

  // Footer
  footerText: '© 2025 Ali Hamza Digital Hub. All rights reserved.',
};

const tabs = [
  { key: 'general', label: 'General', icon: 'fa-solid fa-cog' },
  { key: 'contact', label: 'Contact', icon: 'fa-solid fa-address-book' },
  { key: 'social', label: 'Social Links', icon: 'fa-solid fa-share-nodes' },
  { key: 'seo', label: 'SEO', icon: 'fa-solid fa-magnifying-glass' },
  { key: 'payment', label: 'Payment', icon: 'fa-solid fa-credit-card' },
  { key: 'advanced', label: 'Advanced', icon: 'fa-solid fa-shield-halved' },
];

export default function Settings() {
  const [settings, setSettings] = useState(emptySettings);
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const { success, error } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const saved = localStorage.getItem('siteSettings');
      if (saved) {
        setSettings({ ...emptySettings, ...JSON.parse(saved) });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Save to localStorage (backend mein SiteSetting model add kar sakte hain future mein)
      localStorage.setItem('siteSettings', JSON.stringify(settings));
      success('Settings saved successfully!');
      setHasChanges(false);
    } catch (err) {
      error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (!window.confirm('Reset all settings to default? This cannot be undone.')) return;
    setSettings(emptySettings);
    localStorage.removeItem('siteSettings');
    success('Settings reset to default');
    setHasChanges(false);
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ali-hamza-settings-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    success('Settings exported!');
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        setSettings({ ...emptySettings, ...imported });
        setHasChanges(true);
        success('Settings imported! Click Save to apply.');
      } catch (err) {
        error('Invalid JSON file');
      }
    };
    reader.readAsText(file);
  };

  if (loading) {
    return <div className="card" style={{ padding: '48px', textAlign: 'center' }}>Loading settings...</div>;
  }

  return (
    <div>
      {/* Header */}
      <div className="admin-header">
        <div>
          <h1>Settings</h1>
          {hasChanges && (
            <p style={{ color: '#f59e0b', fontSize: '13px', marginTop: '4px' }}>
              <i className="fa-solid fa-exclamation-circle"></i> You have unsaved changes
            </p>
          )}
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button className="btn btn-outline btn-sm" onClick={handleExport} title="Export settings">
            <i className="fa-solid fa-download"></i> Export
          </button>
          <label className="btn btn-outline btn-sm" style={{ cursor: 'pointer' }} title="Import settings">
            <i className="fa-solid fa-upload"></i> Import
            <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
          </label>
          <button className="btn btn-gold" onClick={handleSave} disabled={saving || !hasChanges}>
            {saving ? (
              <><i className="fa-solid fa-spinner fa-spin"></i> Saving...</>
            ) : (
              <><i className="fa-solid fa-save"></i> Save Changes</>
            )}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', flexWrap: 'wrap', background: 'rgba(0,0,0,0.3)', padding: '6px', borderRadius: '12px' }}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '10px 16px',
              borderRadius: '8px',
              background: activeTab === tab.key ? 'var(--gold)' : 'transparent',
              color: activeTab === tab.key ? 'var(--navy)' : 'var(--gray-400)',
              fontWeight: 600,
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s',
            }}
          >
            <i className={tab.icon}></i>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="card" style={{ padding: '32px' }}>
        {/* GENERAL TAB */}
        {activeTab === 'general' && (
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', marginBottom: '8px' }}>
              <i className="fa-solid fa-cog" style={{ color: 'var(--gold)', marginRight: '10px' }}></i>
              General Settings
            </h2>
            <p style={{ color: 'var(--gray-400)', fontSize: '13px', marginBottom: '24px' }}>
              Basic information about your website
            </p>

            <div className="form-group">
              <label className="form-label">Site Name <span>*</span></label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => handleChange('siteName', e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Tagline</label>
              <input
                type="text"
                value={settings.siteTagline}
                onChange={(e) => handleChange('siteTagline', e.target.value)}
                className="form-input"
                placeholder="e.g. Premium Digital Agency"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Site Description</label>
              <textarea
                value={settings.siteDescription}
                onChange={(e) => handleChange('siteDescription', e.target.value)}
                className="form-textarea"
                rows="3"
                placeholder="Short description of your business"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Footer Text</label>
              <input
                type="text"
                value={settings.footerText}
                onChange={(e) => handleChange('footerText', e.target.value)}
                className="form-input"
              />
            </div>
          </div>
        )}

        {/* CONTACT TAB */}
        {activeTab === 'contact' && (
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', marginBottom: '8px' }}>
              <i className="fa-solid fa-address-book" style={{ color: 'var(--gold)', marginRight: '10px' }}></i>
              Contact Information
            </h2>
            <p style={{ color: 'var(--gray-400)', fontSize: '13px', marginBottom: '24px' }}>
              How customers can reach you
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Email Address <span>*</span></label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="form-input"
                  placeholder="info@example.com"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  value={settings.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="form-input"
                  placeholder="+92 300 1234567"
                />
              </div>

              <div className="form-group">
                <label className="form-label">WhatsApp Number <span>*</span></label>
                <input
                  type="tel"
                  value={settings.whatsapp}
                  onChange={(e) => handleChange('whatsapp', e.target.value)}
                  className="form-input"
                  placeholder="923001234567"
                />
                <p style={{ fontSize: '12px', color: 'var(--gray-600)', marginTop: '6px' }}>
                  Without + or spaces. Example: 923001234567
                </p>
              </div>

              <div className="form-group">
                <label className="form-label">Working Hours</label>
                <input
                  type="text"
                  value={settings.workingHours}
                  onChange={(e) => handleChange('workingHours', e.target.value)}
                  className="form-input"
                  placeholder="Mon-Sat: 9:00 AM - 8:00 PM"
                />
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Address</label>
                <textarea
                  value={settings.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  className="form-textarea"
                  rows="2"
                  placeholder="City, Country"
                />
              </div>
            </div>

            {/* Preview */}
            <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '12px' }}>
              <div style={{ fontSize: '12px', color: 'var(--gold)', marginBottom: '8px', fontWeight: 600 }}>
                <i className="fa-solid fa-eye"></i> Preview (as shown on Contact page)
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
                <div><i className="fa-brands fa-whatsapp" style={{ color: 'var(--gold)', marginRight: '8px' }}></i>{settings.whatsapp || 'Not set'}</div>
                <div><i className="fa-solid fa-envelope" style={{ color: 'var(--gold)', marginRight: '8px' }}></i>{settings.email || 'Not set'}</div>
                <div><i className="fa-solid fa-location-dot" style={{ color: 'var(--gold)', marginRight: '8px' }}></i>{settings.address || 'Not set'}</div>
              </div>
            </div>
          </div>
        )}

        {/* SOCIAL TAB */}
        {activeTab === 'social' && (
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', marginBottom: '8px' }}>
              <i className="fa-solid fa-share-nodes" style={{ color: 'var(--gold)', marginRight: '10px' }}></i>
              Social Media Links
            </h2>
            <p style={{ color: 'var(--gray-400)', fontSize: '13px', marginBottom: '24px' }}>
              Connect your social profiles
            </p>

            <div className="form-group">
              <label className="form-label">
                <i className="fa-brands fa-facebook" style={{ color: '#1877f2', marginRight: '8px' }}></i>
                Facebook URL
              </label>
              <input
                type="url"
                value={settings.facebook}
                onChange={(e) => handleChange('facebook', e.target.value)}
                className="form-input"
                placeholder="https://facebook.com/yourpage"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <i className="fa-brands fa-instagram" style={{ color: '#e4405f', marginRight: '8px' }}></i>
                Instagram URL
              </label>
              <input
                type="url"
                value={settings.instagram}
                onChange={(e) => handleChange('instagram', e.target.value)}
                className="form-input"
                placeholder="https://instagram.com/youraccount"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <i className="fa-brands fa-tiktok" style={{ color: 'var(--gray-100)', marginRight: '8px' }}></i>
                TikTok URL
              </label>
              <input
                type="url"
                value={settings.tiktok}
                onChange={(e) => handleChange('tiktok', e.target.value)}
                className="form-input"
                placeholder="https://tiktok.com/@youraccount"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <i className="fa-brands fa-youtube" style={{ color: '#ff0000', marginRight: '8px' }}></i>
                YouTube URL
              </label>
              <input
                type="url"
                value={settings.youtube}
                onChange={(e) => handleChange('youtube', e.target.value)}
                className="form-input"
                placeholder="https://youtube.com/@yourchannel"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <i className="fa-brands fa-linkedin" style={{ color: '#0077b5', marginRight: '8px' }}></i>
                LinkedIn URL (optional)
              </label>
              <input
                type="url"
                value={settings.linkedin}
                onChange={(e) => handleChange('linkedin', e.target.value)}
                className="form-input"
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <i className="fa-brands fa-twitter" style={{ color: '#1da1f2', marginRight: '8px' }}></i>
                Twitter / X URL (optional)
              </label>
              <input
                type="url"
                value={settings.twitter}
                onChange={(e) => handleChange('twitter', e.target.value)}
                className="form-input"
                placeholder="https://twitter.com/youraccount"
              />
            </div>
          </div>
        )}

        {/* SEO TAB */}
        {activeTab === 'seo' && (
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', marginBottom: '8px' }}>
              <i className="fa-solid fa-magnifying-glass" style={{ color: 'var(--gold)', marginRight: '10px' }}></i>
              SEO Settings
            </h2>
            <p style={{ color: 'var(--gray-400)', fontSize: '13px', marginBottom: '24px' }}>
              Optimize for search engines
            </p>

            <div className="form-group">
              <label className="form-label">Meta Title</label>
              <input
                type="text"
                value={settings.metaTitle}
                onChange={(e) => handleChange('metaTitle', e.target.value)}
                className="form-input"
                maxLength="60"
              />
              <p style={{ fontSize: '12px', color: settings.metaTitle.length > 60 ? 'var(--danger)' : 'var(--gray-600)', marginTop: '6px' }}>
                {settings.metaTitle.length}/60 characters
              </p>
            </div>

            <div className="form-group">
              <label className="form-label">Meta Description</label>
              <textarea
                value={settings.metaDescription}
                onChange={(e) => handleChange('metaDescription', e.target.value)}
                className="form-textarea"
                rows="3"
                maxLength="160"
              />
              <p style={{ fontSize: '12px', color: settings.metaDescription.length > 160 ? 'var(--danger)' : 'var(--gray-600)', marginTop: '6px' }}>
                {settings.metaDescription.length}/160 characters
              </p>
            </div>

            <div className="form-group">
              <label className="form-label">Meta Keywords</label>
              <input
                type="text"
                value={settings.metaKeywords}
                onChange={(e) => handleChange('metaKeywords', e.target.value)}
                className="form-input"
                placeholder="keyword1, keyword2, keyword3"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Google Analytics ID</label>
              <input
                type="text"
                value={settings.googleAnalyticsId}
                onChange={(e) => handleChange('googleAnalyticsId', e.target.value)}
                className="form-input"
                placeholder="G-XXXXXXXXXX"
              />
              <p style={{ fontSize: '12px', color: 'var(--gray-600)', marginTop: '6px' }}>
                Find this in your Google Analytics dashboard
              </p>
            </div>

            {/* Google Preview */}
            <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
              <div style={{ fontSize: '12px', color: 'var(--gold)', marginBottom: '12px', fontWeight: 600 }}>
                <i className="fa-brands fa-google"></i> Google Search Preview
              </div>
              <div style={{ background: 'white', padding: '16px', borderRadius: '8px', color: '#333' }}>
                <div style={{ fontSize: '14px', color: '#1a0dab', marginBottom: '4px' }}>
                  {settings.metaTitle || 'Your Page Title'}
                </div>
                <div style={{ fontSize: '12px', color: '#006621', marginBottom: '4px' }}>
                  alihamzadigital.com
                </div>
                <div style={{ fontSize: '13px', color: '#545454', lineHeight: 1.4 }}>
                  {settings.metaDescription || 'Your meta description will appear here...'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PAYMENT TAB */}
        {activeTab === 'payment' && (
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', marginBottom: '8px' }}>
              <i className="fa-solid fa-credit-card" style={{ color: 'var(--gold)', marginRight: '10px' }}></i>
              Payment Information
            </h2>
            <p style={{ color: 'var(--gray-400)', fontSize: '13px', marginBottom: '24px' }}>
              Bank account and mobile payment details for clients
            </p>

            <h3 style={{ fontSize: '14px', color: 'var(--gold)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              <i className="fa-solid fa-building-columns"></i> Bank Account
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Bank Name</label>
                <input
                  type="text"
                  value={settings.bankName}
                  onChange={(e) => handleChange('bankName', e.target.value)}
                  className="form-input"
                  placeholder="HBL, UBL, Meezan..."
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Account Title</label>
                <input
                  type="text"
                  value={settings.accountTitle}
                  onChange={(e) => handleChange('accountTitle', e.target.value)}
                  className="form-input"
                  placeholder="Ali Hamza"
                />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1', marginBottom: 0 }}>
                <label className="form-label">Account Number / IBAN</label>
                <input
                  type="text"
                  value={settings.accountNumber}
                  onChange={(e) => handleChange('accountNumber', e.target.value)}
                  className="form-input"
                  placeholder="PK00XXXX0000000000000000"
                />
              </div>
            </div>

            <h3 style={{ fontSize: '14px', color: 'var(--gold)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              <i className="fa-solid fa-mobile-screen"></i> Mobile Wallets
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">
                  <span style={{ color: '#d42a2a', marginRight: '6px' }}>●</span> JazzCash Number
                </label>
                <input
                  type="text"
                  value={settings.jazzcash}
                  onChange={(e) => handleChange('jazzcash', e.target.value)}
                  className="form-input"
                  placeholder="03001234567"
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">
                  <span style={{ color: '#00a651', marginRight: '6px' }}>●</span> EasyPaisa Number
                </label>
                <input
                  type="text"
                  value={settings.easypaisa}
                  onChange={(e) => handleChange('easypaisa', e.target.value)}
                  className="form-input"
                  placeholder="03001234567"
                />
              </div>
            </div>
          </div>
        )}

        {/* ADVANCED TAB */}
        {activeTab === 'advanced' && (
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', marginBottom: '8px' }}>
              <i className="fa-solid fa-shield-halved" style={{ color: 'var(--gold)', marginRight: '10px' }}></i>
              Advanced Settings
            </h2>
            <p style={{ color: 'var(--gray-400)', fontSize: '13px', marginBottom: '24px' }}>
              Backup, restore, and other maintenance
            </p>

            {/* Backup */}
            <div style={{ padding: '20px', background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '12px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: '4px' }}>
                    <i className="fa-solid fa-download" style={{ color: '#3b82f6', marginRight: '8px' }}></i>
                    Export Settings
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--gray-400)' }}>
                    Download all settings as JSON backup
                  </div>
                </div>
                <button className="btn btn-outline btn-sm" onClick={handleExport}>
                  <i className="fa-solid fa-download"></i> Export
                </button>
              </div>
            </div>

            {/* Import */}
            <div style={{ padding: '20px', background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '12px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: '4px' }}>
                    <i className="fa-solid fa-upload" style={{ color: 'var(--success)', marginRight: '8px' }}></i>
                    Import Settings
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--gray-400)' }}>
                    Restore settings from a JSON backup file
                  </div>
                </div>
                <label className="btn btn-outline btn-sm" style={{ cursor: 'pointer' }}>
                  <i className="fa-solid fa-upload"></i> Import
                  <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
                </label>
              </div>
            </div>

            {/* Reset */}
            <div style={{ padding: '20px', background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '12px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: '4px' }}>
                    <i className="fa-solid fa-trash" style={{ color: 'var(--danger)', marginRight: '8px' }}></i>
                    Reset to Default
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--gray-400)' }}>
                    Reset all settings to default values. This cannot be undone.
                  </div>
                </div>
                <button className="btn btn-sm" onClick={handleReset} style={{ background: 'var(--danger)', color: 'white' }}>
                  <i className="fa-solid fa-refresh"></i> Reset
                </button>
              </div>
            </div>

            {/* System Info */}
            <div style={{ padding: '16px', background: 'rgba(0,0,0,0.3)', borderRadius: '12px' }}>
              <h3 style={{ fontSize: '14px', color: 'var(--gold)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                <i className="fa-solid fa-info-circle"></i> System Info
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '13px' }}>
                <div style={{ color: 'var(--gray-400)' }}>Version:</div>
                <div>1.0.0</div>
                <div style={{ color: 'var(--gray-400)' }}>Environment:</div>
                <div>Development</div>
                <div style={{ color: 'var(--gray-400)' }}>Storage:</div>
                <div>Browser LocalStorage</div>
                <div style={{ color: 'var(--gray-400)' }}>Last Saved:</div>
                <div>{localStorage.getItem('siteSettings') ? 'Yes' : 'Never'}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Save Button (Mobile) */}
      {hasChanges && (
        <div style={{ position: 'sticky', bottom: '20px', marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <button className="btn btn-gold" onClick={handleSave} disabled={saving}>
            {saving ? (
              <><i className="fa-solid fa-spinner fa-spin"></i> Saving...</>
            ) : (
              <><i className="fa-solid fa-save"></i> Save Changes</>
            )}
          </button>
        </div>
      )}
    </div>
  );
}