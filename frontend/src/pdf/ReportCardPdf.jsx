import React from 'react';
import { Document, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 36,
    paddingHorizontal: 36,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#0f172a',
  },
  watermark: {
    position: 'absolute',
    top: 340,
    left: 40,
    opacity: 0.08,
    fontSize: 64,
    fontWeight: 700,
    transform: 'rotate(-25deg)',
    color: '#0f172a',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  brandLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#0a93a7',
    borderWidth: 1,
    borderColor: '#032d36',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logo: {
    width: 34,
    height: 34,
    objectFit: 'cover',
    borderRadius: 12,
  },
  brand: {
    fontSize: 16,
    fontWeight: 700,
    letterSpacing: 1,
  },
  title: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: 700,
  },
  muted: {
    marginTop: 2,
    color: '#64748b',
  },
  chip: {
    fontSize: 10,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    color: '#334155',
  },
  table: {
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  th: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    fontSize: 9,
    color: '#475569',
    fontWeight: 700,
  },
  tr: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  td: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    color: '#0f172a',
  },
  right: {
    textAlign: 'right',
  },
  footer: {
    marginTop: 18,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    color: '#64748b',
    fontSize: 9,
  },
  commentBox: {
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#ffffff',
  },
  commentTitle: {
    fontSize: 9,
    fontWeight: 700,
    color: '#475569',
  },
});

export default function ReportCardPdf({
  schoolName,
  logoUrl,
  referenceNumber,
  issuedAt,
  issuerName,
  studentName,
  className,
  comment,
  subjects,
}) {
  const issuedDate = issuedAt ? new Date(issuedAt).toLocaleDateString() : '';
  const rows = Array.isArray(subjects) ? subjects : [];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.watermark}>{schoolName || 'EDUSYNC'}</Text>

        <View style={styles.headerRow}>
          <View>
            <View style={styles.brandLeft}>
              <View style={styles.logoWrap}>
                {logoUrl ? <Image src={logoUrl} style={styles.logo} /> : null}
              </View>
              <View>
                <Text style={styles.brand}>{schoolName || 'EDUSYNC'}</Text>
                <Text style={styles.muted}>Report Card</Text>
              </View>
            </View>
            <Text style={styles.title}>Academic Report</Text>
            <Text style={styles.muted}>Student: {studentName || '-'}</Text>
            {className ? <Text style={styles.muted}>Class: {className}</Text> : null}
            {issuerName ? <Text style={styles.muted}>Issued by: {issuerName}</Text> : null}
            <Text style={styles.muted}>Issued date: {issuedDate || '-'}</Text>
          </View>
          <View>
            <Text style={styles.chip}>Ref: {referenceNumber || '-'}</Text>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.th, { width: '55%' }]}>Subject</Text>
            <Text style={[styles.th, styles.right, { width: '25%' }]}>Score</Text>
            <Text style={[styles.th, styles.right, { width: '20%' }]}>Grade</Text>
          </View>
          {rows.length === 0 ? (
            <View style={styles.tr}>
              <Text style={[styles.td, { width: '100%', color: '#64748b' }]}>
                No subjects found for the student’s class.
              </Text>
            </View>
          ) : (
            rows.map((r, idx) => (
              <View key={String(r.subjectId || idx)} style={styles.tr}>
                <Text style={[styles.td, { width: '55%' }]}>{r.subjectName || '-'}</Text>
                <Text style={[styles.td, styles.right, { width: '25%' }]}>
                  {r.score === null || r.score === undefined ? '-' : String(r.score)}
                </Text>
                <Text style={[styles.td, styles.right, { width: '20%' }]}>{r.grade || '-'}</Text>
              </View>
            ))
          )}
        </View>

        <View style={styles.commentBox}>
          <Text style={styles.commentTitle}>General Comment</Text>
          <Text style={{ marginTop: 6 }}>{comment || '-'}</Text>
        </View>

        <Text style={styles.footer}>
          This report card is generated electronically. Verify the reference number with the issuing institution if
          required.
        </Text>
      </Page>
    </Document>
  );
}

