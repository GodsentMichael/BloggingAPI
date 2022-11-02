# BloggingAPI

A Blog API Project, with supercool😎 standard features like that of hashnode and medium💪.
---
## Requirements
1.	The blog should have a first_name, last_name, email, password, (you can add other attributes you want to store about the user)
2.	A user should be able to sign up and sign in into the blog app
3.	Users Use JWT as authentication strategy and expire the token after 1 hour
4.	A blog can be in two states; draft and published
5.	Logged in and not logged in users should be able to get a list of published blogs created
6.	Logged in and not logged in users should be able to to get a published blog
7.	Logged in users should be able to create a blog.
8.	When a blog is created, it is in draft state
9.	The owner of the blog should be able to update the state of the blog to published
10.	The owner of a blog should be able to edit the blog in draft or published state
11.	The owner of the blog should be able to delete the blog in draft or published state
12.	The owner of the blog should be able to get a list of their blogs. 
a.	The endpoint should be paginated
b.	It should be filterable by state
13.	Blogs created should have title, description, tags, author, timestamp, state, read_count, reading_time and body.
14.	The list of blogs endpoint that can be accessed by both logged in and not logged in users should be paginated, 
a.	default it to 20 blogs per page. 
b.	It should also be searchable by author, title and tags.
c.	It should also be orderable by read_count, reading_time and timestamp
15.	When a single blog is requested, the api should return the user information with the blog. The read_count of the blog too should be updated by 1
16.	Come up with any algorithm for calculating the reading_time of the blog.
17. Write tests for your Endpoints.
---
## Setup
- Install NodeJS, mongodb
- pull this repo
- update env with example.env
- run `npm run start:dev`
---
## Base URL
- somehostsite.com
- https://www.heroku.com/free
---
## Models
---
 ### User
| field  |  data_type | constraints  |
|---|---|---|
|  id |  string |  required |
|  firstname | string  |  optional|
|  lastname  |  string |  optional  |
|  email     | string  |  optional |
|  password  | string |  required  |
|  blogPost  | array  |  ref: posts|
| timestamps | true   |  


### Post
| field  |  data_type | constraints  |
|---|---|---|
|  id |  string |  required |
| title| | String | required | unique |
| description | String | required: false |
| author | String | required |
| owner | type: Schema.Types.ObjectId | ref: "users" |
| body | type:String | required: true |
| state | type: String |  enum:['draft', 'published'] | default: 'draft' |
| readCount | type: Number | default:0 |
| readTime | type: Number |
| tags | string |
| timestamps | true |
---
## APIs
---

### Signup User

- Route: /signup
- Method: POST
- Body: 
```
{
  "email": "doe@example.com",
  "password": "Password1",
  "firstname": "jon",
  "lastname": "doe",
}
```

- Responses

Success
```
{
    message: 'Signup successful',
    user: {
        "email": "doe@example.com",
        "password": "Password1",
        "firstname": "jon",
        "lastname": "doe",
        "username": 'jon_doe",
    }
}
```
---
### Login User

- Route: /login
- Method: POST
- Body: 
```
{
  "passwordField": "Password1",
  "email": 'jon_doe@gmail.com",
}
```

- Responses

Success
```
{
    message: 'Login successful',
    token: 'sjlkafjkldsfjsd'
}
```

---
### Create Post

- Route: /posts
- Method: POST
- Header
    - Authorization: Bearer {token}
- Body: 
```
{
  "title": "Nigeria and Justice",
  "tags": "Nigeria",
  "description": "Women do not suffer the most when it comes to dealing with societal constructs, without spaeaking up",
  "body": "Nigeria should stop ostracizing men and as well stop making them feel less of a human for showing emotions. Society feels no matter what calamity might have befallen a woman, he should never shed tears, that is totally wrong. ”.",
  "author": "Wole Soinka"
}
```

- Responses

Success
```
{
  "status": true,
  "blogPost": {
    "title": "Nigeria and Justice",
    "description": "Women do not suffer the most when it comes to dealing with societal constructs, without spaeaking up",
    "author": "Wole Soinka",
    "body": "Nigeria should stop ostracizing men and as well stop making them feel less of a human for showing emotions. Society feels no matter what calamity might have befallen a woman, he should never shed tears, that is totally wrong. That must indeed be amazing to those who hold themselves, or situations in which they are involved, higher than anointed standards—and that approximates an immense proportion of the world.    
    "readCount": 0,
    "readTime": 1,
    "tags": [
      "Nigeria"
    ],
    "_id": "6360ff37a3eb884508f1620f",
    "createdAt": "2022-11-01T11:12:55.873Z",
    "updatedAt": "2022-11-01T11:12:55.873Z",
    "__v": 0
  }
}
```
---
### Get a Post

- Route: /posts/:id
- Method: GET
- Header
    - Authorization: Bearer {token}
- Responses

Success
```
{
  "status": true,
  "blogPost": {
    "_id": "6360ff37a3eb884508f1620f",
    "title": "Nigeria and Justice",
    "description": "Women do not suffer the most when it comes to dealing with societal constructs, without spaeaking up",
    "author": "Wole Soinka",
    "body": "Nigeria should stop ostracizing men and as well stop making them feel less of a human for showing emotions. Society feels no matter what calamity might have befallen a woman, he should never shed tears, that is totally wrong. 
    "state": "published",
    "readCount": 3,
    "readTime": 1,
    "tags": [
      "Nigeria"
    ],
    "createdAt": "2022-11-01T11:12:55.873Z",
    "updatedAt": "2022-11-02T01:18:20.265Z",
    "__v": 0
  }
```
---

### Get All Posts

- Route: /posts
- Method: GET
- Header:
    - Authorization: Bearer {token}
- Query params: 
    - page (default: 1)
    - per_page (default: 20)
    - order_by (default: created_at)
    - created_at,
      state = "published",
      order_by = ("read_count", "reading_time", "created_at"),
      
- Responses
created_at,
      state = "published",
      order_by = ("read_count", "reading_time", "created_at"),
      page = 1,
      per_page = 20,

...

## Contributor
- Godsent Michael





