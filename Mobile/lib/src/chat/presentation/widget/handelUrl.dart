import 'package:ecomly/src/chat/presentation/widget/webSocketService.dart';
import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class ChatMessageHandler extends StatelessWidget {
  final WebSocketService _webSocketService = WebSocketService();
  final String message;
  final bool isMine;

  ChatMessageHandler({
    super.key,
    required this.message,
    required this.isMine,
  });

  @override
  Widget build(BuildContext context) {
    final urlRegExp = RegExp(r'(https?:\/\/[^\s]+)');
    final urlMatches = urlRegExp.allMatches(message);

    // Nếu không có URL trong tin nhắn, chỉ cần hiển thị tin nhắn
    if (urlMatches.isEmpty) {
      return Text(message);
    }

    final textSpans = <TextSpan>[];
    int start = 0;

    for (final match in urlMatches) {
      // Thêm phần tin nhắn trước URL
      if (match.start > start) {
        textSpans.add(TextSpan(
          text: message.substring(start, match.start),
        ));
      }

      // Thêm URL dưới dạng văn bản tùy chỉnh và liên kết
      textSpans.add(TextSpan(
        text: 'Click here', // Văn bản tùy chỉnh bạn muốn hiển thị
        style: const TextStyle(
            color: Colors.blue, decoration: TextDecoration.underline),
        recognizer: TapGestureRecognizer()
          ..onTap = () {
            final url = match.group(0);
            final uri = Uri.parse(url!);
            final pathSegments = uri.pathSegments;

            if (pathSegments.length >= 2 && pathSegments[0] == 'products') {
              final productId = pathSegments[1];
              final price = uri.queryParameters['price'];

              if (price != null) {
                _webSocketService.disconnect();
                GoRouter.of(context).push(
                  '/products/$productId/$price',
                );
              }
            }
          },
      ));

      start = match.end;
    }

    // Thêm phần tin nhắn sau URL
    if (start < message.length) {
      textSpans.add(TextSpan(
        text: message.substring(start),
      ));
    }

    return RichText(
      text: TextSpan(
        children: textSpans,
        style: TextStyle(color: isMine ? Colors.white : Colors.black),
      ),
    );
  }
}
