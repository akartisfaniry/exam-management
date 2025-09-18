FROM node:20

WORKDIR /app

# install angular cli
RUN npm install -g @angular/cli@18

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

CMD ["ng", "serve", "--host", "0.0.0.0"]

