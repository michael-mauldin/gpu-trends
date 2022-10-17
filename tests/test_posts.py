from datetime import datetime
import unittest

from src.postdb.posts import get_yesterday


class TestPostDB(unittest.TestCase):
    def test_get_yesterday(self):
        self.assertIsInstance(get_yesterday(), datetime)


if __name__ == '__main__':
    unittest.main()