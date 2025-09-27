<!-- admin/index.php - Complete Dashboard -->
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - KCI Admin Panel</title>
    <link rel="stylesheet" href="assets/css/admin.css">
    <style>
        .dashboard-welcome {
            background: linear-gradient(135deg, #800020, #5D001E);
            color: white;
            padding: 2rem;
            border-radius: 12px;
            margin-bottom: 2rem;
        }
        
        .dashboard-welcome h1 {
            font-size: 2rem;
            margin-bottom: 0.5rem;
        }
        
        .dashboard-welcome p {
            opacity: 0.9;
            font-size: 1.1rem;
        }
        
        .stats-overview {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
        }
        
        .stat-card {
            background: white;
            padding: 1.5rem;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            display: flex;
            align-items: center;
            gap: 1.5rem;
            transition: all 0.3s;
        }
        
        .stat-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 15px rgba(0,0,0,0.15);
        }
        
        .stat-icon {
            width: 70px;
            height: 70px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
        }
        
        .stat-icon.members {
            background: linear-gradient(135deg, #667eea, #764ba2);
        }
        
        .stat-icon.events {
            background: linear-gradient(135deg, #f093fb, #f5576c);
        }
        
        .stat-icon.blog {
            background: linear-gradient(135deg, #4facfe, #00f2fe);
        }
        
        .stat-icon.gallery {
            background: linear-gradient(135deg, #43e97b, #38f9d7);
        }
        
        .stat-icon.revenue {
            background: linear-gradient(135deg, #fa709a, #fee140);
        }
        
        .stat-icon.visitors {
            background: linear-gradient(135deg, #30cfd0, #330867);
        }
        
        .stat-details h3 {
            font-size: 2.5rem;
            color: #333;
            margin: 0;
        }
        
        .stat-details p {
            color: #666;
            margin: 0.25rem 0 0;
        }
        
        .stat-details .trend {
            display: inline-block;
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            font-size: 0.85rem;
            font-weight: 600;
            margin-top: 0.5rem;
        }
        
        .trend.up {
            background: #d4edda;
            color: #155724;
        }
        
        .trend.down {
            background: #f8d7da;
            color: #721c24;
        }
        
        .dashboard-grid {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 2rem;
        }
        
        .chart-container {
            background: white;
            padding: 1.5rem;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        
        .chart-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
        }
        
        .chart-header h2 {
            font-size: 1.25rem;
            color: #333;
        }
        
        .chart-filters {
            display: flex;
            gap: 0.5rem;
        }
        
        .chart-filter {
            padding: 0.5rem 1rem;
            border: 1px solid #ddd;
            background: white;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.3s;
        }
        
        .chart-filter.active {
            background: #800020;
            color: white;
            border-color: #800020;
        }
        
        .activity-feed {
            background: white;
            padding: 1.5rem;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        
        .activity-feed h2 {
            font-size: 1.25rem;
            color: #333;
            margin-bottom: 1rem;
        }
        
        .activity-item {
            display: flex;
            gap: 1rem;
            padding: 1rem 0;
            border-bottom: 1px solid #f0f0f0;
        }
        
        .activity-item:last-child {
            border-bottom: none;
        }
        
        .activity-icon {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
            flex-shrink: 0;
        }
        
        .activity-icon.member {
            background: #e3f2fd;
        }
        
        .activity-icon.event {
            background: #fce4ec;
        }
        
        .activity-icon.blog {
            background: #e8f5e9;
        }
        
        .activity-details {
            flex: 1;
        }
        
        .activity-details h4 {
            font-size: 0.95rem;
            color: #333;
            margin: 0 0 0.25rem;
        }
        
        .activity-details p {
            font-size: 0.85rem;
            color: #666;
            margin: 0;
        }
        
        .activity-time {
            font-size: 0.8rem;
            color: #999;
        }
        
        .quick-actions {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-top: 2rem;
        }
        
        .quick-action-btn {
            padding: 1.5rem;
            background: white;
            border: 2px solid #e0e0e0;
            border-radius: 12px;
            text-align: center;
            text-decoration: none;
            color: #333;
            transition: all 0.3s;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.75rem;
        }
        
        .quick-action-btn:hover {
            border-color: #800020;
            transform: translateY(-3px);
            box-shadow: 0 6px 12px rgba(0,0,0,0.1);
        }
        
        .quick-action-btn .icon {
            font-size: 2rem;
        }
        
        .quick-action-btn span {
            font-weight: 600;
        }
        
        .upcoming-events {
            background: white;
            padding: 1.5rem;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            margin-top: 2rem;
        }
        
        .upcoming-events h2 {
            font-size: 1.25rem;
            color: #333;
            margin-bottom: 1rem;
        }
        
        .event-list {
            display: grid;
            gap: 1rem;
        }
        
        .event-item {
            display: grid;
            grid-template-columns: 80px 1fr auto;
            gap: 1rem;
            padding: 1rem;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            transition: all 0.3s;
        }
        
        .event-item:hover {
            background: #f8f9fa;
            border-color: #800020;
        }
        
        .event-date {
            background: #800020;
            color: white;
            border-radius: 8px;
            padding: 0.75rem;
            text-align: center;
        }
        
        .event-date .day {
            font-size: 1.5rem;
            font-weight: bold;
        }
        
        .event-date .month {
            font-size: 0.85rem;
            text-transform: uppercase;
        }
        
        .event-info h3 {
            margin: 0 0 0.25rem;
            color: #333;
            font-size: 1rem;
        }
        
        .event-info p {
            margin: 0;
            color: #666;
            font-size: 0.9rem;
        }
        
        .event-participants {
            text-align: right;
            color: #666;
            font-size: 0.9rem;
        }
        
        .event-participants strong {
            display: block;
            color: #333;
            font-size: 1.1rem;
        }
    </style>
</head>
<body>
    <?php
    session_start();
    require_once 'config/auth.php';
    $auth->requireLogin();
    
    // Get database connection
    require_once 'config/database.php';
    $db = Database::getInstance()->getConnection();
    
    // Fetch statistics
    $stats = [
        'total_members' => $db->query("SELECT COUNT(*) FROM members WHERE member_status = 'active'")->fetchColumn(),
        'pending_members' => $db->query("SELECT COUNT(*) FROM members WHERE member_status = 'pending'")->fetchColumn(),
        'total_events' => $db->query("SELECT COUNT(*) FROM events WHERE status = 'upcoming'")->fetchColumn(),
        'total_blog' => $db->query("SELECT COUNT(*) FROM blog_posts WHERE status = 'published'")->fetchColumn(),
        'total_gallery' => $db->query("SELECT COUNT(*) FROM gallery WHERE is_active = 1")->fetchColumn(),
        'monthly_visitors' => rand(5000, 15000) // Replace with actual analytics
    ];
    
    // Calculate trends (mock data - replace with actual calculations)
    $membersTrend = '+12%';
    $eventsTrend = '+5%';
    $visitorsTrend = '+23%';
    
    // Fetch recent activities
    $activities = $db->query("
        SELECT * FROM activity_logs 
        ORDER BY created_at DESC 
        LIMIT 10
    ")->fetchAll();
    
    // Fetch upcoming events
    $upcomingEvents = $db->query("
        SELECT * FROM events 
        WHERE status = 'upcoming' 
        AND event_date >= NOW() 
        ORDER BY event_date ASC 
        LIMIT 5
    ")->fetchAll();
    ?>
    
    <div class="dashboard-container">
        <!-- Sidebar -->
        <aside class="sidebar">
            <div class="sidebar-header">
                <h2>KCI Admin</h2>
                <p>Management System</p>
            </div>
            <ul class="sidebar-menu">
                <li><a href="index.php" class="active"><i>📊</i> Dashboard</a></li>
                <li><a href="modules/events.php"><i>📅</i> Events</a></li>
                <li><a href="modules/gallery.php"><i>🖼️</i> Gallery</a></li>
                <li><a href="modules/blog.php"><i>📝</i> Blog</a></li>
                <li><a href="modules/testimonials.php"><i>💬</i> Testimonials</a></li>
                <li><a href="modules/partners.php"><i>🤝</i> Partners</a></li>
                <li><a href="modules/members.php"><i>👥</i> Members</a></li>
                <li><a href="modules/users.php"><i>👤</i> Users</a></li>
                <li><a href="modules/settings.php"><i>⚙️</i> Settings</a></li>
                <li><a href="logout.php"><i>🚪</i> Logout</a></li>
            </ul>
        </aside>
        
        <main class="main-content">
            <!-- Welcome Section -->
            <div class="dashboard-welcome">
                <h1>Welcome back, <?php echo htmlspecialchars($_SESSION['full_name'] ?? 'Admin'); ?>!</h1>
                <p>Here's what's happening with KCI today.</p>
            </div>
            
            <!-- Statistics Overview -->
            <div class="stats-overview">
                <div class="stat-card">
                    <div class="stat-icon members">👥</div>
                    <div class="stat-details">
                        <h3><?php echo number_format($stats['total_members']); ?></h3>
                        <p>Active Members</p>
                        <span class="trend up">↑ <?php echo $membersTrend; ?> this month</span>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon events">📅</div>
                    <div class="stat-details">
                        <h3><?php echo $stats['total_events']; ?></h3>
                        <p>Upcoming Events</p>
                        <span class="trend up">↑ <?php echo $eventsTrend; ?> vs last month</span>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon blog">📝</div>
                    <div class="stat-details">
                        <h3><?php echo $stats['total_blog']; ?></h3>
                        <p>Blog Posts</p>
                        <span class="trend up">↑ 3 new this week</span>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon gallery">🖼️</div>
                    <div class="stat-details">
                        <h3><?php echo number_format($stats['total_gallery']); ?></h3>
                        <p>Gallery Photos</p>
                        <span class="trend up">↑ 25 added</span>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon revenue">💰</div>
                    <div class="stat-details">
                        <h3><?php echo $stats['pending_members']; ?></h3>
                        <p>Pending Approvals</p>
                        <span class="trend down">↓ Process soon</span>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon visitors">👁️</div>
                    <div class="stat-details">
                        <h3><?php echo number_format($stats['monthly_visitors']); ?></h3>
                        <p>Monthly Visitors</p>
                        <span class="trend up">↑ <?php echo $visitorsTrend; ?> growth</span>
                    </div>
                </div>
            </div>
            
            <!-- Dashboard Grid -->
            <div class="dashboard-grid">
                <!-- Chart Section -->
                <div>
                    <!-- Members Growth Chart -->
                    <div class="chart-container">
                        <div class="chart-header">
                            <h2>Members Growth</h2>
                            <div class="chart-filters">
                                <button class="chart-filter active">Week</button>
                                <button class="chart-filter">Month</button>
                                <button class="chart-filter">Year</button>
                            </div>
                        </div>
                        <canvas id="membersChart" height="300"></canvas>
                    </div>
                    
                    <!-- Upcoming Events -->
                    <div class="upcoming-events">
                        <h2>Upcoming Events</h2>
                        <div class="event-list">
                            <?php foreach ($upcomingEvents as $event): ?>
                            <div class="event-item">
                                <div class="event-date">
                                    <div class="day"><?php echo date('d', strtotime($event['event_date'])); ?></div>
                                    <div class="month"><?php echo date('M', strtotime($event['event_date'])); ?></div>
                                </div>
                                <div class="event-info">
                                    <h3><?php echo htmlspecialchars($event['title']); ?></h3>
                                    <p>📍 <?php echo htmlspecialchars($event['location']); ?></p>
                                </div>
                                <div class="event-participants">
                                    <strong><?php echo $event['current_participants'] ?? 0; ?>/<?php echo $event['max_participants'] ?? '∞'; ?></strong>
                                    Participants
                                </div>
                            </div>
                            <?php endforeach; ?>
                        </div>
                    </div>
                </div>
                
                <!-- Activity Feed -->
                <div class="activity-feed">
                    <h2>Recent Activity</h2>
                    <?php 
                    // Mock activity data - replace with actual data
                    $mockActivities = [
                        ['type' => 'member', 'title' => 'New Member Registration', 'desc' => 'Linda Wijaya joined', 'time' => '5 min ago'],
                        ['type' => 'event', 'title' => 'Event Updated', 'desc' => 'Chinese New Year 2025', 'time' => '1 hour ago'],
                        ['type' => 'blog', 'title' => 'Blog Post Published', 'desc' => 'Cultural Heritage Article', 'time' => '3 hours ago'],
                        ['type' => 'member', 'title' => 'Member Approved', 'desc' => 'John Doe approved', 'time' => '5 hours ago'],
                        ['type' => 'event', 'title' => 'Registration Opened', 'desc' => 'Basketball Tournament', 'time' => '1 day ago']
                    ];
                    
                    foreach ($mockActivities as $activity):
                    ?>
                    <div class="activity-item">
                        <div class="activity-icon <?php echo $activity['type']; ?>">
                            <?php 
                            echo $activity['type'] === 'member' ? '👤' : 
                                ($activity['type'] === 'event' ? '📅' : '📝');
                            ?>
                        </div>
                        <div class="activity-details">
                            <h4><?php echo $activity['title']; ?></h4>
                            <p><?php echo $activity['desc']; ?></p>
                            <span class="activity-time"><?php echo $activity['time']; ?></span>
                        </div>
                    </div>
                    <?php endforeach; ?>
                </div>
            </div>
            
            <!-- Quick Actions -->
            <div class="quick-actions">
                <a href="modules/events.php?action=add" class="quick-action-btn">
                    <div class="icon">➕</div>
                    <span>Create Event</span>
                </a>
                <a href="modules/blog.php?action=add" class="quick-action-btn">
                    <div class="icon">✍️</div>
                    <span>Write Blog</span>
                </a>
                <a href="modules/gallery.php?action=upload" class="quick-action-btn">
                    <div class="icon">📸</div>
                    <span>Upload Photos</span>
                </a>
                <a href="modules/members.php?filter=pending" class="quick-action-btn">
                    <div class="icon">⏳</div>
                    <span>Review Members</span>
                </a>
                <a href="modules/settings.php#backup" class="quick-action-btn">
                    <div class="icon">💾</div>
                    <span>Backup Data</span>
                </a>
                <a href="../" target="_blank" class="quick-action-btn">
                    <div class="icon">🌐</div>
                    <span>View Website</span>
                </a>
            </div>
        </main>
    </div>
    
    <!-- Chart.js for visualizations -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script>
        // Members Growth Chart
        const ctx = document.getElementById('membersChart').getContext('2d');
        const membersChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'New Members',
                    data: [12, 19, 15, 25, 22, 30, 28],
                    borderColor: '#800020',
                    backgroundColor: 'rgba(128, 0, 32, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            display: true,
                            color: '#f0f0f0'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
        
        // Chart filter functionality
        document.querySelectorAll('.chart-filter').forEach(button => {
            button.addEventListener('click', function() {
                document.querySelectorAll('.chart-filter').forEach(btn => {
                    btn.classList.remove('active');
                });
                this.classList.add('active');
                
                // Update chart data based on filter
                const filter = this.textContent;
                updateChartData(filter);
            });
        });
        
        function updateChartData(period) {
            // Mock data update - replace with actual data fetching
            let labels, data;
            
            switch(period) {
                case 'Week':
                    labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                    data = [12, 19, 15, 25, 22, 30, 28];
                    break;
                case 'Month':
                    labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
                    data = [85, 92, 78, 105];
                    break;
                case 'Year':
                    labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    data = [120, 150, 180, 190, 220, 240, 210, 230, 250, 280, 310, 350];
                    break;
            }
            
            membersChart.data.labels = labels;
            membersChart.data.datasets[0].data = data;
            membersChart.update();
        }
        
        // Auto-refresh dashboard every 5 minutes
        setInterval(function() {
            location.reload();
        }, 300000);
    </script>
</body>
</html>