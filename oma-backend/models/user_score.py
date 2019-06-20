from . import db

class UserScore(db.Document):
    user = db.StringField(required=True, unique=True)
    score = db.IntField(required=True)

    meta = {
        "collection": "scores"
    }