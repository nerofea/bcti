CREATE TABLE prompt_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    model_name TEXT,
    prompt TEXT,
    result TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);