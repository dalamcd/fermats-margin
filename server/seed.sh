#!/bin/bash

rm -rf fermat_server/fermatapi/migrations
rm db.sqlite3
python3 manage.py makemigrations fermatapi
python3 manage.py migrate
python3 manage.py loaddata symbols
python3 manage.py loaddata categories
python3 manage.py loaddata symbolCategories
python3 manage.py loaddata users
python3 manage.py loaddata tokens