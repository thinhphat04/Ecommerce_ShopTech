import 'dart:convert';
import 'package:ecomly/core/common/singletons/cache.dart';
import 'package:web_socket_channel/web_socket_channel.dart';
import 'package:ecomly/core/utils/constants/network_constants.dart';

class WebSocketService {
  WebSocketChannel? channel;

  void connect(Function(String) onMessageReceived) {
    var senderId =
        Cache.instance.userId!; // Thay thế bằng giá trị thực tế của senderId
    final wsUrl = '${NetworkConstants.websocketurl}?userId=$senderId';
    print('Attempting to connect to WebSocket at: $wsUrl');

    channel = WebSocketChannel.connect(
      Uri.parse(wsUrl),
    );

    channel?.stream.listen(
      (message) {
        print('Message received: $message');
        onMessageReceived(message); // Gọi callback khi nhận tin nhắn
      },
      onError: (error) {
        print('WebSocket Error: $error');
      },
      onDone: () {
        print('WebSocket connection closed');
      },
    );

    // Đợi một chút để kết nối được thiết lập và kiểm tra trạng thái kết nối
    Future.delayed(const Duration(seconds: 1), () {
      if (channel != null) {
        print('Connected to WebSocket at: $wsUrl');
      } else {
        print('Failed to connect to WebSocket');
      }
    });
  }

  void sendMessage(String recipientId, String content, String senderId) {
    final message = {
      'chatId': '${senderId}_$recipientId',
      'senderId': senderId,
      'recipientId': recipientId,
      'content': content,
      'timestamp': DateTime.now().toIso8601String(),
    };
    if (channel != null) {
      final encodedMessage = jsonEncode(message);
      print('Sending message: $encodedMessage');
      channel?.sink.add(encodedMessage);
    } else {
      print('Cannot send message: WebSocket is not connected.');
    }
  }

  void disconnect() {
    channel?.sink.close();
    print('Disconnected from WebSocket');
  }
}
