from wrappers.operations import reshape1x150str
from fire.account import updateAccount
from wrappers.operations import opAnalyze, opMatch
from fire.account import verifyAccount
import sys
import argparse
import json

parser = argparse.ArgumentParser(
    description='Backend application for analyze and match people')

# required args
parser.add_argument('email', type=str, help="User email")
parser.add_argument('uid', type=str, help="User uid (for verification")

#optional args
parser.add_argument('-P', '--policy', default='', type=str)
parser.add_argument('-O', '--operation', choices=['analyze', 'match', 'both'], default='both', type=str,
                    help="Select operation from [analyze|match|both]")

args = parser.parse_args()

operation = args.operation
email = args.email
uid = args.uid
policy = args.policy
try:
    policy = json.loads(policy)
except:
    policy = {'policy': policy}

print(f"Executing {operation} for user {email}:{uid} with policy {policy}")

# result states
result = {
    "state": 'successful'
}
def error_return(msg):
    result['state'] = 'failed'
    result['message'] = msg
    print(json.dumps(result))
    exit(-1)

# check and parse user data from server
if not verifyAccount(email=email, uid=uid): error_return('Unable to verify user info')

# do the operation
if operation == 'analyze' or operation == 'both':
    passed, feature = opAnalyze(email=email)
    if not passed: error_return("Unable to get embeddings")
    data = reshape1x150str(feature)

    if not updateAccount(email, {'embeddings': data}):
        error_return("Unable to save embeddings")

if operation == 'match' or operation == 'both':
    passed, matchedUsers = opMatch(email=email)
    if not passed: error_return("Unable to perform matching")

    if not updateAccount(email, {'matched': [matchedUsers['email']]}):
        error_return("Unable to save matched users")
    

# print out 
print("DONE")