-- Create the schema that we'll use to populate data and watch the effect in the WAL
CREATE SCHEMA orders;
SET search_path TO orders;

CREATE TABLE purchase_order (
	id int8 NOT NULL,
	customer_id int8 NOT NULL,
	order_date timestamp NULL,
	CONSTRAINT purchase_order__pk PRIMARY KEY (id)
);

CREATE TABLE order_line (
	id int8 NOT NULL,
	quantity int4 NOT NULL,
	total_price decimal(12, 2) NULL,
	order_id int8 NULL,
	item varchar(255) NULL,
	"status" varchar(255) NULL,
	CONSTRAINT order_line__pk PRIMARY KEY (id),
	CONSTRAINT order_line__status__enum_check CHECK (((status)::text = ANY ((ARRAY['ENTERED'::character varying, 'CANCELLED'::character varying, 'SHIPPED'::character varying])::text[])))
);
ALTER TABLE order_line ADD CONSTRAINT order_line__purchase_order__fk FOREIGN KEY (order_id) REFERENCES purchase_order(id);

CREATE TABLE outbox_event (
	id uuid NOT NULL,
	"timestamp" timestamp NOT NULL,
	aggregate_id varchar(255) NOT NULL,
	aggregate_type varchar(255) NOT NULL,
	payload jsonb NOT NULL,
	"type" varchar(255) NOT NULL,
	CONSTRAINT outbox_event__pk PRIMARY KEY (id)
);
ALTER TABLE outbox_event REPLICA IDENTITY FULL;