// js/main.js

// ========================================
// NAVIGATION SCROLL BEHAVIOR
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    const nav = document.getElementById('nav');
    const hero = document.getElementById('hero');
    
    // Sticky navigation shadow on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > hero.offsetHeight - 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
    
    // Smooth scroll for navigation links
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
});

// ========================================
// SCROLL ANIMATIONS
// ========================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
});

// ========================================
// KPI COUNTER ANIMATION
// ========================================
function animateCounter(element, target, suffix = '') {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.round(current) + suffix;
    }, 30);
}

// Trigger KPI animations when section is visible
const kpiSection = document.querySelector('.kpi-section');
const kpiObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Animate each KPI value
            const maxTemp = document.getElementById('maxTemp');
            const urbanDelta = document.getElementById('urbanDelta');
            const riskPop = document.getElementById('riskPop');
            const concreteRatio = document.getElementById('concreteRatio');
            
            // These would be populated from your actual data
            animateCounter(maxTemp, 38, '°C');
            setTimeout(() => {
                urbanDelta.textContent = '+2.5°C';
            }, 500);
            setTimeout(() => {
                riskPop.textContent = '2.1M';
            }, 700);
            animateCounter(concreteRatio, 93, '%');
            
            kpiObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

if (kpiSection) {
    kpiObserver.observe(kpiSection);
}

// ========================================
// IMAGE FALLBACK HANDLING
// ========================================
document.querySelectorAll('.chart-image').forEach(img => {
    img.addEventListener('error', function() {
        this.classList.add('error');
        this.style.display = 'none';
        const placeholder = this.nextElementSibling;
        if (placeholder && placeholder.classList.contains('chart-placeholder')) {
            placeholder.style.display = 'block';
        }
    });
});

// ========================================
// FALLBACK CHARTS (if images don't load)
// Using Canvas for simple visualizations
// ========================================

