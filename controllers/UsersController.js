import sha1 from 'sha1';
import { ObjectId } from 'mongodb';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class UsersController {
  static async postNew(req, res) {
    const { email } = req.body;
    const { password } = req.body;
    if (!email) {
      res.status(400).json({ error: 'Missing email' });
      return;
    }
    if (!password) {
      res.status(400).json({ error: 'Mising password' });
      return;
    }
    const users = dbClient.usersCollection;
    users.findOne({ email }, (err, user) => {
      if (user) {
        res.status(400).json({ error: 'Already exists' });
      } else {
        const hashedPassword = sha1(password);
        users.insertOne(
          {
            email,
            password: hashedPassword,
          },
        ).then((result) => {
          res.status(201).json({ id: result.insertedId, email });
        }).catch((error) => console.log(error));
      }
    });
  }
}

module.exports = UsersController;
