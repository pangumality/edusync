import React from 'react';
import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 36,
    paddingHorizontal: 36,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#0f172a',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
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
  cardsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  statCard: {
    flexGrow: 1,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 10,
    backgroundColor: '#ffffff',
  },
  statLabel: {
    color: '#64748b',
    fontSize: 9,
  },
  statValue: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: 700,
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
});

const formatZmw = (value) => `ZMW ${Number(value || 0).toLocaleString('en-ZM')}`;

export default function FinanceStatementPdf({
  studentName,
  studentSection,
  className,
  termLabel,
  feeAmount,
  totalPaidTerm,
  balanceTerm,
  payments,
}) {
  const createdAt = new Date().toLocaleString();
  const rows = Array.isArray(payments) ? payments : [];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.brand}>EDUSYNC</Text>
            <Text style={styles.title}>Fees Statement</Text>
            <Text style={styles.muted}>
              Student: {studentName || '-'} {studentSection ? `· Section: ${studentSection}` : ''}{' '}
              {className ? `· Class: ${className}` : ''}
            </Text>
            <Text style={styles.muted}>Generated: {createdAt}</Text>
          </View>
          <Text style={styles.chip}>{termLabel || 'Term'}</Text>
        </View>

        <View style={styles.cardsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Amount Due (Current Term)</Text>
            <Text style={styles.statValue}>{formatZmw(feeAmount)}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Paid (Current Term)</Text>
            <Text style={styles.statValue}>{formatZmw(totalPaidTerm)}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Balance (Current Term)</Text>
            <Text style={styles.statValue}>{formatZmw(balanceTerm)}</Text>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.th, { width: '20%' }]}>Date</Text>
            <Text style={[styles.th, { width: '15%' }]}>Term</Text>
            <Text style={[styles.th, { width: '20%' }]}>Method</Text>
            <Text style={[styles.th, { width: '25%' }]}>Reference</Text>
            <Text style={[styles.th, styles.right, { width: '20%' }]}>Amount</Text>
          </View>
          {rows.length === 0 ? (
            <View style={styles.tr}>
              <Text style={[styles.td, { width: '100%', color: '#64748b' }]}>No payments recorded</Text>
            </View>
          ) : (
            rows.map((p, idx) => (
              <View key={String(p.id || idx)} style={styles.tr}>
                <Text style={[styles.td, { width: '20%' }]}>{p.date || '-'}</Text>
                <Text style={[styles.td, { width: '15%' }]}>{p.term || '-'}</Text>
                <Text style={[styles.td, { width: '20%' }]}>{p.method || '-'}</Text>
                <Text style={[styles.td, { width: '25%' }]}>{p.reference || '-'}</Text>
                <Text style={[styles.td, styles.right, { width: '20%' }]}>
                  {formatZmw(p.amount)}
                </Text>
              </View>
            ))
          )}
        </View>

        <Text style={styles.footer}>
          This statement is generated electronically. If you suspect an error, contact the school accounts office.
        </Text>
      </Page>
    </Document>
  );
}

