import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Animated, { 
  FadeIn,
  FadeInUp,
  SlideInLeft,
  SlideInRight
} from 'react-native-reanimated';
import NavBar from '@/components/navigation/NavBar';

export default function MarketplaceScreen() {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Products');

  const featuredProducts = [
    {
      id: 1,
      name: 'Organic Tomato Seeds',
      price: '$12.99',
      originalPrice: '$15.99',
      seller: 'Premium Seeds Co.',
      rating: 4.8,
      image: 'local-florist',
      category: 'Seeds',
      discount: true,
      discountPercent: '19% OFF'
    },
    {
      id: 2,
      name: 'Organic Fertilizer',
      price: '$24.50',
      seller: 'GreenGrow Ltd.',
      rating: 4.7,
      image: 'eco',
      category: 'Fertilizers',
      discount: false
    }
  ];

  const myOrders = [
    {
      id: '45782',
      item: 'Soil Moisture Sensor',
      quantity: 2,
      price: '$35.99',
      status: 'Shipping',
      deliveryDate: 'Jun 15',
      image: 'sensors'
    },
    {
      id: '45689',
      item: 'Drip Irrigation Kit',
      quantity: 1,
      price: '$89.99',
      status: 'Completed',
      deliveryDate: 'Jun 2',
      image: 'water-drop'
    }
  ];

  const messages = [
    {
      id: 1,
      sender: 'Maria Johnson',
      message: 'Is the organic fertilizer still available?',
      time: '10:23 AM',
      avatar: 'person'
    },
    {
      id: 2,
      sender: 'Support Team',
      message: 'Your order #45782 has been shipped!',
      time: 'Yesterday',
      avatar: 'support-agent'
    },
    {
      id: 3,
      sender: 'Robert Smith',
      message: 'Thank you for the quick delivery!',
      time: 'Jun 3',
      avatar: 'person'
    }
  ];

  const categories = ['All Products', 'Seeds', 'Fertilizers', 'Tools'];

  return (
    <View style={styles.container}>
      {/* Header */}
      <Animated.View 
        style={styles.header}
        entering={FadeIn.duration(600)}
      >
        <View style={styles.headerLeft}>
          <MaterialIcons name="eco" size={24} color="white" style={styles.leafIcon} />
          <Text style={styles.brandText}>Smart Farming</Text>
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <MaterialIcons name="person" size={20} color="white" style={styles.profileIcon} />
        </TouchableOpacity>
      </Animated.View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search Section */}
        <Animated.View 
          style={styles.searchSection}
          entering={FadeInUp.delay(200).duration(800)}
        >
          <Text style={styles.marketplaceTitle}>Marketplace</Text>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search products"
              value={searchText}
              onChangeText={setSearchText}
              placeholderTextColor="#999"
            />
            <TouchableOpacity style={styles.filterButton}>
              <MaterialIcons name="search" size={18} color="#666" style={styles.filterIcon} />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Category Tabs */}
        <Animated.View 
          style={styles.categoryTabs}
          entering={SlideInLeft.delay(400).duration(800)}
        >
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((category, index) => (
              <Animated.View
                key={index}
                entering={SlideInLeft.delay(500 + index * 100).duration(600)}
              >
                <TouchableOpacity
                  style={[
                    styles.categoryTab,
                    selectedCategory === category && styles.selectedCategoryTab
                  ]}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Text style={[
                    styles.categoryTabText,
                    selectedCategory === category && styles.selectedCategoryTabText
                  ]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Featured Products */}
        <Animated.View 
          style={styles.section}
          entering={FadeInUp.delay(800).duration(800)}
        >
          <Text style={styles.sectionTitle}>Featured Products</Text>
          <View style={styles.productsGrid}>
            {featuredProducts.map((product, index) => (
              <Animated.View 
                key={product.id} 
                style={styles.productCard}
                entering={SlideInLeft.delay(1000 + index * 200).duration(600)}
              >
                <View style={styles.productImageContainer}>
                  <MaterialIcons name={product.image as any} size={40} color="#4CAF50" style={styles.productImage} />
                  {product.discount && (
                    <View style={styles.discountBadge}>
                      <Text style={styles.discountText}>SALE</Text>
                    </View>
                  )}
                </View>
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{product.name}</Text>
                  <View style={styles.priceContainer}>
                    <Text style={styles.productPrice}>{product.price}</Text>
                    {product.originalPrice && (
                      <Text style={styles.originalPrice}>{product.originalPrice}</Text>
                    )}
                  </View>
                  <View style={styles.ratingContainer}>
                    <MaterialIcons name="star" size={14} color="#FFD700" style={styles.ratingIcon} />
                    <Text style={styles.ratingText}>{product.rating}</Text>
                  </View>
                  <TouchableOpacity style={styles.addToCartButton}>
                    <Text style={styles.addToCartText}>Add to Cart</Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* My Orders */}
        <Animated.View 
          style={styles.section}
          entering={FadeInUp.delay(1400).duration(800)}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Orders</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {/* Order Status Tabs */}
          <View style={styles.orderTabs}>
            <TouchableOpacity style={[styles.orderTab, styles.selectedOrderTab]}>
              <Text style={[styles.orderTabText, styles.selectedOrderTabText]}>All</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.orderTab}>
              <Text style={styles.orderTabText}>Pending</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.orderTab}>
              <Text style={styles.orderTabText}>Shipping</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.orderTab}>
              <Text style={styles.orderTabText}>Completed</Text>
            </TouchableOpacity>
          </View>

          {/* Order List */}
          {myOrders.map((order, index) => (
            <Animated.View 
              key={order.id} 
              style={styles.orderCard}
              entering={SlideInRight.delay(1600 + index * 200).duration(600)}
            >
              <View style={styles.orderHeader}>
                <Text style={styles.orderNumber}>Order #{order.id}</Text>
                <View style={[
                  styles.orderStatusBadge,
                  order.status === 'Completed' ? styles.completedBadge : styles.shippingBadge
                ]}>
                  <Text style={styles.orderStatusText}>{order.status}</Text>
                </View>
              </View>
              
              <View style={styles.orderContent}>
                <MaterialIcons name={order.image as any} size={32} color="#4CAF50" style={styles.orderItemIcon} />
                <View style={styles.orderDetails}>
                  <Text style={styles.orderItemName}>{order.item}</Text>
                  <Text style={styles.orderQuantity}>Qty: {order.quantity} • {order.price}</Text>
                  <Text style={styles.orderDelivery}>
                    {order.status === 'Completed' ? 'Delivered:' : 'Est. delivery:'} {order.deliveryDate}
                  </Text>
                </View>
                <TouchableOpacity style={styles.orderActionButton}>
                  <Text style={styles.orderActionText}>
                    {order.status === 'Completed' ? 'Review' : 'Track'}
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          ))}
        </Animated.View>

        {/* Messages */}
        <Animated.View 
          style={styles.section}
          entering={FadeInUp.delay(2000).duration(800)}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Messages</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {messages.map((message, index) => (
            <Animated.View
              key={message.id}
              entering={FadeInUp.delay(2200 + index * 150).duration(500)}
            >
              <TouchableOpacity style={styles.messageCard}>
              <MaterialIcons name={message.avatar as any} size={32} color="#4CAF50" style={styles.messageAvatar} />
              <View style={styles.messageContent}>
                <View style={styles.messageHeader}>
                  <Text style={styles.messageSender}>{message.sender}</Text>
                  <Text style={styles.messageTime}>{message.time}</Text>
                </View>
                <Text style={styles.messageText}>{message.message}</Text>
              </View>
            </TouchableOpacity>
            </Animated.View>
          ))}
        </Animated.View>

        <View style={{ height: 120 }} />
      </ScrollView>

      <NavBar currentRoute="marketplace" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leafIcon: {
    fontSize: 20,
    marginRight: 8,
    color: 'white',
  },
  brandText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  profileButton: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileIcon: {
    fontSize: 18,
    color: 'white',
  },
  content: {
    flex: 1,
  },
  searchSection: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  marketplaceTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    marginRight: 10,
  },
  filterButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterIcon: {
    fontSize: 20,
    color: 'white',
  },
  categoryTabs: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginTop: 5,
  },
  categoryTab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedCategoryTab: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  categoryTabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  selectedCategoryTabText: {
    color: 'white',
    fontWeight: 'bold',
  },
  section: {
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  viewAllText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  productsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  productCard: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
  },
  productImageContainer: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: 10,
  },
  productImage: {
    fontSize: 60,
  },
  discountBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#F44336',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  discountText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  productInfo: {
    alignItems: 'center',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    textAlign: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginRight: 5,
  },
  originalPrice: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  ratingIcon: {
    fontSize: 14,
    marginRight: 5,
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
  },
  addToCartButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  addToCartText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  orderTabs: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  orderTab: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
    marginRight: 10,
    backgroundColor: '#f8f9fa',
  },
  selectedOrderTab: {
    backgroundColor: '#4CAF50',
  },
  orderTabText: {
    fontSize: 14,
    color: '#666',
  },
  selectedOrderTabText: {
    color: 'white',
    fontWeight: 'bold',
  },
  orderCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  orderStatusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  shippingBadge: {
    backgroundColor: '#FF9800',
  },
  completedBadge: {
    backgroundColor: '#4CAF50',
  },
  orderStatusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  orderContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderItemIcon: {
    marginRight: 15,
  },
  orderDetails: {
    flex: 1,
  },
  orderItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 3,
  },
  orderQuantity: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  orderDelivery: {
    fontSize: 12,
    color: '#999',
  },
  orderActionButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 15,
    paddingVertical: 6,
    paddingHorizontal: 15,
  },
  orderActionText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  messageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  messageAvatar: {
    marginRight: 15,
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  messageSender: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  messageTime: {
    fontSize: 12,
    color: '#999',
  },
  messageText: {
    fontSize: 14,
    color: '#666',
  },
});
