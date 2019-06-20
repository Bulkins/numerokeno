from flask import Blueprint
from flask_restplus import Api
from .scores import ns as scores

blueprint = Blueprint('api', __name__)
api = Api(blueprint)
api.add_namespace(scores)

