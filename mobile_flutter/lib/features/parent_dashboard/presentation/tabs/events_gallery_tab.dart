import 'package:flutter/material.dart';

class EventPost {
  final int id;
  final String title;
  final String date;
  final String timeAgo;
  final String category;
  final Color color;
  final IconData icon;
  final String image;
  final String caption;
  final int likes;
  final int comments;
  final String postedBy;
  final String avatar;
  final List<String> hashtags;

  EventPost({
    required this.id,
    required this.title,
    required this.date,
    required this.timeAgo,
    required this.category,
    required this.color,
    required this.icon,
    required this.image,
    required this.caption,
    required this.likes,
    required this.comments,
    required this.postedBy,
    required this.avatar,
    required this.hashtags,
  });
}

final List<EventPost> events = [
  EventPost(
    id: 1,
    title: "Annual Sports Day 2026",
    date: "Apr 20, 2026",
    timeAgo: "9 days ago",
    category: "Sports",
    color: const Color(0xFFFF7F50),
    icon: Icons.emoji_events,
    image: "assets/events/sports-day.png",
    caption:
        "What an incredible day of sportsmanship! 🏆 Our students showcased outstanding athletic abilities across track, field, and team sports. Proud of every participant who gave their best!",
    likes: 248,
    comments: 32,
    postedBy: "SNS Academy",
    avatar: "SA",
    hashtags: ["#SportsDay2026", "#SNSAcademy", "#Champions"],
  ),
  EventPost(
    id: 2,
    title: "Science Exhibition",
    date: "Apr 14, 2026",
    timeAgo: "2 weeks ago",
    category: "Academic",
    color: const Color(0xFF6C63FF),
    icon: Icons.science,
    image: "assets/events/science-exhibition.png",
    caption:
        "Young scientists blew everyone away at this year's Science Exhibition! 🔬 From renewable energy models to AI-powered robots — the future is bright with these innovators.",
    likes: 189,
    comments: 24,
    postedBy: "SNS Academy",
    avatar: "SA",
    hashtags: ["#ScienceExhibition", "#Innovation", "#FutureScientists"],
  ),
  EventPost(
    id: 3,
    title: "Cultural Fest 2026",
    date: "Apr 10, 2026",
    timeAgo: "2 weeks ago",
    category: "Cultural",
    color: const Color(0xFF10B981),
    icon: Icons.masks,
    image: "assets/events/cultural-fest.png",
    caption:
        "Colors, music, and dance filled the campus during Cultural Fest 2026! 🎭 From classical performances to modern fusion — our students proved that art knows no boundaries.",
    likes: 312,
    comments: 45,
    postedBy: "SNS Academy",
    avatar: "SA",
    hashtags: ["#CulturalFest", "#ArtAndCulture", "#SNSPride"],
  ),
  EventPost(
    id: 4,
    title: "Parent-Teacher Meet",
    date: "Apr 5, 2026",
    timeAgo: "3 weeks ago",
    category: "Meeting",
    color: const Color(0xFFF59E0B),
    icon: Icons.handshake,
    image: "assets/events/parent-teacher-meet.png",
    caption:
        "A productive Parent-Teacher Meet where we discussed academic progress, goals, and the holistic development of every student. 🤝 Together, we build a better future!",
    likes: 134,
    comments: 18,
    postedBy: "SNS Academy",
    avatar: "SA",
    hashtags: ["#PTM", "#ParentTeacher", "#Education"],
  ),
  EventPost(
    id: 5,
    title: "Inter-School Debate",
    date: "Mar 28, 2026",
    timeAgo: "1 month ago",
    category: "Academic",
    color: const Color(0xFF8B5CF6),
    icon: Icons.mic,
    image: "assets/events/debate-competition.png",
    caption:
        "Our debate team represented SNS Academy brilliantly at the Inter-School Debate Championship! 🎙️ Articulate, confident, and well-prepared — these students are natural leaders.",
    likes: 176,
    comments: 21,
    postedBy: "SNS Academy",
    avatar: "SA",
    hashtags: ["#DebateChampionship", "#PublicSpeaking", "#Leaders"],
  ),
  EventPost(
    id: 6,
    title: "Yoga & Wellness Day",
    date: "Mar 21, 2026",
    timeAgo: "1 month ago",
    category: "Health",
    color: const Color(0xFF10B981),
    icon: Icons.fitness_center,
    image: "assets/events/yoga-wellness.png",
    caption:
        "Mind, body, and soul — all aligned on Yoga & Wellness Day! 🧘 Students and teachers came together for a rejuvenating session of yoga, meditation, and mindfulness.",
    likes: 203,
    comments: 15,
    postedBy: "SNS Academy",
    avatar: "SA",
    hashtags: ["#YogaDay", "#Wellness", "#MindfulSchool"],
  ),
];

