import os
import json
from pinecone import Pinecone as PineconeClient, ServerlessSpec
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_pinecone import Pinecone
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def setup_vector_store():
    """
    Initializes embeddings, connects to Pinecone, and uploads processed
    document chunks to the vector store.
    """
    # 1. Load the pre-processed chunks from the JSON file
    chunks_path = os.path.join('data', 'processed_chunks.json')
    try:
        with open(chunks_path, 'r') as f:
            chunks = json.load(f)
        if not chunks:
            print("Error: The 'processed_chunks.json' file is empty. Please run 'Process_document.py' first.")
            return None
        print(f"Loaded {len(chunks)} chunks from '{chunks_path}'")
    except FileNotFoundError:
        print(f"Error: The file '{chunks_path}' was not found. Please run 'src/Process_document.py' first to generate it.")
        return None

    # 2. Initialize Google Gemini Embeddings
    # This will automatically use the GOOGLE_API_KEY from your .env file
    try:
        embeddings = GoogleGenerativeAIEmbeddings(model="models/text-embedding-004")
    except Exception as e:
        print(f"Error initializing Gemini Embeddings: {e}")
        print("Please ensure your GOOGLE_API_KEY is set correctly in the .env file.")
        return None

    # 3. Initialize Pinecone client
    pinecone_api_key = os.getenv("PINECONE_API_KEY")
    pinecone_index_name = os.getenv("PINECONE_INDEX")

    if not all([pinecone_api_key, pinecone_index_name]):
        print("Error: PINECONE_API_KEY or PINECONE_INDEX environment variables are not set.")
        return None

    pc = PineconeClient(api_key=pinecone_api_key)
    
    # 4. Create or connect to the Pinecone index
    # The dimension for Google's text-embedding-004 is 768
    embedding_dimension = 768 
    if pinecone_index_name not in pc.list_indexes().names():
        print(f"Creating new Pinecone index: '{pinecone_index_name}' with dimension {embedding_dimension}...")
        pc.create_index(
            name=pinecone_index_name,
            dimension=embedding_dimension,
            metric="cosine",
            spec=ServerlessSpec(
                cloud='aws',
                region='us-east-1'
            )
        )
        print("Index created successfully.")

    # 5. Store documents in the vector DB
    print("Uploading document chunks to Pinecone...")
    vector_store = Pinecone.from_texts(
        texts=chunks,
        embedding=embeddings,
        index_name=pinecone_index_name
    )
    print(f"Successfully stored {len(chunks)} embeddings in Pinecone.")
    return vector_store

# This block allows the script to be run directly to set up the database
if __name__ == "__main__":
    setup_vector_store()

