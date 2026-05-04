import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../../core/theme/app_theme.dart';

class EventsScreen extends StatefulWidget {
  const EventsScreen({super.key});

  @override
  State<EventsScreen> createState() => _EventsScreenState();
}

class _EventsScreenState extends State<EventsScreen> {
  final _likedPosts = <int>{};
  final _savedPosts = <int>{};

  final _events = [
    {
      'id': 1,
      'title': 'Annual Sports Day 2026',
      'date': 'Apr 20, 2026',
      'location': 'Main Stadium',
      'category': 'Sports',
      'color': const Color(0xFFFF7F50),
      'icon': Icons.emoji_events,
      'image': 'assets/events/sports-day.png',
      'likes': 1248,
      'comments': 48,
      'description': 'What an incredible display of talent and sportsmanship! Our students showcased outstanding athletic abilities across track, field, and team sports.',
      'hashtags': ['#SportsDay2026', '#SNSAcademy', '#Champions'],
      'postedTime': '2 hours ago',
    },
    {
      'id': 2,
      'title': 'Science Exhibition',
      'date': 'Apr 14, 2026',
      'location': 'Block A Hall',
      'category': 'Academic',
      'color': const Color(0xFF6C63FF),
      'icon': Icons.science,
      'image': 'assets/events/science-exhibition.png',
      'likes': 856,
      'comments': 32,
      'description': 'Exploring the future! Our young scientists blew everyone away at this year\'s Science Exhibition.',
      'hashtags': ['#ScienceFair', '#Innovation', '#FutureScientists'],
      'postedTime': '1 day ago',
    },
    {
      'id': 3,
      'title': 'Cultural Fest 2026',
      'date': 'Apr 10, 2026',
      'location': 'Open Air Theatre',
      'category': 'Cultural',
      'color': const Color(0xFF10B981),
      'icon': Icons.celebration,
      'image': 'assets/events/cultural-fest.png',
      'likes': 2432,
      'comments': 156,
      'description': 'A night filled with music, dance, and vibrant performances! From classical to modern fusion.',
      'hashtags': ['#CulturalFest', '#ArtAndCulture', '#SNSPride'],
      'postedTime': '3 days ago',
    },
    {
      'id': 4,
      'title': 'Parent-Teacher Meet',
      'date': 'Apr 5, 2026',
      'location': 'Conference Room',
      'category': 'Meeting',
      'color': const Color(0xFFF59E0B),
      'icon': Icons.handshake,
      'image': 'assets/events/parent-teacher-meet.png',
      'likes': 432,
      'comments': 12,
      'description': 'A productive Parent-Teacher Meet discussing student progress and future goals.',
      'hashtags': ['#PTM', '#ParentTeacher', '#Education'],
      'postedTime': '1 week ago',
    },
    {
      'id': 5,
      'title': 'Inter-School Debate',
      'date': 'Mar 28, 2026',
      'location': 'Auditorium',
      'category': 'Academic',
      'color': const Color(0xFF8B5CF6),
      'icon': Icons.mic,
      'image': 'assets/events/debate-competition.png',
      'likes': 176,
      'comments': 21,
      'description': 'Our debate team represented SNS Academy brilliantly at the Inter-School Debate Championship!',
      'hashtags': ['#DebateChampionship', '#PublicSpeaking', '#Leaders'],
      'postedTime': '1 month ago',
    },
    {
      'id': 6,
      'title': 'Yoga & Wellness Day',
      'date': 'Mar 21, 2026',
      'location': 'Wellness Center',
      'category': 'Health',
      'color': const Color(0xFF10B981),
      'icon': Icons.self_improvement,
      'image': 'assets/events/yoga-wellness.png',
      'likes': 203,
      'comments': 15,
      'description': 'Mind, body, and soul — all aligned on Yoga & Wellness Day!',
      'hashtags': ['#YogaDay', '#Wellness', '#MindfulSchool'],
      'postedTime': '1 month ago',
    },
  ];

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textColor = isDark ? DarkAppColors.textPrimary : AppColors.textPrimary;
    final textSecondaryColor = isDark ? DarkAppColors.textSecondary : AppColors.textSecondary;
    final cardColor = isDark ? DarkAppColors.card : AppColors.card;
    final surfaceColor = isDark ? DarkAppColors.surface : AppColors.surface;
    final borderColor = isDark ? DarkAppColors.border : AppColors.border;

    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(vertical: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Stories row
          SizedBox(
            height: 100,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              itemCount: _events.length,
              separatorBuilder: (_, __) => const SizedBox(width: 14),
              itemBuilder: (_, i) {
                final event = _events[i];
                return Column(
                  children: [
                    Container(
                      width: 68,
                      height: 68,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        gradient: const LinearGradient(
                          colors: [Color(0xFFF09433), Color(0xFFE6683C), Color(0xFFDC2743), Color(0xFFCC2366), Color(0xFFBC1888)],
                        ),
                        border: Border.all(color: isDark ? DarkAppColors.background : AppColors.background, width: 3),
                      ),
                      child: Container(
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          border: Border.all(color: isDark ? DarkAppColors.background : AppColors.background, width: 2),
                        ),
                        child: ClipOval(
                          child: Image.asset(
                            event['image'] as String,
                            fit: BoxFit.cover,
                            errorBuilder: (_, __, ___) => CircleAvatar(
                              backgroundColor: event['color'] as Color,
                              child: Icon(event['icon'] as IconData, color: Colors.white, size: 24),
                            ),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      (event['title'] as String).split(' ').first,
                      style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.w600, color: textColor),
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                );
              },
            ),
          ),
          const SizedBox(height: 20),
          // Feed
          ...(_events.map((event) => _EventCard(
            event: event,
            isLiked: _likedPosts.contains(event['id']),
            isSaved: _savedPosts.contains(event['id']),
            onLike: () => setState(() {
              final id = event['id'] as int;
              _likedPosts.contains(id) ? _likedPosts.remove(id) : _likedPosts.add(id);
            }),
            onSave: () => setState(() {
              final id = event['id'] as int;
              _savedPosts.contains(id) ? _savedPosts.remove(id) : _savedPosts.add(id);
            }),
            textColor: textColor,
            textSecondaryColor: textSecondaryColor,
            cardColor: cardColor,
            surfaceColor: surfaceColor,
            borderColor: borderColor,
            isDark: isDark,
          ))),
        ],
      ),
    );
  }
}

