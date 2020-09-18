-- iphone-11-pro-max,at-t,iphone-11-pro-max-64gb-at-t,497056-gpid,140,99
CREATE DATABASE iphones;

CREATE SCHEMA iphones;

CREATE TABLE iphones.phones (
  id serial,
  "datetime" timestamp DEFAULT now(),
  phone text,
  carrier text,
  model text,
  gpid text,
  price1 numeric,
  price2 numeric
);

CREATE INDEX phone_index ON iphones.phones (phone);
CREATE INDEX carrier_index ON iphones.phones (carrier);
CREATE INDEX datetime_index ON iphones.phones ("datetime");