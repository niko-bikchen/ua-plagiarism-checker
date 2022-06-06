import os
from datetime import datetime
import hashlib
import uuid

import gdown

# from flask_cors import CORS
from flask import Flask, request, send_from_directory, make_response
from flask_pymongo import PyMongo
from fastapi.encoders import jsonable_encoder

from pymongo.collection import Collection

from models import UaText
from objectid import PydanticObjectId

from gensim.models import KeyedVectors
from sentence_transformers import SentenceTransformer

from text_preprocessing import process_texts, my_tokenizer
from utils import get_tf_idf_model, get_tokenizer, get_document_embeddings, get_model_scores

from constants import UBERCORPUS_LOWERCASED_LEMMATIZED

if not os.path.isfile(UBERCORPUS_LOWERCASED_LEMMATIZED):
    if not os.path.isdir('models'):
        os.mkdir('models')

    print(f"{datetime.utcnow()}: Downloading Word2Vec")

    url = 'https://drive.google.com/uc?id=1DOyPADJsEnd0zVBTDEBgKzf3d5DtuJOa'
    output = os.path.join(UBERCORPUS_LOWERCASED_LEMMATIZED)

    gdown.download(url, output, quiet=False)

print(f"{datetime.utcnow()}: Setting-up Word2Vec")

w2v_model = KeyedVectors.load_word2vec_format(
    os.path.abspath(UBERCORPUS_LOWERCASED_LEMMATIZED))

print(f"{datetime.utcnow()}: Setting-up BERT")

sbert_model = SentenceTransformer(
    'sentence-transformers/paraphrase-multilingual-mpnet-base-v2')

print(f"{datetime.utcnow()}: Setting-up Flask & PyMongo")

app = Flask(__name__)
app.config["MONGO_URI"] = os.getenv("MONGO_URI")

# CORS(app)

pymongo = PyMongo(app)

ua_texts_collection: Collection = pymongo.cx.ua_texts.texts

print(f"{datetime.utcnow()}: Done!")


def custom_error(data, status_code):
    return make_response(jsonable_encoder(data, exclude_none=True), status_code)


@app.route('/favicon.ico', methods=["GET"])
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'),
                               'favicon.ico', mimetype='image/x-icon')


@app.route('/', defaults={'path': ''}, methods=["GET"])
def get_index(path):
    return app.send_static_file('html/index.html')


@app.route('/compare/', methods=["POST"])
def compare_texts():
    raw_data = request.get_json()
    query_text = str(raw_data['text'])
    model = str(raw_data['model'])

    cursor = ua_texts_collection.find({}).sort("title")
    documents = [UaText(**doc) for doc in cursor]

    texts = [query_text] + [doc.text for doc in documents]
    slugs = [query_text] + [doc.slug for doc in documents]

    document_embeddings = []

    if model == 'word2vec':
        processed_texts = process_texts(texts)

        tfidfvectoriser = get_tf_idf_model(processed_texts, my_tokenizer)
        tokenizer = get_tokenizer(processed_texts)

        document_embeddings = get_document_embeddings(
            tfidfvectoriser, tokenizer, w2v_model, processed_texts)
    elif model == 'bert':
        unnorm_processed_texts = process_texts(texts, False)

        document_embeddings = sbert_model.encode(unnorm_processed_texts)
    else:
        return custom_error({'message': 'Model not found'}, 404)

    scores = get_model_scores(document_embeddings, slugs)

    scores['cosine_similarities']['similar'] = list(
        map(lambda item: list(map(str, item)), scores['cosine_similarities']['similar']))
    scores['euclidian_distances']['similar'] = list(
        map(lambda item: list(map(str, item)), scores['euclidian_distances']['similar']))

    return jsonable_encoder(scores, exclude_none=True)


@app.route("/texts/", methods=["POST"])
def new_text():
    raw_text = request.get_json()
    raw_text["date_added"] = datetime.utcnow()
    raw_text["slug"] = hashlib.sha256(
        (str(raw_text['text']) + str(raw_text['title']) + str(uuid.uuid4())).encode('utf-8')).hexdigest()

    text = UaText(**raw_text)
    insert_result = ua_texts_collection.insert_one(text.to_bson())
    text.id = PydanticObjectId(str(insert_result.inserted_id))

    print(text)

    return text.to_json()


@app.route("/texts/<string:slug>", methods=["GET"])
def get_text(slug):
    text = ua_texts_collection.find_one({"slug": slug})
    if text:
        return UaText(**text).to_json()
    else:
        return custom_error({'message': 'Text not found'}, 404)


@app.route("/texts/<string:slug>", methods=["DELETE"])
def delete_text(slug):
    deleted_text = ua_texts_collection.find_one_and_delete(
        {"slug": slug},
    )
    if deleted_text:
        return UaText(**deleted_text).to_json()
    else:
        return custom_error({'message': 'Text not found'}, 404)


@app.route("/texts/", methods=["GET"])
def list_texts():
    cursor = ua_texts_collection.find({}).sort("title")

    return {
        "texts": [UaText(**doc).to_json() for doc in cursor]
    }


@app.errorhandler(404)
def not_found(e):
    return app.send_static_file('html/index.html')
