import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  TextInput,
  TouchableOpacity
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFirestore } from '../../hooks/useFirestore';
import TableCard from '../Shared/TableCard';
import Error from '../Shared/Error';
import { MaterialIcons } from '@expo/vector-icons';

const Legend = () => (
  <View style={styles.legendContainer}>
    <LegendItem color="#28a745" label="Bo'sh" />
    <LegendItem color="#dc3545" label="Band" />
    <LegendItem color="#007bff" label="Zaxira" />
  </View>
);

const LegendItem = ({ color, label }) => (
  <View style={styles.legendItem}>
    <View style={[styles.legendDot, { backgroundColor: color }]} />
    <Text style={styles.legendText}>{label}</Text>
  </View>
);

const TablesScreen = () => {
  const navigation = useNavigation();
  const { data: tables, loading, error, refetch } = useFirestore('tables', 'tableNumber');
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    if (refetch) await refetch();
    setRefreshing(false);
  }, [refetch]);

  const filteredTables = useMemo(() => {
    if (!searchQuery.trim()) return tables;
    return tables.filter(t =>
      String(t.tableNumber).toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [tables, searchQuery]);

  const handleSelectTable = (table) => {
    navigation.navigate('MenuScreen', {
      tableId: table.id,
      tableNumber: table.tableNumber,
    });
  };

  const renderContent = () => {
    if (loading && !refreshing) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.loadingText}>Stollar yuklanmoqda...</Text>
        </View>
      );
    }

    if (error) {
      return <Error message={error} onRetry={refetch} />;
    }

    return (
      <FlatList
        data={filteredTables}
        renderItem={({ item }) => (
          <TableCard table={item} onPress={() => handleSelectTable(item)} />
        )}
        keyExtractor={(item) => item.id}
        numColumns={3}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <Text style={styles.title}>Stollar</Text>
              <Text style={styles.subtitle}>Buyurtma uchun stol tanlang</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Stol raqamini qidiring..."
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              <Legend />
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyText}>Hech qanday stol topilmadi.</Text>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#007bff']}
            tintColor={'#007bff'}
          />
        }
      />
    );
  };

  return <SafeAreaView style={styles.container}>{renderContent()}</SafeAreaView>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#212529',
  },
  subtitle: {
    fontSize: 15,
    color: '#6c757d',
    marginTop: 4,
    marginBottom: 10,
  },
  searchInput: {
    backgroundColor: '#f1f3f5',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 15,
    marginBottom: 12,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
    marginBottom: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  legendText: {
    fontSize: 13,
    color: '#495057',
  },
  listContainer: {
    paddingHorizontal: 8,
    paddingBottom: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 15,
    color: '#6c757d',
  },
  emptyText: {
    fontSize: 15,
    color: '#6c757d',
    textAlign: 'center',
  },
});

export default TablesScreen;
