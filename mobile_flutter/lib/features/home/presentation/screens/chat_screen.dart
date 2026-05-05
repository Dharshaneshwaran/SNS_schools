import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../core/providers/auth_provider.dart';
import '../../../../core/providers/services_providers.dart';
import '../../../../core/services/messaging_service.dart';

class ChatScreen extends ConsumerStatefulWidget {
  const ChatScreen({super.key});

  @override
  ConsumerState<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends ConsumerState<ChatScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  Contact? _selectedContact;
  Group? _selectedGroup;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final bg = isDark ? DarkAppColors.background : AppColors.background;
    final textColor = isDark ? DarkAppColors.textPrimary : AppColors.textPrimary;
    final cardColor = isDark ? DarkAppColors.card : AppColors.card;
    final borderColor = isDark ? DarkAppColors.border : AppColors.border;

    if (_selectedContact != null) {
      return _ConversationView(
        contact: _selectedContact!,
        onBack: () => setState(() => _selectedContact = null),
        isDark: isDark,
        textColor: textColor,
        cardColor: cardColor,
        borderColor: borderColor,
      );
    }

    if (_selectedGroup != null) {
      return _GroupConversationView(
        group: _selectedGroup!,
        onBack: () => setState(() => _selectedGroup = null),
        isDark: isDark,
        textColor: textColor,
        cardColor: cardColor,
        borderColor: borderColor,
      );
    }

    return Scaffold(
      backgroundColor: bg,
      body: Column(
        children: [
          // Header
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 8, 16, 0),
            child: Row(
              children: [
                Text('Messages', style: GoogleFonts.poppins(fontSize: 22, fontWeight: FontWeight.w800, color: textColor)),
                const Spacer(),
                IconButton(
                  icon: Icon(Icons.group_add_outlined, color: AppColors.primary),
                  onPressed: () => _showCreateGroupDialog(context),
                ),
              ],
            ),
          ),
          // Tabs
          Container(
            margin: const EdgeInsets.fromLTRB(16, 8, 16, 0),
            decoration: BoxDecoration(
              color: isDark ? DarkAppColors.surface : AppColors.surface,
              borderRadius: BorderRadius.circular(12),
            ),
            child: TabBar(
              controller: _tabController,
              indicator: BoxDecoration(
                color: AppColors.primary,
                borderRadius: BorderRadius.circular(10),
              ),
              indicatorSize: TabBarIndicatorSize.tab,
              labelColor: Colors.white,
              unselectedLabelColor: isDark ? DarkAppColors.textSecondary : AppColors.textSecondary,
              labelStyle: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w700),
              unselectedLabelStyle: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w500),
              dividerColor: Colors.transparent,
              tabs: const [Tab(text: 'Direct'), Tab(text: 'Groups')],
            ),
          ),
          const SizedBox(height: 8),
          Expanded(
            child: TabBarView(
              controller: _tabController,
              children: [
                _DirectMessagesTab(
                  isDark: isDark,
                  textColor: textColor,
                  cardColor: cardColor,
                  borderColor: borderColor,
                  onSelectContact: (c) => setState(() => _selectedContact = c),
                ),
                _GroupsTab(
                  isDark: isDark,
                  textColor: textColor,
                  cardColor: cardColor,
                  borderColor: borderColor,
                  onSelectGroup: (g) => setState(() => _selectedGroup = g),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  void _showCreateGroupDialog(BuildContext context) {
    final nameCtrl = TextEditingController();
    final descCtrl = TextEditingController();
    final isDark = Theme.of(context).brightness == Brightness.dark;

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: isDark ? DarkAppColors.card : AppColors.card,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: Text('Create Group', style: GoogleFonts.poppins(fontWeight: FontWeight.w700)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: nameCtrl,
              decoration: const InputDecoration(labelText: 'Group Name', border: OutlineInputBorder()),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: descCtrl,
              decoration: const InputDecoration(labelText: 'Description', border: OutlineInputBorder()),
            ),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary),
            onPressed: () async {
              if (nameCtrl.text.isNotEmpty) {
                await ref.read(messagingServiceProvider).createGroup(nameCtrl.text, descCtrl.text);
                ref.invalidate(groupsProvider);
                if (mounted) Navigator.pop(ctx);
              }
            },
            child: const Text('Create', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );
  }
}

class _DirectMessagesTab extends ConsumerWidget {
  final bool isDark;
  final Color textColor, cardColor, borderColor;
  final ValueChanged<Contact> onSelectContact;

  const _DirectMessagesTab({required this.isDark, required this.textColor, required this.cardColor, required this.borderColor, required this.onSelectContact});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final conversationsAsync = ref.watch(conversationsProvider);

    return conversationsAsync.when(
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (e, _) => _ErrorView(message: e.toString(), onRetry: () => ref.invalidate(conversationsProvider)),
      data: (contacts) {
        if (contacts.isEmpty) return _EmptyView(label: 'No conversations yet', isDark: isDark);
        return ListView.builder(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
          itemCount: contacts.length,
          itemBuilder: (_, i) => _ContactTile(
            contact: contacts[i],
            isDark: isDark,
            textColor: textColor,
            cardColor: cardColor,
            borderColor: borderColor,
            onTap: () => onSelectContact(contacts[i]),
          ),
        );
      },
    );
  }
}

class _GroupsTab extends ConsumerWidget {
  final bool isDark;
  final Color textColor, cardColor, borderColor;
  final ValueChanged<Group> onSelectGroup;

  const _GroupsTab({required this.isDark, required this.textColor, required this.cardColor, required this.borderColor, required this.onSelectGroup});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final groupsAsync = ref.watch(groupsProvider);

    return groupsAsync.when(
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (e, _) => _ErrorView(message: e.toString(), onRetry: () => ref.invalidate(groupsProvider)),
      data: (groups) {
        if (groups.isEmpty) return _EmptyView(label: 'No groups yet', isDark: isDark);
        return ListView.builder(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
          itemCount: groups.length,
          itemBuilder: (_, i) => _GroupTile(
            group: groups[i],
            isDark: isDark,
            textColor: textColor,
            cardColor: cardColor,
            borderColor: borderColor,
            onTap: () => onSelectGroup(groups[i]),
          ),
        );
      },
    );
  }
}

