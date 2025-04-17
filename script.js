
// Define total number of sections
const totalSections = 5;
let currentSection = 1;

// Update progress bar
function updateProgress() {
    const progressPercent = ((currentSection - 1) / totalSections) * 100;
    document.getElementById('progress').style.width = progressPercent + '%';
}

// Navigate to next section
function nextSection(sectionNum) {
    // Check if all questions in current section are answered
    const currentQuestions = document.querySelectorAll(`#section-${sectionNum} input[type="radio"]`);
    const questionGroups = {};

    // Group questions by name
    currentQuestions.forEach(question => {
        if (!questionGroups[question.name]) {
            questionGroups[question.name] = [];
        }
        questionGroups[question.name].push(question);
    });

    // Check if any group has no checked option
    let allAnswered = true;
    for (const group in questionGroups) {
        if (!questionGroups[group].some(q => q.checked)) {
            allAnswered = false;
            break;
        }
    }

    if (!allAnswered) {
        alert('Please answer all questions in this section before proceeding.');
        return;
    }

    // Hide current section
    document.getElementById(`section-${sectionNum}`).classList.remove('active');

    // Show next section
    currentSection = sectionNum + 1;
    document.getElementById(`section-${currentSection}`).classList.add('active');

    // Update progress
    updateProgress();
}

// Navigate to previous section
function prevSection(sectionNum) {
    // Hide current section
    document.getElementById(`section-${sectionNum}`).classList.remove('active');

    // Show previous section
    currentSection = sectionNum - 1;
    document.getElementById(`section-${currentSection}`).classList.add('active');

    // Update progress
    updateProgress();
}

// Calculate section score
function calculateSectionScore(sectionNum) {
    const questions = document.querySelectorAll(`#section-${sectionNum} input[type="radio"]:checked`);
    let scoreTotal = 0;
    let weightTotal = 0;

    // Define weights for critical questions
    const questionWeights = {
        'q1_1': 2, // Boundary firewalls
        'q1_3': 2, // Administrative access restriction
        'q2_2': 3, // Default password changes
        'q3_4': 2, // Critical updates
        'q4_2': 3, // User authentication
        'q4_4': 2, // Multi-factor authentication
        'q5_1': 2, // Malware protection
        'q5_3': 2  // Malware execution prevention
    };

    questions.forEach(question => {
        if (question.value === 'na') return; // Skip N/A answers

        const weight = questionWeights[question.name] || 1;
        weightTotal += weight;

        if (question.value === 'yes') {
            scoreTotal += weight;
        } else if (question.value === 'partial') {
            scoreTotal += (weight * 0.5);
        } // 'no' scores 0
    });

    // Return percentage score if there are answered questions, otherwise 0
    return weightTotal > 0 ? (scoreTotal / weightTotal) * 100 : 0;
}

// Calculate overall compliance and determine risk level
function calculateComplianceStatus(score) {
    if (score >= 90) {
        return 'Compliant';
    } else if (score >= 70) {
        return 'Partially Compliant';
    } else {
        return 'Non-Compliant';
    }
}

