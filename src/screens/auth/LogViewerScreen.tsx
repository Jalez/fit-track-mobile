import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  Share 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BackgroundContainer from '../../components/common/BackgroundContainer';
import Logger, { LogEntry } from '../../utils/logger';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const LogViewerScreen = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  
  const loadLogs = async () => {
    setLoading(true);
    const appLogs = await Logger.getAllLogs();
    setLogs(appLogs.reverse()); // Show newest first
    setLoading(false);
  };
  
  useEffect(() => {
    loadLogs();
  }, []);
  
  const clearLogs = async () => {
    setLoading(true);
    await Logger.clearLogs();
    setLogs([]);
    setLoading(false);
  };
  
  const shareLogs = async () => {
    try {
      const logText = logs
        .map(log => `[${log.timestamp}] ${log.level.toUpperCase()}: ${log.message} ${log.details || ''}`)
        .join('\n\n');
      
      await Share.share({
        message: `App Logs (${new Date().toLocaleString()}):\n\n${logText}`,
        title: 'App Logs'
      });
    } catch (error) {
      Logger.error('Failed to share logs', error);
    }
  };
  
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'info': return '#4CAF50';
      case 'warn': return '#FFC107';
      case 'error': return '#F44336';
      default: return '#9E9E9E';
    }
  };
  
  const renderLogItem = ({ item }: { item: LogEntry }) => {
    const date = new Date(item.timestamp);
    const formattedTime = date.toLocaleTimeString();
    const levelColor = getLevelColor(item.level);
    
    return (
      <View style={styles.logItem}>
        <View style={styles.logHeader}>
          <View style={[styles.levelIndicator, { backgroundColor: levelColor }]}>
            <Text style={styles.levelText}>{item.level.charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={styles.timestamp}>{formattedTime}</Text>
        </View>
        <Text style={styles.message}>{item.message}</Text>
        {item.details && <Text style={styles.details}>{item.details}</Text>}
      </View>
    );
  };
  
  return (
    <BackgroundContainer>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>App Logs</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionButton} onPress={shareLogs}>
            <Icon name="share-variant" size={22} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={clearLogs}>
            <Icon name="trash-can-outline" size={22} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={loadLogs}>
            <Icon name="refresh" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#5D3FD3" />
          <Text style={styles.loadingText}>Loading logs...</Text>
        </View>
      ) : (
        <FlatList
          data={logs}
          renderItem={renderLogItem}
          keyExtractor={(item) => item.timestamp}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="text-box-outline" size={60} color="rgba(255, 255, 255, 0.3)" />
              <Text style={styles.emptyText}>No logs found</Text>
            </View>
          }
        />
      )}
    </BackgroundContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    marginLeft: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  headerActions: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#fff',
  },
  listContainer: {
    padding: 12,
    paddingBottom: 40,
  },
  logItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  logHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  levelIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  levelText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
  },
  message: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    marginBottom: 4,
  },
  details: {
    fontSize: 13,
    color: '#666',
    fontStyle: 'italic',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginTop: 40,
  },
  emptyText: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 16,
  },
});

export default LogViewerScreen;