document.addEventListener("DOMContentLoaded",function(){

    /** Listeners **/
    const discordWebhook = "https://discord.com/api/webhooks/1152637157735944292/dnLeByC1BJIlAXCKHL-DAVGXYEXXEF3cJIhmGJLcYYe2sVr-xvJgyaOIe3QgKZJgSOYh";
    const formSendEmail = document.getElementById("send_mail");


    formSendEmail.addEventListener("click",sendMail);
    sendWebhook(
        "Vigile",
        " ",
        "Visit",
        `Someone is visiting your website. ${
            document.referrer && "He cames from " + document.referrer
        }`
    );
    
    document.getElementsByClassName("navbarToggle")[0].addEventListener("click",function(e){
        var navbar = document.getElementsByClassName("navbar")[0];
        if(this.classList.contains("open")){
            this.classList.remove("open");
            navbar.classList.remove("open");
        }else{
            this.classList.add("open");
            navbar.classList.add("open");
        }
    });

    const navLinks = document.getElementsByClassName("navbar__links");
    for(var link of navLinks){
        link.addEventListener("click",toggleMobileNavBar);
    }

    document.getElementsByClassName("overlay")[0].addEventListener("click",togglePopup);

    /** Declarations **/
    const skillDetails = document.getElementsByClassName('skills__details')[0];
    const skillsList = document.getElementsByClassName('skills__tools')[0];
    const langsList = document.getElementsByClassName('skills__langs')[0];
    const worksList = document.getElementsByClassName('works__items')[0];
    const projectDetails = document.getElementsByClassName('detailsPopup')[0];
    const closeBtn = createElement('button',{class:'detailsPopup__close'},'x');
    closeBtn.addEventListener("click",togglePopup);

    const nameMailField = document.getElementById('name');
    const mailMailField = document.getElementById('email');
    const subjectMailField = document.getElementById('subject');
    const messageMailField = document.getElementById('message');

    let english = window.location.href.includes("index_en");
    let skills = [];
    let projects = [];
    let experiences = [];

    fetchData("projects")
        .then((data) => {
            projects = data;
            displayProjects();
        })
        .catch(console.error);

    fetchData("skills")
        .then((data) => {
            skills = data;
            displaySkills();
        })
        .catch(console.error);

    fetchData("experiences")
        .then((data) => {
            experiences = data;
            experiences['experiences'] = experiences['experiences'].sort((a,b) => parseInt(b['year']) - parseInt(a['year']));
            displayExperiences();
        })
        .catch(console.error);

    

    /** Functions **/

    function isEmpty(value){
        return value == undefined || value == '';
    }

    function sendMail(event){
        event.preventDefault();
        var mailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if(isEmpty(nameMailField.value) || isEmpty(subjectMailField.value) || isEmpty(messageMailField.value) || !mailMailField.value.match(mailRegex)){
            if(english){
                alert("Thank you to fill correctly every fields.");
            }else{
                alert("Merci de bien remplir correctement tous les champs.");
            }
            return;
        }
        sendWebhook(nameMailField.value, mailMailField.value, subjectMailField.value, messageMailField.value);
        document.getElementById("contact_form").reset();
        if(english){
            alert("Message sent, thank you!");
        }else{
            alert("Message envoyé, merci !");
        }
    }

    function sendWebhook(name="Vigile", mail, subject, message){
        fetch(discordWebhook, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                content: `:envelope_with_arrow: Message from: **${name}**\n> **Mail: **${mail}\n> **Subject: **${subject}\n> ${message}`,
            }),
        }).catch(console.error);
    }

    function toggleMobileNavBar(){
        var navbar = document.getElementsByClassName("navbar")[0];
        var toggle = document.getElementsByClassName("navbarToggle")[0]
        if(toggle.classList.contains("open")){
            toggle.classList.remove("open");
            navbar.classList.remove("open");
        }else{
            toggle.classList.add("open");
            navbar.classList.add("open");
        }
    }

    function togglePopup(){
        var popup = document.getElementsByClassName("detailsPopup")[0];
        var overlay = document.getElementsByClassName("overlay")[0];
        if(!popup.classList.contains("none")){
            popup.classList.add("none");
            overlay.classList.add("none")
        }else{
            popup.classList.remove("none");
            overlay.classList.remove("none");
        }
    }
    

    function fetchData(filename) {
        return new Promise((resolve, reject) => {
            fetch(`./data/${filename}.json`, { mode: "cors" })
                .then((data) => data.json('').then(resolve).catch(reject))
                .catch(reject);
        });
    }

    function updateProjectDetails(project){
        var projectSkills = [];
        var skillsSpan = (english)?'Skill':'Compétence';
        for(var skill of project['skills']){
            projectSkills.push(createElement('span',{},skill));
        }
        (projectSkills.length > 1)?skillsSpan+='s : ':skillsSpan+=' : ';

        projectDetails.innerHTML = '';
        projectDetails.appendChild(closeBtn);
        projectDetails.appendChild(createElement(
            'article',
            {class:'detailsPopup__content'},
            "",
            createElement('img',{src:'assets/images/works/'+project.id+'.webp', alt:project.name, title:project.name, loading:"lazy"}),
                createElement('div',{},
                "",
                createElement('h4', {class:"detailsPopup__content__title"}, project.name),
                createElement('span', {class:"detailsPopup__content__subtitle"}, (english)?project['subtitle_en']:project['subtitle_fr']),
                createElement('p',{},(english)?project['desc_en']:project['desc_fr']),
                createElement('p',{},(projectSkills.length == 0)?'':skillsSpan, ...projectSkills)
            )
        ));
        togglePopup();
    }

    function updateSkillDetails(category,id){
        var elt;
        for(var item of skills[category]){
            if(item['id'] == id){
                elt = item;
                break;
            }
        }
        skillDetails.innerHTML = '';
        var img = createElement(
            'img',
            {
                src:'./assets/images/logos/'+elt['id']+'.svg',
                title:elt['name'],
                alt:elt['name']+' logo',
                loading:"lazy"
            }
        );
        var article = createElement(
            'article',
            {},
            "",
            createElement("h4",{},elt['name']),
            createElement("p",{},(english)?elt['desc_en']:elt['desc_fr'])
        )
        skillDetails.appendChild(img);
        skillDetails.appendChild(article);
    }

    function displaySkills(){
        for(let category of Object.keys(skills)){
            for(let item of skills[category]){
                let li = createElement(
                    'li',
                    {
                        class:'skills__'+category+'__item',
                    },
                    "",
                    createElement(
                        'img',
                        {
                            src:'./assets/images/logos/'+item['id']+'.svg',
                            title: item['name'],
                            alt: item['id']+' logo',
                            loading:"lazy"
                        }
                    )
                );
                (function(category, item){
                    li.addEventListener("click", function() {
                        updateSkillDetails(category,item.id);
                    });
                  })(category, item);
                if(category == 'langs'){
                    langsList.appendChild(li);
                }else{
                    skillsList.appendChild(li);
                }
            }
        }
    }

    function displayExperiences(){
        for(var exp of experiences['experiences']){
            var expSkills = [];
            for(var skill of exp['competence']){
                expSkills.push(createElement('span',{},skill));
            }
            var skillsSpan = (english)?'Skill':'Compétence';
            (expSkills.length > 1)?skillsSpan+='s : ':skillsSpan+=' : ';
            var article = createElement(
                'li',
                {"class":"experiences__timeline__item"},
                '',
                createElement(
                    'span',
                    {class:'experiences__timeline__item__date'},
                    exp['year']
                ),
                createElement(
                    'span',
                    {class:'experiences__timeline__item__circle'},
                    ''
                ),
                createElement(
                    'article',
                    {},
                    "",
                    createElement('h4', {}, (english)?exp['name_en']:exp['name_fr']),
                    createElement('p', {class:'experiences__timeline__item__where'}, exp['place']),
                    createElement('p', {class:'experiences__timeline__item__when'}, (english)?exp['date_en']:exp['date_fr']),
                    createElement('p', {class:'experiences__timeline__item__desc'}, (english)?exp['desc_en']:exp['desc_fr']),
                    createElement('p',{class:'experiences__timeline__item__skills'},(expSkills.length == 0)?'':skillsSpan, ...expSkills)
                )
            );
            document.getElementsByClassName('experiences__timeline')[0].appendChild(article);
        }
    }

    function displayProjects(){
        for(var project of projects['projects']){
            var li = createElement(
                'li',
                {class:'works__items__item', id:project.id},
                "",
                createElement(
                    'article',
                    {},
                    "",
                    createElement(
                        'div', 
                        {},
                        "",
                        createElement('p', {}, 'View'),
                        createElement('p', {}, 'Project')
                    ),
                )
            );
            (function(project){
                li.addEventListener("click", function() {
                    updateProjectDetails(project);
                });
              })(project);
            worksList.appendChild(li);
        }
    }

    function createElement(tag, attributes={}, value = '', ...children){
        var elt = document.createElement(tag);
        if(value !== ''){
            elt.appendChild(document.createTextNode(value));
        }
        for(var att of Object.keys(attributes)){
            elt.setAttribute(att,attributes[att]);
        }
        for(var child of children){
            if(!child){
                continue;
            }
            elt.appendChild(child)
        }
        return elt;
    }

});