import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import NavBar from '../../components/navigation/NavBar';
import { LanguageToggleButton } from '../../components/LanguageToggleButton';

export default function ExportDataScreen() {
  const { t } = useTranslation();

  const exportOptions = [
    {
      id: 'crop-data',
      title: t('export.crop_data_title') || 'ข้อมูลการเพาะปลูก',
      subtitle: t('export.crop_data_subtitle') || 'ประวัติการปลูก, ผลผลิต, การดูแล',
      icon: 'grass',
      color: '#059669',
      format: t('export.format_csv_excel') || 'CSV, Excel'
    },
    {
      id: 'iot-data',
      title: t('export.iot_data_title') || 'ข้อมูล IoT',
      subtitle: t('export.iot_data_subtitle') || 'ค่าเซ็นเซอร์, อุณหภูมิ, ความชื้น',
      icon: 'sensors',
      color: '#3B82F6',
      format: t('export.format_json_csv') || 'JSON, CSV'
    },
    {
      id: 'weather-data',
      title: t('export.weather_data_title') || 'ข้อมูลสภาพอากาศ',
      subtitle: t('export.weather_data_subtitle') || 'ประวัติสภาพอากาศ, พยากรณ์',
      icon: 'cloud',
      color: '#06B6D4',
      format: t('export.format_csv_json') || 'CSV, JSON'
    },
    {
      id: 'marketplace-data',
      title: t('export.marketplace_data_title') || 'ข้อมูลตลาด',
      subtitle: t('export.marketplace_data_subtitle') || 'ราคาสินค้า, ประวัติการซื้อขาย',
      icon: 'trending-up',
      color: '#9C27B0',
      format: t('export.format_excel_pdf') || 'Excel, PDF'
    },
    {
      id: 'financial-data',
      title: t('export.financial_data_title') || 'ข้อมูลการเงิน',
      subtitle: t('export.financial_data_subtitle') || 'รายได้, ค่าใช้จ่าย, กำไร-ขาดทุน',
      icon: 'account-balance',
      color: '#F59E0B',
      format: t('export.format_excel_pdf') || 'Excel, PDF'
    },
    {
      id: 'all-data',
      title: t('export.all_data_title') || 'ข้อมูลทั้งหมด',
      subtitle: t('export.all_data_subtitle') || 'รวมข้อมูลทุกประเภทในไฟล์เดียว',
      icon: 'folder-zip',
      color: '#EF4444',
      format: t('export.format_zip') || 'ZIP Archive'
    }
  ];

  const handleExport = (option: any) => {
    Alert.alert(
      t('export.export_data') || 'Export ข้อมูล',
      t('export.export_confirm', { title: option.title, format: option.format }) || 
      `คุณต้องการ Export ${option.title} ในรูปแบบ ${option.format} หรือไม่?`,
      [
        {
          text: t('common.cancel') || 'ยกเลิก',
          style: 'cancel'
        },
        {
          text: t('export.export') || 'Export',
          onPress: () => {
            Alert.alert(
              t('export.processing') || 'กำลังดำเนินการ', 
              t('export.exporting', { title: option.title }) || `กำลัง Export ${option.title}...`
            );
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View 
          entering={FadeInUp.delay(100).duration(600)}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <MaterialIcons name="file-download" size={32} color="#059669" />
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>{t('export.page_title') || 'Export ข้อมูล'}</Text>
              <Text style={styles.headerSubtitle}>{t('export.page_subtitle') || 'ส่งออกข้อมูลการเกษตรของคุณ'}</Text>
            </View>
            <View style={styles.languageButton}>
              <LanguageToggleButton />
            </View>
          </View>
        </Animated.View>

        {/* Export Options */}
        <View style={styles.optionsContainer}>
          {exportOptions.map((option, index) => (
            <Animated.View
              key={option.id}
              entering={FadeInDown.delay(200 + index * 100).duration(600)}
            >
              <TouchableOpacity
                style={styles.optionCard}
                onPress={() => handleExport(option)}
                activeOpacity={0.7}
              >
                <View style={styles.optionHeader}>
                  <View style={[styles.iconContainer, { backgroundColor: `${option.color}15` }]}>
                    <MaterialIcons 
                      name={option.icon as any} 
                      size={24} 
                      color={option.color} 
                    />
                  </View>
                  <View style={styles.optionContent}>
                    <Text style={styles.optionTitle}>{option.title}</Text>
                    <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
                  </View>
                  <MaterialIcons name="download" size={20} color="#666" />
                </View>
                <View style={styles.optionFooter}>
                  <Text style={styles.formatText}>รูปแบบ: {option.format}</Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        {/* Export History */}
        <Animated.View 
          entering={FadeInUp.delay(800).duration(600)}
          style={styles.historySection}
        >
          <Text style={styles.sectionTitle}>{t('export.history_title') || 'ประวัติการ Export'}</Text>
          <View style={styles.historyCard}>
            <MaterialIcons name="history" size={24} color="#666" />
            <Text style={styles.historyText}>{t('export.no_history') || 'ยังไม่มีประวัติการ Export'}</Text>
          </View>
        </Animated.View>
      </ScrollView>
      
      {/* Bottom Navigation Bar */}
      <NavBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: 16,
    flex: 1,
  },
  languageButton: {
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  optionsContainer: {
    paddingHorizontal: 20,
  },
  optionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    minHeight: 80,
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    minWidth: 48,
  },
  optionContent: {
    flex: 1,
    minWidth: 200,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 2,
    flexWrap: 'wrap',
  },
  optionSubtitle: {
    fontSize: 12,
    color: '#666',
    flexWrap: 'wrap',
    lineHeight: 16,
  },
  optionFooter: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  formatText: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '500',
  },
  historySection: {
    margin: 20,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  historyCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  historyText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
});