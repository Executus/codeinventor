CREATE OR REPLACE FUNCTION func_insert_object(IN in_n_parent_id BIGINT, IN in_s_name TEXT, IN in_n_nested_level INTEGER, IN in_s_app_id TEXT)
  RETURNS BIGINT AS
$$
DECLARE
  n_object_id BIGINT;
BEGIN
  INSERT INTO tbl_object (k_parent, s_name, n_nested_level, s_app_id, t_created, t_modified)
  VALUES (in_n_parent_id, in_s_name, in_n_nested_level, in_s_app_id, now(), now())
  RETURNING k_object INTO n_object_id;
  RETURN n_object_id;
END
$$ LANGUAGE plpgsql VOLATILE NOT LEAKPROOF;

CREATE OR REPLACE FUNCTION func_get_objects(IN in_s_app_id TEXT)
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
  FROM tbl_object AS o
  WHERE o.s_app_id = in_s_app_id;
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

CREATE OR REPLACE FUNCTION func_get_files(IN in_n_type INTEGER, IN in_s_app_id TEXT)
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
  WHERE f.n_type = in_n_type
  AND f.s_app_id = in_s_app_id
  OR f.s_app_id IS NULL;
END
$$ LANGUAGE plpgsql VOLATILE NOT LEAKPROOF;

CREATE OR REPLACE FUNCTION func_insert_behaviour_def(IN in_s_script TEXT, IN in_s_name TEXT, IN in_b_system BOOLEAN, IN in_u_filename UUID, 
                                                     IN in_s_app_id TEXT)
  RETURNS BIGINT AS
$$
DECLARE
  n_behaviour_def_id BIGINT;
BEGIN
  INSERT INTO tbl_behaviour_def (s_script, s_name, b_system, u_filename, s_app_id, t_created, t_modified)
  VALUES (in_s_script, in_s_name, in_b_system, in_u_filename, in_s_app_id, now(), now())
  RETURNING k_behaviour_def INTO n_behaviour_def_id;
  RETURN n_behaviour_def_id;
END
$$ LANGUAGE plpgsql VOLATILE NOT LEAKPROOF;

CREATE OR REPLACE FUNCTION func_get_behaviour_defs(IN in_s_app_id TEXT)
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
  WHERE bd.s_app_id = in_s_app_id
  OR bd.s_app_id IS NULL;
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
  DELETE FROM tbl_behaviour_instance_property
  WHERE k_behaviour_instance IN (
    SELECT k_behaviour_instance
    FROM tbl_behaviour_instance
    WHERE k_behaviour_def = in_n_behaviour_def_id
  );

  DELETE FROM tbl_behaviour_instance
  WHERE k_behaviour_def = in_n_behaviour_def_id;

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
  DELETE FROM tbl_behaviour_instance_property
  WHERE k_behaviour_def_property = in_k_behaviour_def_property;

  DELETE FROM tbl_behaviour_def_property
  WHERE k_behaviour_def_property = in_k_behaviour_def_property;
  GET DIAGNOSTICS n_records_deleted = ROW_COUNT;
  RETURN n_records_deleted;
END
$$ LANGUAGE plpgsql VOLATILE NOT LEAKPROOF;

CREATE OR REPLACE FUNCTION func_insert_behaviour_instance(IN in_k_object BIGINT, IN in_k_behaviour_def BIGINT)
  RETURNS BIGINT AS
$$
DECLARE
  n_behaviour_instance_id BIGINT;
BEGIN
  INSERT INTO tbl_behaviour_instance (k_object, k_behaviour_def, t_created, t_modified)
  VALUES (in_k_object, in_k_behaviour_def, now(), now())
  RETURNING k_behaviour_instance INTO n_behaviour_instance_id;
  RETURN n_behaviour_instance_id;
END
$$ LANGUAGE plpgsql VOLATILE NOT LEAKPROOF;

CREATE OR REPLACE FUNCTION func_delete_behaviour_instance(IN in_k_behaviour_instance BIGINT)
  RETURNS INTEGER AS
$$
DECLARE
  n_records_deleted   INTEGER;
