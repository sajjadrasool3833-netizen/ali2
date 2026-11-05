import { useEffect, useState } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext.jsx';

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState('list');
  const { success, error } = useToast();

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/contact');
      setMessages(data);
    } catch (err) {
      error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await api.put(`/contact/${id}/read`);
      fetchMessages();
    } catch (err) {
      error('Failed to update');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message? This cannot be undone.')) return;
    try {
      await api.delete(`/contact/${id}`);
      success('Message deleted');
      if (selectedMessage?._id === id) setSelectedMessage(null);
      fetchMessages();
    } catch (err) {
      error('Failed to delete');
    }
  };

  const handleOpenMessage = (msg) => {
    setSelectedMessage(msg);
    if (!msg.read) {
      handleMarkRead(msg._id);
    }
  };

  const handleWhatsAppReply = (msg) => {
    if (!msg.phone) {
      error('No phone number available');
      return;
    }
    const phone = msg.phone.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(`Assalam-o-Alaikum ${msg.name}! Thanks for contacting Ali Hamza Digital Hub. I received your message about "${msg.subject}". How can I help you?`);
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  const handleEmailReply = (msg) => {
    if (!msg.email) {
      error('No email available');
      return;
    }
    const subject = encodeURIComponent(`Re: ${msg.subject}`);
    const body = encodeURIComponent(`Hi ${msg.name},\n\nThank you for reaching out to Ali Hamza Digital Hub. Regarding your message: "${msg.subject}"\n\n[Write your reply here]\n\nBest regards,\nAli Hamza\nAli Hamza Digital Hub`);
    window.open(`mailto:${msg.email}?subject=${subject}&body=${body}`);
  };

  const handleCopyEmail = (email) => {
    navigator.clipboard.writeText(email);
    success('Email copied!');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hr ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  const filteredMessages = messages.filter((m) => {
    const matchesSearch =
      m.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.message?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'unread' && !m.read) ||
      (filterStatus === 'read' && m.read);
    return matchesSearch && matchesStatus;
  });

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div>
      {/* Header */}
      <div className="admin-header">
        <h1>Messages Inbox</h1>
        <button className="btn btn-outline" onClick={fetchMessages}>
          <i className="fa-solid fa-refresh"></i> Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="admin-stats" style={{ marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="label"><i className="fa-solid fa-envelope" style={{ color: 'var(--gold)', marginRight: '8px' }}></i>Total Messages</div>
          <div className="value">{messages.length}</div>
        </div>
        <div className="stat-card">
          <div className="label"><i className="fa-solid fa-envelope-open" style={{ color: 'var(--gold)', marginRight: '8px' }}></i>Unread</div>
          <div className="value" style={{ color: unreadCount > 0 ? 'var(--gold)' : 'var(--gray-400)' }}>
            {unreadCount}
          </div>
        </div>
        <div className="stat-card">
          <div className="label"><i className="fa-solid fa-check-circle" style={{ color: 'var(--gold)', marginRight: '8px' }}></i>Read</div>
          <div className="value">{messages.filter((m) => m.read).length}</div>
        </div>
        <div className="stat-card">
          <div className="label"><i className="fa-solid fa-calendar" style={{ color: 'var(--gold)', marginRight: '8px' }}></i>Today</div>
          <div className="value">
            {messages.filter((m) => {
              const today = new Date().toDateString();
              return new Date(m.createdAt).toDateString() === today;
            }).length}
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="card" style={{ padding: '16px', marginBottom: '24px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
          <i className="fa-solid fa-search" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }}></i>
          <input
            type="text"
            placeholder="Search by name, email, or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '44px' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '4px', background: 'rgba(0,0,0,0.3)', padding: '4px', borderRadius: '8px' }}>
          {[
            { key: 'all', label: 'All', count: messages.length },
            { key: 'unread', label: 'Unread', count: unreadCount },
            { key: 'read', label: 'Read', count: messages.filter((m) => m.read).length },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilterStatus(tab.key)}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                background: filterStatus === tab.key ? 'var(--gold)' : 'transparent',
                color: filterStatus === tab.key ? 'var(--navy)' : 'var(--gray-400)',
                fontSize: '13px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              {tab.label}
              <span style={{
                background: filterStatus === tab.key ? 'rgba(10,17,40,0.2)' : 'rgba(212,175,55,0.2)',
                padding: '1px 6px',
                borderRadius: '8px',
                fontSize: '11px',
              }}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="card" style={{ padding: '48px', textAlign: 'center' }}>Loading...</div>
      ) : filteredMessages.length === 0 ? (
        <div className="card" style={{ padding: '48px', textAlign: 'center' }}>
          <i className="fa-solid fa-inbox" style={{ fontSize: '48px', color: 'var(--gray-600)', marginBottom: '16px' }}></i>
          <p style={{ color: 'var(--gray-400)' }}>
            {messages.length === 0 ? 'No messages yet.' : 'No messages match your filters.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: selectedMessage ? '1fr 1.2fr' : '1fr', gap: '20px' }}>
          {/* Messages List */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ maxHeight: 'calc(100vh - 400px)', overflowY: 'auto' }}>
              {filteredMessages.map((msg) => (
                <div
                  key={msg._id}
                  onClick={() => handleOpenMessage(msg)}
                  style={{
                    padding: '16px 20px',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    cursor: 'pointer',
                    background: selectedMessage?._id === msg._id ? 'rgba(212,175,55,0.1)' : 'transparent',
                    borderLeft: selectedMessage?._id === msg._id ? '3px solid var(--gold)' : '3px solid transparent',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    if (selectedMessage?._id !== msg._id) {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedMessage?._id !== msg._id) {
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    {/* Avatar */}
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        background: `hsl(${(msg.name.charCodeAt(0) * 137) % 360}, 50%, 40%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 700,
                        fontSize: '14px',
                        flexShrink: 0,
                      }}
                    >
                      {msg.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: msg.read ? 500 : 700, fontSize: '14px' }}>{msg.name}</span>
                          {!msg.read && (
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--gold)', flexShrink: 0 }}></span>
                          )}
                        </div>
                        <span style={{ fontSize: '11px', color: 'var(--gray-600)', whiteSpace: 'nowrap' }}>
                          {formatDate(msg.createdAt)}
                        </span>
                      </div>
                      <div style={{ fontSize: '13px', color: 'var(--gold)', marginBottom: '4px', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {msg.subject}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--gray-400)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {msg.message}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Message Detail */}
          {selectedMessage && (
            <div className="card" style={{ padding: '28px', height: 'fit-content', position: 'sticky', top: '20px' }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid rgba(212,175,55,0.15)' }}>
                <div>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', marginBottom: '4px' }}>
                    {selectedMessage.subject}
                  </h2>
                  <p style={{ fontSize: '12px', color: 'var(--gray-400)' }}>
                    From {selectedMessage.name} • {new Date(selectedMessage.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedMessage(null)}
                  style={{ fontSize: '20px', color: 'var(--gray-400)', padding: '4px' }}
                >
                  <i className="fa-solid fa-times"></i>
                </button>
              </div>

              {/* Sender Info */}
              <div style={{ marginBottom: '20px', padding: '16px', background: 'rgba(0,0,0,0.3)', borderRadius: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '50%',
                      background: `hsl(${(selectedMessage.name.charCodeAt(0) * 137) % 360}, 50%, 40%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '18px',
                    }}
                  >
                    {selectedMessage.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '15px' }}>{selectedMessage.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--gray-400)' }}>Contact Form Submission</div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                    <i className="fa-solid fa-envelope" style={{ color: 'var(--gold)', width: '16px' }}></i>
                    <span style={{ flex: 1, wordBreak: 'break-all' }}>{selectedMessage.email}</span>
                    <button
                      onClick={() => handleCopyEmail(selectedMessage.email)}
                      style={{ color: 'var(--gray-400)', padding: '4px' }}
                      title="Copy email"
                    >
                      <i className="fa-solid fa-copy" style={{ fontSize: '12px' }}></i>
                    </button>
                  </div>
                  {selectedMessage.phone && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                      <i className="fa-solid fa-phone" style={{ color: 'var(--gold)', width: '16px' }}></i>
                      <span>{selectedMessage.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Message Body */}
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--gray-400)', marginBottom: '10px' }}>
                  <i className="fa-solid fa-comment"></i> Message
                </h3>
                <div style={{ padding: '16px', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', color: 'var(--gray-100)', lineHeight: 1.7, fontSize: '14px', whiteSpace: 'pre-wrap' }}>
                  {selectedMessage.message}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {selectedMessage.phone && (
                  <button
                    onClick={() => handleWhatsAppReply(selectedMessage)}
                    className="btn btn-sm"
                    style={{ background: '#25d366', color: 'white', flex: 1, minWidth: '120px' }}
                  >
                    <i className="fa-brands fa-whatsapp"></i> Reply via WhatsApp
                  </button>
                )}
                <button
                  onClick={() => handleEmailReply(selectedMessage)}
                  className="btn btn-gold btn-sm"
                  style={{ flex: 1, minWidth: '120px' }}
                >
                  <i className="fa-solid fa-reply"></i> Reply via Email
                </button>
                <button
                  onClick={() => handleDelete(selectedMessage._id)}
                  className="btn btn-sm"
                  style={{ background: 'rgba(239,68,68,0.15)', color: 'var(--danger)', padding: '8px 14px' }}
                  title="Delete"
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
              </div>

              {/* Status */}
              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'var(--gray-400)' }}>
                <span>
                  <i className={`fa-solid ${selectedMessage.read ? 'fa-envelope-open' : 'fa-envelope'}`} style={{ color: 'var(--gold)', marginRight: '6px' }}></i>
                  {selectedMessage.read ? 'Read' : 'Unread'}
                </span>
                <span>{new Date(selectedMessage.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}