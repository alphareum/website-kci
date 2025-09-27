<!-- Maintenance Mode Page (maintenance.php - place in root) -->
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Maintenance - Komunitas Chinese Indonesia</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #800020, #5D001E);
            color: white;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        
        .maintenance-container {
            text-align: center;
            max-width: 600px;
        }
        
        .logo {
            font-size: 4rem;
            font-weight: bold;
            margin-bottom: 2rem;
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
        }
        
        h1 {
            font-size: 2.5rem;
            margin-bottom: 1rem;
        }
        
        p {
            font-size: 1.2rem;
            margin-bottom: 2rem;
            opacity: 0.9;
        }
        
        .progress-bar {
            width: 100%;
            height: 6px;
            background: rgba(255,255,255,0.2);
            border-radius: 3px;
            overflow: hidden;
            margin: 2rem 0;
        }
        
        .progress {
            height: 100%;
            background: white;
            width: 60%;
            animation: loading 2s ease-in-out infinite;
        }
        
        @keyframes loading {
            0% { width: 0%; }
            50% { width: 80%; }
            100% { width: 60%; }
        }
        
        .contact-info {
            margin-top: 3rem;
            padding-top: 2rem;
            border-top: 1px solid rgba(255,255,255,0.3);
        }
        
        .contact-info h3 {
            margin-bottom: 1rem;
            font-size: 1.2rem;
        }
        
        .contact-info a {
            color: white;
            text-decoration: none;
            opacity: 0.8;
            transition: opacity 0.3s;
        }
        
        .contact-info a:hover {
            opacity: 1;
        }
        
        .countdown {
            font-size: 1.5rem;
            margin-top: 2rem;
            font-weight: 600;
        }
    </style>
</head>
<body>
    <div class="maintenance-container">
        <div class="logo">KCI</div>
        <h1>We'll Be Back Soon!</h1>
        <p>Kami sedang melakukan pemeliharaan sistem untuk meningkatkan layanan kepada Anda.</p>
        
        <div class="progress-bar">
            <div class="progress"></div>
        </div>
        
        <div class="countdown" id="countdown">
            Expected completion: <span id="timer">calculating...</span>
        </div>
        
        <div class="contact-info">
            <h3>Need immediate assistance?</h3>
            <p>Contact us at: <a href="mailto:admin@komunitaschineseindonesia.com">admin@komunitaschineseindonesia.com</a></p>
            <p>WhatsApp: <a href="https://wa.me/6287884924385">+62 878-8492-4385</a></p>
        </div>
    </div>
    
    <script>
        // Countdown timer (set your end time)
        const endTime = new Date('2025-09-26T12:00:00').getTime();
        
        function updateCountdown() {
            const now = new Date().getTime();
            const distance = endTime - now;
            
            if (distance > 0) {
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                
                document.getElementById('timer').innerHTML = 
                    hours + "h " + minutes + "m " + seconds + "s";
            } else {
                document.getElementById('timer').innerHTML = "Any moment now...";
            }
        }
        
        setInterval(updateCountdown, 1000);
        updateCountdown();
    </script>
</body>
</html>