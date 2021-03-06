from flask import Flask
from Routes.getdata import getdata_api
from Routes.getone import getone_data
from Routes.create import create_data_api
from Routes.remove import remove_api
from Routes.change import change_api
from Routes.update import update_api


app = Flask(__name__)

app.register_blueprint(getone_data)
app.register_blueprint(getdata_api)
app.register_blueprint(create_data_api)
app.register_blueprint(remove_api)
app.register_blueprint(change_api)
app.register_blueprint(update_api)

app.run(debug=True, use_reloader=False, port=1000)
