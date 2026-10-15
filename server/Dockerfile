# =========================
# 1. BUILD
# =========================
FROM maven:3.9-eclipse-temurin-25 AS build

WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN mvn clean package -DskipTests


# =========================
# 2. RUNTIME - TOMCAT 10
# =========================
FROM tomcat:10.1-jdk25

WORKDIR /usr/local/tomcat

# Remove default Tomcat apps
RUN rm -rf webapps/*

# Deploy WAR as ROOT
COPY --from=build /app/target/server-1.0-SNAPSHOT.war \
    webapps/ROOT.war

# Copy current .env into container
COPY .env /app/.env

EXPOSE 8080

CMD ["catalina.sh", "run"]