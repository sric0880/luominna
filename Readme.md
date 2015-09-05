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

#Related resources
* [Django](https://www.djangoproject.com/download/)
* [Nginx]()
* [uWsgi](https://uwsgi-docs.readthedocs.org/en/latest/)
* [tag-it](https://github.com/sric0880/tag-it)
* [jQuery-File-Upload](https://blueimp.github.io/jQuery-File-Upload/)
* [jquery-ui-1.11.4](https://jqueryui.com/)
* [upyun](https://www.upyun.com/index.html)
* [SparkMD5](https://github.com/satazor/SparkMD5)
