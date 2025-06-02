// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations
    initializeAnimations();
    
    // Create ROI Chart
    createROIChart();
    
    // Add interactive features
    addInteractiveFeatures();
    
    // Initialize counters
    initializeCounters();
});

// Initialize GSAP animations
function initializeAnimations() {
    // Animate header on load
    gsap.from('.logo-section', {
        opacity: 0,
        y: -30,
        duration: 1,
        ease: 'power3.out'
    });
    
    gsap.from('.roi-summary .roi-card', {
        opacity: 0,
        scale: 0.8,
        duration: 0.8,
        stagger: 0.2,
        ease: 'back.out(1.7)'
    });
    
    // Animate sections on scroll
    const sections = document.querySelectorAll('section');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

// Create ROI Chart using Chart.js
function createROIChart() {
    const ctx = document.getElementById('roiChart').getContext('2d');
    
    const data = {
        labels: ['Investimento', 'Time Savings', 'Revenue Extra', 'Total Value'],
        datasets: [{
            label: 'Valore Mensile (€)',
            data: [317, 1500, 1650, 3150],
            backgroundColor: [
                'rgba(255, 107, 53, 0.8)',
                'rgba(76, 175, 80, 0.8)',
                'rgba(255, 215, 0, 0.8)',
                'rgba(26, 26, 26, 0.8)'
            ],
            borderColor: [
                'rgba(255, 107, 53, 1)',
                'rgba(76, 175, 80, 1)',
                'rgba(255, 215, 0, 1)',
                'rgba(26, 26, 26, 1)'
            ],
            borderWidth: 2
        }]
    };
    
    const options = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: 'ROI Breakdown (€/mese)',
                font: {
                    size: 18,
                    weight: 'bold'
                },
                padding: 20
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        label += '€' + context.parsed.y.toLocaleString();
                        return label;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function(value) {
                        return '€' + value.toLocaleString();
                    }
                }
            }
        },
        animation: {
            duration: 2000,
            easing: 'easeInOutQuart'
        }
    };
    
    new Chart(ctx, {
        type: 'bar',
        data: data,
        options: options
    });
}

// Add interactive features
function addInteractiveFeatures() {
    // Stack cards hover effect
    const stackCards = document.querySelectorAll('.stack-card');
    
    stackCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            gsap.to(this, {
                scale: 1.05,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        card.addEventListener('mouseleave', function() {
            gsap.to(this, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
    
    // Timeline items animation
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-50px)';
        
        setTimeout(() => {
            gsap.to(item, {
                opacity: 1,
                x: 0,
                duration: 0.8,
                ease: 'power3.out'
            });
        }, 200 * index);
    });
    
    // Phase cards interaction
    const phaseCards = document.querySelectorAll('.phase-card');
    
    phaseCards.forEach(card => {
        card.addEventListener('click', function() {
            phaseCards.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Initialize animated counters
function initializeCounters() {
    const counters = [
        { element: '.roi-card .value', target: 894, suffix: '%', decimal: false },
        { element: '.big-number', target: null, prefix: '€', decimal: false }
    ];
    
    counters.forEach(counter => {
        const elements = document.querySelectorAll(counter.element);
        
        elements.forEach(element => {
            const text = element.textContent;
            let target = counter.target;
            
            // Extract number from text if target not specified
            if (!target) {
                const match = text.match(/[\d,]+/);
                if (match) {
                    target = parseInt(match[0].replace(/,/g, ''));
                }
            }
            
            if (target) {
                animateCounter(element, target, counter.prefix, counter.suffix, counter.decimal);
            }
        });
    });
}

// Animate counter function
function animateCounter(element, target, prefix = '', suffix = '', decimal = false) {
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;
    let current = 0;
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const timer = setInterval(() => {
                    current += target / steps;
                    
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    
                    const value = decimal ? current.toFixed(1) : Math.floor(current);
                    const formattedValue = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                    element.textContent = prefix + formattedValue + suffix;
                }, stepDuration);
                
                observer.unobserve(element);
            }
        });
    });
    
    observer.observe(element);
}

// Add smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Dynamic update of metrics based on time
function updateMetricsBasedOnTime() {
    const now = new Date();
    const hours = now.getHours();
    
    // Update timeline active state based on current time
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach(item => {
        const time = item.querySelector('.time').textContent;
        const itemHour = parseInt(time.split(':')[0]);
        
        if (hours >= itemHour && hours < itemHour + 4) {
            item.classList.add('active');
            item.querySelector('.content').style.background = '#fff5f2';
        }
    });
}

// Call updateMetricsBasedOnTime every minute
setInterval(updateMetricsBasedOnTime, 60000);
updateMetricsBasedOnTime();

// Add pulse animation to CTA section
gsap.to('.cta-section', {
    boxShadow: '0 0 30px rgba(255, 215, 0, 0.5)',
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: 'power2.inOut'
});

// Create floating animation for result cards
const resultCards = document.querySelectorAll('.result-card');

resultCards.forEach((card, index) => {
    gsap.to(card, {
        y: -10,
        duration: 2 + index * 0.2,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
        delay: index * 0.1
    });
});

// Add particle effect to header (optional enhancement)
function createParticles() {
    const header = document.querySelector('.dashboard-header');
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    particlesContainer.style.position = 'absolute';
    particlesContainer.style.top = '0';
    particlesContainer.style.left = '0';
    particlesContainer.style.width = '100%';
    particlesContainer.style.height = '100%';
    particlesContainer.style.overflow = 'hidden';
    particlesContainer.style.pointerEvents = 'none';
    header.style.position = 'relative';
    header.appendChild(particlesContainer);
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = '2px';
        particle.style.height = '2px';
        particle.style.background = 'rgba(255, 215, 0, 0.8)';
        particle.style.borderRadius = '50%';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        particlesContainer.appendChild(particle);
        
        gsap.to(particle, {
            y: -200,
            x: (Math.random() - 0.5) * 100,
            opacity: 0,
            duration: 3 + Math.random() * 2,
            repeat: -1,
            delay: Math.random() * 3,
            ease: 'none'
        });
    }
}

// Initialize particles
createParticles();

// Performance monitoring simulation
function simulatePerformanceUpdate() {
    const performanceMetrics = [
        { selector: '.metric-value', variations: ['+5%', '+3%', '+8%', '+2%'] },
        { selector: '.stat-value', variations: ['+10', '+15', '+5', '+20'] }
    ];
    
    setInterval(() => {
        performanceMetrics.forEach(metric => {
            const elements = document.querySelectorAll(metric.selector);
            elements.forEach((element, index) => {
                if (Math.random() > 0.7 && metric.variations[index]) {
                    const originalText = element.textContent;
                    element.style.color = '#4caf50';
                    element.textContent = originalText + ' ' + metric.variations[index];
                    
                    setTimeout(() => {
                        element.style.color = '';
                        element.textContent = originalText;
                    }, 2000);
                }
            });
        });
    }, 10000);
}

// Initialize performance simulation
simulatePerformanceUpdate();