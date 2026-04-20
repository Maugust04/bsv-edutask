from unittest.mock import MagicMock

import pytest

from src.controllers.usercontroller import UserController


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
class TestEmailValidation:
    def test_valid_email(self):
        # Arrange
        mock_dao = MagicMock()
        mock_dao.find.return_value = [{"email": "user@example.com", "name": "Alice"}]
        controller = UserController(dao=mock_dao)

        # Act
        result = controller.get_user_by_email("user@example.com")

        # Assert
        assert result == {"email": "user@example.com", "name": "Alice"}

    def test_invalid_email_missing_at(self):
        # Arrange
        mock_dao = MagicMock()
        controller = UserController(dao=mock_dao)

        # Act
        with pytest.raises(ValueError) as excinfo:
            controller.get_user_by_email("userexample.com")

        # Assert
        assert str(excinfo.value) == 'Error: invalid email address'
    
    def test_invalid_email_missing_domain(self):
        # Arrange
        mock_dao = MagicMock()
        controller = UserController(dao=mock_dao)
        
        # NOTE: This test fails due to a bug in the regex r'.*@.*'
        # Should be fixed to r'.+@.+\..+' to ensure that the 
        # domain part is not empty.
        # Act
        with pytest.raises(ValueError) as excinfo:
            controller.get_user_by_email("user@.com")

        # Assert
        assert str(excinfo.value) == 'Error: invalid email address'

    def test_invalid_email_missing_string(self):
        # Arrange - sets up the variables
        mock_dao = MagicMock()
        controller = UserController(dao=mock_dao)

        # Act - executes the function being tested
        with pytest.raises(ValueError) as excinfo:
            controller.get_user_by_email("")

        # Assert - checks the exception was raised with the correct message
        assert str(excinfo.value) == 'Error: invalid email address'
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
class TestUserRetrieval:
    def test_no_user(self):
        # Arrange
        mock_dao = MagicMock()
        mock_dao.find.return_value = []
        controller = UserController(dao=mock_dao)
        
        # NOTE: This test fails due to a bug in the code.
        # When no user is found, the code calls users[0] on an empty list
        # causing an IndexError instead of returning None as specified.
        # Act
        result = controller.get_user_by_email("nonexistent@example.com")

        # Assert
        assert result is None

    def test_one_user(self):
        # Arrange
        mock_dao = MagicMock()
        mock_dao.find.return_value = [{"email": "user@example.com", "name": "Alice"}]
        controller = UserController(dao=mock_dao)

        # Act
        result = controller.get_user_by_email("user@example.com")

        # Assert
        assert result == {"email": "user@example.com", "name": "Alice"}
    
    def test_multiple_users(self):
        # Arrange
        mock_dao = MagicMock()
        mock_dao.find.return_value = [
            {"email": "user@example.com", "name": "Alice"},
            {"email": "user@example.com", "name": "Bob"}
        ]
        controller = UserController(dao=mock_dao)

        # Act
        result = controller.get_user_by_email("user@example.com")

        # Assert
        assert result == {"email": "user@example.com", "name": "Alice"}

"""
try:
    users = self.dao.find({'email': email})
    ...
except Exception as e:
    raise
    
TC - 8: database operation fails

"""
class TestDatabaseOperation:
    def test_database_operation_fails(self):
        # Arrange
        mock_dao = MagicMock()
        mock_dao.find.side_effect = Exception("Database error")
        controller = UserController(dao=mock_dao)

        # Act
        with pytest.raises(Exception) as excinfo:
            controller.get_user_by_email("user@example.com")

        # Assert
        assert str(excinfo.value) == "Database error"