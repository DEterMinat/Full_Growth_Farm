import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Animated, { FadeInUp, SlideInLeft } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import NavBar from '@/components/navigation/NavBar';
import { marketplaceService, Product } from '@/src/services/marketplaceService';
import { useCart } from '@/src/contexts/CartContext';

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
        const fetchedProducts = await marketplaceService.getAllProducts();
        setProducts(fetchedProducts);
        setError(null);
      } catch (err) {
        setError('Failed to load products.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);
  
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

  const ProductCard = ({ product }: { product: Product }) => (
    <View style={styles.productCard}>
      <View style={styles.productImageContainer}>
        <MaterialIcons name={"local-florist"} size={40} color="#4CAF50" style={styles.productImage} />
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
        <Text style={styles.productPrice}>฿{parseFloat(product.price).toFixed(2)}</Text>
        <Text style={styles.productSeller} numberOfLines={1}>{t('market.seller')}: {product.seller?.full_name || product.seller?.username || 'N/A'}</Text>
        {/* [แก้ไข] เพิ่ม onPress ให้กับปุ่ม */}
        <TouchableOpacity style={styles.addToCartButton} onPress={() => handleAddToCart(product)}>
          <Text style={styles.addToCartText}>{t('market.add_to_cart')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // [แก้ไข] เพิ่มการกรองสินค้าตามการค้นหา
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderContent = () => {
    if (loading || !isTranslationsLoaded) { // เพิ่ม !isTranslationsLoaded
      return <ActivityIndicator size="large" color="#4CAF50" style={{ marginTop: 50 }} />;
    }
    if (error) {
      return <Text style={styles.errorText}>{error}</Text>;
    }
    if (filteredProducts.length === 0) {
      return <Text style={styles.emptyText}>{t('market.no_products_found')}</Text>;
    }
    return (
      <View style={styles.productsGrid}>
        {filteredProducts.map((product, index) => (
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
      <NavBar currentRoute="marketplace" />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={styles.searchSection} entering={FadeInUp.duration(600)}>
          <Text style={styles.marketplaceTitle}>{t('market.title')}</Text>
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

        <Animated.View entering={FadeInUp.delay(200).duration(600)}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryTabs}>
            {categories.map((category) => (
              <TouchableOpacity key={category} style={[styles.categoryTab, selectedCategory === category && styles.selectedCategoryTab]} onPress={() => setSelectedCategory(category)}>
                <Text style={[styles.categoryTabText, selectedCategory === category && styles.selectedCategoryTabText]}>{t(`market.categories.${category.toLowerCase().replace(' ', '_')}`)}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        <Animated.View style={styles.section} entering={FadeInUp.delay(400).duration(600)}>
          <Text style={styles.sectionTitle}>{t('market.featured_products')}</Text>
          {renderContent()}
        </Animated.View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

// Stylesheet (เหมือนเดิม)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  content: { flex: 1 },
  searchSection: { backgroundColor: 'white', padding: 20, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  marketplaceTitle: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 15 },
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
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 20 },
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
  productImageContainer: {
    alignItems: 'center',
    paddingVertical: 15,
    backgroundColor: '#f5f5f5'
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
  productSeller: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
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
  addToCartText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold'
  },
  emptyText: { textAlign: 'center', width: '100%', paddingVertical: 20, color: '#666' },
  errorText: { textAlign: 'center', marginTop: 50, color: 'red' },
});