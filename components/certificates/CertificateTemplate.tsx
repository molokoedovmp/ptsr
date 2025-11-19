import React from 'react'
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer'
import path from 'path'
import fs from 'fs'

const PRIMARY_FONT_FAMILY = 'PTSRSans'
const fontDir = path.join(process.cwd(), 'public', 'fonts')
const regularFontPath = path.join(fontDir, 'NotoSans-Regular.ttf')
const boldFontPath = path.join(fontDir, 'NotoSans-Bold.ttf')

let fontsRegistered = false

if (!fontsRegistered) {
  try {
    if (fs.existsSync(regularFontPath) && fs.existsSync(boldFontPath)) {
      Font.register({
        family: PRIMARY_FONT_FAMILY,
        fonts: [
          { src: regularFontPath, fontWeight: 'normal' },
          { src: boldFontPath, fontWeight: 'bold' },
        ],
      })
      fontsRegistered = true
    } else {
      console.warn('Certificate fonts not found. Default font will be used.')
    }
  } catch (error) {
    console.error('Failed to register fonts for certificate:', error)
  }
}

// Стили для PDF
const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    padding: 60,
    fontFamily: PRIMARY_FONT_FAMILY,
  },
  container: {
    border: '8px solid #0d9488',
    padding: 40,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  header: {
    textAlign: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#0d9488',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 3,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 40,
  },
  content: {
    textAlign: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 20,
    lineHeight: 1.6,
  },
  userName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1e293b',
    marginTop: 20,
    marginBottom: 20,
    textDecoration: 'underline',
  },
  courseName: {
    fontSize: 24,
    color: '#0d9488',
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 30,
  },
  footer: {
    marginTop: 40,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  footerSection: {
    width: '45%',
  },
  date: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 5,
  },
  signature: {
    fontSize: 14,
    color: '#1e293b',
    fontWeight: 'bold',
    borderTop: '2px solid #0d9488',
    paddingTop: 5,
    marginTop: 20,
  },
  label: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 5,
  },
  certificateId: {
    fontSize: 10,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 20,
  },
  decorativeLine: {
    width: '100%',
    height: 2,
    backgroundColor: '#0d9488',
    marginVertical: 20,
  },
})

interface CertificateTemplateProps {
  userName: string
  courseName: string
  completionDate: string
  certificateId: string
  duration: string
}

const CertificateTemplate: React.FC<CertificateTemplateProps> = ({
  userName,
  courseName,
  completionDate,
  certificateId,
  duration,
}) => (
  <Document>
    <Page size="A4" orientation="landscape" style={styles.page}>
      <View style={styles.container}>
        {/* Заголовок */}
        <View style={styles.header}>
          <Text style={styles.title}>Сертификат</Text>
          <Text style={styles.subtitle}>о прохождении образовательной программы</Text>
        </View>

        {/* Основной контент */}
        <View style={styles.content}>
          <Text style={styles.text}>Настоящий сертификат подтверждает, что</Text>
          
          <Text style={styles.userName}>{userName}</Text>
          
          <Text style={styles.text}>
            успешно завершил(а) образовательную программу
          </Text>
          
          <Text style={styles.courseName}>{courseName}</Text>
          
          <View style={styles.decorativeLine} />
          
          <Text style={styles.text}>
            Продолжительность программы: {duration}
          </Text>
          <Text style={styles.text}>
            Дата завершения: {completionDate}
          </Text>
        </View>

        {/* Футер */}
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

        {/* ID сертификата */}
        <Text style={styles.certificateId}>
          ID сертификата: {certificateId}
        </Text>
      </View>
    </Page>
  </Document>
)

export default CertificateTemplate
