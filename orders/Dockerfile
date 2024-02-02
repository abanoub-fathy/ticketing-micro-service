FROM node:alpine

# creating working directory
WORKDIR /app

# copying package.json and installing dependencies
COPY package.json .
RUN npm install --omit=dev

# copying source code
COPY . .

# Running the app
CMD [ "npm", "start" ]