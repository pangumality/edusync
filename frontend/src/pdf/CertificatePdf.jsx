import React from 'react';
import { Document, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 36,
    paddingHorizontal: 36,
    fontSize: 11,
    fontFamily: 'Helvetica',
    color: '#0f172a',
  },
  header: {
    marginBottom: 18,
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
  logoWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#1670f2',
    borderWidth: 1,
    borderColor: '#0c2047',
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
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brand: {
    fontSize: 18,
    fontWeight: 700,
    letterSpacing: 1,
  },
  badge: {
    fontSize: 10,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    color: '#334155',
  },
  title: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 700,
  },
  subtle: {
    marginTop: 2,
    color: '#64748b',
  },
  section: {
    marginTop: 14,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#ffffff',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 8,
  },
  key: {
    color: '#475569',
  },
  value: {
    fontWeight: 700,
    color: '#0f172a',
  },
  footer: {
    marginTop: 22,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    color: '#64748b',
    fontSize: 9,
  },
});

export default function CertificatePdf({
  typeLabel,
  typeCode,
  referenceNumber,
  issuedAt,
  studentName,
  remarks,
  issuerName,
  schoolName,
  logoUrl,
}) {
  const issuedDate = issuedAt ? new Date(issuedAt).toLocaleDateString() : '';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.watermark}>{schoolName || 'EDUSYNC'}</Text>
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <View style={styles.brandLeft}>
              <View style={styles.logoWrap}>
                {logoUrl ? <Image src={logoUrl} style={styles.logo} /> : null}
              </View>
              <View>
                <Text style={styles.brand}>{schoolName || 'EDUSYNC'}</Text>
                <Text style={styles.subtle}>Official document</Text>
              </View>
            </View>
            <Text style={styles.badge}>{typeCode || ''}</Text>
          </View>
          <Text style={styles.title}>{typeLabel || 'Certificate'}</Text>
          {issuerName ? <Text style={styles.subtle}>Issued by: {issuerName}</Text> : null}
        </View>

        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.key}>Reference</Text>
            <Text style={styles.value}>{referenceNumber || '-'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.key}>Issued To</Text>
            <Text style={styles.value}>{studentName || '-'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.key}>Issued Date</Text>
            <Text style={styles.value}>{issuedDate || '-'}</Text>
          </View>
          {remarks ? (
            <View style={{ marginTop: 10 }}>
              <Text style={styles.key}>Remarks</Text>
              <Text style={{ marginTop: 4 }}>{remarks}</Text>
            </View>
          ) : null}
        </View>

        <Text style={styles.footer}>
          This PDF is generated electronically for demo purposes. Verify the reference number with the issuing
          institution if required.
        </Text>
      </Page>
    </Document>
  );
}
