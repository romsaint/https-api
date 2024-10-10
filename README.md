This is my first major project using the https protocol instead of http. 
In this project I am using technologies such as: Postgre sql database, 
Redis for data caching and blocking, I also use nginx as a proxy server and load balancer.
This project uses 3 microservices on TCP protocol. 
Also react is connected to this server. 
Server and load balancer servers work on 5000, 5001, 5002 ports respectively,
microservices work on 3001, 3002, 3003 ports, react application on 3000 port.
