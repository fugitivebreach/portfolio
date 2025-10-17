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
    if (!config.discordID) {
        console.log('No Discord ID configured');
        return;
    }
    
    console.log('🔍 Loading Discord data for ID:', config.discordID);
    console.log('📋 Make sure you joined the Lanyard Discord server: https://discord.gg/lanyard');
    
    try {
        // Using Lanyard API to get Discord presence
        const response = await fetch(`https://api.lanyard.rest/v1/users/${config.discordID}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success && data.data) {
            const discordData = data.data;
            const user = discordData.discord_user;
            
            // Update Discord profile information
            config.discordUsername = user.username;
            config.discordDisplayName = user.display_name || user.global_name || user.username;
            
            // Handle avatar URL - check if user has custom avatar
            if (user.avatar) {
                config.discordAvatar = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${user.avatar.startsWith('a_') ? 'gif' : 'png'}?size=128`;
            } else {
                // Use default Discord avatar
                const defaultAvatarNumber = parseInt(user.discriminator) % 5;
                config.discordAvatar = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNumber}.png`;
            }
            
            config.discordStatus = discordData.discord_status; // online, idle, dnd, offline
            
            // Update activities if available
            if (discordData.activities && discordData.activities.length > 0) {
                config.discordActivity = discordData.activities[0];
                console.log('Current activity:', config.discordActivity.name);
            }
            
            console.log('✅ Discord data loaded successfully:');
            console.log('Username:', config.discordUsername);
            console.log('Display Name:', config.discordDisplayName);
            console.log('Status:', config.discordStatus);
            console.log('Avatar URL:', config.discordAvatar);
        } else {
            throw new Error('Invalid response from Lanyard API');
        }
    } catch (error) {
        console.error('❌ Error loading Discord data:', error);
        
        if (error.message.includes('404')) {
            console.log('🚨 Discord ID not found! This means:');
            console.log('1. Join the Lanyard Discord server: https://discord.gg/lanyard');
            console.log('2. Wait 5-10 minutes after joining');
            console.log('3. Make sure your Discord ID is correct');
            console.log('4. Your Discord privacy settings allow server members to see your status');
        }
        
        // Fallback to default values
        config.discordUsername = 'archiveAnt';
        config.discordDisplayName = 'archiveAnt';
        config.discordAvatar = 'https://cdn.discordapp.com/embed/avatars/0.png';
        config.discordStatus = 'offline';
        console.log('Using fallback Discord data');
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
    // Update basic profile info
    const userNameElement = document.getElementById('userName');
    const userDescriptionElement = document.getElementById('userDescription');
    
    if (userNameElement) userNameElement.textContent = config.name;
    if (userDescriptionElement) userDescriptionElement.textContent = config.description;
    
    // Update Discord information with real data
    const discordNameElement = document.getElementById('discordName');
    const discordAvatarElement = document.getElementById('discordAvatar');
    const discordStatusElement = document.querySelector('.discord-status');
    const statusIndicatorElement = document.querySelector('.status-indicator');
    
    if (discordNameElement) {
        // Prioritize display name, then username, then ID
        if (config.discordDisplayName && config.discordDisplayName !== 'Discord User') {
            discordNameElement.textContent = config.discordDisplayName;
            console.log('📝 Using Discord display name:', config.discordDisplayName);
        } else if (config.discordUsername && config.discordUsername !== 'User') {
            discordNameElement.textContent = config.discordUsername;
            console.log('📝 Using Discord username:', config.discordUsername);
        } else {
            discordNameElement.textContent = config.discordID;
            console.log('📝 Using Discord ID as fallback:', config.discordID);
        }
    }
    
    // Update avatar with error handling
    if (discordAvatarElement && config.discordAvatar) {
        discordAvatarElement.src = config.discordAvatar;
        discordAvatarElement.onerror = function() {
            console.log('❌ Avatar failed to load, using default');
            this.src = 'https://cdn.discordapp.com/embed/avatars/0.png';
        };
        console.log('🖼️ Updated Discord avatar');
    }
    
    // Update status with proper styling
    const statusMap = {
        'online': { text: 'Online', class: 'online' },
        'idle': { text: 'Away', class: 'away' },
        'dnd': { text: 'Do Not Disturb', class: 'dnd' },
        'offline': { text: 'Offline', class: 'offline' }
    };
    
    const status = statusMap[config.discordStatus] || statusMap['offline'];
    
    if (discordStatusElement) {
        discordStatusElement.textContent = status.text;
        console.log('🟢 Discord status:', status.text);
    }
    
    if (statusIndicatorElement) {
        statusIndicatorElement.className = `status-indicator ${status.class}`;
    }
    
    // Log current activity if available
    if (config.discordActivity) {
        console.log('🎮 Current activity:', config.discordActivity.name);
    }
}



// Update Discord data periodically
async function updateDiscordData() {
    await loadDiscordData();
    populateContent();
}

// Update Discord status every 30 seconds
setInterval(updateDiscordData, 30000);
