
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE page_content (
  id INT AUTO_INCREMENT PRIMARY KEY,
  page_name VARCHAR(255) NOT NULL,
  section_name VARCHAR(255) NOT NULL,
  content_key VARCHAR(255) NOT NULL,
  content_value TEXT NOT NULL,
  UNIQUE(page_name, section_name, content_key)
);
INSERT INTO users (id, username, email, password) VALUES
(1, 'nsengiyumvae878@gmail.com', 'nsengiyumvae878@gmail.com', '$2b$10$D0q5rAEqYve7F3gwizUmPunHTb9ocnLT3h7kF1AN6qLmgaGigLigC');
INSERT INTO admins (id, username, email, password, created_at) VALUES
(1, 'Admin', 'admin@gardentss.edu.zm', '$2b$10$dYYTFS9/nptUnzdtJTeHI.CyBRIy2G21hGExAzmYvTJOYtMLjkFAy', '2026-02-11 03:39:06');
INSERT INTO page_content (id, page_name, section_name, content_key, content_value) VALUES
(1, 'home', 'hero', 'fullText', 'WELCOME TO THE GARDEN TSS TO GET THE BEST TECHNICAL EDUCATIONAL EXPERIENCE AND ACADEMIC INNOVATION BECAUSE WE ARE THE BEST FOR CAREER DEVELOPMENT AND FUTURE SUCCESS'),
(2, 'home', 'hero', 'bgImage', 'https://media.istockphoto.com/id/1830042746/photo/document-management-system-dms-with-arrange-folder-and-files-icons-man-setup-storage-backup.jpg?s=612x612&w=0&k=20&c=t8oAAO16j6fMhleAYJEXm5pSXFIDZrEG6sYJkv_Sdos='),
(3, 'home', 'users', 'list', '["NSENGIYUMVA Eric","HAKIZIMANA Aimable","CYUZUZO J.Bosco"]'),
(4, 'home', 'cards', 'image1', 'https://scontent.fnbo18-1.fna.fbcdn.net/v/t39.30808-6/577017538_122203495460430213_338196711157474203_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=_9QDa13EM2gQ7kNvwGl21ht&_nc_oc=AdmxJKtHk1VSSq-bmtbX14qO5CqQRVaxIMlnXgEZKNO8E6XMUh8mbpnZZ8X20HIMHZw&_nc_zt=23&_nc_ht=scontent.fnbo18-1.fna&_nc_gid=zwUam4vHrDO1Rug8pyK-Rw&oh=00_AfsY_0eFVZKbuewuSJciF6Vqjh5jiElZvxhQ4T6UjMTv7g&oe=698B4FDA'),
(5, 'home', 'cards', 'image2', '\IMAGES\ccccc.png'),
(6, 'team', 'header', 'title', 'Our Team'),
(7, 'team', 'members', 'list', '[{"role":"Principal","name":"Mr. Eric M."},{"role":"Vice Principal","name":"Ms. Sarah K."},{"role":"Head of Technical Dept","name":"Mr. John D."},{"role":"Head of Science Dept","name":"Mrs. Jane S."}]'),
(8, 'about', 'header', 'title', 'About GARDEN TSS'),
(9, 'about', 'mission', 'text', 'To provide high-quality technical and vocational education that equips students with practical skills and ethical values.'),
(10, 'about', 'vision', 'text', 'To be a center of excellence in technical education, producing innovative leaders who contribute to national development.'),
(11, 'contact', 'header', 'title', 'Contact Us'),
(12, 'contact', 'details', 'address', '123 Garden Avenue, Tech City'),
(13, 'contact', 'details', 'phone', '+260 977 123456'),
(14, 'contact', 'details', 'email', 'info@gardentss.edu.zm'),
(15, 'footer', 'social', 'facebook', 'https://facebook.com'),
(16, 'footer', 'social', 'twitter', 'https://twitter.com'),
(17, 'footer', 'social', 'linkedin', 'https://linkedin.com'),
(18, 'footer', 'copyright', 'text', '© 2026 NSENGIYUMVA Eric');
