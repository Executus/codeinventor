CREATE OR REPLACE FUNCTION func_insert_object(IN in_n_parent_id BIGINT, IN in_s_name TEXT)
  RETURNS BIGINT AS
$$
DECLARE
  n_object_id BIGINT;
BEGIN
  INSERT INTO tbl_object (k_parent, s_name, t_created, t_modified)
  VALUES (in_n_parent_id, in_s_name, now(), now())
  RETURNING k_object INTO n_object_id;
  RETURN n_object_id;
END
$$ LANGUAGE plpgsql VOLATILE NOT LEAKPROOF;