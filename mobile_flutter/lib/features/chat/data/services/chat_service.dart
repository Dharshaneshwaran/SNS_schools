import '../../../../core/services/api_service.dart';
import '../models/chat_models.dart';

class ChatService {
  final ApiService _apiService = ApiService();

  Future<List<Conversation>> getConversations() async {
    try {
      final response = await _apiService.get('/messaging/conversations');
      final List<dynamic> data = response.data;
      return data.map((json) => Conversation.fromJson(json)).toList();
    } catch (e) {
      rethrow;
    }
  }

  Future<List<ChatMessage>> getChatHistory(String recipientId) async {
    try {
      final response = await _apiService.get('/messaging/history/$recipientId');
      final List<dynamic> data = response.data;
      return data.map((json) => ChatMessage.fromJson(json)).toList();
    } catch (e) {
      rethrow;
    }
  }

  Future<ChatMessage> sendMessage(String recipientId, String text) async {
    try {
      final response = await _apiService.post('/messaging/send', data: {
        'recipientId': recipientId,
        'text': text,
      });
      return ChatMessage.fromJson(response.data);
    } catch (e) {
      rethrow;
    }
  }
}
