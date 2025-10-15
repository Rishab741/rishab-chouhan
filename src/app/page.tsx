import { Suspense } from 'react';
const fs = require('fs').promises;
const path = require('path');

import PortfolioClientLayout from './components/portfolio-layout';
import { PortfolioData } from './components/types'; // Import from types instead
import AdvancedChatbot from './components/AdvancedChatbot';

// --- SERVER COMPONENT ---
export default async function Page() {
  const filePath = path.join(process.cwd(), 'public', 'data', 'Portfoliodata.json');
  
  try {
    const jsonData = await fs.readFile(filePath, 'utf-8');

    if (!jsonData || jsonData.trim() === '') {
      throw new Error('Portfolio data file is empty.');
    }

    const portfolioData: PortfolioData = JSON.parse(jsonData);

    return (
      <>
        <PortfolioClientLayout portfolioData={portfolioData} />
        <AdvancedChatbot />
      </>
    );
  } catch (error) {
    console.error("Failed to read or parse portfolio data:", error);
    return <div>Error: Could not load portfolio data. Please ensure the JSON file is not empty and is correctly formatted.</div>;
  }
}