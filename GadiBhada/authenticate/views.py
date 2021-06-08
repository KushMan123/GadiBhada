from django.shortcuts import redirect, render
from django.contrib.auth.models import User, auth
from authenticate.models import Person


# Create your views here.
def index(request):
    if request.method == 'POST':
        username= request.POST['username']
        name= request.POST['name']
        email = request.POST['email']
        password1 = request.POST['pass']
        password2 = request.POST['re_pass']

        user= User.objects.create_user(name=name, password= password1, email= email, username=username)
        user.save()
        print('info saved')
        return redirect('/login')

    else:
        return render(request, 'index.html')

def loginPage(request):
    return render(request, 'login.html')