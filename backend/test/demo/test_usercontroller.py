import pytest
import json, os

"""
Unit test for the UserController class.

Mocking with Magic mocking allows us to replace parts of our system under test with mock objects and make
assertions about how they have been used. This is useful for testing the UserController class in isolation,

"""

"""
if not re.fullmatch(emailValidator, email):
    raise ValueError('Error: invalid email address')

TC - 1: valid email address
TC - 2: invalid email address missing @
TC - 3: invalid email address missing domain
TC - 4: Missing string
"""

"""
if len(users) == 1:
    return users[0]
else:
    print(f'Error: more than one user found with mail {email}')
    return users[0]

TC - 5: no user    
TC - 6: one user 
TC - 7: more than one user

"""

"""
try:
    users = self.dao.find({'email': email})
    ...
except Exception as e:
    raise
    
TC - 8: database operation fails

"""
