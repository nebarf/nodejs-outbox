FROM rabbitmq:3-management-alpine

ENV RABBITMQ_ADMIN_USER admin
ENV RABBITMQ_ADMIN_PASSWORD admin
ENV RABBITMQ_PID_FILE /var/lib/rabbitmq/mnesia/rabbitmq

ADD bootstrap.sh /bootstrap.sh
RUN chmod +x /bootstrap.sh

CMD ["/bootstrap.sh"]