class _ContactTile extends StatelessWidget {
  final Contact contact;
  final bool isDark;
  final Color textColor, cardColor, borderColor;
  final VoidCallback onTap;

  const _ContactTile({required this.contact, required this.isDark, required this.textColor, required this.cardColor, required this.borderColor, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final textSecondary = isDark ? DarkAppColors.textSecondary : AppColors.textSecondary;
    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.only(bottom: 8),
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(color: cardColor, borderRadius: BorderRadius.circular(16), border: Border.all(color: borderColor)),
        child: Row(
          children: [
            Stack(
              children: [
                Container(
                  width: 48,
                  height: 48,
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(colors: [Color(0xFFFF7F50), Color(0xFFE66A3E)]),
                    borderRadius: BorderRadius.circular(14),
                  ),
                  child: Center(child: Text(contact.name.isNotEmpty ? contact.name[0].toUpperCase() : '?',
                      style: GoogleFonts.poppins(fontSize: 18, fontWeight: FontWeight.w800, color: Colors.white))),
                ),
                if (contact.online)
                  Positioned(
                    right: 0, bottom: 0,
                    child: Container(
                      width: 12, height: 12,
                      decoration: BoxDecoration(color: AppColors.success, shape: BoxShape.circle, border: Border.all(color: cardColor, width: 2)),
                    ),
                  ),
              ],
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(contact.name, style: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.w700, color: textColor)),
                  Text(contact.type, style: GoogleFonts.inter(fontSize: 12, color: textSecondary)),
                  if (contact.lastMsg != null)
                    Text(contact.lastMsg!, style: GoogleFonts.inter(fontSize: 12, color: textSecondary), maxLines: 1, overflow: TextOverflow.ellipsis),
                ],
              ),
            ),
            Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                if (contact.time != null)
                  Text(contact.time!, style: GoogleFonts.inter(fontSize: 11, color: textSecondary)),
                if (contact.unread > 0) ...[
                  const SizedBox(height: 4),
                  Container(
                    width: 20, height: 20,
                    decoration: BoxDecoration(color: AppColors.primary, shape: BoxShape.circle),
                    child: Center(child: Text('${contact.unread}', style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.w700, color: Colors.white))),
                  ),
                ],
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _GroupTile extends StatelessWidget {
  final Group group;
  final bool isDark;
  final Color textColor, cardColor, borderColor;
  final VoidCallback onTap;

  const _GroupTile({required this.group, required this.isDark, required this.textColor, required this.cardColor, required this.borderColor, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final textSecondary = isDark ? DarkAppColors.textSecondary : AppColors.textSecondary;
    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.only(bottom: 8),
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(color: cardColor, borderRadius: BorderRadius.circular(16), border: Border.all(color: borderColor)),
        child: Row(
          children: [
            Container(
              width: 48, height: 48,
              decoration: BoxDecoration(color: const Color(0xFF4F46E5).withValues(alpha: 0.12), borderRadius: BorderRadius.circular(14)),
              child: const Icon(Icons.group, color: Color(0xFF4F46E5), size: 24),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(group.name, style: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.w700, color: textColor)),
                  if (group.description != null)
                    Text(group.description!, style: GoogleFonts.inter(fontSize: 12, color: textSecondary), maxLines: 1, overflow: TextOverflow.ellipsis),
                  Text('${group.members.length} members', style: GoogleFonts.inter(fontSize: 11, color: textSecondary)),
                ],
              ),
            ),
            Icon(Icons.chevron_right, color: textSecondary),
          ],
        ),
      ),
    );
  }
}

