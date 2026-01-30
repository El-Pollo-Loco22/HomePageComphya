/**
 * Sanity.io Integration for Comphya News
 */

const PROJECT_ID = 'ws75pj86'; 
const DATASET = 'production';
const API_VERSION = '2023-05-03';

let client;

/**
 * Initializes the Sanity client
 */
function initClient() {
    if (window.createSanityClient) {
        client = window.createSanityClient({
            projectId: PROJECT_ID,
            dataset: DATASET,
            apiVersion: API_VERSION,
            useCdn: false, 
        });
        
        // Determine which page we are on and fetch appropriate news
        if (document.getElementById('news-container')) {
            fetchNewsForListing();
        }
        
        if (document.getElementById('latest-news-grid')) {
            fetchLatestNewsForHome();
        }
    } else {
        window.addEventListener('sanity-ready', initClient);
    }
}

/**
 * Fetches all news items for the News page
 */
async function fetchNewsForListing() {
    if (!client) return;
    const query = `*[_type == "news"] | order(publicationDate desc) {
        title, category, description, link, publicationDate
    }`;
    try {
        const newsItems = await client.fetch(query);
        renderNewsListing(newsItems);
    } catch (error) {
        console.error('Error fetching news:', error);
        document.getElementById('news-container').innerHTML = '<p>Error loading news.</p>';
    }
}

/**
 * Fetches only the 4 most recent news items for the Home page
 */
async function fetchLatestNewsForHome() {
    if (!client) return;
    // Fetch top 4 most recent
    const query = `*[_type == "news"] | order(publicationDate desc) [0...4] {
        title, publicationDate, link
    }`;
    try {
        const newsItems = await client.fetch(query);
        renderLatestNewsHome(newsItems);
    } catch (error) {
        console.error('Error fetching latest news:', error);
        document.getElementById('latest-news-grid').innerHTML = '<p>Error loading updates.</p>';
    }
}

/**
 * Renders news for the main listing page
 */
function renderNewsListing(newsItems) {
    const container = document.getElementById('news-container');
    if (!container) return;
    if (!newsItems || newsItems.length === 0) {
        container.innerHTML = '<p>No news stories available.</p>';
        return;
    }
    container.innerHTML = newsItems.map(item => `
        <div class="publication-card" data-category="${item.category}">
            <div class="publication-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3M19 19H5V5H19V19M17 12H7V14H17V12M17 9H7V11H17V9M17 15H7V17H17V15Z"/>
                </svg>
            </div>
            <div class="publication-content">
                <h3 class="publication-title">${item.title}</h3>
                <p class="publication-description">${item.description}</p>
                <a href="${item.link}" target="_blank" class="learn-more-link">
                    Learn More
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M16.172 11L10.808 5.63605L12.222 4.22205L20 12L12.222 19.778L10.808 18.364L16.172 13H4V11H16.172Z"/>
                    </svg>
                </a>
            </div>
        </div>
    `).join('');
}

/**
 * Renders the 4 latest news cards on the Home page
 */
function renderLatestNewsHome(newsItems) {
    const container = document.getElementById('latest-news-grid');
    if (!container) return;
    if (!newsItems || newsItems.length === 0) {
        container.innerHTML = '<p>No updates available.</p>';
        return;
    }

    container.innerHTML = newsItems.map(item => {
        // Format date to be consistent with original design
        let dateStr = "Recent";
        if (item.publicationDate) {
            const date = new Date(item.publicationDate);
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            dateStr = date.toLocaleDateString('en-US', options);
        }

        return `
        <article class="news-card-new" onclick="if('${item.link}') window.open('${item.link}', '_blank')" style="cursor: pointer;">
          <div class="news-card-content">
            <h3 class="news-article-title">${item.title}</h3>
            <div class="news-meta">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style="flex-shrink: 0;">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="#6a7282" stroke-width="2" fill="none"/>
                <line x1="16" y1="2" x2="16" y2="6" stroke="#6a7282" stroke-width="2" stroke-linecap="round"/>
                <line x1="8" y1="2" x2="8" y2="6" stroke="#6a7282" stroke-width="2" stroke-linecap="round"/>
                <line x1="3" y1="10" x2="21" y2="10" stroke="#6a7282" stroke-width="2"/>
              </svg>
              <span class="news-date-text">${dateStr}</span>
            </div>
          </div>
          <div class="news-card-border"></div>
        </article>
        `;
    }).join('');
}

// Initial initialization
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initClient);
} else {
    initClient();
}