// Intensity Score Bar Chart (Fallback)
function drawIntensityChart() {
    const canvas = document.getElementById('intensityCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = 400;
    
    // Sample data based on your description
    const data = [
        { district: 'Yuen Long', score: 38, color: '#d62828' },
        { district: 'Southern', score: 37, color: '#f77f00' },
        { district: 'Yau Tsim Mong', score: 37, color: '#f77f00' },
        { district: 'Kwun Tong', score: 36, color: '#fcbf49' },
        { district: 'Sham Shui Po', score: 35, color: '#fcbf49' },
        { district: 'Wong Tai Sin', score: 35, color: '#fcbf49' },
        { district: 'Sha Tin', score: 34, color: '#90be6d' },
        { district: 'Tuen Mun', score: 33, color: '#43aa8b' },
        { district: 'North', score: 33, color: '#43aa8b' }
    ];
    
    const barWidth = (canvas.width - 100) / data.length - 10;
    const maxScore = 40;
    
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    data.forEach((item, index) => {
        const x = 50 + index * (barWidth + 10);
        const barHeight = (item.score / maxScore) * (canvas.height - 100);
        const y = canvas.height - 50 - barHeight;
        
        // Draw bar
        ctx.fillStyle = item.color;
        ctx.fillRect(x, y, barWidth, barHeight);
        
        // Draw value
        ctx.fillStyle = '#1a1a2e';
        ctx.font = 'bold 14px Noto Sans HK';
        ctx.textAlign = 'center';
        ctx.fillText(item.score + '°C', x + barWidth/2, y - 10);
        
        // Draw label
        ctx.save();
        ctx.translate(x + barWidth/2, canvas.height - 10);
        ctx.rotate(-Math.PI/4);
        ctx.font = '11px Noto Sans HK';
        ctx.textAlign = 'right';
        ctx.fillText(item.district, 0, 0);
        ctx.restore();
    });
    
    // Y-axis label
    ctx.save();
    ctx.translate(15, canvas.height/2);
    ctx.rotate(-Math.PI/2);
    ctx.font = '12px Noto Sans HK';
    ctx.textAlign = 'center';
    ctx.fillText('Temperature (°C)', 0, 0);
    ctx.restore();
}

// Urban Heat Delta Chart (Fallback)
function drawDeltaChart() {
    const canvas = document.getElementById('deltaCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = 400;
    
    const data = [
        { district: 'Sai Kung', delta: 0.5, color: '#d62828' },
        { district: 'Tsuen Wan', delta: 0.3, color: '#f77f00' },
        { district: 'Kwai Tsing', delta: 0.1, color: '#fcbf49' },
        { district: 'Sha Tin', delta: -0.5, color: '#90be6d' },
        { district: 'Tuen Mun', delta: -1.0, color: '#43aa8b' },
        { district: 'North', delta: -1.67, color: '#2a9d8f' },
        { district: 'Yuen Long', delta: -2.0, color: '#1d7a6e' }
    ];
    
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const centerY = canvas.height / 2;
    const barWidth = (canvas.width - 100) / data.length - 15;
    const scale = 80;
    
    // Draw zero line
    ctx.strokeStyle = '#666';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(50, centerY);
    ctx.lineTo(canvas.width - 20, centerY);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw "0" label
    ctx.fillStyle = '#666';
    ctx.font = '12px Noto Sans HK';
    ctx.textAlign = 'right';
    ctx.fillText('0°C', 45, centerY + 4);
    
    data.forEach((item, index) => {
        const x = 60 + index * (barWidth + 15);
        const barHeight = Math.abs(item.delta) * scale;
        const y = item.delta >= 0 ? centerY - barHeight : centerY;
        
        ctx.fillStyle = item.color;
        ctx.fillRect(x, y, barWidth, barHeight);
        
        // Value label
        ctx.fillStyle = '#1a1a2e';
        ctx.font = 'bold 12px Noto Sans HK';
        ctx.textAlign = 'center';
        const labelY = item.delta >= 0 ? y - 8 : y + barHeight + 15;
        ctx.fillText((item.delta > 0 ? '+' : '') + item.delta.toFixed(1), x + barWidth/2, labelY);
        
        // District label
        ctx.save();
        ctx.translate(x + barWidth/2, canvas.height - 10);
        ctx.rotate(-Math.PI/4);
        ctx.font = '10px Noto Sans HK';
        ctx.textAlign = 'right';
        ctx.fillText(item.district, 0, 0);
        ctx.restore();
    });
}

// High Risk Population Donut Chart (Fallback)
function drawDonutChart() {
    const canvas = document.getElementById('densityDonutCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = 350;
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2 - 20;
    const radius = Math.min(centerX, centerY) - 40;
    const innerRadius = radius * 0.6;
    
    const data = [
        { label: 'High Density', value: 35, color: '#d62828' },
        { label: 'Medium-High', value: 28, color: '#f77f00' },
        { label: 'Medium', value: 22, color: '#fcbf49' },
        { label: 'Low', value: 15, color: '#43aa8b' }
    ];
    
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    let startAngle = -Math.PI / 2;
    const total = data.reduce((sum, item) => sum + item.value, 0);
    
    data.forEach((item, index) => {
        const sliceAngle = (item.value / total) * 2 * Math.PI;
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
        ctx.arc(centerX, centerY, innerRadius, startAngle + sliceAngle, startAngle, true);
        ctx.closePath();
        ctx.fillStyle = item.color;
        ctx.fill();
        
        // Label
        const midAngle = startAngle + sliceAngle / 2;
        const labelRadius = radius + 25;
        const labelX = centerX + Math.cos(midAngle) * labelRadius;
        const labelY = centerY + Math.sin(midAngle) * labelRadius;
        
        ctx.fillStyle = '#1a1a2e';
        ctx.font = '11px Noto Sans HK';
        ctx.textAlign = midAngle > Math.PI/2 && midAngle < 3*Math.PI/2 ? 'right' : 'left';
        ctx.fillText(`${item.label} (${item.value}%)`, labelX, labelY);
        
        startAngle += sliceAngle;
    });
    
    // Center text
    ctx.fillStyle = '#1a1a2e';
    ctx.font = 'bold 24px Noto Sans HK';
    ctx.textAlign = 'center';
    ctx.fillText('7.5M', centerX, centerY - 5);
    ctx.font = '12px Noto Sans HK';
    ctx.fillText('Total Population', centerX, centerY + 15);
}

// Initialize fallback charts if images fail
window.addEventListener('load', function() {
    // Check if images loaded successfully
    setTimeout(() => {
        const charts = document.querySelectorAll('.chart-image');
        charts.forEach(img => {
            if (!img.complete || img.naturalHeight === 0) {
                img.dispatchEvent(new Event('error'));
            }
        });
        
        // Draw fallback charts
        drawIntensityChart();
        drawDeltaChart();
        drawDonutChart();
    }, 1000);
});

// ========================================
// TOOLTIP FUNCTIONALITY
// ========================================
document.querySelectorAll('.term').forEach(term => {
    term.addEventListener('mouseenter', function(e) {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = this.getAttribute('data-tooltip');
        document.body.appendChild(tooltip);
        
        const rect = this.getBoundingClientRect();
        tooltip.style.left = rect.left + rect.width/2 - tooltip.offsetWidth/2 + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + window.scrollY + 'px';
    });
    
    term.addEventListener('mouseleave', function() {
        const tooltip = document.querySelector('.tooltip');
        if (tooltip) tooltip.remove();
    });
});

// ========================================
// DATA LOADING (for future API integration)
// ========================================
async function loadHKOData() {
    try {
        const response = await fetch('[data.weather.gov.hk](https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread&lang=en)');
        const data = await response.json();
        
        if (data.temperature && data.temperature.data) {
            console.log('HKO Temperature Data:', data.temperature.data);
            // Process and display live data
            updateLiveTemperatures(data.temperature.data);
        }
    } catch (error) {
        console.error('Error loading HKO data:', error);
    }
}

function updateLiveTemperatures(tempData) {
    // This function would update the page with live data
    // Implementation depends on your specific needs
    console.log('Live temperature data available for integration');
}

// Uncomment to load live data (for demonstration)
// loadHKOData();

// ========================================
// RESIZE HANDLER
// ========================================
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        drawIntensityChart();
        drawDeltaChart();
        drawDonutChart();
    }, 250);
});

console.log('HK Urban Heat Island Study - Website Initialized');
