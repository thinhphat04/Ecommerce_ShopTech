import 'dart:convert';
import 'package:ecomly/src/chat/presentation/widget/handelUrl.dart';
import 'package:flutter/material.dart';
import 'package:ecomly/core/utils/constants/network_constants.dart';
import 'package:ecomly/src/chat/data/chatHistory_iml.dart';
import 'package:ecomly/src/chat/presentation/widget/webSocketService.dart';
import 'package:ecomly/core/common/singletons/cache.dart';

class ChatScreen extends StatefulWidget {
  const ChatScreen({super.key});

  @override
  _ChatScreenState createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final WebSocketService _webSocketService = WebSocketService();
  final TextEditingController _messageController = TextEditingController();
  final List<Map<String, dynamic>> _messages = [];
  late String _recipientId;
  late String _userId;
  final ChatService _chatService = ChatService(NetworkConstants.baseUrl);

  @override
  void initState() {
    super.initState();
    _userId = Cache.instance.userId!;
    _recipientId = '66cac61ba1a23e8c836e5e53'; // gán cứng id của admin
    _webSocketService.connect(_onMessageReceived);
    _loadChatHistory();
  }

  @override
  void dispose() {
    _webSocketService.disconnect();
    super.dispose();
  }

  void _sendMessage() {
    final message = _messageController.text;

    // Gửi tin nhắn qua WebSocket
    _webSocketService.sendMessage(_recipientId, message, _userId);

    // Thêm tin nhắn vào danh sách và cập nhật UI
    setState(() {
      _messages.insert(0, {
        'text': message,
        'isMine': true, // Đánh dấu tin nhắn này là của người gửi
      }); // Thêm vào đầu danh sách
    });

    // Xóa nội dung trong TextField sau khi gửi
    _messageController.clear();
  }

  void _loadChatHistory() async {
    try {
      final chatHistory =
      await _chatService.fetchChatHistory(_userId, _recipientId);
      setState(() {
        _messages.addAll(chatHistory.map((message) => {
          'text': message['text'],
          'isMine': message['isMine'],
        }));
      });
    } catch (e) {
      print('Failed to load chat history: $e');
    }
  }

  void _onMessageReceived(String message) {
    try {
      final jsonMessage = jsonDecode(message);
      setState(() {
        _messages.insert(0, {
          'text': jsonMessage['content'],
          'isMine': false, // Đánh dấu tin nhắn này là của người nhận
        });
      });
    } catch (e) {
      print('Failed to parse received message: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Customer Support'),
      ),
      body: Column(
        children: <Widget>[
          Expanded(
            child: ListView.builder(
              reverse: true,
              itemCount: _messages.length,
              itemBuilder: (context, index) {
                final message = _messages[index];
                final isMine = message['isMine'] as bool;

                return Align(
                  alignment:
                  isMine ? Alignment.centerRight : Alignment.centerLeft,
                  child: Container(
                    margin: const EdgeInsets.symmetric(
                        vertical: 4.0, horizontal: 8.0),
                    padding: const EdgeInsets.symmetric(
                        vertical: 10.0, horizontal: 16.0),
                    decoration: BoxDecoration(
                      color: isMine ? Colors.blue : Colors.grey[300],
                      borderRadius: BorderRadius.circular(12.0),
                    ),
                    child: ChatMessageHandler(
                      message: message['text'] as String,
                      isMine: isMine,
                    ),
                  ),
                );
              },
            ),
          ),
          Padding(
            padding: const EdgeInsets.fromLTRB(
                16.0, 8.0, 16.0, 12.0), // Thêm khoảng cách ở phía dưới
            child: Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12.0),
                boxShadow: [
                  BoxShadow(
                    color: Colors.grey.withOpacity(0.5),
                    spreadRadius: 2,
                    blurRadius: 5,
                    offset: const Offset(0, 3), // Thêm bóng đổ
                  ),
                ],
              ),
              child: Padding(
                padding: const EdgeInsets.all(
                    12.0), // Thêm khoảng cách bên trong Container
                child: Row(
                  children: <Widget>[
                    Expanded(
                      child: TextField(
                        controller: _messageController,
                        decoration: const InputDecoration(
                          hintText: 'Type message here...',
                          border: InputBorder.none,
                        ),
                        style: const TextStyle(
                          fontSize: 16.0,
                          color: Colors.black,
                        ),
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.send),
                      color: Colors.blue,
                      onPressed: _sendMessage,
                    ),
                  ],
                ),
              ),
            ),
          )
        ],
      ),
    );
  }
}
