from ibm_watson import NaturalLanguageUnderstandingV1
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator
from ibm_watson.natural_language_understanding_v1 import Features
from ibm_watson import ApiException

import torch
import torchtext
import numpy as np

from sklearn.cluster import KMeans
import hdbscan
import yaml
from typing import List

import pathlib


def print_closest_words(glove, vec, n=5):
    dists = torch.norm(glove.vectors - vec, dim=1)     # compute distances to all words
    lst = sorted(enumerate(dists.numpy()), key=lambda x: x[1]) # sort by distance
    for idx, difference in lst[1:n+1]: 					       # take the top n
        print(glove.itos[idx], difference)


def _random_gen_words():
    with open(f'{pathlib.Path(__file__).parent.absolute()}word-1000.txt','r') as f:
        words = f.read()
    return words.split('\n')


glove = torchtext.vocab.GloVe(name="6B",  # trained on Wikipedia 2014 corpus
                              dim=50,
                              cache=f'{pathlib.Path(__file__).parent.absolute()}/.vector_cache')  # embedding size = 100

api_ = yaml.safe_load(open(f'{pathlib.Path(__file__).parent.absolute()}/api_key/ibm.yaml', 'r'))
_simulate_data = False

if _simulate_data:

    _url = 'https://docs.google.com/document/d/e/2PACX-1vSF0e_dE_8k_MpGwVSMyLFO37KXjL0OwM2w-8BAnV1bOh9W8QzlyL1xredJheGOoeHaRMszxAGKXV7O/pub'

    _mode = 'keywords'

    _text = ['During my high school, I’m part of the computer science club, organizing programming contests for junior students.', \
    'I like to play bball during my free time.', \
    'Favourite food is dumplings.']

    total_num_user = 100
    uids = np.arange(total_num_user)
    uids = uids.astype(str)

    words = _random_gen_words()

    # data = np.random.rand(3*total_num_user, 50)

    data = np.empty((0, 50))
    for _ in range(total_num_user*3):
        rand_word = np.random.choice(words, 1)
        rand_emb = glove[rand_word.item()].unsqueeze(0).numpy()
        data = np.vstack((data, rand_emb))



    print('done simulating data')
    print('data shape: ', data.shape)


def text_to_feat(text: List[str], mode: str = 'keywords'):
    '''
    Input Argument 1: str (their response)
    Input Argument 2: str (mode: keywords, concepts)
    Output 1: bool (error status)
    Output 2: np.ndarray (3, D) user feature
    '''

    err = False

    combined_str = ' '.join(text)
    results = {
        # "entities": {},
        "keywords": {},
        "concepts": {}
    }

    features = Features().from_dict(results)

    authenticator = IAMAuthenticator(api_['key'])
    natural_language_understanding = NaturalLanguageUnderstandingV1(
        version='2020-08-01',
        authenticator=authenticator
    )

    natural_language_understanding.set_service_url(
        'https://api.us-south.natural-language-understanding.watson.cloud.ibm.com/instances/ff8e9411-0684-4d2e-855c-d90faab4d68b')

    # try:
    info = natural_language_understanding.analyze(
        # url=url,
        text=combined_str,
        features=features).get_result()
    # except ApiException:
    #     print("ApiException")
    #     err = True

    centres = None
    if not err:
        concepts = []

        for entry in info[mode]:
            # concepts.append(entry['text'])
            concepts += [c.lower() for c in entry['text'].split()]

        concepts = list(set(concepts))
        # print(concepts)

        word_emb = []
        for c in concepts:
            word_emb.append(glove[c].cpu().numpy())

        word_emb = np.asarray(word_emb)
        kmeans = KMeans(n_clusters=3).fit(word_emb)

        # c0_names = np.asarray(concepts)[kmeans.labels_ == 0]
        # c1_names = np.asarray(concepts)[kmeans.labels_ == 1]
        # c2_names = np.asarray(concepts)[kmeans.labels_ == 2]



        centres = kmeans.cluster_centers_  # (3, 50)

    return err, centres



def find_matching(data: np.ndarray, uids: np.ndarray, cur_id: str):
    '''
    Input Argument 1: user feature data, each with 3 features (N*3, D)
    Input Argument 2: uid (N,)
    Input Argument 3: current user id (str)

    Output 3: matched buddy uid (str)
    '''

    uid_rp = np.repeat(uids, 3)

    clusterer = hdbscan.HDBSCAN(min_cluster_size=2)
    cluster_labels = clusterer.fit_predict(data)

    matched_grp = cluster_labels[uid_rp == cur_id]

    if (matched_grp != -1).sum() == 0:  # unable to find
        # random
        if cluster_labels.max() == 0 or cluster_labels.max() == -1:
            random_grp = -1
        else:
            random_grp = np.random.choice(cluster_labels.max(), 1)
    else:
        random_grp = np.random.choice(matched_grp[matched_grp != -1], 1)

    matched_buddies = uid_rp[cluster_labels == random_grp]

    # don't find self
    if (matched_buddies != cur_id).sum() == 0:  # unable to find
        # random
        matched_uid = np.random.choice(uids, 1)
    else:
        matched_uid = np.random.choice(matched_buddies[matched_buddies != cur_id], 1)


    # matched_uid = np.random.choice(matched_buddies, 1)

    print('assigned group: ', matched_grp)
    print('chosen group: ', random_grp)
    print('total # users in the group', matched_buddies.shape[0])
    print('matched buddies: ', matched_buddies)
    print('matched uid: ', matched_uid)

    return matched_uid

if __name__ == '__main__':

    '''
    assume N number of registered users

    func 1: user text to feature
    Input Argument 1: str (their response)
    Input Argument 2: str (mode: keywords, concepts)
    Output 1: bool (error status)
    Output 2: np.ndarray (3, D) user feature

    func 2: find buddy
    Input Argument 1: user feature data, each with 3 features (N*3, D)
    Input Argument 2: uid (N,)
    Input Argument 3: current user id (str)

    Output 3: matched buddy uid (str)
    '''



    err, feats = text_to_feat(text=_text, mode=_mode)

    if err:
        quit()

    uid = '34'

    matched_id = find_matching(data=data, uids=uids, cur_id=uid)









