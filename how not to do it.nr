fn main(password: Field, stored_hash: pub Field) {
    let hashed = sha256(password); // Placeholder - if no sha256 yet, replace manually
    assert(hashed == stored_hash);
}
