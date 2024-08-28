import 'dart:convert';

import 'package:ecomly/core/utils/constants/network_constants.dart';
import 'package:stomp_dart_client/stomp_dart_client.dart';

class WebSocketService {
  StompClient? client;

  void connect() {
    client = StompClient(
      config: StompConfig(
        url: NetworkConstants.websocketurl,
        onConnect: onConnect,
        onWebSocketError: (error) => print('WebSocket Error: $error'),
        onDisconnect: (error) => print('Disconnected$error'),
        onStompError: (frame) => print('STOMP Error: ${frame.body}'),
      ),
    );
    client?.activate();
  }

  void onConnect(StompFrame frame) {
    print('Connected to WebSocket');
    // Đăng ký các subscription ở đây nếu cần
  }

  void sendMessage(String recipientId, String content, String senderId) {
    final message = {
      'senderId': senderId, // Thay đổi với ID người gửi thực tế
      'recipientId': recipientId,
      'content': content,
      'timestamp': DateTime.now().toIso8601String(),
    };
    if (client != null && client!.isActive) {
      print('Sending message: $message'); // Debug: In ra message đang gửi
      client?.send(
        destination: '/app/chat',
        body: jsonEncode(message),
      );
    } else {
      print('Cannot send message: WebSocket is not connected.');
    }
  }

  void disconnect() {
    client?.deactivate();
    print('Disconnected to WebSocket');
  }
}