// Show results after completing the assessment
function showResults() {
    // Check if all questions in current section are answered
    const currentQuestions = document.querySelectorAll(`#section-${currentSection} input[type="radio"]`);
    const questionGroups = {};

    // Group questions by name
    currentQuestions.forEach(question => {
        if (!questionGroups[question.name]) {
            questionGroups[question.name] = [];
        }
        questionGroups[question.name].push(question);
    });

    // Check if any group has no checked option
    let allAnswered = true;
    for (const group in questionGroups) {
        if (!questionGroups[group].some(q => q.checked)) {
            allAnswered = false;
            break;
        }
    }

    if (!allAnswered) {
        alert('Please answer all questions in this section before proceeding.');
        return;
    }

    // Hide current section
    document.getElementById(`section-${currentSection}`).classList.remove('active');

    // Update progress bar to 100%
    document.getElementById('progress').style.width = '100%';

    // Show results section
    document.getElementById('results').style.display = 'block';

    // Calculate scores for each section
    const sectionScores = [
        { name: 'Firewalls', score: calculateSectionScore(1) },
        { name: 'Secure Configuration', score: calculateSectionScore(2) },
        { name: 'Security Update Management', score: calculateSectionScore(3) },
        { name: 'User Access Control', score: calculateSectionScore(4) },
        { name: 'Malware Protection', score: calculateSectionScore(5) }
    ];

    // Calculate overall score
    const overallScore = sectionScores.reduce((total, section) => total + section.score, 0) / sectionScores.length;

    // Populate summary table
    const summaryBody = document.getElementById('summary-body');
    summaryBody.innerHTML = '';

    sectionScores.forEach(section => {
        const status = calculateComplianceStatus(section.score);
        const statusClass = status === 'Compliant' ? 'status-compliant' : 
                           status === 'Partially Compliant' ? 'status-partial' : 'status-non-compliant';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${section.name}</td>
            <td><span class="status-indicator ${statusClass}"></span>${status}</td>
            <td>${section.score.toFixed(1)}%</td>
        `;
        summaryBody.appendChild(row);
    });

    // Add overall row
    const overallStatus = calculateComplianceStatus(overallScore);
    const overallStatusClass = overallStatus === 'Compliant' ? 'status-compliant' : 
                              overallStatus === 'Partially Compliant' ? 'status-partial' : 'status-non-compliant';

    const overallRow = document.createElement('tr');
    overallRow.style.fontWeight = 'bold';
    overallRow.innerHTML = `
        <td>Overall</td>
        <td><span class="status-indicator ${overallStatusClass}"></span>${overallStatus}</td>
        <td>${overallScore.toFixed(1)}%</td>
    `;
    summaryBody.appendChild(overallRow);

    // Determine risk level based on overall score
    const likelihood = overallScore >= 90 ? 1 : overallScore >= 70 ? 2 : overallScore >= 50 ? 3 : overallScore >= 30 ? 4 : 5;
    const impact = overallScore >= 70 ? 3 : overallScore >= 30 ? 4 : 5; // Impact increases with lower scores

    // Highlight the risk cell
    const riskScore = likelihood * impact;
    document.getElementById(`cell-${likelihood}-${impact}`).style.border = '3px solid black';

    // Generate detailed results
    generateDetailedResults();

    // Generate recommendations
    generateRecommendations();
}

// Generate detailed analysis of each section
function generateDetailedResults() {
    const detailedResults = document.getElementById('detailed-results');
    detailedResults.innerHTML = '';

    const sections = [
        { id: 1, name: 'Firewalls' },
        { id: 2, name: 'Secure Configuration' },
        { id: 3, name: 'Security Update Management' },
        { id: 4, name: 'User Access Control' },
        { id: 5, name: 'Malware Protection' }
    ];

    sections.forEach(section => {
        const sectionDiv = document.createElement('div');
        sectionDiv.classList.add('results-section');

        const sectionHeader = document.createElement('h4');
        sectionHeader.textContent = section.name;
        sectionDiv.appendChild(sectionHeader);

        const sectionQuestions = document.querySelectorAll(`#section-${section.id} .question`);

        sectionQuestions.forEach(questionElem => {
            const questionText = questionElem.querySelector('label').textContent;
            const answer = questionElem.querySelector('input[type="radio"]:checked');

            if (!answer) return;

            const answerValue = answer.value;
            let statusClass = '';
            let statusText = '';

            if (answerValue === 'yes') {
                statusClass = 'status-compliant';
                statusText = 'Compliant';
            } else if (answerValue === 'partial') {
                statusClass = 'status-partial';
                statusText = 'Partially Compliant';
            } else if (answerValue === 'no') {
                statusClass = 'status-non-compliant';
                statusText = 'Non-Compliant';
            } else if (answerValue === 'na') {
                statusClass = '';
                statusText = 'Not Applicable';
            }

            const questionResult = document.createElement('div');
            questionResult.classList.add('question');
            questionResult.innerHTML = `
                <p><strong>${questionText}</strong></p>
                <p><span class="status-indicator ${statusClass}"></span>${statusText}</p>
            `;

            sectionDiv.appendChild(questionResult);
        });

        detailedResults.appendChild(sectionDiv);
    });
}

