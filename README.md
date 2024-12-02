# Crear un README detallado y con formato para copia directa
readme_content = """
# **Proyecto APIs REST y SOAP con Kubernetes**

Este repositorio contiene el desarrollo y despliegue de un sistema compuesto por dos APIs (REST y SOAP), diseñado para gestionar datos relacionados con recursos de un restaurante. El despliegue se realiza en **Kubernetes**, cumpliendo con los requerimientos de namespaces, almacenamiento persistente y manejo seguro de datos sensibles mediante secretos.

---

## **📜 Descripción del Proyecto**

### **API REST**
- **Propósito**: Gestionar mesas y meseros en un restaurante.
- **Base de datos**: PostgreSQL.
- **Endpoints principales**:
  - `POST /mesas`: Crear mesas.
  - `GET /mesas`: Listar todas las mesas.
  - `GET /mesas/{id}`: Obtener una mesa por su ID.
  - `PATCH /mesas/{id}`: Actualizar información de una mesa.

### **API SOAP**
- **Propósito**: Gestionar alimentos disponibles en el restaurante.
- **Base de datos**: MySQL.
- **Endpoints principales**:
  - `POST /alimentos`: Crear alimentos.
  - `GET /alimentos/{id}`: Obtener un alimento por su ID.

### **Integración**
- La API REST utiliza la API SOAP para operaciones de creación y obtención de datos relacionados con alimentos.

---

## **🚀 Funcionalidades del Proyecto**

1. **Kubernetes**:
   - Dos namespaces:
     - `mlr-api`: APIs REST y SOAP.
     - `mlr-database`: Bases de datos PostgreSQL y MySQL.
   - Configuración de servicios:
     - **ClusterIP**: API SOAP y bases de datos.
     - **NodePort**: API REST.
   - Almacenamiento persistente:
     - Bases de datos con volúmenes configurados.
   - Manejo de secretos:
     - Datos sensibles, como contraseñas de bases de datos, almacenados de forma segura en Kubernetes.

2. **Repositorio GitHub**:
   - Contiene:
     - Código fuente de ambas APIs.
     - Archivos YAML para el despliegue en Kubernetes.
     - Evidencias visuales del sistema funcionando.
     - Este archivo README.

---


---

## **🔧 Configuración Inicial**

### **Prerrequisitos**
- Docker instalado y configurado.
- Minikube configurado para Kubernetes.
- Kubectl instalado para interactuar con el clúster.
- Acceso a un clúster Kubernetes (Minikube o remoto).

### **Pasos para el Despliegue**

1. **Iniciar Minikube**:
   ```bash
   minikube start --driver=docker
   ```

   Nota: Asegúrate de que Minikube esté utilizando el driver docker y que esté correctamente configurado en tu entorno.

2. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/usuario/Rest-Soap-Kubernetes.git
   cd Rest-Soap-Kubernetes
   ```

3. **Construir imagenes Docker**:
   ```bash
   cd RestApi
   docker build -t rest-soap-kubernetes-rest-api:latest .
   cd ../SoapApi
   docker build -t rest-soap-kubernetes-soap-api:latest .
   ```

4. **Subir imágenes al entorno Kubernetes**:
   ```bash
   minikube -p minikube docker-env --shell powershell | Invoke-Expression
   docker load < rest-soap-kubernetes-rest-api.tar
   docker load < rest-soap-kubernetes-soap-api.tar
   ```

5. **Crear namespaces**
   ```bash
   kubectl create ns mlr-api
   kubectl create ns mlr-database

   kubectl apply -f k8s/namespaces.yml
   kubectl apply -f k8s/database-secrets.yml
   kubectl apply -f k8s/postgres-deployment.yml
   kubectl apply -f k8s/restapi-deployment.yml
   kubectl apply -f k8s/soapapi-deployment.yml
   ```

6. **Verifica el estado del despliegue**
   ```bash
   kubectl get pods-A
   ```

---


---

## **Ejemplos de peticiones en postman y evidencias del sistema en funcionamiento**

![uso del endpoint Post de Aliemntos (Soap)](Capturas%20del%20sistema%20funcionando/Captura%20Post%20-%20Alimentos(Soap).png)

![uso del endpoint Get de Aliemntos (Soap)](Capturas%20del%20sistema%20funcionando/Captura%20Get%20-%20Alimentos(soap).png)

![uso del endpoint Post de Mesas (Rest a traves de soap)](Capturas%20del%20sistema%20funcionando/Captura%20Post%20-%20Mesas%20(Rest).png)

![uso del endpoint Get de Aliemntos (Rest a traves de soap)](Capturas%20del%20sistema%20funcionando/Captura%20Get%20-%20Mesas%20(Rest).png)

![so del endpoint Patch de Aliemntos (Rest)](Capturas%20del%20sistema%20funcionando/Captura%20Patch%20-%20Mesas%20(Rest).png)

Nota: Se pueden encontrar las imagenes de ejemplos de peticiones en postman y wsagger y las evidencias del sistama en uso en la carpeta "Capturas del sistema funcionando" dentro de este repositorio

---


---

 ## **Este Proyecto fue realizado por**  
    Martin Luna Rogel   Exp: 315410    Facultad de informatica UAQ