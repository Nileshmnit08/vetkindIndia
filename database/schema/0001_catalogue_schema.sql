-- Categories
CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE
);

-- Animal Species
CREATE TABLE animal_species (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE
);

-- Product Benefits
CREATE TABLE product_benefits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE
);

-- Products
CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  short_description text,
  description text,
  category_id uuid REFERENCES categories(id),
  brand text,
  product_type text,
  ingredients text,
  composition text,
  dosage text,
  usage text,
  pack_sizes text[],
  mrp numeric,
  status text DEFAULT 'active',
  featured boolean DEFAULT false,
  bestseller boolean DEFAULT false,
  seo_title text,
  seo_description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Many-to-many relationship: Products <-> Animal Species
CREATE TABLE product_species_link (
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  species_id uuid REFERENCES animal_species(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, species_id)
);

-- Many-to-many relationship: Products <-> Product Benefits
CREATE TABLE product_benefits_link (
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  benefit_id uuid REFERENCES product_benefits(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, benefit_id)
);

-- Product Images
CREATE TABLE product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  is_primary boolean DEFAULT false
);

-- Product Documents
CREATE TABLE product_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  title text NOT NULL,
  file_url text NOT NULL
);
