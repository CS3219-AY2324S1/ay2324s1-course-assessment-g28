## RMQ operation

Receives RMQ messages over the `pairing_requests` queue.
Each pairing request should follow the structure:

```json
{
  "user": "some_user_string"
}
```