class _ConversationView extends ConsumerStatefulWidget {
  final Contact contact;
  final VoidCallback onBack;
  final bool isDark;
  final Color textColor, cardColor, borderColor;

  const _ConversationView({required this.contact, required this.onBack, required this.isDark, required this.textColor, required this.cardColor, required this.borderColor});

  @override
  ConsumerState<_ConversationView> createState() => _ConversationViewState();
}

class _ConversationViewState extends ConsumerState<_ConversationView> {
  final _ctrl = TextEditingController();
  final _scroll = ScrollController();
  final _localMessages = <Message>[];

  @override
  void dispose() {
    _ctrl.dispose();
    _scroll.dispose();
    super.dispose();
  }

  Future<void> _send() async {
    final text = _ctrl.text.trim();
    if (text.isEmpty) return;
    _ctrl.clear();
    try {
      final msg = await ref.read(messagingServiceProvider).sendMessage(widget.contact.id, text);
      setState(() => _localMessages.add(msg));
      ref.invalidate(messageHistoryProvider(widget.contact.id));
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (_scroll.hasClients) _scroll.jumpTo(_scroll.position.maxScrollExtent);
      });
    } catch (_) {}
  }

  @override
  Widget build(BuildContext context) {
    final historyAsync = ref.watch(messageHistoryProvider(widget.contact.id));
    final authState = ref.watch(authStateProvider);
    final myId = authState.user?.id ?? '';
    final textSecondary = widget.isDark ? DarkAppColors.textSecondary : AppColors.textSecondary;
    final bg = widget.isDark ? DarkAppColors.background : AppColors.background;

    return Scaffold(
      backgroundColor: bg,
      appBar: AppBar(
        backgroundColor: widget.cardColor,
        elevation: 0,
        leading: IconButton(icon: Icon(Icons.arrow_back, color: AppColors.primary), onPressed: widget.onBack),
        title: Row(
          children: [
            Container(
              width: 36, height: 36,
              decoration: BoxDecoration(gradient: const LinearGradient(colors: [Color(0xFFFF7F50), Color(0xFFE66A3E)]), borderRadius: BorderRadius.circular(10)),
              child: Center(child: Text(widget.contact.name.isNotEmpty ? widget.contact.name[0].toUpperCase() : '?',
                  style: GoogleFonts.poppins(fontSize: 14, fontWeight: FontWeight.w800, color: Colors.white))),
            ),
            const SizedBox(width: 10),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(widget.contact.name, style: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.w700, color: widget.textColor)),
                Text(widget.contact.online ? 'Online' : 'Offline',
                    style: GoogleFonts.inter(fontSize: 11, color: widget.contact.online ? AppColors.success : textSecondary)),
              ],
            ),
          ],
        ),
        titleSpacing: 0,
      ),
      body: Column(
        children: [
          Expanded(
            child: historyAsync.when(
              loading: () => const Center(child: CircularProgressIndicator()),
              error: (e, _) => Center(child: Text('Error loading messages', style: GoogleFonts.inter(color: AppColors.error))),
              data: (msgs) {
                final allMsgs = [...msgs, ..._localMessages];
                return ListView.builder(
                  controller: _scroll,
                  padding: const EdgeInsets.all(16),
                  itemCount: allMsgs.length,
                  itemBuilder: (_, i) => _MessageBubble(
                    message: allMsgs[i],
                    isMe: allMsgs[i].senderId == myId,
                    isDark: widget.isDark,
                  ),
                );
              },
            ),
          ),
          _MessageInput(ctrl: _ctrl, onSend: _send, isDark: widget.isDark, cardColor: widget.cardColor, borderColor: widget.borderColor),
        ],
      ),
    );
  }
}

class _GroupConversationView extends ConsumerStatefulWidget {
  final Group group;
  final VoidCallback onBack;
  final bool isDark;
  final Color textColor, cardColor, borderColor;

  const _GroupConversationView({required this.group, required this.onBack, required this.isDark, required this.textColor, required this.cardColor, required this.borderColor});

  @override
  ConsumerState<_GroupConversationView> createState() => _GroupConversationViewState();
}

class _GroupConversationViewState extends ConsumerState<_GroupConversationView> {
  final _ctrl = TextEditingController();
  final _scroll = ScrollController();

