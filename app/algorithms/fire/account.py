from fire.firebaseDB import fire, db

def verifyAccount(email, uid):

    try:
        doc = db.collection(u'users').document(email).get()
        data = doc.to_dict()
        if doc.id == email and data['uid'] == uid:
            return data

    except :
        pass
    
    return False
