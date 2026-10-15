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
FROM tomcat:10.1-jdk25-temurin

# Remove default Tomcat apps
RUN rm -rf /usr/local/tomcat/webapps/*

# Deploy WAR as ROOT (app served at /)
COPY --from=build /app/target/server-1.0-SNAPSHOT.war \
    /usr/local/tomcat/webapps/ROOT.war

# Copy .env so PaymentService's Dotenv can read BANK_ID / BANK_ACCOUNT /
# SEPAY_WEBHOOK_TOKEN (looked up in the current directory at runtime).
COPY .env.production /usr/local/tomcat/.env

# Listen on Render's $PORT when provided, otherwise the Tomcat default 8080
EXPOSE 8080
CMD sed -i "s/port=\"8080\"/port=\"${PORT:-8080}\"/" conf/server.xml && exec catalina.sh run
