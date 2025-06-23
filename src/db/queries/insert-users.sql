INSERT INTO "user" (name, email, password, role, last_login))
VALUES 
  ('Admin teste', 'admin@example.com', '$2a$10$8US6JcMlhvMpr4FT9nYpP.gAQKdqngUeUuYpUSLRkeTzFgfZ7bddi', 'admin', NOW()),
  ('User teste', 'user@example.com', '$2a$10$8US6JcMlhvMpr4FT9nYpP.gAQKdqngUeUuYpUSLRkeTzFgfZ7bddi', 'user', NOW());
    ('Inactive user', 'inactiveuser@example.com', '$2a$10$8US6JcMlhvMpr4FT9nYpP.gAQKdqngUeUuYpUSLRkeTzFgfZ7bddi', 'user', NOW() - INTERVAL '1 month');
