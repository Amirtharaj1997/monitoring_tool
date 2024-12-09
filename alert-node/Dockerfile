FROM node:20

COPY package.json package.json
RUN npm install

COPY . .
EXPOSE 7777
CMD ["node", "promo_alert_node.js"]