BEGIN
  DELETE FROM tbl_behaviour_instance_property
  WHERE k_behaviour_instance = in_k_behaviour_instance;

  DELETE FROM tbl_behaviour_instance
  WHERE k_behaviour_instance = in_k_behaviour_instance;
  GET DIAGNOSTICS n_records_deleted = ROW_COUNT;
  RETURN n_records_deleted;
END
$$ LANGUAGE plpgsql VOLATILE NOT LEAKPROOF;

CREATE OR REPLACE FUNCTION func_insert_behaviour_instance_prop(IN in_k_behaviour_instance BIGINT, IN in_k_behaviour_def_property BIGINT, IN in_n_value INTEGER DEFAULT NULL,
                                                               IN in_r_value REAL DEFAULT NULL, IN in_s_value TEXT DEFAULT NULL, IN in_b_value BOOLEAN DEFAULT NULL,
                                                               IN in_t_value TIMESTAMP DEFAULT NULL, IN in_k_file INTEGER DEFAULT NULL)
  RETURNS BIGINT AS
$$
DECLARE
  n_behaviour_instance_prop_id BIGINT;
BEGIN
  INSERT INTO tbl_behaviour_instance_property (k_behaviour_instance, k_behaviour_def_property, n_value, r_value, s_value, b_value, 
                                               t_value, k_file, t_created, t_modified)
  VALUES (in_k_behaviour_instance, in_k_behaviour_def_property, in_n_value, in_r_value, in_s_value, in_b_value, in_t_value, in_k_file, now(), now())
  RETURNING k_behaviour_instance_property INTO n_behaviour_instance_prop_id;
  RETURN n_behaviour_instance_prop_id;
END
$$ LANGUAGE plpgsql VOLATILE NOT LEAKPROOF;

CREATE OR REPLACE FUNCTION func_delete_behaviour_instance_prop(IN in_k_behaviour_instance_property BIGINT)
  RETURNS INTEGER AS
$$
DECLARE
  n_records_deleted   INTEGER;
BEGIN
  DELETE FROM tbl_behaviour_instance_property
  WHERE k_behaviour_instance_property = in_k_behaviour_instance_property;
  GET DIAGNOSTICS n_records_deleted = ROW_COUNT;
  RETURN n_records_deleted;
END
$$ LANGUAGE plpgsql VOLATILE NOT LEAKPROOF;

CREATE OR REPLACE FUNCTION func_get_behaviour_instances(IN in_k_object BIGINT)
  RETURNS TABLE(
    k_behaviour_instance   BIGINT,
    k_object               BIGINT,
    k_behaviour_def        BIGINT,
    s_name                 TEXT
  ) AS
$$
BEGIN
  RETURN QUERY
  SELECT bi.k_behaviour_instance, bi.k_object, bi.k_behaviour_def, bd.s_name
  FROM tbl_behaviour_instance AS bi
  INNER JOIN tbl_behaviour_def bd
  ON bd.k_behaviour_def = bi.k_behaviour_def
  WHERE bi.k_object = in_k_object;
END
$$ LANGUAGE plpgsql VOLATILE NOT LEAKPROOF;

CREATE OR REPLACE FUNCTION func_get_behaviour_instance_properties(IN in_k_behaviour_instance BIGINT)
  RETURNS TABLE(
    k_behaviour_instance_property BIGINT,
    k_behaviour_instance          BIGINT,
    k_behaviour_def_property      BIGINT,
    s_name                        TEXT,
    s_type                        TEXT,
    n_value                       INTEGER,
    r_value                       REAL,
    s_value                       TEXT,
    b_value                       BOOLEAN,
    t_value                       TIMESTAMP,
    k_file                        INTEGER,
    u_filename                    UUID
  ) AS
