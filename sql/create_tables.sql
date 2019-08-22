CREATE TABLE tbl_object
(
  k_object                      BIGSERIAL PRIMARY KEY,
  k_parent                      BIGINT REFERENCES tbl_object(k_object) ON DELETE CASCADE,
  s_name                        TEXT,
  n_nested_level                INTEGER NOT NULL,
  t_created                     TIMESTAMP NOT NULL,
  t_modified                    TIMESTAMP NOT NULL
)
WITH (
  OIDS=FALSE
);

CREATE TABLE tbl_behaviour_def
(
  k_behaviour_def               BIGSERIAL PRIMARY KEY,
  s_script                      TEXT NOT NULL,
  s_name                        TEXT NOT NULL,
  u_filename                    UUID NOT NULL,
  b_system                      BOOLEAN NOT NULL,
  t_created                     TIMESTAMP NOT NULL,
  t_modified                    TIMESTAMP NOT NULL
)
WITH (
  OIDS=FALSE
);

CREATE TABLE tbl_property_data_type
(
  k_property_data_type          SERIAL PRIMARY KEY,
  s_name                        TEXT NOT NULL
)
WITH (
  OIDS=FALSE
);

CREATE TABLE tbl_behaviour_def_property
(
  k_behaviour_def_property      BIGSERIAL PRIMARY KEY,
  s_name                        TEXT NOT NULL,
  k_behaviour_def               BIGINT NOT NULL REFERENCES tbl_behaviour_def(k_behaviour_def),
  k_property_data_type          INTEGER NOT NULL REFERENCES tbl_property_data_type(k_property_data_type),
  t_created                     TIMESTAMP NOT NULL,
  t_modified                    TIMESTAMP NOT NULL
)
WITH (
  OIDS=FALSE
);

CREATE TABLE tbl_behaviour_instance
(
  k_behaviour_instance          BIGSERIAL PRIMARY KEY,
  k_object                      BIGINT NOT NULL REFERENCES tbl_object(k_object),
  k_behaviour_def               BIGINT NOT NULL REFERENCES tbl_behaviour_def(k_behaviour_def),
  t_created                     TIMESTAMP NOT NULL,
  t_modified                    TIMESTAMP NOT NULL
)
WITH (
  OIDS=FALSE
);

CREATE TABLE tbl_file
(
  k_file                        SERIAL PRIMARY KEY,
  n_type                        INTEGER NOT NULL,
  x_data                        BYTEA NOT NULL,
  u_filename                    UUID NOT NULL,
  t_created                     TIMESTAMP NOT NULL,
  t_modified                    TIMESTAMP NOT NULL
)
WITH (
  OIDS=FALSE
);

CREATE TABLE tbl_behaviour_instance_property
(
  k_behaviour_instance_property BIGSERIAL PRIMARY KEY,
  k_behaviour_instance          BIGINT NOT NULL REFERENCES tbl_behaviour_instance(k_behaviour_instance),
  k_behaviour_def_property      BIGINT NOT NULL REFERENCES tbl_behaviour_def_property(k_behaviour_def_property),
  n_value                       INTEGER,
  r_value                       REAL,
  s_value                       TEXT,
  b_value                       BOOLEAN,
  t_value                       TIMESTAMP,
  k_file                        INTEGER REFERENCES tbl_file(k_file),
  t_created                     TIMESTAMP NOT NULL,
  t_modified                    TIMESTAMP NOT NULL
)
WITH (
  OIDS=FALSE
);
