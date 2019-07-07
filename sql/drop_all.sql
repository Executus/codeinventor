this error is here intentionally to stop accidental running of this script

DROP FUNCTION func_insert_object(IN in_n_parent_id BIGINT, IN in_s_name TEXT, IN in_n_nested_level INTEGER);
DROP FUNCTION func_get_objects();
DROP FUNCTION func_update_object(IN in_n_object_id BIGINT, IN in_s_name TEXT);
DROP FUNCTION func_delete_objects(IN in_n_object_id INTEGER);
DROP FUNCTION func_get_files(IN in_n_type INTEGER);
DROP FUNCTION func_insert_behaviour_def(IN in_s_script TEXT, IN in_s_name TEXT, IN in_b_system BOOLEAN);
DROP FUNCTION func_get_behaviour_defs();
DROP FUNCTION func_update_behaviour_def(IN in_n_behaviour_def_id BIGINT, IN in_s_script TEXT, IN in_s_name TEXT);
DROP FUNCTION func_delete_behaviour_def(IN in_n_behaviour_def_id BIGINT);

DROP TABLE tbl_behaviour_instance_property;
DROP TABLE tbl_behaviour_instance;
DROP TABLE tbl_behaviour_def_property;
DROP TABLE tbl_property_data_type;
DROP TABLE tbl_behaviour_def;
DROP TABLE tbl_object;
DROP TABLE tbl_file;