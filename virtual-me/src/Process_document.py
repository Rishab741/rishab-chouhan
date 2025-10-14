import json
import os
from langchain.text_splitter import RecursiveCharacterTextSplitter

def process_portfolio_documents():
    """
    Loads portfolio data from a JSON file, transforms it into text documents,
    and splits them into smaller chunks.
    """
    # Construct the correct path to the JSON file relative to the project root
    # This assumes you run the script from the 'virtual-me' directory
    file_path = os.path.join('data', 'Portfoliodata.json')

    try:
        with open(file_path) as f:
            portfolio_data = json.load(f)
    except FileNotFoundError:
        print(f"Error: The file '{file_path}' was not found. Make sure it exists in the 'data' directory.")
        return []

    documents = []

    # Experience documents
    for exp in portfolio_data.get("experience", []):
        doc = f"Role: {exp.get('role', 'N/A')}\nCompany: {exp.get('company', 'N/A')}\nDuration: {exp.get('duration', 'N/A')}\nDescription: {exp.get('description', 'N/A')}"
        documents.append(doc)

    # Project documents
    for proj in portfolio_data.get("projects", []):
        technologies = ', '.join(proj.get('technologies', []))
        doc = f"Project: {proj.get('title', 'N/A')}\nTechnologies: {technologies}\nDescription: {proj.get('description', 'N/A')}\nContribution: {proj.get('contribution', 'N/A')}"
        documents.append(doc)

    # Education documents
    for edu in portfolio_data.get("education", []):
        doc = f"Degree: {edu.get('degree', 'N/A')}\nInstitution: {edu.get('institution', 'N/A')}\nDuration: {edu.get('duration', 'N/A')}"
        documents.append(doc)

    # Skills documents
    for category, skills in portfolio_data.get("skills", {}).items():
        skills_str = ', '.join(skills)
        doc = f"Skill Category: {category}\nSkills: {skills_str}"
        documents.append(doc)

    # Bio/About document
    contact_info = portfolio_data.get('contact', {})
    documents.append(
        f"Name: {portfolio_data.get('name', 'N/A')}\n"
        f"Role: {portfolio_data.get('role', 'N/A')}\n"
        f"Bio: {portfolio_data.get('bio', 'N/A')}\n"
        f"Email: {contact_info.get('email', 'N/A')}\n"
        f"Location: {contact_info.get('location', 'N/A')}"
    )

    # Chunk documents
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        separators=["\n\n", "\n", " ", ""]
    )

    chunks = []
    for doc in documents:
        split_docs = text_splitter.split_text(doc)
        chunks.extend(split_docs)

    print(f"Created {len(chunks)} chunks from portfolio data.")
    return chunks

# This block ensures the code runs only when the script is executed directly
if __name__ == "__main__":
    generated_chunks = process_portfolio_documents()
    
    # Define the output path for the processed chunks
    output_path = os.path.join('data', 'processed_chunks.json')
    
    # Ensure the 'data' directory exists
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    # Save the chunks to the specified JSON file
    with open(output_path, 'w') as f:
        json.dump(generated_chunks, f, indent=2)
        
    print(f"Successfully saved {len(generated_chunks)} chunks to '{output_path}'")

