import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import NavBar from '@/components/navigation/NavBar';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function PlanAccessScreen() {
  const farmingPlans = [
    {
      id: 1,
      title: 'Tomato Cultivation Plan',
      status: 'active',
      progress: 75,
      startDate: '2024-01-15',
      endDate: '2024-04-15',
      priority: 'high'
    },
    {
      id: 2,
      title: 'Corn Harvest Schedule',
      status: 'pending',
      progress: 45,
      startDate: '2024-02-01',
      endDate: '2024-06-30',
      priority: 'medium'
    },
    {
      id: 3,
      title: 'Irrigation System Upgrade',
      status: 'completed',
      progress: 100,
      startDate: '2023-12-01',
      endDate: '2024-01-10',
      priority: 'high'
    }
  ];

  const upcomingTasks = [
    { id: 1, task: 'Soil pH Testing', due: 'Today', priority: 'high' },
    { id: 2, task: 'Pesticide Application', due: 'Tomorrow', priority: 'medium' },
    { id: 3, task: 'Equipment Maintenance', due: '3 days', priority: 'low' },
    { id: 4, task: 'Harvest Planning Meeting', due: '1 week', priority: 'medium' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#4CAF50';
      case 'pending': return '#FF9800';
      case 'completed': return '#2196F3';
      default: return '#9E9E9E';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#F44336';
      case 'medium': return '#FF9800';
      case 'low': return '#4CAF50';
      default: return '#9E9E9E';
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <MaterialIcons name="assignment" size={32} color="#4CAF50" style={styles.headerIcon} />
          <Text style={styles.headerTitle}>Plan Access & Update</Text>
          <Text style={styles.headerSubtitle}>Manage your farming plans and schedules</Text>
        </View>

        {/* Overview Stats */}
        <View style={styles.statsSection}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>Active Plans</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: '#FF9800' }]}>4</Text>
            <Text style={styles.statLabel}>Pending Tasks</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: '#4CAF50' }]}>85%</Text>
            <Text style={styles.statLabel}>Avg Progress</Text>
          </View>
        </View>

        {/* Farming Plans */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Farming Plans</Text>
          {farmingPlans.map((plan) => (
            <TouchableOpacity key={plan.id} style={styles.planCard}>
              <View style={styles.planHeader}>
                <Text style={styles.planTitle}>{plan.title}</Text>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(plan.status) }
                ]}>
                  <Text style={styles.statusText}>{plan.status}</Text>
                </View>
              </View>
              
              <View style={styles.planProgress}>
                <View style={styles.progressBar}>
                  <View style={[
                    styles.progressFill,
                    { width: `${plan.progress}%`, backgroundColor: getStatusColor(plan.status) }
                  ]} />
                </View>
                <Text style={styles.progressText}>{plan.progress}%</Text>
              </View>
              
              <View style={styles.planDetails}>
                <Text style={styles.planDate}>
                  📅 {plan.startDate} → {plan.endDate}
                </Text>
                <View style={[
                  styles.priorityTag,
                  { backgroundColor: getPriorityColor(plan.priority) }
                ]}>
                  <Text style={styles.priorityText}>{plan.priority} priority</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Upcoming Tasks */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Tasks</Text>
          {upcomingTasks.map((task) => (
            <TouchableOpacity key={task.id} style={styles.taskCard}>
              <View style={styles.taskInfo}>
                <Text style={styles.taskTitle}>{task.task}</Text>
                <Text style={styles.taskDue}>Due: {task.due}</Text>
              </View>
              <View style={[
                styles.taskPriority,
                { backgroundColor: getPriorityColor(task.priority) }
              ]}>
                <Text style={styles.taskPriorityText}>{task.priority}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionCard}>
              <MaterialIcons name="add" size={20} color="#4CAF50" style={styles.actionIcon} />
              <Text style={styles.actionTitle}>New Plan</Text>
              <Text style={styles.actionSubtitle}>Create farming plan</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionCard}>
              <MaterialIcons name="analytics" size={20} color="#2196F3" style={styles.actionIcon} />
              <Text style={styles.actionTitle}>Progress Report</Text>
              <Text style={styles.actionSubtitle}>View analytics</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionCard}>
              <MaterialIcons name="event" size={20} color="#FF9800" style={styles.actionIcon} />
              <Text style={styles.actionTitle}>Schedule Task</Text>
              <Text style={styles.actionSubtitle}>Add to calendar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionCard}>
              <MaterialIcons name="settings" size={20} color="#9C27B0" style={styles.actionIcon} />
              <Text style={styles.actionTitle}>Plan Settings</Text>
              <Text style={styles.actionSubtitle}>Configure plans</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      <NavBar currentRoute="plan-access" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingTop: 60,
  },
  headerIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  planCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  planTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  planProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginRight: 10,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    minWidth: 40,
  },
  planDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planDate: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  priorityTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  priorityText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  taskCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  taskDue: {
    fontSize: 14,
    color: '#666',
  },
  taskPriority: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 15,
  },
  taskPriorityText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    fontSize: 30,
    marginBottom: 10,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});