$$
BEGIN
  RETURN QUERY
  SELECT bip.k_behaviour_instance_property, bip.k_behaviour_instance, bip.k_behaviour_def_property, bdp.s_name, pdt.s_name AS s_type,
         bip.n_value, bip.r_value, bip.s_value, bip.b_value, bip.t_value, bip.k_file, f.u_filename
  FROM tbl_behaviour_instance_property AS bip
  INNER JOIN tbl_behaviour_def_property bdp
  ON bdp.k_behaviour_def_property = bip.k_behaviour_def_property
  INNER JOIN tbl_property_data_type pdt
  ON pdt.k_property_data_type = bdp.k_property_data_type
  LEFT OUTER JOIN tbl_file f
  ON f.k_file = bip.k_file
  WHERE bip.k_behaviour_instance = in_k_behaviour_instance;
END
$$ LANGUAGE plpgsql VOLATILE NOT LEAKPROOF;

CREATE OR REPLACE FUNCTION func_get_property_type(IN in_k_behaviour_def_property BIGINT)
  RETURNS TEXT AS
$$
DECLARE
  s_property_type  TEXT;
BEGIN
  SELECT pdt.s_name INTO s_property_type
  FROM tbl_behaviour_def_property AS bdp
  INNER JOIN tbl_property_data_type pdt
  ON pdt.k_property_data_type = bdp.k_property_data_type
  WHERE bdp.k_behaviour_def_property = in_k_behaviour_def_property;
  RETURN s_property_type;
END
$$ LANGUAGE plpgsql VOLATILE NOT LEAKPROOF;

CREATE OR REPLACE FUNCTION func_update_behaviour_instance_property(IN in_k_behaviour_instance_property BIGINT, IN in_n_value INTEGER DEFAULT NULL,
                                                        IN in_r_value REAL DEFAULT NULL, IN in_s_value TEXT DEFAULT NULL, IN in_b_value BOOLEAN DEFAULT NULL,
                                                        IN in_t_value TIMESTAMP DEFAULT NULL, IN in_k_file INTEGER DEFAULT NULL)
  RETURNS TABLE(
    k_behaviour_instance_property BIGINT,
    k_behaviour_instance          BIGINT,
    k_behaviour_def_property      BIGINT,
    s_name                        TEXT,
    s_type                        TEXT,
    n_value                       INTEGER,
    r_value                       REAL,
    s_value                       TEXT,
    b_value                       BOOLEAN,
    t_value                       TIMESTAMP,
    k_file                        INTEGER
  ) AS
$$
BEGIN
  UPDATE tbl_behaviour_instance_property
  SET (n_value, r_value, s_value, b_value, t_value, k_file, t_modified) = 
  (in_n_value, in_r_value, in_s_value, in_b_value, in_t_value, in_k_file, now())
  WHERE tbl_behaviour_instance_property.k_behaviour_instance_property = in_k_behaviour_instance_property;

  RETURN QUERY
  SELECT bip.k_behaviour_instance_property, bip.k_behaviour_instance, bip.k_behaviour_def_property, bdp.s_name, pdt.s_name AS s_type,
         bip.n_value, bip.r_value, bip.s_value, bip.b_value, bip.t_value, bip.k_file
  FROM tbl_behaviour_instance_property AS bip
  INNER JOIN tbl_behaviour_def_property bdp
  ON bdp.k_behaviour_def_property = bip.k_behaviour_def_property
  INNER JOIN tbl_property_data_type pdt
  ON pdt.k_property_data_type = bdp.k_property_data_type
  WHERE bip.k_behaviour_instance_property = in_k_behaviour_instance_property;
END
$$ LANGUAGE plpgsql VOLATILE NOT LEAKPROOF;

CREATE OR REPLACE FUNCTION func_insert_file(IN in_n_type INTEGER, IN in_x_data BYTEA, IN in_u_filename UUID, IN in_s_app_id TEXT)
  RETURNS BIGINT AS
$$
DECLARE
  n_file_id BIGINT;
BEGIN
  INSERT INTO tbl_file (n_type, x_data, u_filename, s_app_id, t_created, t_modified)
  VALUES (in_n_type, in_x_data, in_u_filename, in_s_app_id, now(), now())
  RETURNING k_file INTO n_file_id;
  RETURN n_file_id;
END
$$ LANGUAGE plpgsql VOLATILE NOT LEAKPROOF;