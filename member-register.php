
<!-- Member Registration Form (Frontend - member-register.php) -->
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Member Registration - KCI</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #FAF9F6 0%, #FFFFFF 100%);
            min-height: 100vh;
            padding: 2rem 0;
        }
        
        .registration-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        
        .registration-header {
            background: linear-gradient(135deg, #800020, #5D001E);
            color: white;
            padding: 2rem;
            text-align: center;
        }
        
        .registration-header h1 {
            font-size: 2rem;
            margin-bottom: 0.5rem;
        }
        
        .registration-header p {
            opacity: 0.9;
        }
        
        .form-progress {
            display: flex;
            justify-content: space-between;
            padding: 2rem 2rem 0;
        }
        
        .progress-step {
            flex: 1;
            text-align: center;
            position: relative;
        }
        
        .progress-step::before {
            content: '';
            position: absolute;
            top: 15px;
            left: 50%;
            width: 100%;
            height: 2px;
            background: #e0e0e0;
            z-index: 0;
        }
        
        .progress-step:first-child::before {
            display: none;
        }
        
        .step-circle {
            width: 30px;
            height: 30px;
            background: #e0e0e0;
            border-radius: 50%;
            margin: 0 auto 0.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            z-index: 1;
            font-weight: bold;
            color: #666;
        }
        
        .progress-step.active .step-circle {
            background: #800020;
            color: white;
        }
        
        .progress-step.completed .step-circle {
            background: #28a745;
            color: white;
        }
        
        .form-section {
            padding: 2rem;
            display: none;
        }
        
        .form-section.active {
            display: block;
        }
        
        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
            margin-bottom: 1.5rem;
        }
        
        .form-group {
            margin-bottom: 1.5rem;
        }
        
        .form-group.full-width {
            grid-column: 1 / -1;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 600;
            color: #333;
        }
        
        .form-group input,
        .form-group select,
        .form-group textarea {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-size: 1rem;
            transition: all 0.3s;
        }
        
        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: #800020;
            box-shadow: 0 0 0 3px rgba(128, 0, 32, 0.1);
        }
        
        .form-actions {
            display: flex;
            justify-content: space-between;
            margin-top: 2rem;
        }
        
        .btn {
            padding: 0.75rem 2rem;
            border: none;
            border-radius: 6px;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.3s;
        }
        
        .btn-secondary {
            background: #e0e0e0;
            color: #333;
        }
        
        .btn-primary {
            background: #800020;
            color: white;
        }
        
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }
        
        .photo-upload {
            text-align: center;
            padding: 2rem;
            border: 2px dashed #ddd;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s;
        }
        
        .photo-upload:hover {
            border-color: #800020;
            background: rgba(128, 0, 32, 0.05);
        }
        
        .photo-preview {
            width: 150px;
            height: 150px;
            margin: 0 auto;
            border-radius: 50%;
            background: #f0f0f0;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
        }
        
        .photo-preview img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        @media (max-width: 768px) {
            .form-row {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="registration-container">
        <div class="registration-header">
            <h1>Join Komunitas Chinese Indonesia</h1>
            <p>Bergabung dengan keluarga besar KCI</p>
        </div>
        
        <!-- Progress Indicator -->
        <div class="form-progress">
            <div class="progress-step active" id="step1">
                <div class="step-circle">1</div>
                <span>Personal Info</span>
            </div>
            <div class="progress-step" id="step2">
                <div class="step-circle">2</div>
                <span>Contact Details</span>
            </div>
            <div class="progress-step" id="step3">
                <div class="step-circle">3</div>
                <span>Review</span>
            </div>
        </div>
        
        <form id="registrationForm" method="POST" enctype="multipart/form-data">
            <!-- Step 1: Personal Information -->
            <div class="form-section active" id="section1">
                <h2>Personal Information</h2>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="firstName">First Name *</label>
                        <input type="text" id="firstName" name="firstName" required>
                    </div>
                    <div class="form-group">
                        <label for="lastName">Last Name *</label>
                        <input type="text" id="lastName" name="lastName" required>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="birthDate">Birth Date *</label>
                        <input type="date" id="birthDate" name="birthDate" required>
                    </div>
                    <div class="form-group">
                        <label for="gender">Gender *</label>
                        <select id="gender" name="gender" required>
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-group">
                    <label>Profile Photo</label>
                    <div class="photo-upload" onclick="document.getElementById('photoInput').click()">
                        <input type="file" id="photoInput" name="photo" accept="image/*" hidden onchange="previewPhoto(this)">
                        <div class="photo-preview" id="photoPreview">
                            <span style="color: #999;">📷 Upload Photo</span>
                        </div>
                        <p style="margin-top: 1rem; color: #666; font-size: 0.9rem;">Click to upload photo</p>
                    </div>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" disabled>Previous</button>
                    <button type="button" class="btn btn-primary" onclick="nextStep(2)">Next</button>
                </div>
            </div>
            
            <!-- Step 2: Contact Details -->
            <div class="form-section" id="section2">
                <h2>Contact Details</h2>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="email">Email Address *</label>
                        <input type="email" id="email" name="email" required>
                    </div>
                    <div class="form-group">
                        <label for="phone">Phone Number *</label>
                        <input type="tel" id="phone" name="phone" required>
                    </div>
                </div>
                
                <div class="form-group full-width">
                    <label for="address">Street Address *</label>
                    <input type="text" id="address" name="address" required>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="city">City *</label>
                        <input type="text" id="city" name="city" required>
                    </div>
                    <div class="form-group">
                        <label for="postalCode">Postal Code</label>
                        <input type="text" id="postalCode" name="postalCode">
                    </div>
                </div>
                
                <div class="form-group full-width">
                    <label for="reason">Why do you want to join KCI?</label>
                    <textarea id="reason" name="reason" rows="4" placeholder="Tell us about yourself and why you want to join..."></textarea>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="previousStep(1)">Previous</button>
                    <button type="button" class="btn btn-primary" onclick="nextStep(3)">Next</button>
                </div>
            </div>
            
            <!-- Step 3: Review & Submit -->
            <div class="form-section" id="section3">
                <h2>Review Your Information</h2>
                
                <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
                    <h3>Personal Information</h3>
                    <p><strong>Name:</strong> <span id="reviewName"></span></p>
                    <p><strong>Birth Date:</strong> <span id="reviewBirth"></span></p>
                    <p><strong>Gender:</strong> <span id="reviewGender"></span></p>
                    
                    <h3 style="margin-top: 1.5rem;">Contact Details</h3>
                    <p><strong>Email:</strong> <span id="reviewEmail"></span></p>
                    <p><strong>Phone:</strong> <span id="reviewPhone"></span></p>
                    <p><strong>Address:</strong> <span id="reviewAddress"></span></p>
                </div>
                
                <div class="form-group">
                    <label>
                        <input type="checkbox" required> I agree to the terms and conditions
                    </label>
                </div>
                
                <div class="form-group">
                    <label>
                        <input type="checkbox" required> I consent to be contacted by KCI
                    </label>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="previousStep(2)">Previous</button>
                    <button type="submit" class="btn btn-primary">Submit Application</button>
                </div>
            </div>
        </form>
    </div>
    
    <script>
        function nextStep(step) {
            // Validate current step
            const currentSection = document.querySelector('.form-section.active');
            const inputs = currentSection.querySelectorAll('input[required], select[required]');
            let valid = true;
            
            inputs.forEach(input => {
                if (!input.value) {
                    input.style.borderColor = 'red';
                    valid = false;
                } else {
                    input.style.borderColor = '#ddd';
                }
            });
            
            if (!valid) {
                alert('Please fill in all required fields');
                return;
            }
            
            // Update review if going to step 3
            if (step === 3) {
                updateReview();
            }
            
            // Switch steps
            document.querySelectorAll('.form-section').forEach(section => {
                section.classList.remove('active');
            });
            document.getElementById('section' + step).classList.add('active');
            
            // Update progress
            document.querySelectorAll('.progress-step').forEach((s, index) => {
                if (index < step) {
                    s.classList.add('completed');
                    s.classList.remove('active');
                } else if (index === step - 1) {
                    s.classList.add('active');
                    s.classList.remove('completed');
                } else {
                    s.classList.remove('active', 'completed');
                }
            });
        }
        
        function previousStep(step) {
            document.querySelectorAll('.form-section').forEach(section => {
                section.classList.remove('active');
            });
            document.getElementById('section' + step).classList.add('active');
            
            // Update progress
            document.querySelectorAll('.progress-step').forEach((s, index) => {
                if (index < step) {
                    s.classList.add('completed');
                    s.classList.remove('active');
                } else if (index === step - 1) {
                    s.classList.add('active');
                    s.classList.remove('completed');
                } else {
                    s.classList.remove('active', 'completed');
                }
            });
        }
        
        function previewPhoto(input) {
            if (input.files && input.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    document.getElementById('photoPreview').innerHTML = 
                        '<img src="' + e.target.result + '" alt="Profile">';
                };
                reader.readAsDataURL(input.files[0]);
            }
        }
        
        function updateReview() {
            document.getElementById('reviewName').textContent = 
                document.getElementById('firstName').value + ' ' + 
                document.getElementById('lastName').value;
            document.getElementById('reviewBirth').textContent = 
                document.getElementById('birthDate').value;
            document.getElementById('reviewGender').textContent = 
                document.getElementById('gender').value;
            document.getElementById('reviewEmail').textContent = 
                document.getElementById('email').value;
            document.getElementById('reviewPhone').textContent = 
                document.getElementById('phone').value;
            document.getElementById('reviewAddress').textContent = 
                document.getElementById('address').value + ', ' + 
                document.getElementById('city').value;
        }
        
        document.getElementById('registrationForm').addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your application! We will review it and get back to you soon.');
            // Here you would submit the form via AJAX
        });
    </script>
</body>
</html>