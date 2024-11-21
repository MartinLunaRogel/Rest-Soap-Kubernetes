FROM node:18

# Establecer directorio de trabajo
WORKDIR /usr/src/app

# Copiar archivos de configuración
COPY package*.json ./

# Instalar las dependencias de desarrollo y producción
RUN npm install

# Instalar Nest CLI globalmente si es necesario para ejecutar "nest start"
RUN npm install -g @nestjs/cli

# Copiar el código fuente
COPY . .

# Exponer el puerto de la aplicación
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "run", "start"]
