# Taiwan Campground Website: A Simple Small Project

<img src="">

## Setting up the Environment for windows
To set up your sql environment

### Setting up the SQL server
#### Step 1. Download the docker desktop for windows
https://www.docker.com/products/docker-desktop/

#### Step 2. Pull the Microsoft SQL server container
```shell
sudo docker pull mcr.microsoft.com/mssql/server:2022-latest
```

### Step 3
```shell
sudo docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=<YourStrong@Passw0rd>" \
   -p 1433:1433 --name sql1 --hostname sql1 \
   -d \
   mcr.microsoft.com/mssql/server:2022-latest
```
**Authors:** 
