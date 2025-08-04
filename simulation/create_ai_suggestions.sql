CREATE TABLE ai_suggestions (
    id SERIAL PRIMARY KEY,
    article_id INTEGER REFERENCES articles(id),
    paragraph_id TEXT,
    suggestion_text TEXT,
    suggested_by TEXT,
    confidence_score INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);