// Generate recommendations based on non-compliant areas
function generateRecommendations() {
    const recommendationsDiv = document.getElementById('recommendations');
    recommendationsDiv.innerHTML = '';

    // Define recommendations for each question
    const allRecommendations = {
        q1_1: 'Implement firewalls for all devices in scope, including next-generation firewalls for network perimeters and software firewalls for individual devices.',
        q1_2: 'Change all default administrative passwords to unique, strong passwords following your password policy.',
        q1_3: 'Disable remote administrative access from the internet or implement strong protections including MFA and IP allow listing.',
        q1_4: 'Configure firewalls to block all inbound connections by default and document all approved exceptions with business justification.',
        q1_5: 'Enable software firewalls on all devices, especially those that connect to untrusted networks like public WiFi.',
        q2_1: 'Implement a process to regularly review and remove unnecessary user accounts, including guest accounts and unused administrative accounts.',
        q2_2: 'Change all default or easily guessable passwords on all accounts and devices.',
        q2_3: 'Remove or disable unused software, system utilities, and network services to reduce attack surface.',
        q2_4: 'Disable auto-run features on all systems to prevent unauthorized file execution.',
        q2_5: 'Implement appropriate device locking controls (password, PIN, or biometric) for all applicable devices.',
        q3_1: 'Ensure all software is licensed and supported by the vendor.',
        q3_2: 'Remove or isolate unsupported software from internet access.',
        q3_3: 'Configure automatic updates for all software where possible.',
        q3_4: 'Implement a process to apply high-risk or critical security updates within 14 days of release.',
        q3_5: 'Implement manual configuration changes within 14 days to fix vulnerabilities where patches are unavailable.',
        q4_1: 'Establish a formal process for creating and approving user accounts.',
        q4_2: 'Ensure all users are authenticated with unique credentials before accessing applications or devices.',
        q4_3: 'Implement processes to promptly remove or disable user accounts when no longer required.',
        q4_4: 'Enable multi-factor authentication for all cloud services and administrative access where available.',
        q4_5: 'Create separate accounts for administrative activities with no standard user activities performed on these accounts.',
        q4_6: 'Enforce password policies that meet minimum technical requirements (8+ characters with MFA, 12+ without MFA) with no maximum length restrictions.',
        q5_1: 'Deploy malware protection on all devices within scope.',
        q5_2: 'Configure anti-malware software to update automatically in line with vendor recommendations.',
        q5_3: 'Configure anti-malware solutions to prevent malware execution and malicious code running.',
        q5_4: 'Enable web filtering to prevent connections to known malicious websites.',
        q5_5: 'If using application allow listing, implement a formal approval process and maintain current approved application lists.'
    };

    // Find non-compliant or partially compliant questions
    let hasRecommendations = false;

    for (const [questionId, recommendation] of Object.entries(allRecommendations)) {
        const radioButton = document.querySelector(`input[name="${questionId}"]:checked`);

        if (radioButton && (radioButton.value === 'no' || radioButton.value === 'partial')) {
            const questionText = document.querySelector(`input[name="${questionId}"]`).closest('.question').querySelector('label').textContent;

            const recommendationElem = document.createElement('div');
            recommendationElem.classList.add('recommendation');
            recommendationElem.innerHTML = `
                <p><strong>${questionText}</strong></p>
                <p>${recommendation}</p>
            `;

            recommendationsDiv.appendChild(recommendationElem);
            hasRecommendations = true;
        }
    }

    if (!hasRecommendations) {
        recommendationsDiv.innerHTML = '<p>Great job! Your organization appears to be meeting most of the Cyber Essentials requirements. Continue to monitor and maintain your security controls.</p>';
    }
}

// Reset the quiz
function resetQuiz() {
    // Clear all selected radio buttons
    document.querySelectorAll('input[type="radio"]:checked').forEach(radio => {
        radio.checked = false;
    });

    // Hide results section
    document.getElementById('results').style.display = 'none';

    // Show first section
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById('section-1').classList.add('active');

    // Reset progress bar
    document.getElementById('progress').style.width = '0%';

    // Reset current section
    currentSection = 1;
}

// Initialize progress bar
updateProgress();
