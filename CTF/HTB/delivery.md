# Delivery - Easy Linux Box

## Reconnaissance

Initial Nmap scan revealed open ports 22 (SSH), 80 (HTTP), and 8065 (MatterMost):

```
# Nmap 7.94 scan initiated Tue Mar 4 10:15:22 2025
Host is up (0.087s latency).
Not shown: 998 closed tcp ports (conn-refused)
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 7.9p1 Debian
80/tcp open  http    nginx 1.14.2
8065/tcp open http    MatterMost
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
```

## Initial Access

The web server hosted a helpdesk application that allowed ticket creation. By creating a ticket, I received an email address that could be used to register on the MatterMost server.

### Exploiting the Helpdesk System

1. Created a ticket on the helpdesk portal
2. Received an email address: `ticket-XXXXX@delivery.htb`
3. Used this email to register on the MatterMost server
4. Received the verification email in the ticket thread
5. Found credentials in the internal "Internal" channel

## Privilege Escalation

Found user credentials in the MatterMost chat. The password hash was also being reused for the system user "maildeliverer".

```bash
ssh maildeliverer@10.10.10.222
# Enter discovered password
```

Root access was obtained by:

1. Finding a password hash in the MatterMost database
2. Cracking the hash with hashcat using a custom wordlist derived from "PleaseSubscribe!"
3. Using the cracked password to escalate to root

## Lessons Learned

1. Always check for password reuse across different services
2. Custom wordlists based on known password patterns can be very effective
3. Internal communication platforms often contain sensitive information