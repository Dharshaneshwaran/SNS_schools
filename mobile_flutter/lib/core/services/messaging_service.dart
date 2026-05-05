import 'api_service.dart';

class Contact {
  final String id;
  final String name;
  final String role;
  final String type;
  final String? lastMsg;
  final String? time;
  final int unread;
  final bool online;

  Contact({required this.id, required this.name, required this.role, required this.type, this.lastMsg, this.time, required this.unread, required this.online});

  factory Contact.fromJson(Map<String, dynamic> j) => Contact(
    id: j['id']?.toString() ?? '',
    name: j['name'] ?? '',
    role: j['role'] ?? '',
    type: j['type'] ?? '',
    lastMsg: j['lastMsg'],
    time: j['time'],
    unread: j['unread'] ?? 0,
    online: j['online'] ?? false,
  );
}

class Message {
  final String id;
  final String senderId;
  final String recipientId;
  final String text;
  final String timestamp;
  final String status;

  Message({required this.id, required this.senderId, required this.recipientId, required this.text, required this.timestamp, required this.status});

  factory Message.fromJson(Map<String, dynamic> j) => Message(
    id: j['id']?.toString() ?? '',
    senderId: j['senderId']?.toString() ?? '',
    recipientId: j['recipientId']?.toString() ?? '',
    text: j['text'] ?? '',
    timestamp: j['timestamp'] ?? '',
    status: j['status'] ?? 'sent',
  );
}

class Group {
  final String id;
  final String name;
  final String? description;
  final List<dynamic> members;
  final int messageCount;

  Group({required this.id, required this.name, this.description, required this.members, required this.messageCount});

  factory Group.fromJson(Map<String, dynamic> j) => Group(
    id: j['id']?.toString() ?? '',
    name: j['name'] ?? '',
    description: j['description'],
    members: j['members'] ?? [],
    messageCount: (j['_count']?['messages'] ?? 0) as int,
  );
}

class MessagingService {
  final ApiService _api;
  MessagingService(this._api);

  Future<List<Contact>> getConversations() async {
    final res = await _api.get('/messaging/conversations');
    final data = res.data;
    if (data is List) return data.map((e) => Contact.fromJson(e)).toList();
    return [];
  }

  Future<List<Message>> getHistory(String recipientId) async {
    final res = await _api.get('/messaging/history/$recipientId');
    final data = res.data;
    if (data is List) return data.map((e) => Message.fromJson(e)).toList();
    return [];
  }

  Future<Message> sendMessage(String recipientId, String text) async {
    final res = await _api.post('/messaging/send', data: {'recipientId': recipientId, 'text': text});
    return Message.fromJson(res.data);
  }

  Future<List<Group>> getGroups() async {
    final res = await _api.get('/messaging/groups');
    final data = res.data;
    if (data is List) return data.map((e) => Group.fromJson(e)).toList();
    return [];
  }

  Future<List<Message>> getGroupMessages(String groupId) async {
    final res = await _api.get('/messaging/messages/$groupId');
    final data = res.data;
    if (data is List) return data.map((e) => Message.fromJson(e)).toList();
    return [];
  }

  Future<Group> createGroup(String name, String description) async {
    final res = await _api.post('/messaging/groups', data: {'name': name, 'description': description});
    return Group.fromJson(res.data);
  }

  Future<void> addGroupMember(String groupId, String userId) async {
    await _api.post('/messaging/groups/$groupId/members', data: {'userId': userId});
  }
}
