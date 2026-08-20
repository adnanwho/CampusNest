CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    role VARCHAR(20) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE student_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    college VARCHAR(255),
    budget_min INTEGER,
    budget_max INTEGER,
    move_in_date DATE,
    locality_pref VARCHAR(255),
    accommodation_type VARCHAR(50),
    lifestyle_tags TEXT,
    golden_profile_key VARCHAR(100)
);

CREATE TABLE lister_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    organization_name VARCHAR(255),
    phone VARCHAR(50)
);

CREATE TABLE properties (
    id BIGSERIAL PRIMARY KEY,
    lister_id BIGINT NOT NULL REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    address VARCHAR(500) NOT NULL,
    locality VARCHAR(255) NOT NULL,
    description TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    rent INTEGER NOT NULL,
    deposit INTEGER NOT NULL DEFAULT 0,
    food_cost INTEGER NOT NULL DEFAULT 0,
    electricity_cost INTEGER NOT NULL DEFAULT 0,
    wifi_cost INTEGER NOT NULL DEFAULT 0,
    maintenance_cost INTEGER NOT NULL DEFAULT 0,
    facilities TEXT,
    distance_km DOUBLE PRECISION,
    commute_time_min INTEGER,
    commute_mode VARCHAR(50),
    capacity INTEGER NOT NULL,
    occupied INTEGER NOT NULL DEFAULT 0,
    available INTEGER NOT NULL DEFAULT 0,
    rating DOUBLE PRECISION DEFAULT 0,
    verification_status VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
    verification_hash VARCHAR(255),
    verification_timestamp TIMESTAMP WITH TIME ZONE,
    blockchain_tx VARCHAR(255),
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE reviews (
    id BIGSERIAL PRIMARY KEY,
    property_id BIGINT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    rating DOUBLE PRECISION NOT NULL,
    cleanliness_rating DOUBLE PRECISION,
    safety_rating DOUBLE PRECISION,
    food_rating DOUBLE PRECISION,
    wifi_rating DOUBLE PRECISION,
    staff_rating DOUBLE PRECISION,
    review_text TEXT,
    is_demo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE verification_records (
    id BIGSERIAL PRIMARY KEY,
    property_id BIGINT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    lister_id BIGINT NOT NULL REFERENCES users(id),
    verification_status VARCHAR(50) NOT NULL,
    record_hash VARCHAR(255) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    blockchain_tx VARCHAR(255),
    reviewed_by BIGINT REFERENCES users(id),
    rejection_reason TEXT
);

CREATE INDEX idx_properties_lister ON properties(lister_id);
CREATE INDEX idx_properties_status ON properties(verification_status);
CREATE INDEX idx_properties_locality ON properties(locality);
CREATE INDEX idx_reviews_property ON reviews(property_id);
CREATE INDEX idx_verification_property ON verification_records(property_id);
