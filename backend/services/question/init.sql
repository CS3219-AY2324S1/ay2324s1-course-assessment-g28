-- this script will be run during initialisation

CREATE TABLE IF NOT EXISTS Images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id INTEGER,
    image_data BYTEA
);