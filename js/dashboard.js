/* ===================================================
   SARKARINEXT - DASHBOARD MODULE
   Fetches data from backend & renders the dashboard
=================================================== */

const DASH_API = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
  ? "http://localhost:3000"
  : "https://api.nripendra.online";

const SarkariDashboard = {
  data: null,

  async load() {
    if (!SarkariAuth.isLoggedIn()) {
      openPage("authPage");
      return;
    }

    this.showLoading();

    try {
      const res = await fetch(DASH_API + "/api/dashboard", {
        headers: {
          ...SarkariAuth.authHeader(),
          "Content-Type": "application/json",
        },
      });

      if (res.status === 401) {
        SarkariAuth.clearSession();
        updateAuthUI();
        openPage("authPage");
        return;
      }

      const json = await res.json();
      if (json.ok) {
        this.data = json.dashboard;
        this.render();
      } else {
        this.showError("Failed to load dashboard");
      }
    } catch (err) {
      this.showError("Network error. Please check connection.");
    }
  },

  showLoading() {
    const container = document.getElementById("dashboardContent");
    if (!container) return;
    container.innerHTML = `
      <div class="dash-section-card">
        <div class="dash-loading">
          <div class="dash-spinner"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    `;
  },

  showError(msg) {
    const container = document.getElementById("dashboardContent");
    if (!container) return;
    container.innerHTML = `
      <div class="dash-section-card">
        <div class="dash-error">
          <h3>${msg}</h3>
          <button class="dash-retry-btn" onclick="SarkariDashboard.load()">Retry</button>
        </div>
      </div>
    `;
  },

  formatTime(seconds) {
    if (!seconds) return "0m";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  },

  getStatusClass(value, goodThreshold, midThreshold) {
    if (value >= goodThreshold) return "good";
    if (value >= midThreshold) return "avg";
    return "low";
  },

  render() {
    const container = document.getElementById("dashboardContent");
    if (!container || !this.data) return;

    const d = this.data;
    const user = d.user;
    const stats = d.stats;
    const accuracyClass = this.getStatusClass(stats.overallAccuracy, 70, 40);
    const streakClass = this.getStatusClass(stats.streak, 7, 3);
    const testsClass = this.getStatusClass(stats.totalTests, 5, 1);
    const focusTopic = d.weakTopics[0];
    const focusBadge = focusTopic ? "Needs focus" : "Stay on track";
    const focusClass = focusTopic ? "avg" : "good";
    const subjectCount = d.subjectBreakdown ? d.subjectBreakdown.length : 0;
    const progressSubtitle = stats.totalQuestionsSolved > 0
      ? `${stats.totalCorrect} correct answers recorded so far`
      : "Start a mock test or course to unlock your performance summary";
    const continueSubtitle = focusTopic
      ? `Resume from the next best action. Focus next on ${focusTopic.subject}.`
      : "Choose one learning path below to begin building your dashboard";
    const subjectSummary = subjectCount > 0
      ? `Review solved questions, correct answers, and time spent for ${subjectCount} subjects`
      : "Your subject-wise progress will appear here after you begin practicing";
    const recentTestSummary = d.recentTests.length > 0
      ? "Review your latest scores and accuracy before the next attempt"
      : "Your recent mock attempts will appear here once you start practicing";

    container.innerHTML = `
      <div class="dash-profile-card">
        <div class="dash-avatar-big">${(user.name || "U").charAt(0).toUpperCase()}</div>
        <div class="dash-profile-info">
          <h2>${user.name}</h2>
          <p class="dash-email">${user.email}</p>
          <span class="dash-badge">${user.role === "admin" ? "Admin" : "Student"}</span>
          ${user.targetExam ? `<span class="dash-target">Target: ${user.targetExam}</span>` : ""}
          <p class="dash-joined">Member since ${new Date(user.joinedAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</p>
          <div class="dash-test-score">
            <span class="dash-test-acc ${accuracyClass}">${stats.overallAccuracy}% accuracy</span>
            <span class="dash-test-acc ${streakClass}">${stats.streak} day streak</span>
          </div>
        </div>
      </div>

      <div class="dash-section-card">
        <h3>Stats</h3>
        <div class="dash-test-row">
          <div class="dash-test-info">
            <span class="dash-test-exam">Performance Snapshot</span>
            <span class="dash-test-date">${progressSubtitle}</span>
          </div>
          <div class="dash-test-score">
            <span class="dash-test-acc ${testsClass}">${stats.totalTests} tests</span>
          </div>
        </div>
        <div class="dash-stats-grid">
          <div class="dash-stat-card stat-blue">
            <span class="dash-stat-icon">&#128221;</span>
            <span class="dash-stat-val">${stats.totalTests}</span>
            <span class="dash-stat-label">Tests Taken</span>
            <span class="dash-stat-label">Recent practice history</span>
          </div>
          <div class="dash-stat-card stat-green">
            <span class="dash-stat-icon">&#9989;</span>
            <span class="dash-stat-val">${stats.totalQuestionsSolved}</span>
            <span class="dash-stat-label">Questions Solved</span>
            <span class="dash-stat-label">${stats.totalCorrect} correct answers</span>
          </div>
          <div class="dash-stat-card stat-orange">
            <span class="dash-stat-icon">&#127919;</span>
            <span class="dash-stat-val">${stats.overallAccuracy}%</span>
            <span class="dash-stat-label">Accuracy</span>
            <span class="dash-stat-label">Overall performance</span>
          </div>
          <div class="dash-stat-card stat-purple">
            <span class="dash-stat-icon">&#9201;</span>
            <span class="dash-stat-val">${this.formatTime(stats.totalTimeSpent)}</span>
            <span class="dash-stat-label">Time Spent</span>
            <span class="dash-stat-label">Focused study time</span>
          </div>
          <div class="dash-stat-card stat-red">
            <span class="dash-stat-icon">&#127942;</span>
            <span class="dash-stat-val">${stats.avgScore}</span>
            <span class="dash-stat-label">Average Score</span>
            <span class="dash-stat-label">Across completed tests</span>
          </div>
          <div class="dash-stat-card stat-teal">
            <span class="dash-stat-icon">&#128293;</span>
            <span class="dash-stat-val">${stats.streak} days</span>
            <span class="dash-stat-label">Study Streak</span>
            <span class="dash-stat-label">Keep the habit alive</span>
          </div>
        </div>
      </div>

      <div class="dash-section-card">
        <h3>Continue Learning</h3>
        <div class="dash-test-row">
          <div class="dash-test-info">
            <span class="dash-test-exam">Next Best Actions</span>
            <span class="dash-test-date">${continueSubtitle}</span>
          </div>
          <div class="dash-test-score">
            <span class="dash-test-acc ${focusClass}">${focusBadge}</span>
          </div>
        </div>
        <div class="dash-continue-grid">
          <button class="dash-continue-btn" onclick="window.location.href='series.html'">
            <span>&#128221;</span>
            <div>
              <div>Take a Mock Test</div>
              <small>Measure score, speed, and accuracy</small>
            </div>
          </button>
          <button class="dash-continue-btn" onclick="window.location.href='prepare.html'">
            <span>&#128218;</span>
            <div>
              <div>Study Courses</div>
              <small>Continue your concept revision</small>
            </div>
          </button>
          <button class="dash-continue-btn" onclick="openPage('home')">
            <span>&#128240;</span>
            <div>
              <div>Current Affairs</div>
              <small>Stay updated with exam-relevant news</small>
            </div>
          </button>
          <button class="dash-continue-btn" onclick="window.location.href='predicter.html'">
            <span>&#128202;</span>
            <div>
              <div>Rank Predictor</div>
              <small>Estimate your standing instantly</small>
            </div>
          </button>
        </div>
      </div>

      <div class="dash-section-card">
        <h3>My Progress</h3>
        <div class="dash-test-row">
          <div class="dash-test-info">
            <span class="dash-test-exam">Subject-wise Breakdown</span>
            <span class="dash-test-date">${subjectSummary}</span>
          </div>
          <div class="dash-test-score">
            <span class="dash-test-acc ${subjectCount > 0 ? "good" : "avg"}">${subjectCount} subjects</span>
          </div>
        </div>
        <div id="subjectBreakdownContainer">
          ${this.renderSubjectBreakdown(d.subjectBreakdown)}
        </div>
      </div>

      <div class="dash-section-card">
        <h3>Recent Mock Tests</h3>
        <div class="dash-test-row">
          <div class="dash-test-info">
            <span class="dash-test-exam">Latest Attempts</span>
            <span class="dash-test-date">${recentTestSummary}</span>
          </div>
          <div class="dash-test-score">
            <span class="dash-test-acc ${accuracyClass}">${stats.avgScore} avg score</span>
          </div>
        </div>
        ${this.renderRecentTests(d.recentTests)}
      </div>

      ${d.weakTopics.length > 0 ? `
      <div class="dash-section-card dash-weak-card">
        <h3>Topics Needing Attention</h3>
        <div class="dash-weak-list">
          ${d.weakTopics.map(t => `
            <div class="dash-weak-item">
              <span class="dash-weak-subject">${t.subject}</span>
              <span class="dash-weak-exam">${t.examType} | ${t.questionsSolved} Q</span>
              <div class="dash-weak-bar-wrap">
                <div class="dash-weak-bar" style="width:${t.accuracy}%"></div>
              </div>
              <span class="dash-weak-pct">${t.accuracy}%</span>
            </div>
          `).join("")}
        </div>
      </div>` : ""}

      <div class="dash-section-card">
        <h3>Recent Activity</h3>
        <div class="dash-test-row">
          <div class="dash-test-info">
            <span class="dash-test-exam">Activity Timeline</span>
            <span class="dash-test-date">Quick view of your latest actions across the platform</span>
          </div>
          <div class="dash-test-score">
            <span class="dash-test-acc ${streakClass}">${stats.streak} day streak</span>
          </div>
        </div>
        ${this.renderRecentActivity(d.recentActivity)}
      </div>
    `;
  },

  renderSubjectBreakdown(subjects) {
    if (!subjects || subjects.length === 0) {
      return `<p class="dash-empty">No progress data yet. Take a mock test to get started!</p>`;
    }

    return `
      <div class="dash-subject-table">
        ${subjects.map(s => {
          const pct = s.accuracy || 0;
          const barColor = pct >= 70 ? "#16a34a" : pct >= 40 ? "#f59e0b" : "#dc2626";
          return `
            <div class="dash-subject-row">
              <div class="dash-subj-info">
                <span class="dash-subj-name">${s.subject}</span>
                <span class="dash-subj-exam">${s.examType}</span>
              </div>
              <div class="dash-subj-stats">
                <span>Solved ${s.questionsSolved}</span>
                <span>Correct ${s.correctAnswers}</span>
                <span>Time ${this.formatTime(s.timeSpent)}</span>
              </div>
              <div class="dash-subj-bar-wrap">
                <div class="dash-subj-bar" style="width:${pct}%;background:${barColor}"></div>
              </div>
              <span class="dash-subj-pct">${pct}%</span>
            </div>
          `;
        }).join("")}
      </div>
    `;
  },

  renderRecentTests(tests) {
    if (!tests || tests.length === 0) {
      return `<p class="dash-empty">No tests taken yet. Start your first mock test!</p>`;
    }

    return `
      <div class="dash-tests-list">
        ${tests.map(t => `
          <div class="dash-test-row">
            <div class="dash-test-info">
              <span class="dash-test-exam">${t.exam}</span>
              <span class="dash-test-date">Attempted ${new Date(t.date).toLocaleDateString("en-IN")}</span>
            </div>
            <div class="dash-test-score">
              <span class="dash-test-score-val">Score ${t.score}/${t.maxMarks}</span>
              <span class="dash-test-acc ${t.accuracy >= 70 ? "good" : t.accuracy >= 40 ? "avg" : "low"}">${t.accuracy}%</span>
            </div>
          </div>
        `).join("")}
      </div>
    `;
  },

  renderRecentActivity(activities) {
    if (!activities || activities.length === 0) {
      return `<p class="dash-empty">No recent activity.</p>`;
    }

    const actionLabels = {
      test_submitted: "Completed a mock test",
      test_attempted: "Attempted a test",
      current_affairs_read: "Read current affairs",
      pdf_opened: "Opened a PDF",
      video_watched: "Watched a video",
      article_read: "Read an article",
      course_viewed: "Viewed a course",
      roadmap_viewed: "Viewed a roadmap",
      login: "Logged in",
      signup: "Created account",
      page_visit: "Visited a page",
    };

    return `
      <div class="dash-activity-list">
        ${activities.map(a => {
          const label = actionLabels[a.action] || a.action;
          const timeAgo = this.timeAgo(a.createdAt);
          return `
            <div class="dash-activity-item">
              <span class="dash-act-label">${label}</span>
              <span class="dash-act-time">${timeAgo}</span>
            </div>
          `;
        }).join("")}
      </div>
    `;
  },

  timeAgo(dateStr) {
    const now = Date.now();
    const diff = now - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString("en-IN");
  },
};

/* ===================================================
   DASHBOARD PAGE OBSERVER
   Auto-loads dashboard when the page becomes visible
=================================================== */
const _origOpenPage = typeof openPage === "function" ? openPage : null;

document.addEventListener("DOMContentLoaded", () => {
  // Patch openPage to detect dashboard navigation
  if (typeof window.openPage === "function") {
    const _original = window.openPage;
    window.openPage = function (id) {
      _original(id);
      if (id === "dashboardPage") {
        SarkariDashboard.load();
      }
    };
  }
});
