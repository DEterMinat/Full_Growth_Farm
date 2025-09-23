import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Animated, { FadeInUp, SlideInLeft } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import NavBar from '@/components/navigation/NavBar';
import { marketplaceService, Product } from '@/src/services/marketplaceService';

export default function MarketplaceScreen() {
  const { t, i18n } = useTranslation(); // [แก้ไข] ดึง i18n มาใช้เพื่อเช็คสถานะ
  const [isTranslationsLoaded, setIsTranslationsLoaded] = useState(i18n.isInitialized);

  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Products');

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const onLoaded = () => setIsTranslationsLoaded(true);
    i18n.on('initialized', onLoaded);
    return () => {
      i18n.off('initialized', onLoaded);
    };
  }, [i18n]);

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
          <Text style={styles.marketplaceTitle}>{t('navigation.marketplace') || 'Marketplace'}</Text>
        </Animated.View>

        {/* Market News & Updates */}
        <Animated.View 
          style={styles.newsSection}
          entering={FadeInUp.delay(200).duration(800)}
        >
          <Text style={styles.newsSectionTitle}>{t('market.market_news') || 'Market News & Updates'}</Text>
          <View style={styles.newsList}>
            <Animated.View 
              style={styles.newsItem}
              entering={FadeInUp.delay(300).duration(500)}
            >
              <View style={styles.newsContent}>
                <Text style={styles.newsTitle}>{t('market.global_wheat_demand') || 'Global Wheat Demand Rises'}</Text>
                <Text style={styles.newsSubtitle}>{t('market.export_opportunities') || 'New export opportunities for local farmers'}</Text>
                <Text style={styles.newsTime}>{t('market.hours_ago_2') || '2 hours ago'}</Text>
              </View>
            </Animated.View>
            
            <Animated.View 
              style={styles.newsItem}
              entering={FadeInUp.delay(400).duration(500)}
            >
              <View style={styles.newsContent}>
                <Text style={styles.newsTitle}>{t('market.weather_forecast_corn') || 'Weather Forecast Affects Corn Prices'}</Text>
                <Text style={styles.newsSubtitle}>{t('market.rain_impact_harvest') || 'Expected rain may impact harvest timing'}</Text>
                <Text style={styles.newsTime}>{t('market.hours_ago_5') || '5 hours ago'}</Text>
              </View>
            </Animated.View>
            
            <Animated.View 
              style={styles.newsItem}
              entering={FadeInUp.delay(500).duration(500)}
            >
              <View style={styles.newsContent}>
                <Text style={styles.newsTitle}>{t('market.trade_agreement_soybean') || 'New Trade Agreement Boosts Soybean Demand'}</Text>
                <Text style={styles.newsSubtitle}>{t('market.farmers_higher_demand') || 'Farmers can expect higher demand and better prices'}</Text>
                <Text style={styles.newsTime}>{t('market.day_ago_1') || '1 day ago'}</Text>
              </View>
            </Animated.View>
          </View>
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
  searchSection: { backgroundColor: 'white', padding: 20, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  marketplaceTitle: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 15 },
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
  // Market News Styles
  newsSection: {
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
  newsSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  newsList: {
    gap: 10,
  },
  newsItem: {
    backgroundColor: '#f0f8f0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  newsContent: {
    flex: 1,
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  newsSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  newsTime: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
  },
});