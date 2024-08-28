import 'dart:convert';

import 'package:http/http.dart' as http;

class ChatService {
  final String serverAddress;

  ChatService(this.serverAddress);

  Future<List<Map<String, dynamic>>> fetchChatHistory(
      String senderId, String recipientId) async {
    final response = await http.get(
      Uri.parse('$serverAddress/messages/$senderId/$recipientId'),
      headers: {
        'Content-Type': 'application/json',
      },
    );

    if (response.statusCode == 200) {
      List<dynamic> jsonResponse = jsonDecode(response.body);
      return jsonResponse
          .map((message) => {
                'text': message['content'],
                'isMine': message['senderId'] == senderId,
              })
          .toList();
    } else {
      throw Exception('Failed to load chat history');
    }
  }
}
