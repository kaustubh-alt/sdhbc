from django.shortcuts import render,redirect,HttpResponse
from . import modelinteract as mi
import concurrent.futures
from django.contrib.auth import login
from .models import userdb , useraction , userfavoritedishes
from django.db import IntegrityError
from datetime import datetime
from django.contrib.auth.models import User
from django.contrib.auth import authenticate , login , logout
from django.contrib.auth.decorators import login_required
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models.functions import TruncDate

gendar = {"male":1,"female":2,"non-binary":3,}



# The dashboard code is for login and signup
# first check if request method is post or not
# second check if request is for login or signup using corresponding keyword
# for login get email and password , turn email into username and authenticate and redirect or return error 
# for signup get all field ,create name , save user into auth.user if it saved successfully the save to userdb and return to login else user already exist


def dashboard(request):
    if request.method == "POST":
        if request.POST.get("signup"):
            
            name = request.POST.get("username")
            email = request.POST.get("email")
            password = request.POST.get("password")
            lat = request.POST.get("lat")
            log = request.POST.get("long")
            gender = request.POST.get("gender")
            dob = request.POST.get("dob")
            dob =  datetime.strptime(dob, "%Y-%m-%d").date()

            newname = email.split("@")[0]+"et"+password
            inst = User(username=newname,email=email,first_name=name)
            inst.set_password(password)
            msg = ""
            color = ""

            try:
                inst.save()
                msg = "User Registered succesfully"
                color = "success"
                obj = userdb(user=inst,latitude=lat,longitude=log,
                             gender=gendar.get(gender),dob=dob,age=20)
                obj.save()
                
            except IntegrityError:
                msg = "Email Already Exist"
                color = "warning"

            finally:
                return render(request,"index.html",{"msg":msg,"color":color})
            
        elif request.POST.get('login'):
           
            email = request.POST.get("email")
            password = request.POST.get("password")
            name = email.split("@")[0]+"et"+password

            print(name , password)
            
            fl = authenticate(request,username=name,password=password)
           
            if fl is not None:
                login(request,fl)
                return redirect("/")
                            
            else:
                return render(request, 'index.html',{"msg":"invalid Credentials","color":"warning"})
        
    return render(request, 'index.html')


def process_llama_request(input_data):
    llama = mi.lamba()
    response = llama.llama7b(input_data)  # Your LLaMA processing logic
    return response


@login_required
def likes(request,fav):
    usr = request.user

    try:
        usrid = userdb.objects.filter(user=usr)
    except userdb.DoesNotExist:
        logout(request)
        redirect("login")
    except:
        redirect("login")

    usrid = list(usrid)[0]
    if fav == "favorites":
        obj = userfavoritedishes.objects.filter(userid=usrid).annotate(date_only=TruncDate('time')).values('dishname','date_only')
    elif fav == "likes":
        obj = useraction.objects.filter(userid=usrid).annotate(date_only=TruncDate('time')).values('dishname','date_only')
    elif fav == "coupons":
        return HttpResponse("Page Coming soon")
    else:
        return HttpResponse("The Page is not available, and it not valid")
    
    obj = list(obj)
    context = {"data":obj}
    
    return render(request,"recent-like.html",context)

@api_view(["POST"])
@login_required
def likedish(request):
    # if not authenticate(request.user):
    #     # logout(request)
    #     return redirect("login")
    actd = {
            "like":1,
            "dislike":0,
            "love":2,
        }

   
    if request.method == "POST" :
        dish_name = request.data.get("dish_name")
        userid = request.data.get("userid")
        action = request.data.get("action")        
        action = actd.get(action,0)
        try:
            usrinst =  userdb.objects.get(userid=userid)
        except userdb.DoesNotExist:
            logout(request)
            return redirect("login")

        if action == 2:
            loved_item = userfavoritedishes(dishname=dish_name)  # Create likedb instance without saving
            loved_item.userid = usrinst  # Set foreign key instance
            loved_item.save() 
        else:
            liked_item = useraction(dishname=dish_name, action=action)  # Create likedb instance without saving
            liked_item.userid = usrinst  # Set foreign key instance
            liked_item.save() 
        
        

        return Response({'status': 200, 'msg': 'action performed succesfullly'})
    else:
        return Response({'status': 400, 'msg': 'request using post method'})        

@login_required
def output(request):
    usr = request.user

    try:
        usrid = userdb.objects.filter(user=usr).values()
        usrid = list(usrid)[0]['userid']
    except userdb.DoesNotExist:
        logout(request)
        redirect("login")
    except:
        redirect("login")
    

    

    key = request.GET.get('key')
    js = [1]
    if key:
        with concurrent.futures.ThreadPoolExecutor() as executor:
            future = executor.submit(process_llama_request, key)
            js = future.result()
        
    context = {'username':usr,'userid':usrid,'key': key, 'data': js,'status':200}
    return render(request,'chatscreen.html' ,context)