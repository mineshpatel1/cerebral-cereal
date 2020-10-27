# Server Setup

Setting up the server using an AWS Amazon Linux instance.

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
local    all    all               md5  # Optional to make local authentication password based
host     all    all   0.0.0.0/0   md5  # Allows remote connections to the database
```

* Restart the server:

```bash
sudo systemctl restart postgresql-12
sudo systemctl status postgresql-12
```

