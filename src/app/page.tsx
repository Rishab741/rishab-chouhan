// Using CommonJS require for Node.js built-in modules to avoid potential bundler issues.
const fs = require('fs').promises;
const path = require('path');

import PortfolioClientLayout, { PortfolioData } from './portfolio-layout';

// --- SERVER COMPONENT (Default for App Router) ---
// This component runs ONLY on the server.
export default async function Page() {
  // Read the JSON file from the file system on the server.
  const filePath = path.join(process.cwd(), 'public', 'data', 'Portfoliodata.json');
  try {
    const jsonData = await fs.readFile(filePath, 'utf-8');

    // Add a check to ensure the file is not empty before parsing
    if (!jsonData || jsonData.trim() === '') {
      throw new Error('Portfolio data file is empty.');
    }

    const portfolioData: PortfolioData = JSON.parse(jsonData);

    // It then renders the client component, passing the fetched data as props.
    return <PortfolioClientLayout portfolioData={portfolioData} />;
  } catch (error) {
    console.error("Failed to read or parse portfolio data:", error);
    // You can return an error message or a fallback UI here
    return <div>Error: Could not load portfolio data. Please ensure the JSON file is not empty and is correctly formatted.</div>;
  }
}

