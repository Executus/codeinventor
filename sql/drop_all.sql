this error is here intentionally to stop accidental running of this script

DROP FUNCTION func_delete_objects(IN in_n_object_id INTEGER);
DROP FUNCTION func_delete_behaviour_def(IN in_n_behaviour_def_id BIGINT);
DROP FUNCTION func_delete_behaviour_def_property(IN in_k_behaviour_def_property BIGINT);
DROP FUNCTION func_delete_behaviour_instance(IN in_k_behaviour_instance BIGINT);
DROP FUNCTION func_delete_behaviour_instance_prop(IN in_k_behaviour_instance_property BIGINT);
DROP FUNCTION func_get_objects();
DROP FUNCTION func_get_files(IN in_n_type INTEGER);
DROP FUNCTION func_get_behaviour_defs();
DROP FUNCTION func_get_behaviour_def(IN in_k_behaviour_def BIGINT);
DROP FUNCTION func_get_behaviour_def_properties(IN in_k_behaviour_def BIGINT);
DROP FUNCTION func_get_property_data_types();
DROP FUNCTION func_get_behaviour_instances(IN in_k_object BIGINT);
DROP FUNCTION func_get_behaviour_instance_properties(IN in_k_behaviour_instance BIGINT);
DROP FUNCTION func_get_property_type(IN in_k_behaviour_def_property BIGINT);
DROP FUNCTION func_insert_object(IN in_n_parent_id BIGINT, IN in_s_name TEXT, IN in_n_nested_level INTEGER);
DROP FUNCTION func_insert_behaviour_def(IN in_s_script TEXT, IN in_s_name TEXT, IN in_b_system BOOLEAN, IN in_u_filename UUID);
DROP FUNCTION func_insert_behaviour_def_property(IN in_s_name TEXT, IN in_k_behaviour_def BIGINT, IN in_k_property_data_type INTEGER);
DROP FUNCTION func_insert_behaviour_instance(IN in_k_object BIGINT, IN in_k_behaviour_def BIGINT);
DROP FUNCTION func_insert_behaviour_instance_prop(IN in_k_behaviour_instance BIGINT, IN in_k_behaviour_def_property BIGINT, IN in_n_value INTEGER,
                                                               IN in_r_value REAL, IN in_s_value TEXT, IN in_b_value BOOLEAN,
                                                               IN in_t_value TIMESTAMP, IN in_k_file INTEGER);
DROP FUNCTION func_insert_file(IN in_n_type INTEGER, IN in_x_data BYTEA, IN in_u_filename UUID);
DROP FUNCTION func_update_object(IN in_n_object_id BIGINT, IN in_s_name TEXT);
DROP FUNCTION func_update_behaviour_def(IN in_n_behaviour_def_id BIGINT, IN in_s_script TEXT, IN in_s_name TEXT);
DROP FUNCTION func_update_behaviour_instance_property(IN in_k_behaviour_instance_property BIGINT, IN in_n_value INTEGER,
                                                        IN in_r_value REAL, IN in_s_value TEXT, IN in_b_value BOOLEAN,
                                                        IN in_t_value TIMESTAMP, IN in_k_file INTEGER);

DROP TABLE tbl_behaviour_instance_property;
DROP TABLE tbl_behaviour_instance;
DROP TABLE tbl_behaviour_def_property;
DROP TABLE tbl_property_data_type;
DROP TABLE tbl_behaviour_def;
DROP TABLE tbl_object;
DROP TABLE tbl_file;