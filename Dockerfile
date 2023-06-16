FROM node:18 as dev

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

ENV PORT 3000

EXPOSE $PORT 

ARG NODE_ENV

RUN if [ "$NODE_ENV" = "production" ]; \
        then npm run build; \
        fi


FROM node:15 as prod

WORKDIR /app

COPY package*.json .

RUN npm ci --only=production

COPY --from=dev /app/dist ./dist

ENV PORT 3000

EXPOSE $PORT

CMD ["npm", "start"]
