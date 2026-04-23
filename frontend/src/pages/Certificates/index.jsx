import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Award, FileText, Download, Plus, Search } from 'lucide-react';
import { pdf } from '@react-pdf/renderer';
import api from '../../utils/api';
import CertificatePdf from '../../pdf/CertificatePdf';
import ReportCardPdf from '../../pdf/ReportCardPdf';
import { downloadBlob } from '../../pdf/download';

const decodeBase64Url = (value) => {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const padLength = (4 - (base64.length % 4)) % 4;
  const padded = base64 + '='.repeat(padLength);
  return atob(padded);
};

const getTokenSchoolId = () => {
  const token = localStorage.getItem('authToken');
  if (!token) return undefined;
  const parts = token.split('.');
  if (parts.length < 2) return undefined;
  try {
    const payload = JSON.parse(decodeBase64Url(parts[1]));
    return payload?.schoolId ? String(payload.schoolId) : undefined;
  } catch {
    return undefined;
  }
};

const Certificates = () => {
  const { currentUser } = useOutletContext();
  const tokenSchoolId = getTokenSchoolId();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Admin only
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    studentId: '',
    type: 'PROGRESS_CARD',
    remarks: ''
  });

  const canManage = ['admin', 'staff'].includes(currentUser?.role);

  const CERT_TYPES = [
    { value: 'TC', label: 'Transfer Certificate (TC)' },
    { value: 'PROGRESS_CARD', label: 'Progress Card' },
    { value: 'MEDICAL', label: 'Medical Certificate' },
    { value: 'MIGRATION', label: 'Migration Certificate' },
    { value: 'REPORT_CARD', label: 'Report Card' }
  ];

  useEffect(() => {
    fetchCertificates();
    if (canManage) {
      fetchStudents();
    }
  }, []);

  useEffect(() => {
    if (!canManage) return;
    if (formData.studentId) return;
    if (!students.length) return;
    setFormData((f) => ({ ...f, studentId: students[0].id }));
  }, [canManage, students, formData.studentId]);

  const fetchCertificates = async () => {
    try {
      const response = await api.get('/certificates');
      setCertificates(response.data);
    } catch (error) {
      console.error('Failed to fetch certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const params = {};
      if (currentUser?.role === 'admin' && tokenSchoolId) {
        params.schoolId = tokenSchoolId;
      }
      const response = await api.get('/students', { params });
      setStudents(response.data);
    } catch (error) {
      console.error('Failed to fetch students');
    }
  };

  const handleIssue = async (e) => {
    e.preventDefault();
    try {
      await api.post('/certificates', {
        ...formData,
        metadata: { remarks: formData.remarks, generalComment: formData.remarks }
      });
      setShowIssueModal(false);
      fetchCertificates();
      alert('Certificate issued successfully!');
    } catch (error) {
      const message = error?.response?.data?.error || 'Failed to issue certificate';
      alert(message);
    }
  };

  const filteredStudents = students.filter((s) => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;
    return `${s.firstName || ''} ${s.lastName || ''} ${s.email || ''} ${s.phone || ''} ${s.rollNumber || ''}`
      .toLowerCase()
      .includes(term);
  });

  const getCertificateColor = (type) => {
    const colors = {
      TC: 'bg-red-50 text-red-700 border-red-200',
      PROGRESS_CARD: 'bg-sidebar-bg-2/15 text-sidebar-bg border-sidebar-bg-2/30',
      MEDICAL: 'bg-green-50 text-green-700 border-green-200',
      MIGRATION: 'bg-brand-50 text-brand-800 border-brand-200',
      REPORT_CARD: 'bg-brand-50 text-brand-800 border-brand-200'
    };
    return colors[type] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const downloadCertificatePdf = async (cert) => {
    const label = CERT_TYPES.find((t) => t.value === cert.type)?.label || cert.type;
    const studentName = `${cert.student?.user?.firstName || ''} ${cert.student?.user?.lastName || ''}`.trim();
    const reference = cert.referenceNumber || cert.id;
    const remarks = cert.metadata?.remarks || '';
    const issuerName = cert.issuer ? `${cert.issuer.firstName} ${cert.issuer.lastName}`.trim() : '';
    const schoolName = cert.school?.name || '';
    const logoUrl = `${window.location.origin}/systemlogo.jpg`;

    if (cert.type === 'REPORT_CARD') {
      const { data } = await api.get(`/certificates/${cert.id}/report-card-data`);
      const doc = (
        <ReportCardPdf
          schoolName={data?.certificate?.schoolName || schoolName}
          logoUrl={logoUrl}
          referenceNumber={data?.certificate?.referenceNumber || reference}
          issuedAt={data?.certificate?.issuedAt || cert.issuedAt}
          issuerName={data?.certificate?.issuerName || issuerName}
          studentName={data?.certificate?.studentName || studentName}
          className={data?.certificate?.className || ''}
          comment={data?.certificate?.comment || ''}
          subjects={data?.subjects || []}
        />
      );
      const blob = await pdf(doc).toBlob();
      const safeRef = String(reference || 'download').replace(/[^a-zA-Z0-9_-]+/g, '-').slice(0, 60);
      downloadBlob(blob, `report-card-${safeRef}.pdf`);
      return;
    }

    const doc = (
      <CertificatePdf
        typeLabel={label}
        typeCode={cert.type}
        referenceNumber={reference}
        issuedAt={cert.issuedAt}
        studentName={studentName}
        remarks={remarks}
        issuerName={issuerName}
        schoolName={schoolName}
        logoUrl={logoUrl}
      />
    );

    const blob = await pdf(doc).toBlob();
    const safeRef = String(reference || 'download').replace(/[^a-zA-Z0-9_-]+/g, '-').slice(0, 60);
    const safeLabel = String(label || 'certificate').replace(/[^a-zA-Z0-9_-]+/g, '-').slice(0, 60);
    downloadBlob(blob, `${safeLabel}-${safeRef}.pdf`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Certificates & Documents</h1>
          <p className="text-gray-500">Access and manage official school documents</p>
        </div>
        {canManage && (
          <button
            onClick={() => setShowIssueModal(true)}
            className="ui-btn ui-btn-primary"
          >
            <Plus size={20} /> Issue Certificate
          </button>
        )}
      </div>

      {showIssueModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="ui-card max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Issue New Certificate</h2>
            <form onSubmit={handleIssue} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Certificate Type</label>
                <select
                  required
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="ui-input"
                >
                  {CERT_TYPES.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Student</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search student..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="ui-input pl-8 mb-2"
                  />
                  <Search size={16} className="absolute top-3 left-2.5 text-gray-400" />
                </div>
                <select
                  required
                  value={formData.studentId}
                  onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                  className="w-full border rounded-lg p-2 bg-white"
                >
                  <option value="" disabled>
                    Select student
                  </option>
                  {filteredStudents.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.firstName} {s.lastName} ({s.rollNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  {formData.type === 'REPORT_CARD' ? 'General Comment' : 'Remarks / Details'}
                </label>
                <textarea
                  value={formData.remarks}
                  onChange={(e) => setFormData({...formData, remarks: e.target.value})}
                  className="ui-textarea"
                  rows={3}
                  placeholder="Additional details to appear on certificate..."
                />
              </div>
              
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowIssueModal(false)}
                  className="ui-btn ui-btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="ui-btn ui-btn-primary"
                >
                  Issue Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map(cert => (
          <div key={cert.id} className="bg-white rounded-xl shadow-sm border p-6 relative overflow-hidden group">
            <div className={`absolute top-0 right-0 px-3 py-1 text-xs font-bold rounded-bl-lg border-b border-l ${getCertificateColor(cert.type)}`}>
              {(CERT_TYPES.find((t) => t.value === cert.type)?.label || String(cert.type)).toUpperCase()}
            </div>
            
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-gray-100 rounded-lg">
                <Award size={32} className="text-brand-700" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">
                  {CERT_TYPES.find(t => t.value === cert.type)?.label || cert.type}
                </h3>
                <p className="text-sm text-gray-500">Ref: {cert.referenceNumber}</p>
              </div>
            </div>

            <div className="space-y-2 text-sm text-gray-600 mb-6">
              <div className="flex justify-between">
                <span>Issued To:</span>
                <span className="font-medium text-gray-900">
                  {cert.student?.user?.firstName} {cert.student?.user?.lastName}
                </span>
              </div>
              {cert.issuer && (
                <div className="flex justify-between">
                  <span>Issued By:</span>
                  <span className="font-medium text-gray-900">
                    {cert.issuer.firstName} {cert.issuer.lastName}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Date:</span>
                <span className="font-medium">
                  {new Date(cert.issuedAt).toLocaleDateString()}
                </span>
              </div>
              {cert.metadata?.remarks && (
                <div className="pt-2 border-t mt-2">
                  <span className="block text-xs text-gray-400 mb-1">Remarks:</span>
                  <p className="italic">{cert.metadata.remarks}</p>
                </div>
              )}
            </div>

            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 py-2 border border-brand-600 text-brand-700 rounded-lg hover:bg-brand-50 transition-colors font-semibold"
              onClick={async () => {
                try {
                  await downloadCertificatePdf(cert);
                } catch (e) {
                  console.error(e);
                  alert('Failed to generate PDF');
                }
              }}
            >
              <Download size={18} /> Download PDF
            </button>
          </div>
        ))}

        {certificates.length === 0 && (
          <div className="col-span-full text-center py-12 bg-gray-50 rounded-xl border border-dashed">
            <FileText size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium">No certificates issued yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Certificates;
