CREATE OR REPLACE FUNCTION func_insert_object(IN in_n_parent_id BIGINT, IN in_s_name TEXT, IN in_n_nested_level INTEGER)
  RETURNS BIGINT AS
$$
DECLARE
  n_object_id BIGINT;
BEGIN
  INSERT INTO tbl_object (k_parent, s_name, n_nested_level, t_created, t_modified)
  VALUES (in_n_parent_id, in_s_name, in_n_nested_level, now(), now())
  RETURNING k_object INTO n_object_id;
  RETURN n_object_id;
END
$$ LANGUAGE plpgsql VOLATILE NOT LEAKPROOF;

CREATE OR REPLACE FUNCTION func_get_objects()
  RETURNS TABLE(
    k_object        BIGINT,
    k_parent        BIGINT,
    s_name          TEXT,
    n_nested_level  INTEGER
  ) AS
$$
BEGIN
  RETURN QUERY
  SELECT o.k_object, o.k_parent, o.s_name, o.n_nested_level
  FROM tbl_object AS o;
END
$$ LANGUAGE plpgsql VOLATILE NOT LEAKPROOF;

CREATE OR REPLACE FUNCTION func_update_object(IN in_n_object_id BIGINT, IN in_s_name TEXT)
  RETURNS BIGINT AS 
$$
BEGIN
  UPDATE tbl_object
  SET (s_name, t_modified) = (in_s_name, now())
  WHERE k_object = in_n_object_id;
  RETURN in_n_object_id;
END
$$ LANGUAGE plpgsql VOLATILE NOT LEAKPROOF;

CREATE OR REPLACE FUNCTION func_delete_objects(IN in_n_object_id INTEGER)
  RETURNS INTEGER AS
$$
DECLARE
  n_records_deleted   INTEGER;
BEGIN
  DELETE FROM tbl_object
  WHERE k_object = in_n_object_id;
  GET DIAGNOSTICS n_records_deleted = ROW_COUNT;
  RETURN n_records_deleted;
END
$$ LANGUAGE plpgsql VOLATILE NOT LEAKPROOF;