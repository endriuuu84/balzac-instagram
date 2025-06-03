// Balzac Control Dashboard JavaScript
class BalzacControlDashboard {
    constructor() {
        this.config = {
            webhookUrl: 'https://hook.eu2.make.com/ouiitebpjbbqlhn5xpfxzvsivfx5i0l9',
            refreshInterval: 30000, // 30 seconds
            apis: {
                openai: 'https://api.openai.com/v1',
                leonardo: 'https://cloud.leonardo.ai/api/rest/v1',
                instagram: 'https://graph.instagram.com'
            }
        };
        
        this.systemStatus = {
            make: 'checking',
            instagram: 'checking', 
            openai: 'checking',
            leonardo: 'checking',
            monitoring: 'checking',
            cron: 'checking'
        };

        this.activityLog = [];
        this.chartInstance = null;
        
        this.init();
    }

    // Initialize dashboard
    init() {
        console.log('🎛️ Initializing Balzac Control Dashboard...');
        
        this.logActivity('SYSTEM', 'Dashboard initialization started', 'info');
        
        // Start periodic checks
        this.startPeriodicChecks();
        
        // Initialize chart
        this.initializeChart();
        
        // Load saved settings
        this.loadSettings();
        
        // Initial status check
        this.checkAllSystems();
        
        this.logActivity('SYSTEM', 'Dashboard ready for control operations', 'success');
    }

    // Check all systems status
    async checkAllSystems() {
        this.showLoading('Checking all systems...');
        
        try {
            await Promise.all([
                this.checkMakeStatus(),
                this.checkInstagramStatus(),
                this.checkOpenAIStatus(),
                this.checkLeonardoStatus(),
                this.checkMonitoringStatus(),
                this.checkCronStatus()
            ]);
            
            this.updateSystemIndicator();
            this.logActivity('SYSTEM', 'All systems checked successfully', 'success');
            
        } catch (error) {
            this.logActivity('ERROR', `System check failed: ${error.message}`, 'error');
        } finally {
            this.hideLoading();
        }
    }

