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

export default function TeamCommunicationScreen() {
  const teamMembers = [
    { id: 1, name: 'John Smith', role: 'Farm Manager', status: 'online', avatar: 'person' },
    { id: 2, name: 'Sarah Johnson', role: 'Crop Specialist', status: 'online', avatar: 'person' },
    { id: 3, name: 'Mike Wilson', role: 'Equipment Tech', status: 'away', avatar: 'person' },
    { id: 4, name: 'Lisa Brown', role: 'Data Analyst', status: 'offline', avatar: 'person' }
  ];

  const recentMessages = [
    {
      id: 1,
      sender: 'Sarah Johnson',
      message: 'Crop inspection complete for sector A. All looking good!',
      time: '2 min ago',
      type: 'update'
    },
    {
      id: 2,
      sender: 'Mike Wilson',
      message: 'Irrigation pump #2 maintenance scheduled for tomorrow 9 AM',
      time: '15 min ago',
      type: 'maintenance'
    },
    {
      id: 3,
      sender: 'John Smith',
      message: 'Weather alert: Rain expected this evening. Adjust harvest plans.',
      time: '1 hour ago',
      type: 'alert'
    }
  ];

  const channels = [
    { id: 1, name: 'General Updates', members: 12, unread: 3, icon: 'campaign' },
    { id: 2, name: 'Field Operations', members: 8, unread: 0, icon: 'agriculture' },
    { id: 3, name: 'Equipment Status', members: 6, unread: 1, icon: 'settings' },
    { id: 4, name: 'Weather Alerts', members: 15, unread: 2, icon: 'wb-sunny' }
  ];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <MaterialIcons name="chat" size={32} color="#4CAF50" style={styles.headerIcon} />
          <Text style={styles.headerTitle}>Team Communication</Text>
          <Text style={styles.headerSubtitle}>Collaborate with your team</Text>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsSection}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Team Members</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: '#4CAF50' }]}>3</Text>
            <Text style={styles.statLabel}>Online Now</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: '#FF9800' }]}>6</Text>
            <Text style={styles.statLabel}>New Messages</Text>
          </View>
        </View>

        {/* Team Members */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Team Members</Text>
          {teamMembers.map((member) => (
            <TouchableOpacity key={member.id} style={styles.memberCard}>
              <View style={styles.memberInfo}>
                <MaterialIcons name={member.avatar as any} size={32} color="#4CAF50" style={styles.memberAvatar} />
                <View style={styles.memberDetails}>
                  <Text style={styles.memberName}>{member.name}</Text>
                  <Text style={styles.memberRole}>{member.role}</Text>
                </View>
              </View>
              <View style={styles.memberStatus}>
                <View style={[
                  styles.statusDot,
                  {
                    backgroundColor:
                      member.status === 'online' ? '#4CAF50' :
                      member.status === 'away' ? '#FF9800' : '#9E9E9E'
                  }
                ]} />
                <Text style={styles.statusText}>{member.status}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Communication Channels */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Channels</Text>
          {channels.map((channel) => (
            <TouchableOpacity key={channel.id} style={styles.channelCard}>
              <View style={styles.channelInfo}>
                <MaterialIcons name={channel.icon as any} size={24} color="#4CAF50" style={styles.channelIcon} />
                <View style={styles.channelDetails}>
                  <Text style={styles.channelName}>{channel.name}</Text>
                  <Text style={styles.channelMembers}>{channel.members} members</Text>
                </View>
              </View>
              {channel.unread > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadText}>{channel.unread}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Messages */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Messages</Text>
          {recentMessages.map((message) => (
            <View key={message.id} style={styles.messageCard}>
              <View style={styles.messageHeader}>
                <Text style={styles.messageSender}>{message.sender}</Text>
                <Text style={styles.messageTime}>{message.time}</Text>
              </View>
              <Text style={styles.messageText}>{message.message}</Text>
              <View style={[
                styles.messageType,
                {
                  backgroundColor:
                    message.type === 'alert' ? '#F44336' :
                    message.type === 'maintenance' ? '#FF9800' : '#4CAF50'
                }
              ]}>
                <Text style={styles.messageTypeText}>{message.type}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionCard}>
              <MaterialIcons name="edit" size={20} color="#2196F3" style={styles.actionIcon} />
              <Text style={styles.actionTitle}>New Message</Text>
              <Text style={styles.actionSubtitle}>Send to team</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionCard}>
              <Text style={styles.actionIcon}>📞</Text>
              <Text style={styles.actionTitle}>Voice Call</Text>
              <Text style={styles.actionSubtitle}>Start conference</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionCard}>
              <MaterialIcons name="assignment" size={20} color="#4CAF50" style={styles.actionIcon} />
              <Text style={styles.actionTitle}>Task Board</Text>
              <Text style={styles.actionSubtitle}>Assign tasks</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionCard}>
              <MaterialIcons name="analytics" size={20} color="#FF9800" style={styles.actionIcon} />
              <Text style={styles.actionTitle}>Reports</Text>
              <Text style={styles.actionSubtitle}>Team analytics</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      <NavBar currentRoute="team-communication" />
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
  memberCard: {
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
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  memberAvatar: {
    fontSize: 32,
    marginRight: 15,
  },
  memberDetails: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 3,
  },
  memberRole: {
    fontSize: 14,
    color: '#666',
  },
  memberStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    color: '#666',
    textTransform: 'capitalize',
  },
  channelCard: {
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
  channelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  channelIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  channelDetails: {
    flex: 1,
  },
  channelName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 3,
  },
  channelMembers: {
    fontSize: 12,
    color: '#666',
  },
  unreadBadge: {
    backgroundColor: '#F44336',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 24,
    alignItems: 'center',
  },
  unreadText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  messageCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  messageSender: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  messageTime: {
    fontSize: 12,
    color: '#666',
  },
  messageText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 10,
  },
  messageType: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  messageTypeText: {
    color: 'white',
    fontSize: 10,
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
