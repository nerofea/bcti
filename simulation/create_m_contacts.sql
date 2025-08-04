CREATE TABLE media_contacts (
    id SERIAL PRIMARY KEY,
    name TEXT,
    outlet TEXT,
    contact_info TEXT,
    tags TEXT[],
    added_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);