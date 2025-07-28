### 1. Too many errors
- What I check: I count how many `error` level logs I get in a short time (for example, in one minute). If I get too many, like more than 10, system will send an alert

-  Because: Many errors mean something is very broken. Maybe one of my microservices is down, or I have a serious bug. I need to fix this very fast



### 2. API is slow (High Latency)
-  What I check: I measure how long it takes for my API to respond. If it takes more than 1 second, for example, I will send an alert
-  Because: Users do not like slow apps. If my app is slow, users might leave. It can also be a sign that my server is too busy or has a problem.



### 3. Too many server errors (5xx)
-   What I check: I count how many server errors (like 500 or 503) my API gives. If the number of these errors is high, I will send an alert
-   Because: Its mean that my server has a serious problems. It is a critical issue. It means users cannot use my app at all



### 4. Cache is not working well
- What I check: I check my cache hit ratio. A "hit" means I found data in the cache. A "miss" means I did not. If the number of hits is much lower than misses, I will send an alert.
- Because: if it's not working well, my app becomes slower and puts more load on my database. This can lead to bigger problems