from flask import Flask
from api import blueprint as api
from models import db
from flask_socketio import SocketIO

app = Flask(__name__)

def create_socketio():
    app.config['SECRET_KEY'] = 'markoOnParas'
    app.config['MONGODB_SETTINGS'] = {
        'db': 'test',
        'host': 'localhost',
        'port': 27017
    }
    db.init_app(app)
    app.register_blueprint(api, url_prefix='/api')
    socketio = SocketIO(app)
    return socketio


if __name__ == '__main__':
    socketio = create_socketio()
    socketio.run(app, debug=True)
