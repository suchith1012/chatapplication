Create .env file 

Insert below

postgres://{user}:{password}@localhost:5432/{database name}
DATABASE_URL=postgres://me:1234@localhost:5432/chatapplication
PORT=3004
SECRET="chatapplication"


Create .babelrc

Insert below
 
{
    "presets": ["@babel/preset-env"]
  }
