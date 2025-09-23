import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Animated, { FadeInUp, SlideInLeft } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import NavBar from '@/components/navigation/NavBar';
import { LanguageToggleButton } from '@/components/LanguageToggleButton';
import { marketplaceService, Product } from '@/src/services/marketplaceService';
import { pricesService, CropPrice } from '@/src/services/pricesService';

export default function MarketplaceScreen() {
  const { t, i18n } = useTranslation(); // [แก้ไข] ดึง i18n มาใช้เพื่อเช็คสถานะ
  const [isTranslationsLoaded, setIsTranslationsLoaded] = useState(i18n.isInitialized);

  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Products');

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Market prices state
  const [todayPrices, setTodayPrices] = useState<CropPrice[]>([]);
  const [pricesLoading, setPricesLoading] = useState(false);

  // Helper functions for prices
  const getPriceIcon = (cropName: string) => {
    const iconMap: { [key: string]: any } = {
      'ข้าวโพด': 'grain',
      'ข้าวสาลี': 'grass', 
      'ข้าว': 'eco',
      'ถั่วเหลือง': 'agriculture',
      'corn': 'grain',
      'wheat': 'grass',
      'rice': 'eco',
      'soybeans': 'agriculture'
    };
    return iconMap[cropName.toLowerCase()] || 'eco';
  };

  const getPriceIconColor = (cropName: string) => {
    const colorMap: { [key: string]: string } = {
      'ข้าวโพด': '#FFD54F',
      'ข้าวสาลี': '#FFB74D',
      'ข้าว': '#8BC34A',
      'ถั่วเหลือง': '#66BB6A',
      'corn': '#FFD54F',
      'wheat': '#FFB74D',
      'rice': '#8BC34A',
      'soybeans': '#66BB6A'
    };
    return colorMap[cropName.toLowerCase()] || '#4CAF50';
  };

  useEffect(() => {
    const onLoaded = () => setIsTranslationsLoaded(true);
    i18n.on('initialized', onLoaded);
    return () => {
      i18n.off('initialized', onLoaded);
    };
  }, [i18n]);

  // ฟังก์ชันดึงข้อมูลราคาตลาดไทย
  const fetchPrices = async (showLoading = true) => {
    try {
      if (showLoading) setPricesLoading(true);
      const todayData = await pricesService.getTodayPrices();
      setTodayPrices(todayData);
      console.log('Prices updated:', { todayCount: todayData.length, source: todayData[0]?.source || 'unknown' });
    } catch (error) {
      console.error('Failed to load market prices:', error);
    } finally {
      if (showLoading) setPricesLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices(); // ดึงราคาตลาดเมื่อ component โหลด
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let fetchedProducts: Product[];
        
        // ถ้ามีการค้นหา ให้ใช้ search function
        if (searchText.trim()) {
          fetchedProducts = await marketplaceService.searchProducts(searchText);
        } 
        // ถ้าเลือกหมวดหมู่
        else if (selectedCategory !== 'All Products') {
          fetchedProducts = await marketplaceService.getProductsByCategory(selectedCategory);
        } 
        // ถ้าไม่มีเงื่อนไขใดๆ ให้ดึงสินค้าทั้งหมด
        else {
          fetchedProducts = await marketplaceService.getAllProducts();
        }
        
        setProducts(fetchedProducts);
        setError(null);
      } catch (err) {
        setError('Failed to load products.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    // Debounce search (รอให้ผู้ใช้พิมพ์เสร็จก่อนค้นหา)
    const searchTimeout = setTimeout(fetchProducts, 300);
    
    return () => clearTimeout(searchTimeout);
  }, [searchText, selectedCategory]);
  
  const categories = ['All Products', 'Seeds', 'Fertilizers', 'Tools'];

  // [แก้ไข] เพิ่มฟังก์ชันสำหรับจัดการการกดปุ่ม
  const handleAddToCart = (product: Product) => {
    Alert.alert(
      `${t('market.add_to_cart_confirm_title')}`,
      `${t('market.add_to_cart_confirm_message')} "${product.name}"?`,
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('common.confirm'), onPress: () => console.log(`Added ${product.name} to cart!`) } // ใส่ Logic การเพิ่มลงตะกร้าจริงที่นี่
      ]
    );
  };

  const ProductCard = ({ product }: { product: Product }) => {
    const isOutOfStock = product.status === 'out_of_stock' || product.quantity === 0;
    
    return (
      <View style={[styles.productCard, isOutOfStock && styles.outOfStockCard]}>
        <View style={[styles.productImageContainer, isOutOfStock && styles.outOfStockImageContainer]}>
          <MaterialIcons 
            name={getProductIcon(product.category)} 
            size={40} 
            color={isOutOfStock ? "#ccc" : "#4CAF50"} 
            style={styles.productImage} 
          />
          {isOutOfStock && (
            <View style={styles.outOfStockBadge}>
              <Text style={styles.outOfStockText}>หมด</Text>
            </View>
          )}
        </View>
        <View style={styles.productInfo}>
          <Text style={[styles.productName, isOutOfStock && styles.outOfStockText]} numberOfLines={2}>
            {product.name}
          </Text>
          <Text style={[styles.productPrice, isOutOfStock && styles.outOfStockPrice]}>
            ฿{parseFloat(product.price).toFixed(2)} / {product.unit}
          </Text>
          <Text style={styles.productSeller} numberOfLines={1}>
            {t('market.seller')}: {product.seller?.full_name || product.seller?.username || 'N/A'}
          </Text>
          <Text style={styles.productQuantity}>
            {t('market.in_stock')}: {product.quantity} {product.unit}
          </Text>
          {/* [แก้ไข] เพิ่ม onPress ให้กับปุ่ม */}
          <TouchableOpacity 
            style={[styles.addToCartButton, isOutOfStock && styles.outOfStockButton]} 
            onPress={() => !isOutOfStock && handleAddToCart(product)}
            disabled={isOutOfStock}
          >
            <Text style={[styles.addToCartText, isOutOfStock && styles.outOfStockButtonText]}>
              {isOutOfStock ? t('market.out_of_stock') : t('market.add_to_cart')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Helper function to get appropriate icon for each category
  const getProductIcon = (category: string) => {
    switch (category) {
      case 'Seeds':
        return 'eco';
      case 'Fertilizers':
        return 'scatter-plot';
      case 'Tools':
        return 'build';
      default:
        return 'local-florist';
    }
  };

  const renderContent = () => {
    if (loading || !isTranslationsLoaded) { // เพิ่ม !isTranslationsLoaded
      return <ActivityIndicator size="large" color="#4CAF50" style={{ marginTop: 50 }} />;
    }
    if (error) {
      return <Text style={styles.errorText}>{error}</Text>;
    }
    if (products.length === 0) {
      return (
        <View style={styles.emptyTextContainer}>
          <MaterialIcons name="shopping-basket" size={64} color="#ccc" />
          <Text style={styles.emptyText}>{t('market.no_products_found')}</Text>
          {searchText.trim() && (
            <Text style={styles.emptyText}>
              {t('market.try_different_search')} &quot;{searchText}&quot;
            </Text>
          )}
        </View>
      );
    }
    return (
      <View style={styles.productsGrid}>
        {products.map((product, index) => (
          <Animated.View key={product.id} style={{ width: '48%' }} entering={SlideInLeft.delay(100 + index * 100).duration(600)}>
            <ProductCard product={product} />
          </Animated.View>
        ))}
      </View>
    );
  };

  if (!isTranslationsLoaded) {
      // แสดงหน้า Loading ขณะรอไฟล์แปลภาษา
      return <View style={styles.container}><ActivityIndicator size="large" color="#4CAF50" /></View>;
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }} // <-- Add this line
      >
        <Animated.View style={styles.searchSection} entering={FadeInUp.duration(600)}>
          <View style={styles.marketplaceHeader}>
            <Text style={styles.marketplaceTitle}>{t('navigation.marketplace') || 'Marketplace'}</Text>
            <LanguageToggleButton size="small" />
          </View>
        </Animated.View>

        {/* Today's Prices */}
        <Animated.View 
          style={styles.pricesSection}
          entering={FadeInUp.delay(200).duration(800)}
        >
          <View style={styles.pricesHeader}>
            <Text style={styles.pricesSectionTitle}>{t('market.todays_prices') || "Today's Prices"}</Text>
            <TouchableOpacity onPress={() => fetchPrices(true)} style={styles.refreshPricesButton}>
              <MaterialIcons 
                name="refresh" 
                size={18} 
                color={pricesLoading ? "#999" : "#4CAF50"} 
              />
            </TouchableOpacity>
          </View>

          {pricesLoading && todayPrices.length === 0 ? (
            <View style={styles.pricesLoadingContainer}>
              <ActivityIndicator size="small" color="#4CAF50" />
              <Text style={styles.pricesLoadingText}>กำลังโหลดราคาล่าสุด...</Text>
            </View>
          ) : (
            <View style={styles.pricesList}>
              {todayPrices.map((price, index) => (
                <Animated.View 
                  key={price.name}
                  style={styles.priceItem}
                  entering={FadeInUp.delay(300 + index * 100).duration(500)}
                >
                  <View style={styles.priceContent}>
                    <View style={styles.priceHeader}>
                      <View style={styles.cropInfo}>
                        <MaterialIcons 
                          name={getPriceIcon(price.name)} 
                          size={20} 
                          color={getPriceIconColor(price.name)} 
                          style={styles.marketCropIcon} 
                        />
                        <Text style={styles.cropName}>{price.name}</Text>
                      </View>
                      <View style={styles.priceChange}>
                        <Text style={[
                          styles.changeText, 
                          price.changePercent >= 0 ? styles.positive : styles.negative
                        ]}>
                          {pricesService.formatPercentage(price.changePercent)}
                        </Text>
                        <MaterialIcons 
                          name={price.changePercent >= 0 ? "arrow-upward" : "arrow-downward"} 
                          size={16} 
                          color={price.changePercent >= 0 ? "#4CAF50" : "#F44336"} 
                        />
                      </View>
                    </View>
                    <Text style={styles.currentPrice}>
                      {pricesService.formatPrice(price.price, price.currency)}/{price.unit}
                    </Text>
                    <Text style={styles.previousPrice}>
                      {t('market.yesterday') || 'Yesterday'}: {pricesService.formatPrice(price.previousPrice, price.currency)}
                    </Text>
                    {price.source && (
                      <Text style={styles.priceSource}>Source: {price.source}</Text>
                    )}
                  </View>
                </Animated.View>
              ))}
              
              {todayPrices.length === 0 && (
                <View style={styles.noPricesContainer}>
                  <MaterialIcons name="trending-up" size={48} color="#ccc" />
                  <Text style={styles.noPricesText}>ไม่มีข้อมูลราคาในขณะนี้</Text>
                </View>
              )}
            </View>
          )}
        </Animated.View>

        {/* Search Products Section */}
        <Animated.View style={styles.productsSearchSection} entering={FadeInUp.delay(600).duration(600)}>
          <Text style={styles.searchProductsTitle}>{t('market.search_products') || 'Search Products'}</Text>
          <View style={styles.searchContainer}>
             <TextInput 
                style={styles.searchInput} 
                placeholder={t('market.search_placeholder')} 
                value={searchText} 
                onChangeText={setSearchText} // ทำให้ช่องค้นหาทำงาน
             />
            <TouchableOpacity style={styles.filterButton}>
              <MaterialIcons name="filter-list" size={20} color="white" style={styles.filterIcon} />
            </TouchableOpacity>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(700).duration(600)}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryTabs}>
            {categories.map((category) => (
              <TouchableOpacity key={category} style={[styles.categoryTab, selectedCategory === category && styles.selectedCategoryTab]} onPress={() => setSelectedCategory(category)}>
                <Text style={[styles.categoryTabText, selectedCategory === category && styles.selectedCategoryTabText]}>{t(`market.categories.${category.toLowerCase().replace(' ', '_')}`)}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        <Animated.View style={styles.section} entering={FadeInUp.delay(800).duration(600)}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('market.featured_products')}</Text>
            <View style={styles.productStats}>
              <Text style={styles.statsText}>
                {products.length} {t('market.products_found')}
              </Text>
              {searchText.trim() && (
                <Text style={styles.searchResultText}>
                  {t('market.search_results_for')} &quot;{searchText}&quot;
                </Text>
              )}
            </View>
          </View>
          {renderContent()}
        </Animated.View>

        <View style={{ height: 120 }} />
      </ScrollView>
      <NavBar />
    </View>
  );
}

