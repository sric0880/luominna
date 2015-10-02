#Usage
```
python manage.py makemigrations picture
python manage.py sqlmigrate picture 0001
python manage.py migrate
python manage.py collectstatic
sh startup_uwsgi.sh # service uwsgi must be available
sodu service nginx start # nginx sites-enabled softlink to luominna_nginx.conf

curl www.luominna.com
```
How to config nginx and uwsgi, see [基于nginx和uWSGI在Ubuntu上部署Django](http://www.jianshu.com/p/e6ff4a28ab5a)

How to config uwsgi as a service, see [uWSGI won't reload, restart or let me run service](http://stackoverflow.com/questions/23073829/uwsgi-wont-reload-restart-or-let-me-run-service)

#Related resources
* [Django](https://www.djangoproject.com/download/)
* [Nginx](nginx.org/en/)
* [uWsgi](https://uwsgi-docs.readthedocs.org/en/latest/)
* [tag-it](https://github.com/sric0880/tag-it)
* [jQuery-File-Upload](https://blueimp.github.io/jQuery-File-Upload/)
* [jQuery-ui-1.11.4](https://jqueryui.com/)
* [Upyun](https://www.upyun.com/index.html)
* [SparkMD5](https://github.com/satazor/SparkMD5)
* [Bootstrap](http://v3.bootcss.com/)
* [masonry](https://github.com/desandro/masonry)
* [imagesloaded](http://imagesloaded.desandro.com/)
* [fortawesome](https://fortawesome.github.io/Font-Awesome/)
* [flickity](http://flickity.metafizzy.co/)
