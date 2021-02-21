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
    result['message'] = 'Unable to verify user info'
    print(json.dumps(result))
    exit(-1)

# check and parse user data from server
user_data = verifyAccount(email=email, uid=uid)
if not user_data: error_return('Unable to verify user info')
# do the operation

# write back to the server

# print out 
print("DONE")