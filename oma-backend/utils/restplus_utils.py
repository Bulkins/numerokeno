from flask_restplus import fields, abort
from flask_restplus.inputs import datetime_from_iso8601
from bson.objectid import ObjectId
from mongoengine import base as me_base
from mongoengine import fields as me_fields
from mongoengine.base.datastructures import LazyReference
from mongoengine.errors import FieldDoesNotExist

def merge(document, data_dict):
    def field_value(field, value):
        if field.__class__ in (me_fields.ListField, me_fields.SortedListField):
            return [
                field_value(field.field, item)
                for item in value
            ]
        if field.__class__ in (
                me_fields.GenericEmbeddedDocumentField,
                me_fields.GenericReferenceField
        ):
            return field.document_type(**value)
        elif field.__class__ in (
                me_fields.EmbeddedDocumentField,
                me_fields.ReferenceField,) and value is not None:
            f = field.document_type(**value) 
            return merge(f, value)
        elif field.__class__ == me_fields.DateTimeField and isinstance(value, str):
            return datetime_from_iso8601(value)
        else:
            return value

    [setattr(
        document, key,
        field_value(document._fields[key], value)
    ) for key, value in data_dict.items()]
    return document


class ObjectIdField(fields.String):

    def __init__(self, *args, **kwargs):
        self.__schema_type__ = 'string'
        self.__schema_format__ = 'ObjectId'
        self.__schema_example__ = '000000000000000000000000'
        self.enum = kwargs.pop('enum', None)
        self.discriminator = kwargs.pop('discriminator', None)
        super(ObjectIdField, self).__init__(*args, **kwargs)
        self.required = self.discriminator or self.required

    def format(self, value):
        try:
            if isinstance(value, ObjectId):
                return fields.text_type(value)
            elif isinstance(value, dict) and '$oid' in value:
                return fields.text_type(value['$oid'])
            elif isinstance(value, str):
                return value
        except ValueError as ve:
            raise fields.MarshallingError(ve)


class LazyReferenceField(ObjectIdField):
    def format(self, value):
        if isinstance(value, LazyReference):
            return super().format(value.pk)

'''
class JSONField(fields.Raw):
    def output(self, key, obj, **kwargs):
        if isinstance(obj, list):
            for o in obj:
                return json.loads(o.to_json())
        if key in obj:
            return json.loads(obj[key].to_json())
'''


class RestplusModelGenerator(object):

    _fieldmap = (
        (me_fields.StringField, fields.String,),
        (me_fields.IntField, fields.Integer,),
        (me_fields.BooleanField, fields.Boolean,),
        (me_fields.LongField, fields.Integer,),
        (me_base.fields.ObjectIdField, ObjectIdField,),
        (me_fields.DateTimeField, fields.DateTime,),
        (me_fields.FloatField, fields.Float,),
        (me_fields.DecimalField, fields.Float,),
        (me_fields.ListField, fields.List,),
        (me_fields.EmbeddedDocumentField, fields.Nested,),
        (me_fields.ReferenceField, fields.Nested,),
        (me_fields.LazyReferenceField, LazyReferenceField,),
        (me_fields.DynamicField, fields.Raw)
    )

    @staticmethod
    def _get_restplus_field(field, api):
        mongoengine_field_type = type(field)
        rp_field_type = None
        for me_field, rp_field in RestplusModelGenerator._fieldmap:
            if mongoengine_field_type == me_field:
                rp_field_type = rp_field
                break

        if rp_field_type is fields.Nested:
            nested_class = field.document_type_obj
            nested_classname = nested_class.__name__
            if nested_classname not in api.models:
                RestplusModelGenerator.from_mongoengine(nested_class, api)
            nested_model = api.models[nested_classname]
            rp_field_type = rp_field_type(nested_model, allow_null=True)
        elif rp_field_type is fields.List:
            of = RestplusModelGenerator._get_restplus_field(field.field, api)
            rp_field_type = fields.List(of)
        return rp_field_type

    @staticmethod
    def from_mongoengine(mongoengine_model, api):
        mongoengine_classname = mongoengine_model.__name__
        restplus_model = api.models.get(mongoengine_classname)
        if restplus_model is None:
            field_definition = {}

            for (field_name, field) in mongoengine_model.__dict__['_fields'].items():
                field_definition[field_name] = RestplusModelGenerator._get_restplus_field(field, api)
            restplus_model = api.model(mongoengine_classname, field_definition)
        return restplus_model


def valid_object_or_400(model_class, json_dict):
    try:
        m = model_class()
        merge(m, json_dict)
        m.validate()
        return m
    except FieldDoesNotExist as e:
        abort(400, e)

