# csci49900-backend-repo
To run, navigate to tradebreath1 directory in console and enter the following:  
  
python manage.py runserver  
  
Afterwards, navigate to the following in a web browser:  
  
http://127.0.0.1:8000/tbapp/?  
  
Add the following parameters to the above link to get bar data and stock news for inputted parameters, each separated by a & character:  
  
stock=[STOCK_NAME]  
start_date=[YYYY-MM-DD]  
end_date=[YYYY-MM-DD]  
interval=[Day/Minute/Hour]  
  
To deploy online, use Heroku Git. Log in to your Heroku account:  
  
$ heroku login  

Initialize a git repository in a new or existing directory  

$ cd my-project/  
$ git init  
$ heroku git:remote -a [APP_NAME]    
  
Deploy your application. Commit your code to the repository and deploy it to Heroku using Git.  
  
$ git add .  
$ git commit -am "make it better"  
$ git push heroku master  
  
Disable collect static if compilation fails
