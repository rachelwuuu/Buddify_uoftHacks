
from nlp.nlp_algs import find_matching
from nlp.nlp_algs import text_to_feat
from fire.account import getAccount
import json
import numpy as np

"""
    return False if errors occur
"""
def reshape1x150str(feature):
    try:
        data = (';'.join([str(x) for x in feature.reshape(-1)]))
        # print(data)
        return data
    except:
        pass
    return []
    
def parse3x50float(data):
    if not data: 
        return np.array([])
    try:
        float1x150 = [float(x) for x in data.split(';')]
        feature = np.array(float1x150)
        feature = feature.reshape(3, 50)
        return feature
    except:
        pass
    return np.array([])

def opAnalyze(email):
    try:
        user_account = getAccount(email)
        texts = [user_account['intro']['headline'],
                user_account['intro']['about']]
        err, feats = text_to_feat(texts)
        return not err, feats
    except:
        pass
    return False, []

def opMatch(email):
    # try:
    user_account = getAccount(email)
    all_accounts = getAccount()

    user_features = parse3x50float(user_account['embeddings'])
    if len(user_features) < 3:
        return False, []
    featureList = []
    emailList = []
    for account in all_accounts:
        if not 'embeddings' in account or len(account['embeddings']) < 300: continue
        
        features = parse3x50float(account['embeddings'])
        if len(features) < 3: continue
        emailList.append(account['email'])
        featureList = features if len(featureList) < 3 else np.concatenate((featureList, features))
    print(emailList)
    print(featureList)
    print(featureList.shape)
    
    if emailList and len(emailList) > 0:
        mid = find_matching(featureList, emailList, email)
        for account in all_accounts:
            if account['email'] == mid:
                return True, account

    # except:
    #     pass
        
    return False, []

