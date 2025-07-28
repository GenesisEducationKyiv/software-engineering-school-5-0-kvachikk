### How i keep my logs

This is my policy for logs. Its important to know how long i store them, so i don't run out of space
Also for privacy rules like GDPR


### Info and Debug Logs
- What I do: I keep these logs for 7 days. Then my system just delete them automatically
- Why: These logs are very big and have a lot of text. I only need them for a quick check if something is not working right now. so one week is enough. this saves much space



### Warning Logs
- What I do: i keep these for 30 days.  after that, they are deleted.
- Why: warnings are more serious. i might want to check them for a whole month to see if a problem is growing. so 30 days is a good period



### Error Logs
- What I do:  Error logs are very important. So i keep them for 90 days in my main system for fast access.  After 90 days, i move them to an archive, like a cold storage. I will keep them there for 1 year
- Why: i need error logs to understand and fix big problems in my app. sometimes i need to look at very old errors.  Archiving is cheaper, and one year is good for looking back.




### User data logs (GDPR stuff)
- What I do: some logs have user information (log context), like an IP address or names, so this is personal data. for GDPR i must be careful. I keep this data for 180 days for security reasons. after 180 days, my script will remove the personal data from the logs, or make it anonymous.
- Why: i have to protect user privacy, it is the law.  but i also need this data to check for security issues, like if someone is trying to hack the system. so 180 days is a good compromise.
