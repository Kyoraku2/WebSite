document.addEventListener("DOMContentLoaded",function(){
    const discordWH ="https://discord.com/api/webhooks/933052117315379230/uWWOa4VcuYum0RXo_E21GgwA8ljpjSGfbp21CXhw3FKquvnjG6nwxnCLo84aHj4HzSbM";
    let skills;
    fetch("./data/skills.json")
    .then(response => {
       return response.json();
    })
    .then(jsondata => skills = jsondata);

    document.getElementById("send_mail").addEventListener("click",function(e){
        var name = document.getElementById("name");
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
        sendWebHook(name.value,email.value,subject.value,message.value);
        name.value='';
        email.value='';
        subject.value='';
        message.value='';
    });

    document.getElementById("skills").addEventListener('click',function(e){
        if(e.target.tagName != "IMG"){
            return;
        }
        alert(skills[e.target.alt])
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

    function sendWebHook(name, email, subject, message){
        fetch(discordWH, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            username:name,
            body: JSON.stringify({content: 'Nom :'+name+'\nMail :'+email+'\nSujet :'+subject+'\n\n'+message,}),
        }).catch(console.error);
    }
});