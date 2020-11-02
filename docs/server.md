# Server Setup

Setting up the server using an AWS Amazon Linux instance.

## Set up `//private/server.json`

```json
{
    "server": {
        "port": 3000,
        "cert_path": "/path/to/certs"
    },
    "pg": {
        "host": "cerebral-cereal.com",
        "port": 5432,
        "user": "postgres",
        "password": "postgres_password"
    },
    "session_secret": "session_secret"
}
```

## User Accounts

* `sudo visudo`
* Uncomment line that allows all members of wheel to sudo without a password.

```
## Same thing without a password
%wheel  ALL=(ALL)       NOPASSWD: ALL
```

```bash
sudo adduser chinnu
sudo usermod -a -G adm chinnu
sudo usermod -a -G wheel chinnu

sudo su chinnu
cd $HOME
mkdir .ssh
chmod 700 .ssh
```

* On your local machine, get the public key from the AWS generated `pem`.

```bash
ssh-keygen -y -f cerebral-cereal.pem
```

* Paste that into .ssh/authorized_keys on the remote server

```
touch .ssh/authorized_keys
chmod 600 .ssh/authorized_keys
```

* Test logging into the server as the newly created user:

```bash
ssh -i "cerebral-cereal.pem" chinnu@ec2-x-x-x-x.eu-west-2.compute.amazonaws.com
```

* Edit startup file, `.bashrc`, to setup environment variables:

```bash
export APP=/opt/cerebral-cereal/server
```

* Bootstrap variables: `source .bashrc`.

## NodeJS

[Guide](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-up-node-on-ec2-instance.html)

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash  # Download NVM
. ~/.nvm/nvm.sh  # Activate NVM
nvm install node  # Install latest version of Node
node -e "console.log('Running Node.js ' + process.version)"  # Test Node
```

##  Python3

```bash
sudo yum install python3
curl -O https://bootstrap.pypa.io/get-pip.py
python3 get-pip.py --user
```

## Git

* Clone repository:

```bash
sudo yum install git
cd /opt
sudo mkdir cerebral-cereal
sudo chown chinnu:chinnu cerebral-cereal
git clone https://github.com/mineshpatel1/cerebral-cereal.git

git config credential.helper store
git push
# Enter username
# Enter personal access token
```

* Install node modules:

```bash
cd $APP
npm install
```

## PostgreSQL 12

* Install the software using `yum`:

```bash
# Install
sudo yum update
sudo tee /etc/yum.repos.d/pgdg.repo<<EOF
[pgdg12]
name=PostgreSQL 12 for RHEL/CentOS 7 - x86_64
baseurl=https://download.postgresql.org/pub/repos/yum/12/redhat/rhel-7-x86_64
enabled=1
gpgcheck=0
EOF

sudo yum makecache
sudo yum install postgresql12 postgresql12-server
```

* Setup database (will auto-start/stop)

```bash
sudo /usr/pgsql-12/bin/postgresql-12-setup initdb
sudo systemctl enable --now postgresql-12

systemctl status postgresql-12  # Check status
```

* Setup password for postgres user

```bash
sudo su - postgres
psql -c "ALTER USER postgres WITH PASSWORD '<password>'"
```

* Find `postgres.conf` (e.g. in `/var/lib/pgsql/12/data`) and set `listen_addresses` to `*`.
* Find `pg_hba.conf` (e.g. in `/var/lib/pgsql/12/data`) and modify to change local
  and remote authentication rules:

```
local    all    all                     md5  # Optional to make local authentication password based
host     all    all     0.0.0.0/0       md5  # Allows remote connections to the database
host     all    all     127.0.0.1/32    md5  # Localhost connections should use password
host     all    all     ::1/128         md5  # Localhost connections should use password
```

* Restart the server:

```bash
sudo systemctl restart postgresql-12
sudo systemctl status postgresql-12
```

## Configure IP routing

* Routes HTTP/HTTPS web traffic directly to custom port:

```bash
sudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 3000
sudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 443 -j REDIRECT --to-port 3001
```

### Deleting Routes

```bash
sudo iptables -t nat -v -L PREROUTING -n --line-number  # View routes
sudo iptables -t nat -D PREROUTING <line_number>        # Delete specific route
```

## Web Server Management

* Install [`pm2`](https://www.npmjs.com/package/pm2): `npm install pm2 -g`

```bash
pm2 start $APP/app.js
pm2 log     # View live logs
pm2 status  # Status
pm2 monit   # Health monitoring
pm2 stop app
```

* Set up `systemd` to automatically start/stop the web server:

```bash
chmod u+x $APP/scripts/start.sh
chmod u+x $APP/scripts/stop.sh

sudo tee /etc/systemd/system/web-server.service<<EOF
[Unit]
Description=Web Server Manager
After=network.target

[Service]
Type=forking
User=$USER
LimitNOFILE=infinity
LimitNPROC=infinity
LimitCORE=infinity
Environment=PATH=$HOME/.vscode-server/bin/d2e414d9e4239a252d1ab117bd7067f125afd80a/bin:$HOME/.nvm/versions/node/$(node --version)/bin:/usr/local/bin:/usr/bin:/usr/local/sbin:/usr/sbin:$HOME/.local/bin:$HOME/bin:$HOME/.nvm/versions/node/$(node --version)/bin:/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin
Environment=APP=$APP
Environment=PM2_HOME=$HOME/.pm2
Environment=PM2=$(whereis pm2 | awk '{print $2}')
PIDFile=$HOME/.pm2/pm2.pid
Restart=on-failure

ExecStart=$APP/scripts/start.sh
ExecReload=$HOME/.nvm/versions/node/$(node --version)/bin/pm2 reload all
ExecStop=$APP/scripts/stop.sh

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable web-server

sudo systemctl status web-server
```

## Configure HTTPS with Let's Encrypt

* [Guide for AWS](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/SSL-on-an-instance.html#letsencrypt)
* [Guide for NodeJS](https://itnext.io/node-express-letsencrypt-generate-a-free-ssl-certificate-and-run-an-https-server-in-5-minutes-a730fbe528ca).

* Install Let's Encrypt:

```bash
cd $HOME
sudo wget -r --no-parent -A 'epel-release-*.rpm' http://dl.fedoraproject.org/pub/epel/7/x86_64/Packages/e/
sudo rpm -Uvh dl.fedoraproject.org/pub/epel/7/x86_64/Packages/e/epel-release-*.rpm
sudo yum-config-manager --enable epel*
sudo yum repolist all

sudo yum install -y certbot
```

* Make sure the web server is running and HTTP traffic is publicly accessible.
* Run `certbot` with automatic webroot installation, optionally using `--dry-run` to test.

```bash
sudo certbot certonly --webroot -w $APP -d cerebral-cereal.com
```

* Set group permissions on certificates:

```bash
sudo chown root:wheel -R /etc/letsencrypt/archive
sudo chmod 770 -R /etc/letsencrypt/archive
sudo chown root:wheel -R /etc/letsencrypt/live
sudo chmod 770 -R /etc/letsencrypt/live
```