class EventsGalleryTab extends StatefulWidget {
  const EventsGalleryTab({super.key});

  @override
  State<EventsGalleryTab> createState() => _EventsGalleryTabState();
}

class _EventsGalleryTabState extends State<EventsGalleryTab> {
  final Set<int> _likedPosts = {};
  final Set<int> _savedPosts = {};
  final Map<int, int> _likeCounts = {for (var e in events) e.id: e.likes};
  final Set<int> _expandedCaptions = {};

  void _toggleLike(int id) {
    setState(() {
      if (_likedPosts.contains(id)) {
        _likedPosts.remove(id);
        _likeCounts[id] = (_likeCounts[id] ?? 0) - 1;
      } else {
        _likedPosts.add(id);
        _likeCounts[id] = (_likeCounts[id] ?? 0) + 1;
      }
    });
  }

  void _toggleSave(int id) {
    setState(() {
      if (_savedPosts.contains(id)) {
        _savedPosts.remove(id);
      } else {
        _savedPosts.add(id);
      }
    });
  }

  void _toggleCaption(int id) {
    setState(() {
      if (_expandedCaptions.contains(id)) {
        _expandedCaptions.remove(id);
      } else {
        _expandedCaptions.add(id);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Scaffold(
      backgroundColor: const Color(0xFFF9FAFB),
      body: CustomScrollView(
        slivers: [
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: Text(
                'Explore recent school events and highlights',
                style: theme.textTheme.bodyMedium?.copyWith(
                  color: Colors.grey[600],
                ),
              ),
            ),
          ),
          // Stories Section - Mirroring Web
          SliverToBoxAdapter(
            child: Container(
              height: 110,
              padding: const EdgeInsets.symmetric(vertical: 10),
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 16),
                itemCount: events.length,
                itemBuilder: (context, index) {
                  final event = events[index];
                  return Container(
                    margin: const EdgeInsets.only(right: 16),
                    child: Column(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(3),
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            gradient: const LinearGradient(
                              colors: [Color(0xFFF09433), Color(0xFFE6683C), Color(0xFFDC2743), Color(0xFFCC2366), Color(0xFFBC1888)],
                              begin: Alignment.bottomLeft,
                              end: Alignment.topRight,
                            ),
                          ),
                          child: Container(
                            padding: const EdgeInsets.all(2),
                            decoration: const BoxDecoration(
                              color: Colors.white,
                              shape: BoxShape.circle,
                            ),
                            child: CircleAvatar(
                              radius: 30,
                              backgroundImage: AssetImage(event.image),
                            ),
                          ),
                        ),
                        const SizedBox(height: 6),
                        Text(
                          event.title.split(' ')[0],
                          style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),
          ),
          const SliverPadding(padding: EdgeInsets.only(top: 8)),
          SliverList(
            delegate: SliverChildBuilderDelegate(
              (context, index) {
                final event = events[index];
                final isLiked = _likedPosts.contains(event.id);
                final isSaved = _savedPosts.contains(event.id);
                final isExpanded = _expandedCaptions.contains(event.id);

                final captionPreview = event.caption.length > 80 && !isExpanded
                    ? '${event.caption.substring(0, 80)}...'
                    : event.caption;

                return Container(
                  margin: const EdgeInsets.only(bottom: 24, left: 16, right: 16),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.05),
                        blurRadius: 10,
                        offset: const Offset(0, 4),
                      )
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Header
                      Padding(
                        padding: const EdgeInsets.all(12),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Row(
                              children: [
                                Container(
                                  padding: const EdgeInsets.all(2),
                                  decoration: BoxDecoration(
                                    gradient: const LinearGradient(
                                      colors: [Color(0xFFFF7F50), Color(0xFFE66A3E)],
                                    ),
                                    borderRadius: BorderRadius.circular(20),
                                  ),
                                  child: const CircleAvatar(
                                    radius: 16,
                                    backgroundColor: Colors.white,
                                    child: Icon(Icons.school, size: 16, color: Color(0xFFFF7F50)),
                                  ),
                                ),
                                const SizedBox(width: 10),
                                Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    const Text(
                                      'SNS Academy',
                                      style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                                    ),
                                    Row(
                                      children: [
                                        Container(
                                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                          decoration: BoxDecoration(
                                            color: event.color,
                                            borderRadius: BorderRadius.circular(4),
                                          ),
                                          child: Text(
                                            event.category,
                                            style: const TextStyle(
                                                color: Colors.white,
                                                fontSize: 10,
                                                fontWeight: FontWeight.bold),
                                          ),
                                        ),
                                        const SizedBox(width: 6),
                                        Text(
                                          event.timeAgo,
                                          style: TextStyle(color: Colors.grey[500], fontSize: 12),
                                        ),
                                      ],
                                    ),
                                  ],
                                ),
                              ],
                            ),
                            IconButton(
                              icon: const Icon(Icons.more_horiz),
                              color: Colors.grey[600],
                              onPressed: () {},
                            ),
                          ],
                        ),
                      ),
                      // Image
                      GestureDetector(
                        onDoubleTap: () => _toggleLike(event.id),
                        child: Image.asset(
                          event.image,
                          width: double.infinity,
                          height: 320,
                          fit: BoxFit.cover,
                        ),
                      ),
                      // Actions
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 4),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Row(
                              children: [
                                IconButton(
                                  icon: Icon(
                                    isLiked ? Icons.favorite : Icons.favorite_border,
                                    color: isLiked ? Colors.red : Colors.black87,
                                  ),
                                  onPressed: () => _toggleLike(event.id),
                                ),
                                IconButton(
                                  icon: const Icon(Icons.chat_bubble_outline),
                                  color: Colors.black87,
                                  onPressed: () {},
                                ),
                                IconButton(
                                  icon: const Icon(Icons.send_outlined),
                                  color: Colors.black87,
                                  onPressed: () {},
                                ),
                              ],
                            ),
                            IconButton(
                              icon: Icon(
                                isSaved ? Icons.bookmark : Icons.bookmark_border,
                                color: isSaved ? const Color(0xFFFF7F50) : Colors.black87,
                              ),
                              onPressed: () => _toggleSave(event.id),
                            ),
                          ],
                        ),
                      ),
                      // Likes
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        child: Text(
                          '${_likeCounts[event.id]} likes',
                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                        ),
                      ),
                      const SizedBox(height: 4),
                      // Caption
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        child: RichText(
                          text: TextSpan(
                            style: const TextStyle(color: Colors.black87, fontSize: 14),
                            children: [
                              const TextSpan(
                                text: 'SNS Academy ',
                                style: TextStyle(fontWeight: FontWeight.bold),
                              ),
                              TextSpan(text: captionPreview),
                            ],
                          ),
                        ),
                      ),
                      if (event.caption.length > 80 && !isExpanded)
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 16),
                          child: GestureDetector(
                            onTap: () => _toggleCaption(event.id),
                            child: const Text(
                              'more',
                              style: TextStyle(color: Colors.grey, fontWeight: FontWeight.bold),
                            ),
                          ),
                        ),
                      const SizedBox(height: 6),
                      // Hashtags
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        child: Wrap(
                          spacing: 4,
                          children: event.hashtags
                              .map((tag) => Text(
                                    tag,
                                    style: TextStyle(
                                      color: event.color,
                                      fontWeight: FontWeight.bold,
                                      fontSize: 13,
                                    ),
                                  ))
                              .toList(),
                        ),
                      ),
                      const SizedBox(height: 6),
                      // Comments
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        child: Text(
                          'View all ${event.comments} comments',
                          style: TextStyle(color: Colors.grey[600], fontSize: 13),
                        ),
                      ),
                      const SizedBox(height: 6),
                      // Date
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        child: Text(
                          event.date.toUpperCase(),
                          style: TextStyle(color: Colors.grey[500], fontSize: 10, letterSpacing: 1.2),
                        ),
                      ),
                      const SizedBox(height: 16),
                    ],
                  ),
                );
              },
              childCount: events.length,
            ),
          ),
        ],
      ),
    );
  }
}
