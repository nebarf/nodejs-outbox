-- Create the schema that we'll use to populate data and watch the effect in the WAL
CREATE SCHEMA shipments;
SET search_path TO shipments;

CREATE TABLE consumed_message (
	event_id uuid NOT NULL,
	time_of_receiving timestamp NULL,
	CONSTRAINT consumed_message__pk PRIMARY KEY (event_id)
);

CREATE TABLE shipment (
	id uuid NOT NULL,
	customer_id integer NOT NULL,
	order_date timestamp NULL,
	order_id uuid NOT NULL,
	CONSTRAINT shipment__pk PRIMARY KEY (id)
);

