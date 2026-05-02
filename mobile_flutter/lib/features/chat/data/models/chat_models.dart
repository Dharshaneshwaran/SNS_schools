class Conversation {
  final String id;
  final String name;
  final String role;
  final String type;
  final String lastMsg;
  final String time;
  final int unread;
  final bool online;

  Conversation({
    required this.id,
    required this.name,
    required this.role,
    required this.type,
    required this.lastMsg,
    required this.time,
    required this.unread,
    required this.online,
  });

  factory Conversation.fromJson(Map<String, dynamic> json) {
    return Conversation(
      id: json['id'],
      name: json['name'],
      role: json['role'],
      type: json['type'] ?? (json['role'] == 'parent' ? 'Parent' : (json['role'] == 'student' ? 'Student' : 'Staff')),
      lastMsg: json['lastMsg'] ?? '',
      time: json['time'] ?? '',
      unread: json['unread'] ?? 0,
      online: json['online'] ?? false,
    );
  }
}

class ChatMessage {
  final String id;
  final String senderId;
  final String recipientId;
  final String text;
  final DateTime timestamp;
  final String status;

  ChatMessage({
    required this.id,
    required this.senderId,
    required this.recipientId,
    required this.text,
    required this.timestamp,
    required this.status,
  });

  factory ChatMessage.fromJson(Map<String, dynamic> json) {
    return ChatMessage(
      id: json['id'],
      senderId: json['senderId'],
      recipientId: json['recipientId'],
      text: json['text'],
      timestamp: DateTime.parse(json['timestamp']),
      status: json['status'],
    );
  }

  bool isMe(String currentUserId) => senderId == currentUserId;
}
