CREATE TABLE pastes (
  id TEXT PRIMARY KEY,
  title TEXT,
  content TEXT NOT NULL,
  language TEXT DEFAULT 'text',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP WITH TIME ZONE,
  views INTEGER DEFAULT 0
);

CREATE INDEX idx_pastes_created_at ON pastes(created_at);
CREATE INDEX idx_pastes_expires_at ON pastes(expires_at);
