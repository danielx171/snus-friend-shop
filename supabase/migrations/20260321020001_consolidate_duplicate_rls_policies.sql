-- Consolidate duplicate permissive RLS policies
-- Problem: "Admin ALL" + "Public SELECT" both evaluated on every SELECT query
-- Fix: Split admin ALL into per-command policies; keep admin SELECT only where needed

-- BRANDS: public SELECT (true) covers admins. Admin only needs write access.
DROP POLICY "Admins can manage brands" ON brands;
CREATE POLICY "Admins can insert brands" ON brands FOR INSERT
  WITH CHECK (has_role((SELECT auth.uid()), 'admin'::app_role));
CREATE POLICY "Admins can update brands" ON brands FOR UPDATE
  USING (has_role((SELECT auth.uid()), 'admin'::app_role))
  WITH CHECK (has_role((SELECT auth.uid()), 'admin'::app_role));
CREATE POLICY "Admins can delete brands" ON brands FOR DELETE
  USING (has_role((SELECT auth.uid()), 'admin'::app_role));

-- INVENTORY: public SELECT (true) covers admins. Admin only needs write.
DROP POLICY "Admins can manage inventory" ON inventory;
CREATE POLICY "Admins can insert inventory" ON inventory FOR INSERT
  WITH CHECK (has_role((SELECT auth.uid()), 'admin'::app_role));
CREATE POLICY "Admins can update inventory" ON inventory FOR UPDATE
  USING (has_role((SELECT auth.uid()), 'admin'::app_role))
  WITH CHECK (has_role((SELECT auth.uid()), 'admin'::app_role));
CREATE POLICY "Admins can delete inventory" ON inventory FOR DELETE
  USING (has_role((SELECT auth.uid()), 'admin'::app_role));

-- PRODUCT_VARIANTS: public SELECT (true) covers admins. Admin only needs write.
DROP POLICY "Admins can manage variants" ON product_variants;
CREATE POLICY "Admins can insert variants" ON product_variants FOR INSERT
  WITH CHECK (has_role((SELECT auth.uid()), 'admin'::app_role));
CREATE POLICY "Admins can update variants" ON product_variants FOR UPDATE
  USING (has_role((SELECT auth.uid()), 'admin'::app_role))
  WITH CHECK (has_role((SELECT auth.uid()), 'admin'::app_role));
CREATE POLICY "Admins can delete variants" ON product_variants FOR DELETE
  USING (has_role((SELECT auth.uid()), 'admin'::app_role));

-- PRODUCTS: public SELECT only shows is_active=true. Admin needs ALL products.
DROP POLICY "Admins can manage products" ON products;
CREATE POLICY "Admins can read all products" ON products FOR SELECT
  USING (has_role((SELECT auth.uid()), 'admin'::app_role));
CREATE POLICY "Admins can insert products" ON products FOR INSERT
  WITH CHECK (has_role((SELECT auth.uid()), 'admin'::app_role));
CREATE POLICY "Admins can update products" ON products FOR UPDATE
  USING (has_role((SELECT auth.uid()), 'admin'::app_role))
  WITH CHECK (has_role((SELECT auth.uid()), 'admin'::app_role));
CREATE POLICY "Admins can delete products" ON products FOR DELETE
  USING (has_role((SELECT auth.uid()), 'admin'::app_role));

-- ORDERS: public SELECT is user_id filtered. Admin needs ALL orders.
DROP POLICY "Admins have full access to orders" ON orders;
CREATE POLICY "Admins can read all orders" ON orders FOR SELECT
  USING (has_role((SELECT auth.uid()), 'admin'::app_role));
CREATE POLICY "Admins can insert orders" ON orders FOR INSERT
  WITH CHECK (has_role((SELECT auth.uid()), 'admin'::app_role));
CREATE POLICY "Admins can update orders" ON orders FOR UPDATE
  USING (has_role((SELECT auth.uid()), 'admin'::app_role))
  WITH CHECK (has_role((SELECT auth.uid()), 'admin'::app_role));
CREATE POLICY "Admins can delete orders" ON orders FOR DELETE
  USING (has_role((SELECT auth.uid()), 'admin'::app_role));

-- USER_ROLES: public SELECT is user_id filtered. Admin needs ALL roles.
DROP POLICY "Admins can manage roles" ON user_roles;
CREATE POLICY "Admins can read all roles" ON user_roles FOR SELECT
  USING (has_role((SELECT auth.uid()), 'admin'::app_role));
CREATE POLICY "Admins can insert roles" ON user_roles FOR INSERT
  WITH CHECK (has_role((SELECT auth.uid()), 'admin'::app_role));
CREATE POLICY "Admins can update roles" ON user_roles FOR UPDATE
  USING (has_role((SELECT auth.uid()), 'admin'::app_role))
  WITH CHECK (has_role((SELECT auth.uid()), 'admin'::app_role));
CREATE POLICY "Admins can delete roles" ON user_roles FOR DELETE
  USING (has_role((SELECT auth.uid()), 'admin'::app_role));
