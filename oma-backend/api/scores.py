from flask_restplus import Namespace, Resource, fields
from flask import request
from models.user_score import UserScore
from werkzeug.exceptions import BadRequest
from utils.restplus_utils import valid_object_or_400

ns = Namespace('scores', description='High scores')

score_model = ns.model('UserScore', {
    'user': fields.String,
    'score': fields.Integer
})

@ns.route('/')
class HighScores(Resource):
    @ns.marshal_with(score_model)
    @ns.doc('Get high scores')
    def get(self):
        """ Get high scores """
        return list(UserScore.objects().order_by('-score'))

    @ns.response(200, 'Created')
    @ns.response(400, 'Bad request')
    @ns.expect(score_model)
    @ns.marshal_with(score_model)
    @ns.doc('Create score for user')
    def post(self):
        """ Create score for user """
        score = valid_object_or_400(UserScore, ns.payload)
        score.save()
        return score

    @ns.response(204, 'Updated')
    @ns.response(400, 'Bad request')
    @ns.expect(score_model)
    @ns.marshal_with(score_model)
    @ns.doc('Update score for user')
    def put(self):
        """ Update score for user """
        new_score = valid_object_or_400(UserScore, ns.payload)
        score_old = UserScore.objects.get_or_404(user=new_score.user)
        if score_old.score < new_score.score:
            score_old.score = new_score.score
            score_old.save()
            return 'Score updated', 204
        else:
            return 'Score is less than previous score', 204

@ns.route('/<string:userId>/')
class UserHighScore(Resource):
    @ns.response(204, 'Deleted')
    @ns.response(400, 'Bad request')
    @ns.marshal_with(score_model)
    @ns.doc('Remove score from user')
    def delete(self, user_id):
        """ Remove score from user """
        score_old = UserScore.objects.get_or_404(user=user_id)
        score = valid_object_or_400(UserScore, ns.payload)
        score.delete()
        return 'Score deleted', 204