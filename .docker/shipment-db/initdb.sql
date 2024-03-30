-- Create the schema that we'll use to populate data and watch the effect in the WAL
CREATE SCHEMA shipments;
SET search_path TO shipments;

CREATE TABLE consumed_message (
	event_id uuid NOT NULL,
	time_of_receiving timestamptz(6) NULL,
	CONSTRAINT consumed_message__pk PRIMARY KEY (event_id)
);

CREATE TABLE shipment (
	id bigserial NOT NULL,
	customer_id int8 NOT NULL,
	order_date timestamp(6) NULL,
	order_id int8 NOT NULL,
	CONSTRAINT shipment__pk PRIMARY KEY (id)
);

