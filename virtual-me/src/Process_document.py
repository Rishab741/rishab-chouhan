import json
import os
from langchain.text_splitter import RecursiveCharacterTextSplitter

def process_portfolio_documents():
    """
    Loads portfolio data from a JSON file, transforms it into text documents,
    and splits them into smaller chunks.
    """
    file_path = os.path.join('data', 'Portfoliodata.json')

    try:
        with open(file_path) as f:
            portfolio_data = json.load(f)
    except FileNotFoundError:
        print(f"Error: The file '{file_path}' was not found. Make sure it exists in the 'data' directory.")
        return []

    documents = []

    # Bio/About document
    contact_info = portfolio_data.get('contact', {})
    documents.append(
        f"Name: {portfolio_data.get('name', 'N/A')}\n"
        f"Role: {portfolio_data.get('role', 'N/A')}\n"
        f"Bio: {portfolio_data.get('bio', 'N/A')}\n"
        f"Email: {contact_info.get('email', 'N/A')}\n"
        f"Phone: {contact_info.get('phone', 'N/A')}\n"
        f"Location: {contact_info.get('location', 'N/A')}\n"
        f"LinkedIn: {contact_info.get('linkedin', 'N/A')}\n"
        f"GitHub: {contact_info.get('github', 'N/A')}"
    )

    # Motivation
    if portfolio_data.get('motivation'):
        documents.append(f"Motivation: {portfolio_data['motivation']}")

    # Strengths
    strengths = portfolio_data.get('strengths', [])
    if strengths:
        documents.append(f"Strengths:\n" + "\n".join(f"- {s}" for s in strengths))

    # Values
    values = portfolio_data.get('values', [])
    if values:
        documents.append(f"Values:\n" + "\n".join(f"- {v}" for v in values))

    # Soft Skills
    soft_skills = portfolio_data.get('softSkills', [])
    if soft_skills:
        documents.append(f"Soft Skills:\n" + "\n".join(f"- {s}" for s in soft_skills))

    # Leadership Style
    if portfolio_data.get('leadershipStyle'):
        documents.append(f"Leadership Style: {portfolio_data['leadershipStyle']}")

    # Technical Philosophy
    if portfolio_data.get('technicalPhilosophy'):
        documents.append(f"Technical Philosophy: {portfolio_data['technicalPhilosophy']}")

    # Learning Goals
    goals = portfolio_data.get('learningGoals', [])
    if goals:
        documents.append(f"Learning Goals:\n" + "\n".join(f"- {g}" for g in goals))

    # Personality
    personality = portfolio_data.get('personality', {})
    if personality:
        traits = "\n".join(f"- {t}" for t in personality.get('traits', []))
        documents.append(
            f"Personality Style: {personality.get('style', '')}\n"
            f"Traits:\n{traits}\n"
            f"Mindset: {personality.get('mindset', '')}"
        )

    # Experience documents
    for exp in portfolio_data.get("experience", []):
        doc = (
            f"Work Experience\n"
            f"Role: {exp.get('role', 'N/A')}\n"
            f"Company: {exp.get('company', 'N/A')}\n"
            f"Duration: {exp.get('duration', 'N/A')}\n"
            f"Description: {exp.get('description', 'N/A')}"
        )
        documents.append(doc)

    # Project documents
    for proj in portfolio_data.get("projects", []):
        technologies = ', '.join(proj.get('technologies', []))
        doc = (
            f"Project: {proj.get('title', 'N/A')}\n"
            f"Technologies: {technologies}\n"
            f"Description: {proj.get('description', 'N/A')}\n"
            f"Contribution: {proj.get('contribution', 'N/A')}"
        )
        documents.append(doc)

    # Education documents
    for edu in portfolio_data.get("education", []):
        achievements = edu.get('achievements', [])
        doc = (
            f"Education\n"
            f"Degree: {edu.get('degree', 'N/A')}\n"
            f"Institution: {edu.get('institution', 'N/A')}\n"
            f"Duration: {edu.get('duration', 'N/A')}"
        )
        if achievements:
            doc += "\nAchievements: " + "; ".join(achievements)
        documents.append(doc)

    # Skills documents
    for category, skills in portfolio_data.get("skills", {}).items():
        skills_str = ', '.join(skills)
        doc = f"Skill Category: {category}\nSkills: {skills_str}"
        documents.append(doc)

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


if __name__ == "__main__":
    generated_chunks = process_portfolio_documents()

    output_path = os.path.join('data', 'processed_chunks.json')
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    with open(output_path, 'w') as f:
        json.dump(generated_chunks, f, indent=2)

    print(f"Successfully saved {len(generated_chunks)} chunks to '{output_path}'")
