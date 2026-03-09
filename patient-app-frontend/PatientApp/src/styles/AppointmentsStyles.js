import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    paddingTop: 50,
    paddingBottom: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 10,
    padding: 5,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  filterTabActive: {
    backgroundColor: '#007AFF',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#fff',
  },
  listContainer: {
    padding: 15,
    paddingTop: 0,
  },
  appointmentCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  appointmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateContainer: {
    width: 60,
    height: 60,
    backgroundColor: '#007AFF',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  dateDay: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  dateMonth: {
    fontSize: 12,
    color: '#fff',
    textTransform: 'uppercase',
  },
  appointmentInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  appointmentTime: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  consultationTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  consultationTypeIcon: {
    fontSize: 14,
    marginRight: 5,
  },
  consultationTypeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#007AFF',
  },
  appointmentReason: {
    fontSize: 12,
    color: '#999',
  },
  statusContainer: {
    alignItems: 'center',
  },
  statusIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  cancelButton: {
    marginTop: 15,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dc3545',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#dc3545',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});