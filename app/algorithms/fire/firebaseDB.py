import firebase_admin
from firebase_admin import credentials, firestore
import pathlib

from google import auth

cred = credentials.Certificate(f"{pathlib.Path(__file__).parent.absolute()}/../../secrets/Buddies-d64f7ad8be53.json")
fire = firebase_admin.initialize_app(cred)

db = firestore.client()