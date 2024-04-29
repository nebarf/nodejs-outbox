#!/bin/sh

# Create RabbitMQ resources.
( rabbitmqctl wait --timeout 60 $RABBITMQ_PID_FILE ; \
rabbitmqctl add_user $RABBITMQ_ADMIN_USER $RABBITMQ_ADMIN_PASSWORD 2>/dev/null ; \
rabbitmqctl set_user_tags $RABBITMQ_ADMIN_USER administrator ; \
rabbitmqctl set_permissions -p / $RABBITMQ_ADMIN_USER  ".*" ".*" ".*" ; \
rabbitmqadmin declare exchange name=order.events type=fanout -u $RABBITMQ_ADMIN_USER -p $RABBITMQ_ADMIN_PASSWORD ; \
rabbitmqadmin declare queue name=shipment.orders durable=true -u $RABBITMQ_ADMIN_USER -p $RABBITMQ_ADMIN_PASSWORD ; \
rabbitmqadmin declare binding source="order.events" destination_type="queue" destination="shipment.orders" -u $RABBITMQ_ADMIN_USER -p $RABBITMQ_ADMIN_PASSWORD ; ) &

# $@ is used to pass arguments to the rabbitmq-server command.
# For example if you use it like this: docker run -d rabbitmq arg1 arg2,
# it will be as you run in the container rabbitmq-server arg1 arg2.
rabbitmq-server $@