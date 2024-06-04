FROM node:18-alpine

WORKDIR /app
COPY . /app
RUN npm install

# Bundle app source
COPY . .

RUN npm run build
CMD [ "npm", "start" ]