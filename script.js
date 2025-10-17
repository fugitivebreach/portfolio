// Configuration data
let config = {};

// Initialize the application
document.addEventListener('DOMContentLoaded', async () => {
    await loadConfig();
    initializeDots();
    generateTabs();
    initializeTabs();
    await loadDiscordData();
    populateContent();
});

// Load configuration from config.json
async function loadConfig() {
    try {
        const response = await fetch('config.json');
        config = await response.json();
    } catch (error) {
        console.error('Error loading config:', error);
        // Fallback config
        config = {
            name: "cosmin",
            description: "full stack developer specializing in modern web technologies",
            discordID: "cosmiccodedger",
            playlistDescription: "currently in rotation - a personal collection of music i've been listening to lately",
            songs: []
        };
    }
}

// Generate tabs dynamically from config
function generateTabs() {
    const tabsContainer = document.getElementById('tabsContainer');
    const contentContainer = document.getElementById('contentContainer');
    
    if (!config.tabs || config.tabs.length === 0) {
        console.log('No tabs defined in config');
        return;
    }
    
    // Clear existing content
    tabsContainer.innerHTML = '';
    contentContainer.innerHTML = '';
    
    // Generate tabs and content
    config.tabs.forEach((tab, index) => {
        // Create tab button
        const tabButton = document.createElement('button');
        tabButton.className = 'tab';
        tabButton.dataset.tab = tab.tabName;
        tabButton.textContent = tab.displayName;
        
        // Make first tab active
        if (index === 0) {
            tabButton.classList.add('active');
        }
        
        tabsContainer.appendChild(tabButton);
        
        // Create tab content
        const tabContent = document.createElement('div');
        tabContent.className = 'tab-content';
        tabContent.id = tab.tabName;
        
        // Make first tab content active
        if (index === 0) {
            tabContent.classList.add('active');
        }
        
        // Generate content based on tab type
        if (tab.type === 'profile') {
            tabContent.innerHTML = `
                <h1 class="name" id="userName"></h1>
                <p class="description" id="userDescription"></p>
                
                <!-- Discord profile -->
                <div class="discord-profile">
                    <div class="discord-avatar">
                        <img src="https://cdn.discordapp.com/embed/avatars/0.png" alt="Discord Avatar" id="discordAvatar">
                        <div class="status-indicator online"></div>
                    </div>
                    <div class="discord-info">
                        <span class="discord-name" id="discordName"></span>
                        <span class="discord-status">Online</span>
                    </div>
                </div>
            `;
        } else if (tab.type === 'text') {
            tabContent.innerHTML = `
                <h2>${tab.displayName.charAt(0).toUpperCase() + tab.displayName.slice(1)}</h2>
                <p>${tab.content || 'Content coming soon...'}</p>
            `;
        }
        
        contentContainer.appendChild(tabContent);
    });
}

// Load Discord data using Lanyard API
async function loadDiscordData() {
    if (!config.discordID) return;
    
    try {
        // Using Lanyard API to get Discord presence
        const response = await fetch(`https://api.lanyard.rest/v1/users/${config.discordID}`);
        const data = await response.json();
        
        if (data.success && data.data) {
            const discordData = data.data;
            
            // Update Discord profile information
            config.discordUsername = discordData.discord_user.username;
            config.discordDisplayName = discordData.discord_user.display_name || discordData.discord_user.username;
            config.discordAvatar = `https://cdn.discordapp.com/avatars/${discordData.discord_user.id}/${discordData.discord_user.avatar}.png?size=128`;
            config.discordStatus = discordData.discord_status; // online, idle, dnd, offline
            
            // Update activities if available
            if (discordData.activities && discordData.activities.length > 0) {
                config.discordActivity = discordData.activities[0];
            }
            
            console.log('Discord data loaded successfully:');
            console.log('Username:', config.discordUsername);
            console.log('Display Name:', config.discordDisplayName);
            console.log('Status:', config.discordStatus);
        }
    } catch (error) {
        console.error('Error loading Discord data:', error);
        // Fallback to default values
        config.discordUsername = config.discordID;
        config.discordDisplayName = config.discordID;
        config.discordAvatar = 'https://cdn.discordapp.com/embed/avatars/0.png';
        config.discordStatus = 'offline';
    }
}


// Create animated dots background
function initializeDots() {
    const dotsContainer = document.querySelector('.dots-container');
    const numberOfDots = 200; // Increased from 50 to 200
    
    for (let i = 0; i < numberOfDots; i++) {
        createDot(dotsContainer);
    }
    
    // Continuously create new dots more frequently
    setInterval(() => {
        createDot(dotsContainer);
        createDot(dotsContainer); // Create 2 dots at once
    }, 1000); // Reduced from 2000 to 1000ms
}

function createDot(container) {
    const dot = document.createElement('div');
    dot.className = 'dot';
    
    // Random size
    const sizes = ['small', 'medium', 'large'];
    const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
    dot.classList.add(randomSize);
    
    // Random horizontal position
    dot.style.left = Math.random() * 100 + '%';
    
    // Random animation duration (very slow)
    const duration = 15 + Math.random() * 25; // 15-40 seconds
    dot.style.animationDuration = `${duration}s, 3s`;
    
    // Random animation delay
    dot.style.animationDelay = Math.random() * 5 + 's';
    
    container.appendChild(dot);
    
    // Remove dot after animation completes
    setTimeout(() => {
        if (dot.parentNode) {
            dot.parentNode.removeChild(dot);
        }
    }, (duration + 5) * 1000);
}

// Initialize tab functionality
function initializeTabs() {
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;
            
            // Remove active class from all tabs and contents
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            tab.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
}


// Populate content with config data
function populateContent() {
    document.getElementById('userName').textContent = config.name;
    document.getElementById('userDescription').textContent = config.description;
    document.getElementById('playlistDescription').textContent = config.playlistDescription;
    
    // Update Discord information with real data
    const discordNameElement = document.getElementById('discordName');
    const discordAvatarElement = document.getElementById('discordAvatar');
    const discordStatusElement = document.querySelector('.discord-status');
    const statusIndicatorElement = document.querySelector('.status-indicator');
    
    if (config.discordDisplayName && config.discordDisplayName !== config.discordID) {
        discordNameElement.textContent = config.discordDisplayName;
        console.log('Using Discord display name:', config.discordDisplayName);
    } else if (config.discordUsername && config.discordUsername !== config.discordID) {
        discordNameElement.textContent = config.discordUsername;
        console.log('Using Discord username:', config.discordUsername);
    } else {
        discordNameElement.textContent = config.discordID;
        console.log('Using Discord ID as fallback:', config.discordID);
    }
    
    if (config.discordAvatar) {
        discordAvatarElement.src = config.discordAvatar;
    }
    
    // Update status
    const statusMap = {
        'online': { text: 'Online', class: 'online' },
        'idle': { text: 'Away', class: 'away' },
        'dnd': { text: 'Do Not Disturb', class: 'dnd' },
        'offline': { text: 'Offline', class: 'offline' }
    };
    
    const status = statusMap[config.discordStatus] || statusMap['offline'];
    discordStatusElement.textContent = status.text;
    statusIndicatorElement.className = `status-indicator ${status.class}`;
}



// Update Discord data periodically
async function updateDiscordData() {
    await loadDiscordData();
    populateContent();
}

// Update Discord status every 30 seconds
setInterval(updateDiscordData, 30000);
