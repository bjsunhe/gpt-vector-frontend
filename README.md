## install mongodb

curl -fsSL https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -

echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list

sudo apt update

sudo apt install mongodb-org

sudo systemctl start mongod.service

sudo systemctl status mongod


### config mongodb
sudo nano /etc/mongod.conf

sudo systemctl restart mongod


## install git

sudo apt update

sudo apt install git


## install node 18

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash

export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm



nvm install 18


## git clone


https://github.com/bjsunhe/api-template.git

npm i


## config .env

nano .env


## run

node -r dotenv/config app.js




## nginx

sudo apt update
sudo apt install nginx

sudo systemctl status nginx

sudo mkdir -p /var/www/atmo/html

sudo chown -R $USER:$USER /var/www/atmo/html

sudo chmod -R 755 /var/www/atmo

# sudo nano /var/www/atmo/html/index.html

cd /var/www/atmo/html/
git clone  https://github.com/bjsunhe/gpt-vector-frontend.git
nano .env
npm i
npm run build
cp -r * ../../


sudo nano /etc/nginx/sites-available/atmo

server {
        listen 8080;
        listen [::]:8080;

        root /var/www/atmo/html;
        index index.html index.htm index.nginx-debian.html;

        # server_name your_domain www.your_domain;

        location / {
                try_files $uri $uri/ =404;
        }
}


sudo ln -s /etc/nginx/sites-available/atmo /etc/nginx/sites-enabled/

sudo nano /etc/nginx/nginx.conf

http {
    ...
    server_names_hash_bucket_size 64;
    ...
}

sudo nginx -t

sudo systemctl restart nginx
sudo systemctl status nginx