  @override
  void dispose() {
    _ctrl.dispose();
    _scroll.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final bg = widget.isDark ? DarkAppColors.background : AppColors.background;

    return Scaffold(
      backgroundColor: bg,
      appBar: AppBar(
        backgroundColor: widget.cardColor,
        elevation: 0,
        leading: IconButton(icon: Icon(Icons.arrow_back, color: AppColors.primary), onPressed: widget.onBack),
        title: Row(
          children: [
            Container(
              width: 36, height: 36,
              decoration: BoxDecoration(color: const Color(0xFF4F46E5).withValues(alpha: 0.12), borderRadius: BorderRadius.circular(10)),
              child: const Icon(Icons.group, color: Color(0xFF4F46E5), size: 20),
            ),
            const SizedBox(width: 10),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(widget.group.name, style: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.w700, color: widget.textColor)),
                Text('${widget.group.members.length} members', style: GoogleFonts.inter(fontSize: 11, color: widget.isDark ? DarkAppColors.textSecondary : AppColors.textSecondary)),
              ],
            ),
          ],
        ),
        titleSpacing: 0,
      ),
      body: const Center(child: Text('Group messages coming soon')),
    );
  }
}

class _MessageBubble extends StatelessWidget {
  final Message message;
  final bool isMe;
  final bool isDark;

  const _MessageBubble({required this.message, required this.isMe, required this.isDark});

  @override
  Widget build(BuildContext context) {
    return Align(
      alignment: isMe ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.only(bottom: 8),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
        constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.72),
        decoration: BoxDecoration(
          color: isMe ? AppColors.primary : (isDark ? DarkAppColors.card : AppColors.card),
          borderRadius: BorderRadius.only(
            topLeft: const Radius.circular(16),
            topRight: const Radius.circular(16),
            bottomLeft: isMe ? const Radius.circular(16) : const Radius.circular(4),
            bottomRight: isMe ? const Radius.circular(4) : const Radius.circular(16),
          ),
          boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.04), blurRadius: 6, offset: const Offset(0, 2))],
        ),
        child: Text(message.text,
            style: GoogleFonts.inter(fontSize: 14, color: isMe ? Colors.white : (isDark ? DarkAppColors.textPrimary : AppColors.textPrimary))),
      ),
    );
  }
}

class _MessageInput extends StatelessWidget {
  final TextEditingController ctrl;
  final VoidCallback onSend;
  final bool isDark;
  final Color cardColor, borderColor;

  const _MessageInput({required this.ctrl, required this.onSend, required this.isDark, required this.cardColor, required this.borderColor});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.fromLTRB(16, 8, 16, 16),
      decoration: BoxDecoration(color: cardColor, border: Border(top: BorderSide(color: borderColor))),
      child: Row(
        children: [
          Expanded(
            child: TextField(
              controller: ctrl,
              style: GoogleFonts.inter(fontSize: 14, color: isDark ? DarkAppColors.textPrimary : AppColors.textPrimary),
              decoration: InputDecoration(
                hintText: 'Type a message...',
                hintStyle: GoogleFonts.inter(fontSize: 14, color: isDark ? DarkAppColors.textSecondary : AppColors.textSecondary),
                filled: true,
                fillColor: isDark ? DarkAppColors.surface : AppColors.surface,
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(24), borderSide: BorderSide.none),
                contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
              ),
              onSubmitted: (_) => onSend(),
            ),
          ),
          const SizedBox(width: 8),
          GestureDetector(
            onTap: onSend,
            child: Container(
              width: 44, height: 44,
              decoration: BoxDecoration(gradient: const LinearGradient(colors: [Color(0xFFFF7F50), Color(0xFFE66A3E)]), shape: BoxShape.circle),
              child: const Icon(Icons.send_rounded, color: Colors.white, size: 20),
            ),
          ),
        ],
      ),
    );
  }
}

class _EmptyView extends StatelessWidget {
  final String label;
  final bool isDark;
  const _EmptyView({required this.label, required this.isDark});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.chat_bubble_outline, size: 64, color: isDark ? DarkAppColors.textSecondary : AppColors.textSecondary),
          const SizedBox(height: 12),
          Text(label, style: GoogleFonts.inter(fontSize: 16, color: isDark ? DarkAppColors.textSecondary : AppColors.textSecondary)),
        ],
      ),
    );
  }
}

class _ErrorView extends StatelessWidget {
  final String message;
  final VoidCallback onRetry;
  const _ErrorView({required this.message, required this.onRetry});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.error_outline, size: 48, color: AppColors.error),
          const SizedBox(height: 12),
          Text(message, textAlign: TextAlign.center, style: GoogleFonts.inter(color: AppColors.error)),
          const SizedBox(height: 16),
          ElevatedButton(onPressed: onRetry, child: const Text('Retry')),
        ],
      ),
    );
  }
}