class _EventCard extends StatelessWidget {
  final Map<String, dynamic> event;
  final bool isLiked;
  final bool isSaved;
  final VoidCallback onLike;
  final VoidCallback onSave;
  final Color textColor;
  final Color textSecondaryColor;
  final Color cardColor;
  final Color surfaceColor;
  final Color borderColor;
  final bool isDark;

  const _EventCard({
    required this.event,
    required this.isLiked,
    required this.isSaved,
    required this.onLike,
    required this.onSave,
    required this.textColor,
    required this.textSecondaryColor,
    required this.cardColor,
    required this.surfaceColor,
    required this.borderColor,
    required this.isDark,
  });

  @override
  Widget build(BuildContext context) {
    final color = event['color'] as Color;
    final likes = event['likes'] as int;

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        color: cardColor,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: borderColor),
        boxShadow: [
          BoxShadow(color: isDark ? Colors.black.withValues(alpha: 0.3) : Colors.black.withValues(alpha: 0.04), blurRadius: 20, offset: const Offset(0, 8)),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header
          Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                Container(
                  width: 40,
                  height: 40,
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(colors: [Color(0xFFFF7F50), Color(0xFFFFD700)]),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Center(
                    child: Text('S', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w800, fontSize: 16)),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Text('SNS Academy', style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w700, color: textColor)),
                          const SizedBox(width: 4),
                          const Icon(Icons.verified, size: 16, color: Color(0xFF4F46E5)),
                        ],
                      ),
                      Text('${event['location']} • ${event['postedTime']}', style: GoogleFonts.inter(fontSize: 12, color: textSecondaryColor)),
                    ],
                  ),
                ),
                Icon(Icons.more_vert, color: textSecondaryColor),
              ],
            ),
          ),
          // Image
          GestureDetector(
            onDoubleTap: onLike,
            child: Stack(
              children: [
                Container(
                  width: double.infinity,
                  height: 300,
                  decoration: BoxDecoration(
                    color: color.withValues(alpha: 0.1),
                  ),
                  child: Image.asset(
                    event['image'] as String,
                    fit: BoxFit.cover,
                    errorBuilder: (_, __, ___) => Container(
                      color: color.withValues(alpha: 0.1),
                      child: Center(
                        child: Icon(event['icon'] as IconData, size: 80, color: color.withValues(alpha: 0.3)),
                      ),
                    ),
                  ),
                ),
                Positioned(
                  top: 16,
                  right: 16,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: Colors.black.withValues(alpha: 0.3),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(event['icon'] as IconData, size: 14, color: Colors.white),
                        const SizedBox(width: 6),
                        Text(event['category'] as String, style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.w700, color: Colors.white)),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
          // Actions
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    GestureDetector(
                      onTap: onLike,
                      child: Icon(isLiked ? Icons.favorite : Icons.favorite_border, size: 28, color: isLiked ? AppColors.error : textColor),
                    ),
                    const SizedBox(width: 16),
                    Icon(Icons.chat_bubble_outline, size: 28, color: textColor),
                    const SizedBox(width: 16),
                    Icon(Icons.share_outlined, size: 28, color: textColor),
                    const Spacer(),
                    GestureDetector(
                      onTap: onSave,
                      child: Icon(isSaved ? Icons.bookmark : Icons.bookmark_border, size: 28, color: isSaved ? AppColors.primary : textColor),
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                Text('${isLiked ? likes + 1 : likes} likes', style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w700, color: textColor)),
                const SizedBox(height: 6),
                RichText(
                  text: TextSpan(
                    children: [
                      TextSpan(text: 'SNS Academy ', style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w700, color: textColor)),
                      TextSpan(text: event['description'] as String, style: GoogleFonts.inter(fontSize: 14, color: textColor)),
                    ],
                  ),
                ),
                const SizedBox(height: 8),
                Wrap(
                  spacing: 8,
                  children: (event['hashtags'] as List<String>).map((h) => Text(h, style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w600, color: color))).toList(),
                ),
                const SizedBox(height: 8),
                Text('View all ${event['comments']} comments', style: GoogleFonts.inter(fontSize: 13, color: textSecondaryColor, fontWeight: FontWeight.w600)),
                const SizedBox(height: 10),
                Row(
                  children: [
                    Icon(Icons.calendar_today, size: 16, color: textSecondaryColor),
                    const SizedBox(width: 6),
                    Text(event['date'] as String, style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w600, color: textSecondaryColor)),
                    const Spacer(),
                    Icon(Icons.location_on, size: 16, color: AppColors.primary),
                    const SizedBox(width: 4),
                    Text(event['location'] as String, style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w700, color: AppColors.primary)),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