// Stylesheet (เหมือนเดิม)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  content: { flex: 1 },
  searchSection: { backgroundColor: '#4CAF50', padding: 20, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  marketplaceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  marketplaceTitle: { fontSize: 28, fontWeight: 'bold', color: 'white', marginBottom: 0 },
  productsSearchSection: { backgroundColor: 'white', padding: 20, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  searchProductsTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 15 },
  searchContainer: { flexDirection: 'row', alignItems: 'center' },
  searchInput: { flex: 1, backgroundColor: '#f0f0f0', borderRadius: 25, paddingHorizontal: 20, paddingVertical: 12, fontSize: 16, marginRight: 10 },
  filterButton: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#4CAF50', alignItems: 'center', justifyContent: 'center' },
  filterIcon: { fontSize: 24, color: 'white' },
  categoryTabs: { paddingHorizontal: 20, paddingVertical: 15, backgroundColor: 'white' },
  categoryTab: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, marginRight: 10, backgroundColor: '#f0f0f0' },
  selectedCategoryTab: { backgroundColor: '#4CAF50' },
  categoryTabText: { fontSize: 14, color: '#333', fontWeight: '500' },
  selectedCategoryTabText: { color: 'white' },
  section: { minHeight: 200, padding: 20, },
  sectionHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-end',
    marginBottom: 20 
  },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  productStats: { alignItems: 'flex-end' },
  statsText: { fontSize: 14, color: '#666', fontWeight: '500' },
  searchResultText: { fontSize: 12, color: '#4CAF50', marginTop: 2 },
  productsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', },
  productCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    overflow: 'hidden'
  },
  outOfStockCard: {
    opacity: 0.7,
    backgroundColor: '#f9f9f9',
  },
  productImageContainer: {
    alignItems: 'center',
    paddingVertical: 15,
    backgroundColor: '#f5f5f5',
    position: 'relative'
  },
  outOfStockImageContainer: {
    backgroundColor: '#e0e0e0'
  },
  outOfStockBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#f44336',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2
  },
  productImage: { fontSize: 40 },
  productInfo: {
    padding: 10,
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between'
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    minHeight: 40, 
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 8,
  },
  outOfStockPrice: {
    color: '#999',
    textDecorationLine: 'line-through'
  },
  productSeller: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  productQuantity: {
    fontSize: 11,
    color: '#888',
    marginBottom: 12,
  },
  addToCartButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  outOfStockButton: {
    backgroundColor: '#ccc',
  },
  addToCartText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold'
  },
  outOfStockButtonText: {
    color: '#666'
  },
  outOfStockText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold'
  },
  emptyTextContainer: { 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingVertical: 50 
  },
  emptyText: { 
    textAlign: 'center', 
    color: '#666', 
    fontSize: 16,
    marginTop: 10 
  },
  errorText: { 
    textAlign: 'center', 
    marginTop: 50, 
    color: 'red',
    fontSize: 16 
  },
  // Prices Section Styles
  pricesSection: {
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pricesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  pricesSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  refreshPricesButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f0f8f0',
  },
  pricesLoadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  pricesLoadingText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#666',
  },
  pricesList: {
    gap: 10,
  },
  priceItem: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  priceContent: {
    flex: 1,
  },
  priceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cropInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  marketCropIcon: {
    marginRight: 10,
  },
  cropName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  priceChange: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 5,
  },
  positive: {
    color: '#4CAF50',
  },
  negative: {
    color: '#F44336',
  },
  currentPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  previousPrice: {
    fontSize: 12,
    color: '#666',
  },
  priceSource: {
    fontSize: 10,
    color: '#999',
    fontStyle: 'italic',
    marginTop: 2,
  },
  noPricesContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  noPricesText: {
    fontSize: 16,
    color: '#999',
    marginTop: 10,
    textAlign: 'center',
  },
});