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

CREATE OR REPLACE FUNCTION func_get_files(IN in_n_type INTEGER)
  RETURNS TABLE(
    k_file          INTEGER,
    n_type          INTEGER,
    x_data          BYTEA,
    u_filename      UUID
  ) AS
$$
BEGIN
  RETURN QUERY
  SELECT f.k_file, f.n_type, f.x_data, f.u_filename
  FROM tbl_file AS f
  WHERE f.n_type = in_n_type;
END
$$ LANGUAGE plpgsql VOLATILE NOT LEAKPROOF;

CREATE OR REPLACE FUNCTION func_insert_behaviour_def(IN in_s_script TEXT, IN in_s_name TEXT, IN in_b_system BOOLEAN, IN in_u_filename UUID)
  RETURNS BIGINT AS
$$
DECLARE
  n_behaviour_def_id BIGINT;
BEGIN
  INSERT INTO tbl_behaviour_def (s_script, s_name, b_system, u_filename, t_created, t_modified)
  VALUES (in_s_script, in_s_name, in_b_system, in_u_filename, now(), now())
  RETURNING k_behaviour_def INTO n_behaviour_def_id;
  RETURN n_behaviour_def_id;
END
$$ LANGUAGE plpgsql VOLATILE NOT LEAKPROOF;

CREATE OR REPLACE FUNCTION func_get_behaviour_defs()
  RETURNS TABLE(
    k_behaviour_def   BIGINT,
    s_script          TEXT,
    s_name            TEXT,
    b_system          BOOLEAN,
    u_filename        UUID
  ) AS
$$
BEGIN
  RETURN QUERY
  SELECT bd.k_behaviour_def, bd.s_script, bd.s_name, bd.b_system, bd.u_filename
  FROM tbl_behaviour_def AS bd;
END
$$ LANGUAGE plpgsql VOLATILE NOT LEAKPROOF;

CREATE OR REPLACE FUNCTION func_update_behaviour_def(IN in_n_behaviour_def_id BIGINT, IN in_s_script TEXT, IN in_s_name TEXT)
  RETURNS TABLE(
    k_behaviour_def   BIGINT,
    s_script          TEXT,
    s_name            TEXT,
    b_system          BOOLEAN,
    u_filename        UUID
  ) AS
$$
BEGIN
  UPDATE tbl_behaviour_def
  SET (s_script, s_name, t_modified) = (in_s_script, in_s_name, now())
  WHERE tbl_behaviour_def.k_behaviour_def = in_n_behaviour_def_id;

  RETURN QUERY
  SELECT bd.k_behaviour_def, bd.s_script, bd.s_name, bd.b_system, bd.u_filename
  FROM tbl_behaviour_def AS bd
  WHERE bd.k_behaviour_def = in_n_behaviour_def_id;
END
$$ LANGUAGE plpgsql VOLATILE NOT LEAKPROOF;

CREATE OR REPLACE FUNCTION func_delete_behaviour_def(IN in_n_behaviour_def_id BIGINT)
  RETURNS INTEGER AS
$$
DECLARE
  n_records_deleted   INTEGER;
BEGIN
  DELETE FROM tbl_behaviour_def_property
  WHERE k_behaviour_def = in_n_behaviour_def_id;
  DELETE FROM tbl_behaviour_def
  WHERE k_behaviour_def = in_n_behaviour_def_id;
  GET DIAGNOSTICS n_records_deleted = ROW_COUNT;
  RETURN n_records_deleted;
END
$$ LANGUAGE plpgsql VOLATILE NOT LEAKPROOF;

CREATE OR REPLACE FUNCTION func_insert_behaviour_def_property(IN in_s_name TEXT, IN in_k_behaviour_def BIGINT, IN in_k_property_data_type INTEGER)
  RETURNS BIGINT AS
$$
DECLARE
  n_behaviour_def_property_id BIGINT;
BEGIN
  INSERT INTO tbl_behaviour_def_property (s_name, k_behaviour_def, k_property_data_type, t_created, t_modified)
  VALUES (in_s_name, in_k_behaviour_def, in_k_property_data_type, now(), now())
  RETURNING k_behaviour_def_property INTO n_behaviour_def_property_id;
  RETURN n_behaviour_def_property_id;
END
$$ LANGUAGE plpgsql VOLATILE NOT LEAKPROOF;

CREATE OR REPLACE FUNCTION func_get_property_data_types()
  RETURNS TABLE(
    k_property_data_type   INTEGER,
    s_name                 TEXT
  ) AS
$$
BEGIN
  RETURN QUERY
  SELECT pdt.k_property_data_type, pdt.s_name
  FROM tbl_property_data_type AS pdt;
END
$$ LANGUAGE plpgsql VOLATILE NOT LEAKPROOF;

CREATE OR REPLACE FUNCTION func_get_behaviour_def(IN in_k_behaviour_def BIGINT)
  RETURNS TABLE(
    k_behaviour_def   BIGINT,
    s_script          TEXT,
    s_name            TEXT,
    b_system          BOOLEAN,
    u_filename        UUID
  ) AS
$$
BEGIN
  RETURN QUERY
  SELECT bd.k_behaviour_def, bd.s_script, bd.s_name, bd.b_system, bd.u_filename
  FROM tbl_behaviour_def AS bd
  WHERE bd.k_behaviour_def = in_k_behaviour_def;
END
$$ LANGUAGE plpgsql VOLATILE NOT LEAKPROOF;

CREATE OR REPLACE FUNCTION func_get_behaviour_def_properties(IN in_k_behaviour_def BIGINT)
  RETURNS TABLE(
    k_behaviour_def_property    BIGINT,
    s_name                      TEXT,
    k_behaviour_def             BIGINT,
    k_property_data_type        INTEGER
  ) AS
$$
BEGIN
  RETURN QUERY
  SELECT bdp.k_behaviour_def_property, bdp.s_name, bdp.k_behaviour_def, bdp.k_property_data_type
  FROM tbl_behaviour_def_property AS bdp
  WHERE bdp.k_behaviour_def = in_k_behaviour_def;
END
$$ LANGUAGE plpgsql VOLATILE NOT LEAKPROOF;

CREATE OR REPLACE FUNCTION func_delete_behaviour_def_property(IN in_k_behaviour_def_property BIGINT)
  RETURNS INTEGER AS
$$
DECLARE
  n_records_deleted   INTEGER;
BEGIN
  DELETE FROM tbl_behaviour_def_property
  WHERE k_behaviour_def_property = in_k_behaviour_def_property;
  GET DIAGNOSTICS n_records_deleted = ROW_COUNT;
  RETURN n_records_deleted;
END
$$ LANGUAGE plpgsql VOLATILE NOT LEAKPROOF;