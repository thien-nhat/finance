/**
 * Personal Finance Management App
 * Quản Lý Tài Chính Cá Nhân
 *
 * @format
 */

import React, { useState, useEffect } from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Alert,
  useColorScheme,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Transaction {
  id: string;
  desc: string;
  amount: number;
  type: 'income' | 'expense';
  created: number;
}

type FilterType = 'all' | 'income' | 'expense';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('income');
  const [filter, setFilter] = useState<FilterType>('all');

  // Load transactions from AsyncStorage
  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const stored = await AsyncStorage.getItem('transactions_v1');
      if (stored) {
        setTransactions(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  };

  const saveTransactions = async (newTransactions: Transaction[]) => {
    try {
      await AsyncStorage.setItem('transactions_v1', JSON.stringify(newTransactions));
      setTransactions(newTransactions);
    } catch (error) {
      console.error('Error saving transactions:', error);
    }
  };

  const addTransaction = () => {
    if (!desc.trim() || !amount || Number(amount) < 1) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin hợp lệ');
      return;
    }

    const newTransaction: Transaction = {
      id: (Math.random() + Date.now()).toString(36),
      desc: desc.trim(),
      amount: Number(amount),
      type,
      created: Date.now(),
    };

    const newTransactions = [...transactions, newTransaction];
    saveTransactions(newTransactions);
    setDesc('');
    setAmount('');
  };

  const removeTransaction = (id: string) => {
    Alert.alert(
      'Xác nhận',
      'Bạn có chắc chắn muốn xóa giao dịch này?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: () => {
            const newTransactions = transactions.filter(tx => tx.id !== id);
            saveTransactions(newTransactions);
          },
        },
      ]
    );
  };

  const getFilteredTransactions = () => {
    let filtered = filter === 'all' ? transactions : transactions.filter(tx => tx.type === filter);
    return filtered.sort((a, b) => b.created - a.created);
  };

  const calculateSummary = () => {
    const income = transactions.filter(tx => tx.type === 'income').reduce((sum, tx) => sum + tx.amount, 0);
    const expense = transactions.filter(tx => tx.type === 'expense').reduce((sum, tx) => sum + tx.amount, 0);
    const balance = income - expense;
    return { income, expense, balance };
  };

  const formatAmount = (value: number) => {
    return value.toLocaleString('vi-VN') + '₫';
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const { income, expense, balance } = calculateSummary();

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <View style={[styles.transactionItem, item.type === 'income' ? styles.incomeItem : styles.expenseItem]}>
      <View style={styles.transactionInfo}>
        <Text style={styles.transactionDesc}>{item.desc}</Text>
        <View style={styles.transactionMeta}>
          <Text style={styles.transactionCategory}>
            {item.type === 'income' ? 'Thu' : 'Chi'}
          </Text>
          <Text style={styles.transactionDate}>{formatDate(item.created)}</Text>
        </View>
      </View>
      <View style={styles.transactionRight}>
        <Text style={[styles.transactionAmount, item.type === 'income' ? styles.incomeAmount : styles.expenseAmount]}>
          {item.type === 'income' ? '+' : '-'}{formatAmount(item.amount)}
        </Text>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => removeTransaction(item.id)}
        >
          <Text style={styles.deleteButtonText}>×</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor="#3178c6" />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          {/* Header */}
          <Text style={styles.title}>Quản Lý Tài Chính</Text>

          {/* Balance Section */}
          <View style={styles.balanceSection}>
            <Text style={styles.balanceLabel}>Số dư hiện tại</Text>
            <Text style={styles.balanceAmount}>{formatAmount(balance)}</Text>
          </View>

          {/* Summary Section */}
          <View style={styles.summary}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Thu</Text>
              <Text style={[styles.summaryAmount, styles.incomeAmount]}>{formatAmount(income)}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Chi</Text>
              <Text style={[styles.summaryAmount, styles.expenseAmount]}>{formatAmount(expense)}</Text>
            </View>
          </View>

          {/* Add Transaction Form */}
          <View style={styles.form}>
            <TextInput
              style={styles.descInput}
              placeholder="Ghi chú (VD: Lương, Ăn sáng...)"
              value={desc}
              onChangeText={setDesc}
            />
            <View style={styles.formRow}>
              <TextInput
                style={styles.amountInput}
                placeholder="Số tiền"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
              />
              <View style={styles.typeSelector}>
                <TouchableOpacity
                  style={[styles.typeButton, type === 'income' && styles.typeButtonActive]}
                  onPress={() => setType('income')}
                >
                  <Text style={[styles.typeButtonText, type === 'income' && styles.typeButtonTextActive]}>Thu</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.typeButton, type === 'expense' && styles.typeButtonActive]}
                  onPress={() => setType('expense')}
                >
                  <Text style={[styles.typeButtonText, type === 'expense' && styles.typeButtonTextActive]}>Chi</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.addButton} onPress={addTransaction}>
                <Text style={styles.addButtonText}>Thêm</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Filters */}
          <View style={styles.filters}>
            <TouchableOpacity
              style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
              onPress={() => setFilter('all')}
            >
              <Text style={[styles.filterButtonText, filter === 'all' && styles.filterButtonTextActive]}>Tất cả</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, filter === 'income' && styles.filterButtonActive]}
              onPress={() => setFilter('income')}
            >
              <Text style={[styles.filterButtonText, filter === 'income' && styles.filterButtonTextActive]}>Thu</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, filter === 'expense' && styles.filterButtonActive]}
              onPress={() => setFilter('expense')}
            >
              <Text style={[styles.filterButtonText, filter === 'expense' && styles.filterButtonTextActive]}>Chi</Text>
            </TouchableOpacity>
          </View>

          {/* Transactions List */}
          <FlatList
            data={getFilteredTransactions()}
            renderItem={renderTransaction}
            keyExtractor={item => item.id}
            style={styles.transactionsList}
            showsVerticalScrollIndicator={false}
          />

          {/* Footer */}
          <Text style={styles.footer}>© 2025 Quản lý tài chính cá nhân</Text>
        </View>
      </ScrollView>
    </View>
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
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    maxWidth: 480,
    alignSelf: 'center',
    backgroundColor: '#fff',
    margin: 40,
    borderRadius: 12,
    padding: 32,
    shadowColor: '#3178c6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 8,
  },
  title: {
    textAlign: 'center',
    color: '#3178c6',
    marginBottom: 16,
    fontSize: 28,
    fontWeight: 'bold',
  },
  balanceSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  balanceLabel: {
    fontSize: 16,
    color: '#1a1a2e',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    color: '#3178c6',
    fontWeight: 'bold',
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  summaryItem: {
    backgroundColor: '#e3f0fc',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    minWidth: 90,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#1a1a2e',
    marginBottom: 8,
  },
  summaryAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  incomeAmount: {
    color: '#43a047',
  },
  expenseAmount: {
    color: '#f44336',
  },
  form: {
    marginBottom: 18,
  },
  descInput: {
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    marginBottom: 10,
  },
  formRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  amountInput: {
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    width: 100,
  },
  typeSelector: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 6,
    overflow: 'hidden',
  },
  typeButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  typeButtonActive: {
    backgroundColor: '#3178c6',
  },
  typeButtonText: {
    color: '#3178c6',
    fontSize: 16,
  },
  typeButtonTextActive: {
    color: '#fff',
  },
  addButton: {
    backgroundColor: '#3178c6',
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 18,
    flex: 1,
    minWidth: 60,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  filters: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 6,
    marginBottom: 8,
  },
  filterButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  filterButtonActive: {
    backgroundColor: '#3178c6',
    borderColor: '#3178c6',
  },
  filterButtonText: {
    color: '#3178c6',
    fontSize: 14,
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  transactionsList: {
    maxHeight: 270,
    marginBottom: 10,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 11,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#ececec',
    backgroundColor: '#fff',
  },
  incomeItem: {},
  expenseItem: {},
  transactionInfo: {
    flex: 1,
  },
  transactionDesc: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 4,
  },
  transactionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionCategory: {
    fontSize: 14,
    color: '#888',
    marginRight: 10,
  },
  transactionDate: {
    fontSize: 13,
    color: '#aaa',
  },
  transactionRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 12,
  },
  deleteButton: {
    padding: 4,
  },
  deleteButtonText: {
    color: '#f44336',
    fontSize: 20,
    fontWeight: 'bold',
  },
  footer: {
    textAlign: 'center',
    color: '#aaa',
    fontSize: 13,
    marginTop: 10,
  },
});

export default App;