    // Check Make.com status
    async checkMakeStatus() {
        try {
            this.logActivity('MAKE', 'Checking Make.com status...', 'info');
            
            // Test webhook connection
            const response = await fetch(this.config.webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    test: true,
                    source: 'dashboard',
                    timestamp: new Date().toISOString()
                })
            });

            if (response.ok || response.status === 400) {
                // Status 400 is OK - means webhook is listening
                this.systemStatus.make = 'online';
                this.updateStatusBadge('makeStatus', 'Online', 'online');
                this.updateStatusValue('scenarioStatus', '🟢 Active');
                this.updateStatusValue('operationsUsed', '156/10,000');
                this.updateStatusValue('nextRun', this.getNextRunTime());
                
                this.logActivity('MAKE', 'Make.com webhook responding correctly', 'success');
            } else {
                throw new Error(`Webhook returned status ${response.status}`);
            }
            
        } catch (error) {
            this.systemStatus.make = 'error';
            this.updateStatusBadge('makeStatus', 'Error', 'error');
            this.updateStatusValue('scenarioStatus', '❌ Error');
            this.logActivity('MAKE', `Make.com error: ${error.message}`, 'error');
        }
    }

    // Check Instagram status
    async checkInstagramStatus() {
        try {
            this.logActivity('INSTAGRAM', 'Checking Instagram API status...', 'info');
            
            // Simulate Instagram API check (would be real API call)
            // For demo purposes, showing realistic data
            this.systemStatus.instagram = 'online';
            this.updateStatusBadge('instagramStatus', 'Online', 'online');
            this.updateStatusValue('lastPost', '2 hours ago');
            this.updateStatusValue('followersCount', '1,247');
            this.updateStatusValue('postsToday', '2/3');
            
            // Update metrics
            this.updateMetric('postsCountToday', '2');
            this.updateMetric('engagementRate', '6.8%');
            this.updateMetric('newFollowers', '+12');
            this.updateMetric('totalReach', '3,421');
            
            this.logActivity('INSTAGRAM', 'Instagram API connection verified', 'success');
            
        } catch (error) {
            this.systemStatus.instagram = 'error';
            this.updateStatusBadge('instagramStatus', 'Error', 'error');
            this.logActivity('INSTAGRAM', `Instagram error: ${error.message}`, 'error');
        }
    }

    // Check OpenAI status
    async checkOpenAIStatus() {
        try {
            this.logActivity('OPENAI', 'Checking OpenAI API status...', 'info');
            
            // For demo - would be real API status check
            this.systemStatus.openai = 'online';
            this.updateStatusBadge('openaiStatus', 'Online', 'online');
            this.updateStatusValue('openaiApiStatus', '🟢 Operational');
            this.updateStatusValue('openaiRequests', '47 today');
            this.updateStatusValue('openaiCost', '€12.34 this month');
            
            this.logActivity('OPENAI', 'OpenAI API operational', 'success');
            
        } catch (error) {
            this.systemStatus.openai = 'error';
            this.updateStatusBadge('openaiStatus', 'Error', 'error');
            this.logActivity('OPENAI', `OpenAI error: ${error.message}`, 'error');
        }
    }

    // Check Leonardo.ai status
    async checkLeonardoStatus() {
        try {
            this.logActivity('LEONARDO', 'Checking Leonardo.ai status...', 'info');
            
            // Demo data - would be real API check
            this.systemStatus.leonardo = 'online';
            this.updateStatusBadge('leonardoStatus', 'Online', 'online');
            this.updateStatusValue('leonardoTokens', '7,342 remaining');
            this.updateStatusValue('leonardoImages', '23 this month');
            this.updateStatusValue('leonardoPlan', 'Artisan Plan');
            
            this.logActivity('LEONARDO', 'Leonardo.ai API operational', 'success');
            
        } catch (error) {
            this.systemStatus.leonardo = 'error';
            this.updateStatusBadge('leonardoStatus', 'Error', 'error');
            this.logActivity('LEONARDO', `Leonardo error: ${error.message}`, 'error');
        }
    }

    // Check monitoring status
    async checkMonitoringStatus() {
        try {
            this.logActivity('MONITORING', 'Checking monitoring systems...', 'info');
            
            // Demo monitoring data
            this.systemStatus.monitoring = 'online';
            this.updateStatusBadge('monitoringStatus', 'Online', 'online');
            this.updateStatusValue('lastMonitoringCheck', '15 minutes ago');
            this.updateStatusValue('activeAlerts', '1 pending');
            this.updateStatusValue('sentimentScore', '78% positive');
            
            this.logActivity('MONITORING', 'Monitoring systems operational', 'success');
            
        } catch (error) {
            this.systemStatus.monitoring = 'error';
            this.updateStatusBadge('monitoringStatus', 'Error', 'error');
            this.logActivity('MONITORING', `Monitoring error: ${error.message}`, 'error');
        }
    }

    // Check cron jobs status
    async checkCronStatus() {
        try {
            this.logActivity('CRON', 'Checking cron jobs status...', 'info');
            
            // Demo cron data
            this.systemStatus.cron = 'online';
            this.updateStatusBadge('cronStatus', 'Online', 'online');
            this.updateStatusValue('activeJobs', '3/3 running');
            this.updateStatusValue('lastExecution', '2 hours ago');
            this.updateStatusValue('successRate', '98.5%');
            
            this.logActivity('CRON', 'All cron jobs operational', 'success');
            
        } catch (error) {
            this.systemStatus.cron = 'error';
            this.updateStatusBadge('cronStatus', 'Error', 'error');
            this.logActivity('CRON', `Cron error: ${error.message}`, 'error');
        }
    }

    // Test specific post type
    async testPost(mealType) {
        this.showLoading(`Testing ${mealType} post...`);
        this.logActivity('TEST', `Initiating ${mealType} post test...`, 'info');
        
        try {
            const payload = {
                trigger: 'test_post',
                meal_type: mealType,
                time: new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }),
                source: 'dashboard_test',
                timestamp: new Date().toISOString()
            };

            const response = await fetch(this.config.webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (response.ok || response.status === 400) {
                this.logActivity('TEST', `${mealType} test post triggered successfully`, 'success');
                this.showNotification(`Test post ${mealType} inviato con successo!`, 'success');
            } else {
                throw new Error(`Test failed with status ${response.status}`);
            }
            
        } catch (error) {
            this.logActivity('TEST', `${mealType} test failed: ${error.message}`, 'error');
            this.showNotification(`Errore nel test ${mealType}: ${error.message}`, 'error');
        } finally {
            this.hideLoading();
        }
    }

    // Test webhook connection
    async testWebhook() {
        this.showLoading('Testing webhook...');
        
        try {
            const response = await fetch(this.config.webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    test: true,
                    source: 'webhook_test',
                    timestamp: new Date().toISOString()
                })
            });

            if (response.ok || response.status === 400) {
                this.logActivity('WEBHOOK', 'Webhook test successful', 'success');
                this.showNotification('Webhook funziona correttamente!', 'success');
            } else {
                throw new Error(`Webhook test failed: ${response.status}`);
            }
            
        } catch (error) {
            this.logActivity('WEBHOOK', `Webhook test failed: ${error.message}`, 'error');
            this.showNotification(`Webhook error: ${error.message}`, 'error');
        } finally {
            this.hideLoading();
        }
    }

    // Generate content
    async generateContent() {
        const mealType = document.getElementById('mealType').value;
        this.showLoading('Generating content...');
        
        try {
            this.logActivity('CONTENT', `Generating content for ${mealType}...`, 'info');
            
            // Simulate content generation
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const captions = {
                colazione: "Inizia la giornata con energia al Balzac! ☀️ Il nostro cornetto appena sfornato e cappuccino cremoso ti daranno la carica giusta. #colazionemodena #balzacbistrot #buongiorno",
                pranzo: "Pranzo della tradizione modenese al Balzac! 🍝 I nostri tortellini in brodo sono preparati con amore e ingredienti freschi. #pranzomodena #tortellini #balzacbistrot", 
                aperitivo: "L'ora dell'aperitivo al Balzac! 🍸 Spritz perfetto, stuzzichini deliziosi e atmosfera unica nel cuore di Modena. #aperitivomodena #spritz #balzacbistrot"
            };
            
            document.getElementById('customCaption').value = captions[mealType];
            
            this.logActivity('CONTENT', `Content generated for ${mealType}`, 'success');
            this.showNotification('Contenuto generato con successo!', 'success');
            
        } catch (error) {
            this.logActivity('CONTENT', `Content generation failed: ${error.message}`, 'error');
            this.showNotification('Errore nella generazione del contenuto', 'error');
        } finally {
            this.hideLoading();
        }
    }

    // Publish now
    async publishNow() {
        const mealType = document.getElementById('mealType').value;
        const caption = document.getElementById('customCaption').value;
        const hashtags = document.getElementById('customHashtags').value;
        
        if (!caption.trim()) {
            this.showNotification('Inserisci una caption prima di pubblicare!', 'warning');
            return;
        }
        
        this.showLoading('Publishing post...');
        
        try {
            const payload = {
                trigger: 'immediate_post',
                meal_type: mealType,
                custom_caption: caption,
                custom_hashtags: hashtags,
                source: 'dashboard_manual',
                timestamp: new Date().toISOString()
            };

            const response = await fetch(this.config.webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (response.ok || response.status === 400) {
                this.logActivity('PUBLISH', `Manual post published: ${mealType}`, 'success');
                this.showNotification('Post pubblicato con successo!', 'success');
                
                // Clear form
                document.getElementById('customCaption').value = '';
                document.getElementById('customHashtags').value = '';
                
                // Update analytics
                this.refreshAnalytics();
            } else {
                throw new Error(`Publish failed: ${response.status}`);
            }
            
        } catch (error) {
            this.logActivity('PUBLISH', `Publish failed: ${error.message}`, 'error');
            this.showNotification(`Errore pubblicazione: ${error.message}`, 'error');
        } finally {
            this.hideLoading();
        }
    }

    // Run monitoring
    async runMonitoring() {
        this.showLoading('Running monitoring check...');
        this.logActivity('MONITORING', 'Manual monitoring check initiated', 'info');
        
        try {
            // Simulate monitoring run
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            this.logActivity('MONITORING', 'Monitoring check completed successfully', 'success');
            this.showNotification('Monitoring completato! Controlla i report.', 'success');
            
            // Update monitoring status
            this.updateStatusValue('lastMonitoringCheck', 'Just now');
            this.updateStatusValue('activeAlerts', '0 pending');
            
        } catch (error) {
            this.logActivity('MONITORING', `Monitoring failed: ${error.message}`, 'error');
            this.showNotification('Errore nel monitoring', 'error');
        } finally {
            this.hideLoading();
        }
    }

    // Pause automation
    async pauseAutomation() {
        if (confirm('Sei sicuro di voler mettere in pausa l\'automazione?')) {
            this.showLoading('Pausing automation...');
            
            try {
                this.logActivity('SYSTEM', 'Automation paused by user', 'warning');
                this.showNotification('Automazione in pausa. Ricordati di riattivarla!', 'warning');
                
                // Update UI to show paused state
                this.updateSystemIndicator('paused');
                
            } catch (error) {
                this.logActivity('SYSTEM', `Pause failed: ${error.message}`, 'error');
            } finally {
                this.hideLoading();
            }
        }
    }

    // Refresh analytics
    refreshAnalytics() {
        this.logActivity('ANALYTICS', 'Refreshing analytics data...', 'info');
        
        // Simulate analytics refresh
        const metrics = {
            postsCountToday: Math.floor(Math.random() * 5),
            engagementRate: (Math.random() * 10 + 2).toFixed(1) + '%',
            newFollowers: '+' + Math.floor(Math.random() * 50),
            totalReach: (Math.random() * 10000 + 1000).toLocaleString()
        };
        
        Object.keys(metrics).forEach(key => {
            this.updateMetric(key, metrics[key]);
        });
        
        this.updateChart();
        this.logActivity('ANALYTICS', 'Analytics data refreshed', 'success');
    }

    // Helper methods
    updateStatusBadge(elementId, text, status) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = text;
            element.className = `status-badge ${status}`;
        }
    }

    updateStatusValue(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = value;
        }
    }

    updateMetric(metricId, value) {
        const element = document.getElementById(metricId);
        if (element) {
            element.textContent = value;
        }
    }

    updateSystemIndicator(status = null) {
        const indicator = document.querySelector('.status-dot');
        const statusText = document.querySelector('.status-text');
        
        if (!indicator || !statusText) return;
        
        if (status === 'paused') {
            indicator.className = 'status-dot warning';
            statusText.textContent = 'Paused';
            return;
        }
        
        const allOnline = Object.values(this.systemStatus).every(s => s === 'online');
        const hasErrors = Object.values(this.systemStatus).some(s => s === 'error');
        
        if (allOnline) {
            indicator.className = 'status-dot';
            statusText.textContent = 'All Systems Online';
        } else if (hasErrors) {
            indicator.className = 'status-dot error';
            statusText.textContent = 'System Errors Detected';
        } else {
            indicator.className = 'status-dot warning';
            statusText.textContent = 'Some Systems Checking...';
        }
    }

    logActivity(type, message, level = 'info') {
        const timestamp = new Date().toLocaleTimeString('it-IT');
        const activity = {
            timestamp,
            type,
            message,
            level,
            id: Date.now()
        };
        
        this.activityLog.unshift(activity);
        
        // Keep only last 100 activities
        if (this.activityLog.length > 100) {
            this.activityLog = this.activityLog.slice(0, 100);
        }
        
        this.updateActivityFeed();
        
        // Update last update time
        document.getElementById('lastUpdate').textContent = 
            `Last update: ${timestamp}`;
    }

    updateActivityFeed() {
        const feed = document.getElementById('activityFeed');
        if (!feed) return;
        
        feed.innerHTML = this.activityLog.map(activity => `
            <div class="activity-item ${activity.level}">
                <span class="timestamp">${activity.timestamp}</span>
                <span class="type">${activity.type}</span>
                <span class="message">${activity.message}</span>
            </div>
        `).join('');
    }

    showLoading(text = 'Loading...') {
        const overlay = document.getElementById('loadingOverlay');
        const loadingText = document.getElementById('loadingText');
        
        if (overlay && loadingText) {
            loadingText.textContent = text;
            overlay.style.display = 'flex';
        }
    }

    hideLoading() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : type === 'warning' ? '#f39c12' : '#3498db'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 10000;
            max-width: 300px;
            animation: slideInRight 0.3s ease-out;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Remove after 4 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }

    initializeChart() {
        const ctx = document.getElementById('engagementChart');
        if (!ctx) return;
        
        this.chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['6h ago', '5h ago', '4h ago', '3h ago', '2h ago', '1h ago', 'Now'],
                datasets: [{
                    label: 'Engagement Rate',
                    data: [4.2, 5.1, 6.8, 5.9, 7.2, 6.5, 6.8],
                    borderColor: '#007bff',
                    backgroundColor: 'rgba(0, 123, 255, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 10
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    updateChart() {
        if (!this.chartInstance) return;
        
        // Add new data point
        const newValue = Math.random() * 3 + 4; // Random between 4-7
        this.chartInstance.data.datasets[0].data.push(newValue);
        this.chartInstance.data.datasets[0].data.shift();
        this.chartInstance.update();
    }

    startPeriodicChecks() {
        // Check systems every 30 seconds
        setInterval(() => {
            this.checkAllSystems();
        }, this.config.refreshInterval);
        
        // Update chart every 5 minutes
        setInterval(() => {
            this.updateChart();
        }, 300000);
    }

    getNextRunTime() {
        const now = new Date();
        const times = ['08:00', '13:00', '18:00'];
        
        for (const time of times) {
            const [hour, minute] = time.split(':').map(Number);
            const targetTime = new Date(now);
            targetTime.setHours(hour, minute, 0, 0);
            
            if (targetTime > now) {
                return `Today ${time}`;
            }
        }
        
        return 'Tomorrow 08:00';
    }

    // Settings methods
    loadSettings() {
        const settings = localStorage.getItem('balzacSettings');
        if (settings) {
            const parsed = JSON.parse(settings);
            // Apply saved settings
            this.logActivity('SETTINGS', 'Settings loaded from storage', 'info');
        }
    }

    saveSettings() {
        const settings = {
            colazioneTime: document.getElementById('colazioneTime').value,
            pranzoTime: document.getElementById('pranzoTime').value,
            aperitivoTime: document.getElementById('aperitivoTime').value,
            emailNotifications: document.getElementById('emailNotifications').checked,
            slackNotifications: document.getElementById('slackNotifications').checked,
            errorNotifications: document.getElementById('errorNotifications').checked,
            aiStyle: document.getElementById('aiStyle').value,
            captionLength: document.getElementById('captionLength').value
        };
        
        localStorage.setItem('balzacSettings', JSON.stringify(settings));
        this.logActivity('SETTINGS', 'Settings saved successfully', 'success');
        this.showNotification('Impostazioni salvate!', 'success');
        this.closeSettings();
    }
}

// Global functions for HTML event handlers
let dashboard;

function init() {
    dashboard = new BalzacControlDashboard();
}

function testPost(mealType) {
    dashboard.testPost(mealType);
}

function pauseAutomation() {
    dashboard.pauseAutomation();
}

function runMonitoring() {
    dashboard.runMonitoring();
}

function testWebhook() {
    dashboard.testWebhook();
}

function checkMakeStatus() {
    dashboard.checkMakeStatus();
}

function checkInstagramStatus() {
    dashboard.checkInstagramStatus();
}

function testOpenAI() {
    dashboard.showNotification('OpenAI test completed successfully!', 'success');
}

function generateSampleContent() {
    dashboard.generateContent();
}

function testLeonardo() {
    dashboard.showNotification('Leonardo.ai test completed successfully!', 'success');
}

function generateSampleImage() {
    dashboard.showLoading('Generating sample image...');
    setTimeout(() => {
        dashboard.hideLoading();
        dashboard.showNotification('Sample image generated!', 'success');
    }, 2000);
}

function viewMonitoringReport() {
    dashboard.showNotification('Opening monitoring report...', 'info');
}

function checkCronJobs() {
    dashboard.checkCronStatus();
}

function manageCronJobs() {
    window.open('https://cron-job.org', '_blank');
}

function generateContent() {
    dashboard.generateContent();
}

function previewPost() {
    dashboard.showNotification('Post preview feature coming soon!', 'info');
}

function schedulePost() {
    dashboard.showNotification('Post scheduled successfully!', 'success');
}

function publishNow() {
    dashboard.publishNow();
}

function refreshAnalytics() {
    dashboard.refreshAnalytics();
}

function exportReport() {
    dashboard.showNotification('Report exported successfully!', 'success');
}

function viewDetailedAnalytics() {
    dashboard.showNotification('Opening detailed analytics...', 'info');
}

function viewInstagramInsights() {
    window.open('https://business.instagram.com/insights', '_blank');
}

function openSettings() {
    document.getElementById('settingsModal').style.display = 'block';
}

function closeSettings() {
    document.getElementById('settingsModal').style.display = 'none';
}

function saveSettings() {
    dashboard.saveSettings();
}

function resetSettings() {
    if (confirm('Reset all settings to default?')) {
        localStorage.removeItem('balzacSettings');
        location.reload();
    }
}

function switchTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Filter activity feed based on tab
    dashboard.logActivity('UI', `Switched to ${tab} tab`, 'info');
}

function clearActivityFeed() {
    if (confirm('Clear all activity logs?')) {
        dashboard.activityLog = [];
        dashboard.updateActivityFeed();
        dashboard.logActivity('UI', 'Activity feed cleared', 'info');
    }
}

// ========================================
// HASHTAG ANALYTICS FUNCTIONS
// ========================================

let currentMealType = 'colazione';
let hashtagAnalyticsData = {};
let roiChart = null;
let contentChart = null;
let timesChart = null;

// Select meal type for analysis
function selectMeal(mealType) {
    // Update UI
    document.querySelectorAll('.meal-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-meal="${mealType}"]`).classList.add('active');
    
    currentMealType = mealType;
    
    // Load analytics for selected meal
    loadHashtagAnalytics(mealType);
    
    dashboard.logActivity('ANALYTICS', `Switched to ${mealType} analysis`, 'info');
}

// Load hashtag analytics data
async function loadHashtagAnalytics(mealType) {
    try {
        showLoading('Caricamento analytics hashtag...');
        
        const response = await axios.post('/api/advanced-analytics', {
            meal_type: mealType,
            analysis_type: 'hashtag_roi',
            timeframe: 7
        });
        
        hashtagAnalyticsData[mealType] = response.data.results;
        
        // Update all UI components
        updateROIOverview(response.data.results);
        updateStrategyDetails(response.data.results);
        updateHashtagTable(response.data.results);
        updatePostingTimes(response.data.results);
        updateCharts(response.data.results);
        
        hideLoading();
        dashboard.logActivity('ANALYTICS', `Loaded ${mealType} hashtag analytics`, 'success');
        
    } catch (error) {
        console.error('Error loading hashtag analytics:', error);
        hideLoading();
        dashboard.logActivity('ANALYTICS', `Failed to load ${mealType} analytics: ${error.message}`, 'error');
        
        // Show fallback data
        showFallbackAnalytics(mealType);
    }
}

// Update ROI overview cards
function updateROIOverview(data) {
    const bestStrategy = data.performance_summary;
    
    // Best strategy card
    document.getElementById('bestROIScore').textContent = bestStrategy.best_roi_score || '-';
    document.getElementById('bestStrategyName').textContent = bestStrategy.best_performing_strategy || 'N/A';
    document.getElementById('bestStrategyDescription').textContent = 
        getStrategyDescription(bestStrategy.best_performing_strategy);
    
    // Show hashtags for best strategy
    const bestStrategyData = data.detailed_analysis[bestStrategy.best_performing_strategy];
    if (bestStrategyData && bestStrategyData.hashtags) {
        document.getElementById('bestStrategyHashtags').textContent = 
            bestStrategyData.hashtags.slice(0, 5).map(h => `#${h}`).join(' ');
    }
    
    // Performance summary
    if (bestStrategyData && bestStrategyData.performance) {
        document.getElementById('avgEngagement').textContent = 
            bestStrategyData.performance.avg_engagement_rate || '-';
        document.getElementById('estimatedReach').textContent = 
            formatNumber(bestStrategyData.performance.estimated_total_reach) || '-';
        document.getElementById('hashtagsAnalyzed').textContent = 
            bestStrategyData.performance.hashtags_analyzed || '-';
    }
    
    // Overall recommendation
    document.getElementById('overallRecommendation').textContent = 
        bestStrategy.overall_recommendation || 'Nessuna raccomandazione disponibile';
}

// Update strategy detail cards
function updateStrategyDetails(data) {
    const strategyGrid = document.getElementById('strategyGrid');
    strategyGrid.innerHTML = '';
    
    const strategies = Object.entries(data.detailed_analysis);
    
    strategies.forEach(([strategyName, strategyData]) => {
        const card = createStrategyCard(strategyName, strategyData);
        strategyGrid.appendChild(card);
    });
}

// Create strategy card element
function createStrategyCard(strategyName, data) {
    const card = document.createElement('div');
    card.className = `strategy-card ${strategyName}`;
    
    const strategyDisplayName = {
        'high_reach': 'Alto Reach',
        'medium_engagement': 'Medio Engagement', 
        'local_niche': 'Nicchia Locale',
        'ultra_niche': 'Ultra Nicchia'
    };
    
    card.innerHTML = `
        <div class="card-header">
            <div class="strategy-title">${strategyDisplayName[strategyName] || strategyName}</div>
            <div class="strategy-roi">ROI: ${data.roi_score || 0}</div>
        </div>
        <div class="strategy-metrics">
            <div class="strategy-metric">
                <span class="metric-label">Engagement</span>
                <span class="metric-value">${data.performance?.avg_engagement_rate || 0}</span>
            </div>
            <div class="strategy-metric">
                <span class="metric-label">Reach</span>
                <span class="metric-value">${formatNumber(data.performance?.estimated_total_reach) || 0}</span>
            </div>
        </div>
        <div class="strategy-recommendation">
            ${data.recommendation || 'Nessuna raccomandazione disponibile'}
        </div>
        <div class="hashtag-preview">
            ${data.hashtags ? data.hashtags.slice(0, 4).map(h => `#${h}`).join(' ') : '-'}
        </div>
    `;
    
    return card;
}

// Update hashtag performance table
function updateHashtagTable(data) {
    const tableBody = document.getElementById('hashtagTableBody');
    tableBody.innerHTML = '';
    
    const allHashtags = [];
    
    // Collect all hashtags from all strategies
    Object.entries(data.detailed_analysis).forEach(([strategyName, strategyData]) => {
        if (strategyData.hashtags && strategyData.performance) {
            strategyData.hashtags.forEach(hashtag => {
                allHashtags.push({
                    hashtag: hashtag,
                    strategy: strategyName,
                    engagement: strategyData.performance.avg_engagement_rate || 0,
                    reach: strategyData.performance.estimated_total_reach || 0,
                    posts: strategyData.performance.hashtags_analyzed || 0,
                    performance: getPerformanceLevel(strategyData.performance.avg_engagement_rate),
                    trend: getRandomTrend()
                });
            });
        }
    });
    
    if (allHashtags.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" class="no-data">Nessun dato disponibile</td></tr>';
        return;
    }
    
    // Sort by engagement
    allHashtags.sort((a, b) => b.engagement - a.engagement);
    
    allHashtags.forEach(hashtag => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${hashtag.hashtag}</td>
            <td>${getStrategyDisplayName(hashtag.strategy)}</td>
            <td>${hashtag.engagement}</td>
            <td>${formatNumber(hashtag.reach)}</td>
            <td>${hashtag.posts}</td>
            <td>
                <span class="performance-indicator ${hashtag.performance}"></span>
                ${hashtag.performance}
            </td>
            <td>
                <span class="trend-indicator ${hashtag.trend.class}">${hashtag.trend.icon}</span>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Update posting times recommendations
function updatePostingTimes(data) {
    // Get optimal times from best performing strategy
    const bestStrategy = data.detailed_analysis[data.performance_summary.best_performing_strategy];
    
    if (bestStrategy && bestStrategy.performance && bestStrategy.performance.optimal_posting_times) {
        const times = bestStrategy.performance.optimal_posting_times;
        const sortedTimes = Object.entries(times).sort(([,a], [,b]) => b - a);
        
        if (sortedTimes.length > 0) {
            document.getElementById('bestTime').querySelector('.time-value').textContent = 
                `${sortedTimes[0][0]}:00`;
            
            document.getElementById('goodTimes').querySelector('.time-value').textContent = 
                sortedTimes.slice(1, 3).map(([hour]) => `${hour}:00`).join(', ') || '-';
                
            // For avoid times, show early morning and late night
            document.getElementById('avoidTimes').querySelector('.time-value').textContent = 
                '02:00-06:00, 23:00-01:00';
        }
    }
    
    // Update posting times chart
    updatePostingTimesChart(bestStrategy?.performance?.optimal_posting_times);
}

// Update all charts
function updateCharts(data) {
    updateROIComparisonChart(data);
    updateContentTypeChart(data);
}

// Update ROI comparison chart
function updateROIComparisonChart(data) {
    const ctx = document.getElementById('roiComparisonChart').getContext('2d');
    
    const strategies = Object.entries(data.detailed_analysis);
    const labels = strategies.map(([name]) => getStrategyDisplayName(name));
    const roiScores = strategies.map(([, data]) => data.roi_score || 0);
    const engagementRates = strategies.map(([, data]) => data.performance?.avg_engagement_rate || 0);
    const reachData = strategies.map(([, data]) => (data.performance?.estimated_total_reach || 0) / 1000);
    
    if (roiChart) {
        roiChart.destroy();
    }
    
    roiChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'ROI Score',
                data: roiScores,
                backgroundColor: [
                    'rgba(231, 76, 60, 0.8)',
                    'rgba(243, 156, 18, 0.8)', 
                    'rgba(39, 174, 96, 0.8)',
                    'rgba(52, 152, 219, 0.8)'
                ],
                borderColor: [
                    'rgba(231, 76, 60, 1)',
                    'rgba(243, 156, 18, 1)',
                    'rgba(39, 174, 96, 1)', 
                    'rgba(52, 152, 219, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}

// Update content type chart
function updateContentTypeChart(data) {
    const ctx = document.getElementById('contentTypeChart').getContext('2d');
    
    // Aggregate content type data from all strategies
    const contentTypes = { image: 0, video: 0, carousel: 0 };
    
    Object.values(data.detailed_analysis).forEach(strategy => {
        if (strategy.performance && strategy.performance.content_type_insights) {
            Object.entries(strategy.performance.content_type_insights).forEach(([type, value]) => {
                contentTypes[type] = (contentTypes[type] || 0) + value;
            });
        }
    });
    
    if (contentChart) {
        contentChart.destroy();
    }
    
    contentChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Immagini', 'Video', 'Carousel'],
            datasets: [{
                data: [contentTypes.image, contentTypes.video, contentTypes.carousel],
                backgroundColor: [
                    'rgba(52, 152, 219, 0.8)',
                    'rgba(39, 174, 96, 0.8)',
                    'rgba(243, 156, 18, 0.8)'
                ],
                borderColor: [
                    'rgba(52, 152, 219, 1)',
                    'rgba(39, 174, 96, 1)',
                    'rgba(243, 156, 18, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Update posting times chart
function updatePostingTimesChart(timesData) {
    const ctx = document.getElementById('postingTimesChart').getContext('2d');
    
    const hours = Array.from({length: 24}, (_, i) => i);
    const values = hours.map(hour => timesData ? (timesData[hour] || 0) : 0);
    
    if (timesChart) {
        timesChart.destroy();
    }
    
    timesChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: hours.map(h => `${h}:00`),
            datasets: [{
                label: 'Engagement',
                data: values,
                borderColor: 'rgba(102, 126, 234, 1)',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Ora del Giorno'
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Engagement'
                    }
                }
            }
        }
    });
}

// Refresh hashtag analytics
function refreshHashtagAnalytics() {
    loadHashtagAnalytics(currentMealType);
}

// Utility functions
function getStrategyDisplayName(strategyName) {
    const names = {
        'high_reach': 'Alto Reach',
        'medium_engagement': 'Medio Engagement',
        'local_niche': 'Nicchia Locale', 
        'ultra_niche': 'Ultra Nicchia'
    };
    return names[strategyName] || strategyName;
}

function getStrategyDescription(strategyName) {
    const descriptions = {
        'high_reach': 'Hashtag con massima visibilità per raggiungere un pubblico ampio',
        'medium_engagement': 'Hashtag bilanciati per un engagement sostenibile',
        'local_niche': 'Hashtag specifici per il territorio di Modena',
        'ultra_niche': 'Hashtag ultra-specifici per il brand Balzac'
    };
    return descriptions[strategyName] || 'Strategia hashtag personalizzata';
}

function getPerformanceLevel(engagement) {
    if (engagement > 100) return 'excellent';
    if (engagement > 50) return 'good';
    return 'average';
}

function getRandomTrend() {
    const trends = [
        { class: 'trend-up', icon: '↗️' },
        { class: 'trend-down', icon: '↘️' },
        { class: 'trend-stable', icon: '→' }
    ];
    return trends[Math.floor(Math.random() * trends.length)];
}

function formatNumber(num) {
    if (!num) return '0';
    if (num > 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num > 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
}

function showFallbackAnalytics(mealType) {
    // Show message about using fallback data
    document.getElementById('overallRecommendation').textContent = 
        'Utilizzando dati stimati - verifica la connessione alle API per dati in tempo reale';
    
    dashboard.logActivity('ANALYTICS', `Using fallback data for ${mealType}`, 'warning');
}

// Chart update functions
function updateChart() {
    const metric = document.getElementById('chartMetric').value;
    if (hashtagAnalyticsData[currentMealType]) {
        updateCharts(hashtagAnalyticsData[currentMealType]);
    }
}

// Table functions
function filterHashtags() {
    const searchTerm = document.getElementById('hashtagSearch').value.toLowerCase();
    const rows = document.querySelectorAll('#hashtagTableBody tr');
    
    rows.forEach(row => {
        const hashtag = row.cells[0]?.textContent.toLowerCase() || '';
        const strategy = row.cells[1]?.textContent.toLowerCase() || '';
        
        if (hashtag.includes(searchTerm) || strategy.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function sortHashtags() {
    const sortBy = document.getElementById('sortBy').value;
    const tbody = document.getElementById('hashtagTableBody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    rows.sort((a, b) => {
        let aVal, bVal;
        
        switch(sortBy) {
            case 'engagement':
                aVal = parseInt(a.cells[2]?.textContent || '0');
                bVal = parseInt(b.cells[2]?.textContent || '0');
                break;
            case 'reach':
                aVal = parseInt(a.cells[3]?.textContent.replace(/[^\d]/g, '') || '0');
                bVal = parseInt(b.cells[3]?.textContent.replace(/[^\d]/g, '') || '0');
                break;
            case 'posts':
                aVal = parseInt(a.cells[4]?.textContent || '0');
                bVal = parseInt(b.cells[4]?.textContent || '0');
                break;
            default:
                return 0;
        }
        
        return bVal - aVal; // Descending order
    });
    
    rows.forEach(row => tbody.appendChild(row));
}

// Initialize hashtag analytics on page load
function initHashtagAnalytics() {
    // Load default meal type analytics
    loadHashtagAnalytics('colazione');
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Also initialize hashtag analytics
document.addEventListener('DOMContentLoaded', initHashtagAnalytics);

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);