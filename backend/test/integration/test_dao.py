import pytest
import pymongo.errors

from src.util.dao import DAO


@pytest.fixture
def dao():
    test_dao = DAO('user')
    yield test_dao
    test_dao.drop()


VALID_USER = {
    'firstName': 'Walter',
    'lastName': 'White',
    'email': 'w.white@graymatter.com'
}


class TestCreateRequiredFields:
    def test_all_required_fields_succeeds(self, dao):
        result = dao.create(VALID_USER)
        assert result is not None
        assert result['firstName'] == 'Walter'
        assert result['lastName'] == 'White'
        assert result['email'] == 'w.white@graymatter.com'
        assert '_id' in result

    def test_missing_firstname_raises(self, dao):
        data = {'lastName': 'Pinkman', 'email': 'jesse@pinkman.com'}
        with pytest.raises(pymongo.errors.WriteError):
            dao.create(data)

    def test_missing_lastname_raises(self, dao):
        data = {'firstName': 'Jesse', 'email': 'jesse@pinkman.com'}
        with pytest.raises(pymongo.errors.WriteError):
            dao.create(data)

    def test_missing_email_raises(self, dao):
        data = {'firstName': 'Jesse', 'lastName': 'Pinkman'}
        with pytest.raises(pymongo.errors.WriteError):
            dao.create(data)


class TestCreateTypeConstraints:
    def test_wrong_type_firstname_raises(self, dao):
        data = {'firstName': 62, 'lastName': 'Goodman', 'email': 'saul@bettercallsaul.com'}
        with pytest.raises(pymongo.errors.WriteError):
            dao.create(data)

    def test_wrong_type_email_raises(self, dao):
        data = {'firstName': 'Hank', 'lastName': 'Schrader', 'email': True}
        with pytest.raises(pymongo.errors.WriteError):
            dao.create(data)


class TestCreateUniqueItems:
    def test_duplicate_email_raises(self, dao):
        dao.create(VALID_USER)
        with pytest.raises(pymongo.errors.WriteError):
            dao.create(VALID_USER)


class TestCreateOptionalFields:
    def test_with_optional_tasks_field_succeeds(self, dao):
        data = {
            'firstName': 'Mike',
            'lastName': 'Ehrmantraut',
            'email': 'mike@los-pollos.com',
            'tasks': []
        }
        result = dao.create(data)
        assert result is not None
        assert result['tasks'] == []
