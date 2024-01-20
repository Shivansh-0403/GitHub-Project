import express from 'express'
import axios from 'axios';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;

app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/api/endpoint', async (req, res) => {
    try {
        const username = req.body.inputData;
        console.log('Received data:', req.body);
        console.log(username);

        const userApiUrl = `https://api.github.com/users/${username}`;
        const reposApiUrl = `https://api.github.com/users/${username}/repos?per_page=100&page=1`;

        // Fetch the first page of repositories
        const [userData, reposData] = await Promise.all([
            axios.get(userApiUrl),
            axios.get(reposApiUrl),
        ]);

        // Check if there are more pages
        const linkHeader = reposData.headers.link;
        if (linkHeader) {
            const nextPageUrl = extractNextPageUrl(linkHeader);
            if (nextPageUrl) {
                // Fetch the next page of repositories
                const nextPageResponse = await axios.get(nextPageUrl);
                const nextPageData = nextPageResponse.data;
                reposData.data = reposData.data.concat(nextPageData);
            }
        }

        const responseData = {
            user: userData.data,
            repos: reposData.data,
        };

        res.json(responseData);
    } catch (error) {
        console.error('Error fetching data:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Helper function to extract the URL for the next page from the Link header
function extractNextPageUrl(linkHeader) {
    const links = linkHeader.split(', ');
    const nextLink = links.find(link => link.includes('rel="next"'));
    if (nextLink) {
        const match = nextLink.match(/<([^>]+)>/);
        return match ? match[1] : null;
    }
    return null;
}

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
