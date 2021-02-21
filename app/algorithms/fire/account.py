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

def getAccount(email=False):
    if email != False:
        try:
            doc = db.collection(u'users').document(email).get()
            data = doc.to_dict()
            if doc.id == email:
                return data
        except :
            pass
    else:
        try:
            docs = db.collection(u'users').stream()
            data = []
            for doc in docs:
                data.append(doc.to_dict())
            return data
        except :
            pass
    
    return []

def updateAccount(email, field):
    if email != False:
        try:
            db.collection(u'users').document(email).set(
                field,
                merge=True
            )
            return True
        except:
            pass
    return False