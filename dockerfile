# Utiliser une image Node officielle comme base
FROM node:latest as node
RUN mkdir app 
# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers package.json et installer les dépendances
COPY package*.json /app/
RUN npm install

# Copier le reste du code source de l'application dans le conteneur
COPY . .
# Construire l'application
RUN npm run build:dev

# Utiliser NGINX pour servir l'application
FROM nginx:latest
COPY --from=node /app/dist/future_academie/browser /usr/share/nginx/html

# Copier les fichiers de build vers NGINX
COPY nginx.conf /etc/nginx/nginx.conf
# RUN rm -rf /usr/share/nginx/html/*


# Exposer le port 80
EXPOSE 80
