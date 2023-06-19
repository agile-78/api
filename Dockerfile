FROM node:18 as base

WORKDIR /app

COPY package*.json .

FROM base as dev

RUN npm install

COPY . .

ENV PORT 3000

EXPOSE $PORT 

ARG NODE_ENV

RUN if [ "$NODE_ENV" = "production" ]; \
        then npm run build; \
        fi

FROM dev as test

CMD ["npm", "run", "test"]


FROM base as prod

RUN npm ci --only=production

COPY --from=dev /app/dist ./dist

ENV PORT 3000

EXPOSE $PORT

CMD ["npm", "start"]
