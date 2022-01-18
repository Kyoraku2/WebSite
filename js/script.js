document.addEventListener("DOMContentLoaded",function(){

    document.getElementById("send_mail").addEventListener("click",function(e){
        /*var name = document.getElementById("name");
        var email = document.getElementById("email");
        var subject = document.getElementById("subject");
        var message = document.getElementById("message");

        if(isEmpty(name.value) || isEmpty(email.value) || isEmpty(subject.value) || isEmpty(message.value)){
            alert("Merci de bien remplir tous les champs.");
            return;
        }
        if(!isMail(email.value)){
            alert("Merci de saisir une adresse mail valide.");
            return;
        }
        sendEmail(name.value,email.value,subject.value,message.value);
        name.value='';
        email.value='';
        subject.value='';
        message.value='';*/
    });


    function isEmpty(value){
        return value == undefined || value == '';
    }

    function isMail(value){
        if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)){
            return true;
        }
        return false;
    }

    function sendEmail(name, email, subject, message){

    }
});