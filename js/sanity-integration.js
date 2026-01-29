/**
 * Sanity.io Integration for Comphya News
 */

const PROJECT_ID = 'ws75pj86'; // Replace with your Sanity Project ID
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
            useCdn: false, // Set to false to see updates instantly
        });
        fetchNews();
    } else {
        // Wait for the 'sanity-ready' event if not loaded yet
        window.addEventListener('sanity-ready', initClient);
    }
}

/**
 * Fetches news items from Sanity
 */
async function fetchNews() {
    if (!client) return;

    const query = `*[_type == "news"] | order(publicationDate desc) {
        title,
        category,
        description,
        link,
        publicationDate
    }`;

    try {
        const newsItems = await client.fetch(query);
        renderNews(newsItems);
    } catch (error) {
        console.error('Error fetching news from Sanity:', error);
        const container = document.getElementById('news-container');
        if (container) {
            container.innerHTML = '<p>Error loading news. Please try again later.</p>';
        }
    }
}

/**
 * Renders news items to the DOM
 */
function renderNews(newsItems) {
    const container = document.getElementById('news-container');
    if (!container) return;
    
    if (!newsItems || newsItems.length === 0) {
        container.innerHTML = '<p>No news stories available at this time.</p>';
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

// Initial initialization
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initClient);
} else {
    initClient();
}

