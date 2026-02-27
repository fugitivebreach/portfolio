// Configuration data
let config = {};
let projects = [];
let playlist = [];
let currentTrackIndex = 0;
let youtubePlayer = null;
let currentTrack = null;
let progressInterval = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', async () => {
    await loadConfig();
    await loadProjects();
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

// Load projects from projects.json
async function loadProjects() {
    try {
        const response = await fetch('projects.json');
        projects = await response.json();
        console.log('✅ Projects loaded:', projects.length);
    } catch (error) {
        console.error('Error loading projects:', error);
        projects = [];
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
                
                <!-- Music Player -->
                <div class="music-player" id="musicPlayer">
                    <div class="music-player-header">
                        <svg class="music-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M9 18V5l12-2v13"></path>
                            <circle cx="6" cy="18" r="3"></circle>
                            <circle cx="18" cy="16" r="3"></circle>
                        </svg>
                        <span class="music-player-title">Now Playing</span>
                    </div>
                    <div class="music-player-content" id="musicPlayerContent">
                        <div class="music-loading">
                            <div class="loading-spinner"></div>
                            <span>Loading music...</span>
                        </div>
                    </div>
                </div>
            `;
        } else if (tab.type === 'projects') {
            tabContent.innerHTML = `
                <h2>${tab.displayName.charAt(0).toUpperCase() + tab.displayName.slice(1)}</h2>
                <p>${tab.content || 'Click on a project to view details.'}</p>
                <div id="projectsContainer" class="projects-container"></div>
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


// Get language icon/logo SVG
function getLanguageIcon(language) {
    const icons = {
        'JavaScript': '<svg viewBox="0 0 24 24" fill="#F7DF1E"><path d="M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.004-.056z"/></svg>',
        'Python': '<svg viewBox="0 0 24 24" fill="#3776AB"><path d="M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09zm13.09 3.95l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07h2.09l.14.01zm-6.47 14.25l-.23.33-.08.41.08.41.23.33.33.23.41.08.41-.08.33-.23.23-.33.08-.41-.08-.41-.23-.33-.33-.23-.41-.08-.41.08z"/></svg>',
        'TypeScript': '<svg viewBox="0 0 24 24" fill="#3178C6"><path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z"/></svg>',
        'HTML': '<svg viewBox="0 0 24 24" fill="#E34F26"><path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.564-2.438L1.5 0zm7.031 9.75l-.232-2.718 10.059.003.23-2.622L5.412 4.41l.698 8.01h9.126l-.326 3.426-2.91.804-2.955-.81-.188-2.11H6.248l.33 4.171L12 19.351l5.379-1.443.744-8.157H8.531z"/></svg>',
        'CSS': '<svg viewBox="0 0 24 24" fill="#1572B6"><path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.565-2.438L1.5 0zm17.09 4.413L5.41 4.41l.213 2.622 10.125.002-.255 2.716h-6.64l.24 2.573h6.182l-.366 3.523-2.91.804-2.956-.81-.188-2.11h-2.61l.29 3.855L12 19.288l5.373-1.53L18.59 4.414z"/></svg>',
        'SQL': '<svg viewBox="0 0 24 24" fill="#CC2927"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-1.5 3h3v3h-3V3zm0 4.5h3v9h-3v-9zm-3 3h3v6h-3v-6z"/></svg>',
        'JSON': '<svg viewBox="0 0 24 24" fill="#000000"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-2.5 6.5h2v11h-2v-11zm5 0h2v11h-2v-11z"/></svg>',
        'Luau': '<svg viewBox="0 0 24 24" fill="#00A2FF"><path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 2.18l8 3.82v8c0 4.52-3.13 8.78-8 9.82-4.87-1.04-8-5.3-8-9.82V8l8-3.82z"/><circle cx="12" cy="12" r="4"/></svg>',
        'React': '<svg viewBox="0 0 24 24" fill="#61DAFB"><path d="M12 10.11c1.03 0 1.87.84 1.87 1.89 0 1-.84 1.85-1.87 1.85S10.13 13 10.13 12c0-1.05.84-1.89 1.87-1.89M7.37 20c.63.38 2.01-.2 3.6-1.7-.52-.59-1.03-1.23-1.51-1.9a22.7 22.7 0 0 1-2.4-.36c-.51 2.14-.32 3.61.31 3.96m.71-5.74l-.29-.51c-.11.29-.22.58-.29.86.27.06.57.11.88.16l-.3-.51m6.54-.76l.81-1.5-.81-1.5c-.3-.53-.62-1-.91-1.47C13.17 9 12.6 9 12 9c-.6 0-1.17 0-1.71.03-.29.47-.61.94-.91 1.47L8.57 12l.81 1.5c.3.53.62 1 .91 1.47.54.03 1.11.03 1.71.03.6 0 1.17 0 1.71-.03.29-.47.61-.94.91-1.47M12 6.78c-.19.22-.39.45-.59.72h1.18c-.2-.27-.4-.5-.59-.72m0 10.44c.19-.22.39-.45.59-.72h-1.18c.2.27.4.5.59.72M16.62 4c-.62-.38-2 .2-3.59 1.7.52.59 1.03 1.23 1.51 1.9.82.08 1.63.2 2.4.36.51-2.14.32-3.61-.32-3.96m-.7 5.74l.29.51c.11-.29.22-.58.29-.86-.27-.06-.57-.11-.88-.16l.3.51m1.45-7.05c1.47.84 1.63 3.05 1.01 5.63 2.54.75 4.37 1.99 4.37 3.68s-1.83 2.93-4.37 3.68c.62 2.58.46 4.79-1.01 5.63-1.46.84-3.45-.12-5.37-1.95-1.92 1.83-3.91 2.79-5.38 1.95-1.46-.84-1.62-3.05-1-5.63-2.54-.75-4.37-1.99-4.37-3.68s1.83-2.93 4.37-3.68c-.62-2.58-.46-4.79 1-5.63 1.47-.84 3.46.12 5.38 1.95 1.92-1.83 3.91-2.79 5.37-1.95M17.08 12c.34.75.64 1.5.89 2.26 2.1-.63 3.28-1.53 3.28-2.26s-1.18-1.63-3.28-2.26c-.25.76-.55 1.51-.89 2.26M6.92 12c-.34-.75-.64-1.5-.89-2.26-2.1.63-3.28 1.53-3.28 2.26s1.18 1.63 3.28 2.26c.25-.76.55-1.51.89-2.26m9.87 4.31c.3.53.62 1 .91 1.47.54-.03 1.11-.03 1.71-.03.6 0 1.17 0 1.71.03.29-.47.61-.94.91-1.47l.81-1.5-.81-1.5c-.3-.53-.62-1-.91-1.47-.54-.03-1.11-.03-1.71-.03-.6 0-1.17 0-1.71.03-.29.47-.61.94-.91 1.47l-.81 1.5.81 1.5z"/></svg>',
        'Node.js': '<svg viewBox="0 0 24 24" fill="#339933"><path d="M11.998,24c-0.321,0-0.641-0.084-0.922-0.247l-2.936-1.737c-0.438-0.245-0.224-0.332-0.08-0.383 c0.585-0.203,0.703-0.25,1.328-0.604c0.065-0.037,0.151-0.023,0.218,0.017l2.256,1.339c0.082,0.045,0.197,0.045,0.272,0l8.795-5.076 c0.082-0.047,0.134-0.141,0.134-0.238V6.921c0-0.099-0.053-0.192-0.137-0.242l-8.791-5.072c-0.081-0.047-0.189-0.047-0.271,0 L3.075,6.68C2.99,6.729,2.936,6.825,2.936,6.921v10.15c0,0.097,0.054,0.189,0.139,0.235l2.409,1.392 c1.307,0.654,2.108-0.116,2.108-0.89V7.787c0-0.142,0.114-0.253,0.256-0.253h1.115c0.139,0,0.255,0.112,0.255,0.253v10.021 c0,1.745-0.95,2.745-2.604,2.745c-0.508,0-0.909,0-2.026-0.551L2.28,18.675c-0.57-0.329-0.922-0.945-0.922-1.604V6.921 c0-0.659,0.353-1.275,0.922-1.603l8.795-5.082c0.557-0.315,1.296-0.315,1.848,0l8.794,5.082c0.57,0.329,0.924,0.944,0.924,1.603 v10.15c0,0.659-0.354,1.273-0.924,1.604l-8.794,5.078C12.643,23.916,12.324,24,11.998,24z M19.099,13.993 c0-1.9-1.284-2.406-3.987-2.763c-2.731-0.361-3.009-0.548-3.009-1.187c0-0.528,0.235-1.233,2.258-1.233 c1.807,0,2.473,0.389,2.747,1.607c0.024,0.115,0.129,0.199,0.247,0.199h1.141c0.071,0,0.138-0.031,0.186-0.081 c0.048-0.054,0.074-0.123,0.067-0.196c-0.177-2.098-1.571-3.076-4.388-3.076c-2.508,0-4.004,1.058-4.004,2.833 c0,1.925,1.488,2.457,3.895,2.695c2.88,0.282,3.103,0.703,3.103,1.269c0,0.983-0.789,1.402-2.642,1.402 c-2.327,0-2.839-0.584-3.011-1.742c-0.02-0.124-0.126-0.215-0.253-0.215h-1.137c-0.141,0-0.254,0.112-0.254,0.253 c0,1.482,0.806,3.248,4.655,3.248C17.501,17.007,19.099,15.91,19.099,13.993z"/></svg>'
    };
    
    return icons[language] || '<svg viewBox="0 0 24 24" fill="#888"><path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/></svg>';
}

// Render projects with dropdown functionality
function renderProjects() {
    const projectsContainer = document.getElementById('projectsContainer');
    
    if (!projectsContainer || projects.length === 0) {
        return;
    }
    
    projectsContainer.innerHTML = '';
    
    projects.forEach((project, index) => {
        const projectItem = document.createElement('div');
        projectItem.className = 'project-item';
        
        projectItem.innerHTML = `
            <div class="project-header" data-project-index="${index}">
                <h3 class="project-title">${project.projectTitle}</h3>
                <svg class="dropdown-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <div class="project-content">
                <p class="project-description">${project.projectDescription}</p>
                <div class="project-languages">
                    ${project.projectCodeLanguages.map(lang => `
                        <span class="language-tag">
                            <span class="language-icon">${getLanguageIcon(lang)}</span>
                            <span class="language-name">${lang}</span>
                        </span>
                    `).join('')}
                </div>
            </div>
        `;
        
        projectsContainer.appendChild(projectItem);
    });
    
    initializeProjectDropdowns();
}

// Initialize dropdown functionality for projects
function initializeProjectDropdowns() {
    const projectHeaders = document.querySelectorAll('.project-header');
    
    projectHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const projectItem = header.parentElement;
            const isOpen = projectItem.classList.contains('open');
            
            // Close all other project items
            document.querySelectorAll('.project-item').forEach(item => {
                item.classList.remove('open');
            });
            
            // Toggle current item
            if (!isOpen) {
                projectItem.classList.add('open');
            }
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
    
    // Render projects if projects tab exists
    renderProjects();
    
    // Load Spotify music player
    loadSpotifyPlayer();
}

// Initialize YouTube music player
async function loadSpotifyPlayer() {
    const musicPlayerContent = document.getElementById('musicPlayerContent');
    
    if (!musicPlayerContent) {
        console.log('Music player not available');
        return;
    }
    
    try {
        // Load first track from playlist
        await loadTrackFromPlaylist(0);
        
    } catch (error) {
        console.error('Error loading music player:', error);
        musicPlayerContent.innerHTML = `
            <div class="music-placeholder">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 18V5l12-2v13"></path>
                    <circle cx="6" cy="18" r="3"></circle>
                    <circle cx="18" cy="16" r="3"></circle>
                </svg>
                <p>Loading music player...</p>
            </div>
        `;
    }
}

// Initialize YouTube player when API is ready
function onYouTubeIframeAPIReady() {
    console.log('✅ YouTube API ready');
}

// Load and play track from playlist
async function loadTrackFromPlaylist(index) {
    const musicPlayerContent = document.getElementById('musicPlayerContent');
    
    try {
        if (!playlist || playlist.length === 0) {
            throw new Error('Playlist is empty');
        }
        
        // Ensure index is within bounds
        if (index < 0) index = playlist.length - 1;
        if (index >= playlist.length) index = 0;
        
        currentTrackIndex = index;
        const song = playlist[index];
        
        console.log('🔍 Loading track:', song.title, 'by', song.artist);
        
        const trackData = {
            title: song.title,
            author: song.artist,
            duration: song.duration,
            uri: `https://www.youtube.com/watch?v=${song.videoId}`,
            artworkUrl: `https://i.ytimg.com/vi/${song.videoId}/maxresdefault.jpg`,
            identifier: song.videoId
        };
        
        currentTrack = trackData;
        
        // Display the track with custom player UI
        displayCustomPlayer(trackData);
        
        // Initialize or load new video in YouTube player
        if (youtubePlayer && youtubePlayer.loadVideoById) {
            youtubePlayer.loadVideoById(song.videoId);
            console.log('✅ Loaded new video:', trackData.title);
        } else {
            // Wait a bit for DOM to be ready, then initialize YouTube player
            setTimeout(() => {
                initializeYouTubePlayer(song.videoId);
            }, 500);
        }
        
        console.log('✅ Now playing:', trackData.title, 'by', trackData.author, `(${index + 1}/${playlist.length})`);
        
    } catch (error) {
        console.error('❌ Error loading track:', error);
        musicPlayerContent.innerHTML = `
            <div class="music-placeholder">
                <p>Failed to load music player</p>
            </div>
        `;
    }
}

// Initialize YouTube player with custom controls
function initializeYouTubePlayer(videoId) {
    console.log('🎵 Initializing YouTube player with video ID:', videoId);
    
    // Create hidden YouTube player container
    if (!document.getElementById('youtube-player-container')) {
        const container = document.createElement('div');
        container.id = 'youtube-player-container';
        container.style.display = 'none';
        document.body.appendChild(container);
        console.log('✅ Created YouTube player container');
    }
    
    // Create YouTube player
    if (typeof YT !== 'undefined' && YT.Player) {
        console.log('✅ YouTube API loaded, creating player...');
        
        // Destroy existing player if any
        if (youtubePlayer && youtubePlayer.destroy) {
            youtubePlayer.destroy();
        }
        
        youtubePlayer = new YT.Player('youtube-player-container', {
            height: '0',
            width: '0',
            videoId: videoId,
            playerVars: {
                autoplay: 0,
                controls: 0,
                disablekb: 1,
                fs: 0,
                modestbranding: 1,
                playsinline: 1,
                enablejsapi: 1
            },
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange,
                'onError': onPlayerError
            }
        });
    } else {
        console.log('⏳ YouTube API not ready yet, retrying...');
        // YouTube API not loaded yet, retry
        setTimeout(() => initializeYouTubePlayer(videoId), 500);
    }
}

// Player error callback
function onPlayerError(event) {
    console.error('❌ YouTube player error:', event.data);
    const errorMessages = {
        2: 'Invalid video ID',
        5: 'HTML5 player error',
        100: 'Video not found or private',
        101: 'Video not allowed to be played in embedded players',
        150: 'Video not allowed to be played in embedded players'
    };
    console.error('Error details:', errorMessages[event.data] || 'Unknown error');
}

// Player ready callback
function onPlayerReady(event) {
    console.log('✅ YouTube player ready');
    // Start progress tracking
    startProgressTracking();
}

// Player state change callback
function onPlayerStateChange(event) {
    const playBtn = document.querySelector('.music-play-btn svg path');
    
    if (event.data === YT.PlayerState.PLAYING) {
        if (playBtn) playBtn.setAttribute('d', 'M6 4h4v16H6V4zm8 0h4v16h-4V4z');
        startProgressTracking();
    } else if (event.data === YT.PlayerState.PAUSED) {
        if (playBtn) playBtn.setAttribute('d', 'M8 5v14l11-7z');
        stopProgressTracking();
    } else if (event.data === YT.PlayerState.ENDED) {
        if (playBtn) playBtn.setAttribute('d', 'M8 5v14l11-7z');
        stopProgressTracking();
        // Auto-play next track when current one ends
        console.log('🎵 Track ended, playing next...');
        skipForward();
    }
}

// Start tracking playback progress
function startProgressTracking() {
    if (progressInterval) clearInterval(progressInterval);
    
    progressInterval = setInterval(() => {
        if (youtubePlayer && youtubePlayer.getCurrentTime) {
            const currentTime = youtubePlayer.getCurrentTime();
            const duration = youtubePlayer.getDuration();
            
            if (duration > 0) {
                const progress = (currentTime / duration) * 100;
                const progressBar = document.querySelector('.music-progress-fill');
                const currentTimeDisplay = document.querySelector('.current-time');
                const totalTimeDisplay = document.querySelector('.total-time');
                
                if (progressBar) progressBar.style.width = progress + '%';
                if (currentTimeDisplay) currentTimeDisplay.textContent = formatDuration(currentTime * 1000);
                if (totalTimeDisplay) totalTimeDisplay.textContent = formatDuration(duration * 1000);
            }
        }
    }, 100);
}

// Stop tracking progress
function stopProgressTracking() {
    if (progressInterval) {
        clearInterval(progressInterval);
        progressInterval = null;
    }
}

// Update play button state
function updatePlayButton(isPlaying) {
    const playButton = document.querySelector('.music-play-overlay svg');
    if (!playButton) return;
    
    if (isPlaying) {
        playButton.innerHTML = '<path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>';
    } else {
        playButton.innerHTML = '<path d="M8 5v14l11-7z"/>';
    }
}

// Display custom player UI
function displayCustomPlayer(track) {
    const musicPlayerContent = document.getElementById('musicPlayerContent');
    
    if (!musicPlayerContent) return;
    
    const duration = formatDuration(track.duration);
    
    musicPlayerContent.innerHTML = `
        <div class="music-track">
            <div class="music-album-art music-play-button">
                <img src="${track.artworkUrl}" alt="${track.title}" onerror="this.src='https://via.placeholder.com/300/1a1a1a/ffffff?text=♪'">
                <div class="music-play-overlay">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                        <path d="M8 5v14l11-7z"/>
                    </svg>
                </div>
            </div>
            <div class="music-info">
                <div class="music-track-name">${track.title}</div>
                <div class="music-artist-name">${track.author}</div>
                <div class="music-duration">${duration}</div>
            </div>
            <div class="music-controls">
                <button class="music-control-btn" onclick="skipBackward()">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
                    </svg>
                </button>
                <button class="music-control-btn music-play-btn" onclick="togglePlay()">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z"/>
                    </svg>
                </button>
                <button class="music-control-btn" onclick="skipForward()">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M16 18h2V6h-2zm-11-6l8.5-6v12z"/>
                    </svg>
                </button>
            </div>
        </div>
        <div class="music-progress-container">
            <div class="music-progress-bar" onclick="seekToPosition(event)">
                <div class="music-progress-fill" style="width: 0%"></div>
            </div>
            <div class="music-time-display">
                <span class="current-time">0:00</span>
                <span class="total-time">${duration}</span>
            </div>
        </div>
    `;
}

// Format duration from milliseconds to MM:SS
function formatDuration(ms) {
    const seconds = Math.floor(ms / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Music control functions
function togglePlay() {
    if (!youtubePlayer || !currentTrack) return;
    
    try {
        const state = youtubePlayer.getPlayerState();
        
        if (state === YT.PlayerState.PLAYING) {
            youtubePlayer.pauseVideo();
            console.log('⏸️ Paused:', currentTrack.title);
        } else {
            youtubePlayer.playVideo();
            console.log('▶️ Playing:', currentTrack.title, 'by', currentTrack.author);
        }
    } catch (error) {
        console.error('Error toggling playback:', error);
    }
}

function skipBackward() {
    if (!playlist || playlist.length === 0) return;
    
    try {
        // Go to previous track
        const newIndex = currentTrackIndex - 1;
        loadTrackFromPlaylist(newIndex);
        console.log('⏮️ Previous track');
    } catch (error) {
        console.error('Error skipping backward:', error);
    }
}

function skipForward() {
    if (!playlist || playlist.length === 0) return;
    
    try {
        // Go to next track
        const newIndex = currentTrackIndex + 1;
        loadTrackFromPlaylist(newIndex);
        console.log('⏭️ Next track');
    } catch (error) {
        console.error('Error skipping forward:', error);
    }
}

// Seek to position when clicking progress bar
function seekToPosition(event) {
    if (!youtubePlayer) return;
    
    try {
        const progressBar = event.currentTarget;
        const rect = progressBar.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const percentage = clickX / rect.width;
        const duration = youtubePlayer.getDuration();
        const seekTime = duration * percentage;
        
        youtubePlayer.seekTo(seekTime, true);
        console.log('⏩ Seeked to:', formatDuration(seekTime * 1000));
    } catch (error) {
        console.error('Error seeking:', error);
    }
}

// Update Discord data periodically
async function updateDiscordData() {
    await loadDiscordData();
    populateContent();
}

// Update Discord status every 30 seconds
setInterval(updateDiscordData, 30000);

// Initialize the application
document.addEventListener('DOMContentLoaded', async () => {
    await loadConfig();
    await loadProjects();
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

// Load projects from projects.json
async function loadProjects() {
    try {
        const response = await fetch('projects.json');
        projects = await response.json();
        console.log('✅ Projects loaded:', projects.length);
    } catch (error) {
        console.error('Error loading projects:', error);
        projects = [];
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
                
                <!-- Music Player -->
                <div class="music-player" id="musicPlayer">
                    <div class="music-player-header">
                        <svg class="music-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M9 18V5l12-2v13"></path>
                            <circle cx="6" cy="18" r="3"></circle>
                            <circle cx="18" cy="16" r="3"></circle>
                        </svg>
                        <span class="music-player-title">Now Playing</span>
                    </div>
                    <div class="music-player-content" id="musicPlayerContent">
                        <div class="music-loading">
                            <div class="loading-spinner"></div>
                            <span>Loading music...</span>
                        </div>
                    </div>
                </div>
            `;
        } else if (tab.type === 'projects') {
            tabContent.innerHTML = `
                <h2>${tab.displayName.charAt(0).toUpperCase() + tab.displayName.slice(1)}</h2>
                <p>${tab.content || 'Click on a project to view details.'}</p>
                <div id="projectsContainer" class="projects-container"></div>
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


// Get language icon/logo SVG
function getLanguageIcon(language) {
    const icons = {
        'JavaScript': '<svg viewBox="0 0 24 24" fill="#F7DF1E"><path d="M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.004-.056z"/></svg>',
        'Python': '<svg viewBox="0 0 24 24" fill="#3776AB"><path d="M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09zm13.09 3.95l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07h2.09l.14.01zm-6.47 14.25l-.23.33-.08.41.08.41.23.33.33.23.41.08.41-.08.33-.23.23-.33.08-.41-.08-.41-.23-.33-.33-.23-.41-.08-.41.08z"/></svg>',
        'TypeScript': '<svg viewBox="0 0 24 24" fill="#3178C6"><path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z"/></svg>',
        'HTML': '<svg viewBox="0 0 24 24" fill="#E34F26"><path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.564-2.438L1.5 0zm7.031 9.75l-.232-2.718 10.059.003.23-2.622L5.412 4.41l.698 8.01h9.126l-.326 3.426-2.91.804-2.955-.81-.188-2.11H6.248l.33 4.171L12 19.351l5.379-1.443.744-8.157H8.531z"/></svg>',
        'CSS': '<svg viewBox="0 0 24 24" fill="#1572B6"><path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.565-2.438L1.5 0zm17.09 4.413L5.41 4.41l.213 2.622 10.125.002-.255 2.716h-6.64l.24 2.573h6.182l-.366 3.523-2.91.804-2.956-.81-.188-2.11h-2.61l.29 3.855L12 19.288l5.373-1.53L18.59 4.414z"/></svg>',
        'SQL': '<svg viewBox="0 0 24 24" fill="#CC2927"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-1.5 3h3v3h-3V3zm0 4.5h3v9h-3v-9zm-3 3h3v6h-3v-6z"/></svg>',
        'JSON': '<svg viewBox="0 0 24 24" fill="#000000"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-2.5 6.5h2v11h-2v-11zm5 0h2v11h-2v-11z"/></svg>',
        'Luau': '<svg viewBox="0 0 24 24" fill="#00A2FF"><path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 2.18l8 3.82v8c0 4.52-3.13 8.78-8 9.82-4.87-1.04-8-5.3-8-9.82V8l8-3.82z"/><circle cx="12" cy="12" r="4"/></svg>',
        'React': '<svg viewBox="0 0 24 24" fill="#61DAFB"><path d="M12 10.11c1.03 0 1.87.84 1.87 1.89 0 1-.84 1.85-1.87 1.85S10.13 13 10.13 12c0-1.05.84-1.89 1.87-1.89M7.37 20c.63.38 2.01-.2 3.6-1.7-.52-.59-1.03-1.23-1.51-1.9a22.7 22.7 0 0 1-2.4-.36c-.51 2.14-.32 3.61.31 3.96m.71-5.74l-.29-.51c-.11.29-.22.58-.29.86.27.06.57.11.88.16l-.3-.51m6.54-.76l.81-1.5-.81-1.5c-.3-.53-.62-1-.91-1.47C13.17 9 12.6 9 12 9c-.6 0-1.17 0-1.71.03-.29.47-.61.94-.91 1.47L8.57 12l.81 1.5c.3.53.62 1 .91 1.47.54.03 1.11.03 1.71.03.6 0 1.17 0 1.71-.03.29-.47.61-.94.91-1.47M12 6.78c-.19.22-.39.45-.59.72h1.18c-.2-.27-.4-.5-.59-.72m0 10.44c.19-.22.39-.45.59-.72h-1.18c.2.27.4.5.59.72M16.62 4c-.62-.38-2 .2-3.59 1.7.52.59 1.03 1.23 1.51 1.9.82.08 1.63.2 2.4.36.51-2.14.32-3.61-.32-3.96m-.7 5.74l.29.51c.11-.29.22-.58.29-.86-.27-.06-.57-.11-.88-.16l.3.51m1.45-7.05c1.47.84 1.63 3.05 1.01 5.63 2.54.75 4.37 1.99 4.37 3.68s-1.83 2.93-4.37 3.68c.62 2.58.46 4.79-1.01 5.63-1.46.84-3.45-.12-5.37-1.95-1.92 1.83-3.91 2.79-5.38 1.95-1.46-.84-1.62-3.05-1-5.63-2.54-.75-4.37-1.99-4.37-3.68s1.83-2.93 4.37-3.68c-.62-2.58-.46-4.79 1-5.63 1.47-.84 3.46.12 5.38 1.95 1.92-1.83 3.91-2.79 5.37-1.95M17.08 12c.34.75.64 1.5.89 2.26 2.1-.63 3.28-1.53 3.28-2.26s-1.18-1.63-3.28-2.26c-.25.76-.55 1.51-.89 2.26M6.92 12c-.34-.75-.64-1.5-.89-2.26-2.1.63-3.28 1.53-3.28 2.26s1.18 1.63 3.28 2.26c.25-.76.55-1.51.89-2.26m9.87 4.31c.3.53.62 1 .91 1.47.54-.03 1.11-.03 1.71-.03.6 0 1.17 0 1.71.03.29-.47.61-.94.91-1.47l.81-1.5-.81-1.5c-.3-.53-.62-1-.91-1.47-.54-.03-1.11-.03-1.71-.03-.6 0-1.17 0-1.71.03-.29.47-.61.94-.91 1.47l-.81 1.5.81 1.5z"/></svg>',
        'Node.js': '<svg viewBox="0 0 24 24" fill="#339933"><path d="M11.998,24c-0.321,0-0.641-0.084-0.922-0.247l-2.936-1.737c-0.438-0.245-0.224-0.332-0.08-0.383 c0.585-0.203,0.703-0.25,1.328-0.604c0.065-0.037,0.151-0.023,0.218,0.017l2.256,1.339c0.082,0.045,0.197,0.045,0.272,0l8.795-5.076 c0.082-0.047,0.134-0.141,0.134-0.238V6.921c0-0.099-0.053-0.192-0.137-0.242l-8.791-5.072c-0.081-0.047-0.189-0.047-0.271,0 L3.075,6.68C2.99,6.729,2.936,6.825,2.936,6.921v10.15c0,0.097,0.054,0.189,0.139,0.235l2.409,1.392 c1.307,0.654,2.108-0.116,2.108-0.89V7.787c0-0.142,0.114-0.253,0.256-0.253h1.115c0.139,0,0.255,0.112,0.255,0.253v10.021 c0,1.745-0.95,2.745-2.604,2.745c-0.508,0-0.909,0-2.026-0.551L2.28,18.675c-0.57-0.329-0.922-0.945-0.922-1.604V6.921 c0-0.659,0.353-1.275,0.922-1.603l8.795-5.082c0.557-0.315,1.296-0.315,1.848,0l8.794,5.082c0.57,0.329,0.924,0.944,0.924,1.603 v10.15c0,0.659-0.354,1.273-0.924,1.604l-8.794,5.078C12.643,23.916,12.324,24,11.998,24z M19.099,13.993 c0-1.9-1.284-2.406-3.987-2.763c-2.731-0.361-3.009-0.548-3.009-1.187c0-0.528,0.235-1.233,2.258-1.233 c1.807,0,2.473,0.389,2.747,1.607c0.024,0.115,0.129,0.199,0.247,0.199h1.141c0.071,0,0.138-0.031,0.186-0.081 c0.048-0.054,0.074-0.123,0.067-0.196c-0.177-2.098-1.571-3.076-4.388-3.076c-2.508,0-4.004,1.058-4.004,2.833 c0,1.925,1.488,2.457,3.895,2.695c2.88,0.282,3.103,0.703,3.103,1.269c0,0.983-0.789,1.402-2.642,1.402 c-2.327,0-2.839-0.584-3.011-1.742c-0.02-0.124-0.126-0.215-0.253-0.215h-1.137c-0.141,0-0.254,0.112-0.254,0.253 c0,1.482,0.806,3.248,4.655,3.248C17.501,17.007,19.099,15.91,19.099,13.993z"/></svg>'
    };
    
    return icons[language] || '<svg viewBox="0 0 24 24" fill="#888"><path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/></svg>';
}

// Render projects with dropdown functionality
function renderProjects() {
    const projectsContainer = document.getElementById('projectsContainer');
    
    if (!projectsContainer || projects.length === 0) {
        return;
    }
    
    projectsContainer.innerHTML = '';
    
    projects.forEach((project, index) => {
        const projectItem = document.createElement('div');
        projectItem.className = 'project-item';
        
        projectItem.innerHTML = `
            <div class="project-header" data-project-index="${index}">
                <h3 class="project-title">${project.projectTitle}</h3>
                <svg class="dropdown-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <div class="project-content">
                <p class="project-description">${project.projectDescription}</p>
                <div class="project-languages">
                    ${project.projectCodeLanguages.map(lang => `
                        <span class="language-tag">
                            <span class="language-icon">${getLanguageIcon(lang)}</span>
                            <span class="language-name">${lang}</span>
                        </span>
                    `).join('')}
                </div>
            </div>
        `;
        
        projectsContainer.appendChild(projectItem);
    });
    
    initializeProjectDropdowns();
}

// Initialize dropdown functionality for projects
function initializeProjectDropdowns() {
    const projectHeaders = document.querySelectorAll('.project-header');
    
    projectHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const projectItem = header.parentElement;
            const isOpen = projectItem.classList.contains('open');
            
            // Close all other project items
            document.querySelectorAll('.project-item').forEach(item => {
                item.classList.remove('open');
            });
            
            // Toggle current item
            if (!isOpen) {
                projectItem.classList.add('open');
            }
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
    
    // Render projects if projects tab exists
    renderProjects();
    
    // Load Spotify music player
    loadSpotifyPlayer();
}

// Update Discord data periodically
async function updateDiscordData() {
    await loadDiscordData();
    populateContent();
}

// Update Discord status every 30 seconds
setInterval(updateDiscordData, 30000);
