CREATE TABLE "user" (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(10) NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  login_provider VARCHAR(255),
  created_at DATE NOT NULL DEFAULT CURRENT_DATE,
  updated_at DATE,
  last_login DATE
);
