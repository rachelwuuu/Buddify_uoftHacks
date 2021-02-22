# Buddify
Find your best friends in a new environment!

## Inspiration
Have you had the experience of sitting at home feeling lonely?
The COVID-19 pandemic has forced a massive number of people into work-from-home scenarios. Many of us may have already got used to virtual offices and classrooms. Sometimes, our remote lifestyle makes our lives easier; however, there is one crucial part that is extremely difficult to replace: friendship.
In fact, studies have shown 4 in 10 adults in the U.S. have reported symptoms of anxiety or depressive disorder during the pandemic. Friendship can enrich your mental health! How to make friends remotely? Buddify is here to connect people and build friendships.

## What it does
Buddify is designed to help people make friends and connect with new people. Upon registration, the user is asked to provide some basic information, such as the current city, the home country, and a short introduction of himself / herself. Our machine learning algorithm will try to understand what the person is interested in by extracting keywords from the inputs and store them into the database. At the same time. the user can choose to answer some survey questions where another machine learning model will classify the user’s personality into one of the sixteen categories of MBTI according to their answers. The matching algorithm utilizes both the personality and interests information for finding another person with common interests. The user could choose to connect with the matched person and make friends.


## How we built it
Buddify’s front-end is built with Reactjs and the back-end is built with Reactjs and Nodejs. Graphql is used to communicate between front-end and back-end. The database for storing user information is built with Firebase. The Google Cloud server is set up to be responsible for all the computations.
In addition, we use two machine learning algorithms for matching our users. The first algorithm is to predict the personality of the user according to MBTI. A transformer is trained to learn the vocabularies and an XGBClassifier is trained to make the prediction from the user’s posts. The second algorithm we use is to find people with common interests. First, we utilize IBM Natural Language Processing API to extract keywords from the user’s self-introduction. Then these keywords are mapped into a high-dimensional space using a pertained GloVe embedding. Next we apply a clustering algorithm (HDBSCAN) in the embedding space to locate people with common interests according to these mapped keywords. Finally this information is combined with the MBTI pairing to provide the user with the matching result. 


## Challenges we ran into
Our matching algorithm highly relies on the machine’s understanding of the user’s self-introduction text and the posts. During the initial testing data collection phase, we found out that many of the posts contain wrong-spelling words or slang terms which are very challenging for the model to learn. Thus, we decided to use a robust NLP API to preprocess the input and extract the keywords of the user inputs. 


## Accomplishments 
We wanted to build something to help people connect with each other and we really think we have accomplished that with this project. Achieving this goal in the span of 36 hours was a huge accomplishment. In particular, our project featured machine learning, natural language processing, and cloud computing.


## What we learned
Our team learned how to use a react front end and integrate with a python backend server which was a really interesting challenge. We also read some papers on NLP and network building algorithms.


## What's next for Buddify
- Allow users to send private messages to each other
- Allow users to make a community and share stories

[Devpost](https://devpost.com/software/buddify)
[Demo](http://Buddify.online)
