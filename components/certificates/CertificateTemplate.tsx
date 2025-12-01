import React from 'react'
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer'
import fs from 'fs'
import path from 'path'

const fontDir = path.join(process.cwd(), 'public', 'fonts')
const regularFontPath = path.join(fontDir, 'NotoSans-Regular.ttf')
const boldFontPath = path.join(fontDir, 'NotoSans-Bold.ttf')

let PRIMARY_FONT_FAMILY = 'Helvetica'

// Пытаемся подключить NotoSans, если валидные файлы реально есть; иначе используем встроенную Helvetica.
try {
  if (fs.existsSync(regularFontPath) && fs.existsSync(boldFontPath)) {
    Font.register({
      family: 'PTSRSans',
      fonts: [
        { src: regularFontPath, fontWeight: 400 },
        { src: boldFontPath, fontWeight: 700 },
      ],
    })
    PRIMARY_FONT_FAMILY = 'PTSRSans'
  }
} catch (err) {
  PRIMARY_FONT_FAMILY = 'Helvetica'
  console.warn('Falling back to default PDF font. To use custom Cyrillic font, place valid NotoSans *.ttf in public/fonts.', err)
}

// Стили для PDF
const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    padding: 50,
    fontFamily: PRIMARY_FONT_FAMILY,
  },
  container: {
    border: '6px solid #0d9488',
    padding: 32,
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  brandBlock: {
    width: '30%',
    gap: 4,
  },
  brandTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0d9488',
  },
  brandSubtitle: {
    fontSize: 10,
    color: '#64748b',
  },
  certBlock: {
    width: '40%',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0d9488',
    letterSpacing: 3,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 12,
    color: '#475569',
    textAlign: 'center',
    marginTop: 6,
  },
  metaBlock: {
    width: '30%',
    alignItems: 'flex-end',
    gap: 4,
  },
  metaLabel: {
    fontSize: 10,
    color: '#94a3b8',
  },
  metaValue: {
    fontSize: 12,
    color: '#0f172a',
    fontWeight: 'bold',
  },
  section: {
    alignItems: 'center',
    textAlign: 'center',
    gap: 8,
  },
  textCenter: {
    fontSize: 12,
    color: '#475569',
  },
  userName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0f172a',
    marginVertical: 6,
  },
  courseName: {
    fontSize: 18,
    color: '#0d9488',
    fontWeight: 'bold',
    marginTop: 4,
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTop: '1pt solid #e2e8f0',
    borderBottom: '1pt solid #e2e8f0',
    paddingVertical: 12,
    marginTop: 10,
  },
  infoItem: {
    width: '32%',
    gap: 4,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 10,
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 8,
  },
  footerSection: {
    width: '45%',
  },
  signature: {
    fontSize: 12,
    color: '#0f172a',
    fontWeight: 'bold',
    borderTop: '1pt solid #0d9488',
    paddingTop: 6,
    marginTop: 12,
    textAlign: 'left',
  },
  label: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 4,
  },
})

interface CertificateTemplateProps {
  userName: string
  courseName: string
  completionDate: string
  certificateId: string
  duration: string
  moduleCount: number
}

const CertificateTemplate: React.FC<CertificateTemplateProps> = ({
  userName,
  courseName,
  completionDate,
  certificateId,
  duration,
  moduleCount,
}) => (
  <Document>
    <Page size="A4" orientation="landscape" style={styles.page}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <View style={styles.brandBlock}>
            <Text style={styles.brandTitle}>ПТСР Эксперт</Text>
            <Text style={styles.brandSubtitle}>Образовательная платформа</Text>
          </View>
          <View style={styles.certBlock}>
            <Text style={styles.title}>СЕРТИФИКАТ</Text>
            <Text style={styles.subtitle}>о завершении программы</Text>
          </View>
          <View style={styles.metaBlock}>
            <Text style={styles.metaLabel}>Дата</Text>
            <Text style={styles.metaValue}>{completionDate}</Text>
            <Text style={styles.metaLabel}>ID</Text>
            <Text style={styles.metaValue}>{certificateId}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.textCenter}>Настоящий сертификат подтверждает, что</Text>
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.textCenter}>успешно прошёл(ла) курс</Text>
          <Text style={styles.courseName}>{courseName}</Text>
        </View>

        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Продолжительность</Text>
            <Text style={styles.infoValue}>{duration}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Модулей в курсе</Text>
            <Text style={styles.infoValue}>{moduleCount}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Платформа</Text>
            <Text style={styles.infoValue}>ПТСР Эксперт Онлайн</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.footerSection}>
            <Text style={styles.signature}>ПТСР Эксперт</Text>
            <Text style={styles.label}>Образовательная платформа</Text>
          </View>
          <View style={styles.footerSection}>
            <Text style={styles.signature}>Администрация</Text>
            <Text style={styles.label}>Подпись</Text>
          </View>
        </View>
      </View>
    </Page>
  </Document>
)

export default CertificateTemplate
