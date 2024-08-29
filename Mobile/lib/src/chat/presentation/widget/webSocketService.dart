import 'dart:convert';
import 'package:web_socket_channel/web_socket_channel.dart';
import 'package:ecomly/core/utils/constants/network_constants.dart';

class WebSocketService {
  WebSocketChannel? channel;

  void connect(Function(String) onMessageReceived) {
    // Kết nối đến WebSocket server
    channel = WebSocketChannel.connect(
      Uri.parse(NetworkConstants.websocketurl),
    );

    // Lắng nghe sự kiện khi kết nối thành công
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
    Future.delayed(Duration(seconds: 1), () {
      if (channel != null) {
        print('Connected to WebSocket');
      } else {
        print('Failed to connect to WebSocket');
      }
    });
  }

  void sendMessage(String recipientId, String content, String senderId) {
    final message = {
      'senderId': senderId,
      'recipientId': recipientId,
      'content': content,
      'timestamp': DateTime.now().toIso8601String(),
    };
    if (channel != null) {
      final encodedMessage = jsonEncode(message);
      print('Sending message: $encodedMessage');  // In ra message đang gửi
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
