CREATE TABLE journalist_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    bio TEXT,
    portfolio_url TEXT,
    verification_status TEXT CHECK (verification_status IN ('pending', 'verified', 'rejected'))
);