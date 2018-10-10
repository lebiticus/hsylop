RESTFUL ROUTES

name      url      verb    desc.
===============================================
INDEX   /dogs      GET   Display a list of all dogs
NEW     /dogs/new  GET   Displays form to make a new dog
CREATE  /dogs      POST  Add new dog to DB
SHOW    /dogs/:id  GET   Shows info about one dog

INDEX   /posts
NEW     /posts/new
CREATE  /posts
SHOW    /posts/:id

NEW     posts/:id/comments/new    GET
CREATE  posts/:id/comments        POST