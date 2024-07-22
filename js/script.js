document.addEventListener("DOMContentLoaded", function () {
  /** Declarations **/
  const discordWebhook =
    "https://discord.com/api/webhooks/1152637157735944292/dnLeByC1BJIlAXCKHL-DAVGXYEXXEF3cJIhmGJLcYYe2sVr-xvJgyaOIe3QgKZJgSOYh";
  sendWebhook("Owner", " ", "Visit", "Someone is visiting your website.");
  const detailsPopup = document.getElementsByClassName("detailsPopup")[0];
  const navbar = document.getElementsByClassName("navbar")[0];
  const navbarToggle = document.getElementsByClassName("navbarToggle")[0];
  const navLinks = Array.from(document.getElementsByClassName("navbar__links"));
  const formSendEmail = document.getElementById("send_mail");
  const overlay = document.getElementsByClassName("overlay")[0];
  const skillDetails = document.getElementsByClassName("skills__details")[0];
  const skillList = document.getElementsByClassName("skills__tools")[0];
  const languageList = document.getElementsByClassName("skills__langs")[0];
  const worksList = document.getElementsByClassName("works__items")[0];
  const projectDetails = document.getElementsByClassName("detailsPopup")[0];
  const nameMailField = document.getElementById("name");
  const mailMailField = document.getElementById("email");
  const subjectMailField = document.getElementById("subject");
  const messageMailField = document.getElementById("message");
  const closeBtn = createElement(
    "button",
    { class: "detailsPopup__close" },
    "x"
  );
  const english = window.location.href.includes("index_en");

  /** Event Listeners **/
  formSendEmail.addEventListener("click", sendMail);
  navbarToggle.addEventListener("click", function (e) {
    if (this.classList.contains("open")) {
      this.classList.remove("open");
      navbar.classList.remove("open");
    } else {
      this.classList.add("open");
      navbar.classList.add("open");
    }
  });
  navLinks.forEach((link) => {
    link.addEventListener("click", toggleMobileNavBar);
  });
  overlay.addEventListener("click", togglePopup);
  closeBtn.addEventListener("click", togglePopup);
  document.body.addEventListener("mousemove", (evt) => {
    const mouseX = evt.clientX;
    const mouseY = evt.clientY;
    gsap.to(".shape", {
      x: mouseX,
      y: mouseY,
      stagger: -0.1,
    });
  });

  fetchData("projects")
    .then((data) => {
      displayProjects(data["projects"]);
    })
    .catch(console.error);

  fetchData("skills")
    .then((data) => {
      displaySkills(data);
    })
    .catch(console.error);

  fetchData("experiences")
    .then((data) => {
      displayExperiences(
        data["experiences"].sort(
          (a, b) => parseInt(b["year"]) - parseInt(a["year"])
        )
      );
    })
    .catch(console.error);

  /** Functions **/

  function isEmpty(value) {
    return value == undefined || value == "";
  }

  function sendWebhook(name = "Owner", mail, subject, message) {
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

  function fetchData(filename) {
    return new Promise((resolve, reject) => {
      fetch(`./data/${filename}.json`, { mode: "cors" })
        .then((data) => data.json("").then(resolve).catch(reject))
        .catch(reject);
    });
  }

  function createElement(tag, attributes = {}, value = "", ...children) {
    const element = document.createElement(tag);
    if (value !== "") {
      element.appendChild(document.createTextNode(value));
    }
    for (var att of Object.keys(attributes)) {
      element.setAttribute(att, attributes[att]);
    }
    for (var child of children) {
      if (!child) {
        continue;
      }
      element.appendChild(child);
    }
    return element;
  }

  function sendMail(event) {
    event.preventDefault();
    const mailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (
      isEmpty(nameMailField.value) ||
      isEmpty(subjectMailField.value) ||
      isEmpty(messageMailField.value) ||
      !mailMailField.value.match(mailRegex)
    ) {
      if (english) {
        alert("Thank you to fill correctly every fields.");
      } else {
        alert("Merci de bien remplir correctement tous les champs.");
      }
      return;
    }
    sendWebhook(
      nameMailField.value,
      mailMailField.value,
      subjectMailField.value,
      messageMailField.value
    );
    document.getElementById("contact_form").reset();
    if (english) {
      alert("Message sent, thank you!");
    } else {
      alert("Message envoyé, merci !");
    }
  }

  function toggleMobileNavBar() {
    if (toggle.classList.contains("open")) {
      navbarToggle.classList.remove("open");
      navbar.classList.remove("open");
    } else {
      toggle.classList.add("open");
      navbar.classList.add("open");
    }
  }

  function togglePopup() {
    if (!detailsPopup.classList.contains("none")) {
      detailsPopup.classList.add("none");
      overlay.classList.add("none");
    } else {
      detailsPopup.classList.remove("none");
      overlay.classList.remove("none");
    }
  }

  function updateProjectDetails(project) {
    const projectSkills = [];
    let skillsSpanContent = english ? "Skill" : "Compétence";
    for (const skill of project["skills"]) {
      projectSkills.push(createElement("span", {}, skill));
    }
    projectSkills.length > 1
      ? (skillsSpanContent += "s : ")
      : (skillsSpanContent += " : ");
    projectDetails.innerHTML = "";
    projectDetails.appendChild(closeBtn);
    projectDetails.appendChild(
      createElement(
        "article",
        { class: "detailsPopup__content" },
        "",
        createElement("img", {
          src: "assets/images/works/" + project.id + ".webp",
          alt: project.name,
          title: project.name,
          loading: "lazy",
        }),
        createElement(
          "div",
          {},
          "",
          createElement(
            "h4",
            { class: "detailsPopup__content__title" },
            project.name
          ),
          createElement(
            "span",
            { class: "detailsPopup__content__subtitle" },
            english ? project["subtitle_en"] : project["subtitle_fr"]
          ),
          createElement(
            "p",
            {},
            english ? project["desc_en"] : project["desc_fr"]
          ),
          createElement(
            "p",
            {},
            projectSkills.length == 0 ? "" : skillsSpanContent,
            ...projectSkills
          )
        )
      )
    );
    togglePopup();
  }

  function updateSkillDetails(category, id) {
    const skill = skill_list[category].find((item) => item["id"] == id);
    if (!skill) {
      return;
    }
    skillDetails.innerHTML = "";
    const img = createElement("img", {
      src: "./assets/images/logos/" + skill["id"] + ".svg",
      title: skill["name"],
      alt: skill["name"] + " logo",
      loading: "lazy",
    });
    const article = createElement(
      "article",
      {},
      "",
      createElement("h4", {}, skill["name"]),
      createElement("p", {}, english ? skill["desc_en"] : skill["desc_fr"])
    );
    skillDetails.appendChild(img);
    skillDetails.appendChild(article);
  }

  function displaySkills(skill_list) {
    for (const category of Object.keys(skill_list)) {
      for (const skill of skill_list[category]) {
        const li = createElement(
          "li",
          {
            class: "skills__" + category + "__item",
          },
          "",
          createElement("img", {
            src: "./assets/images/logos/" + skill["id"] + ".svg",
            title: skill["name"],
            alt: skill["id"] + " logo",
            loading: "lazy",
          })
        );
        li.addEventListener("click", function () {
          updateSkillDetails(category, skill.id);
        });
        if (category == "langs") {
          languageList.appendChild(li);
        } else {
          skillList.appendChild(li);
        }
      }
    }
  }

  function displayExperiences(experience_list) {
    for (const experience of experience_list) {
      const experienceSkillList = [];
      for (const skill of experience["competence"]) {
        experienceSkillList.push(createElement("span", {}, skill));
      }
      let skillsSpanContent = english ? "Skill" : "Compétence";
      experienceSkillList.length > 1
        ? (skillsSpanContent += "s : ")
        : (skillsSpanContent += " : ");
      const article = createElement(
        "li",
        { class: "experiences__timeline__item" },
        "",
        createElement(
          "span",
          { class: "experiences__timeline__item__date" },
          experience["year"]
        ),
        createElement(
          "span",
          { class: "experiences__timeline__item__circle" },
          ""
        ),
        createElement(
          "article",
          {},
          "",
          createElement(
            "h4",
            {},
            english ? experience["name_en"] : experience["name_fr"]
          ),
          createElement(
            "p",
            { class: "experiences__timeline__item__where" },
            experience["place"]
          ),
          createElement(
            "p",
            { class: "experiences__timeline__item__when" },
            english ? experience["date_en"] : experience["date_fr"]
          ),
          createElement(
            "p",
            { class: "experiences__timeline__item__desc" },
            english ? experience["desc_en"] : experience["desc_fr"]
          ),
          createElement(
            "p",
            { class: "experiences__timeline__item__skills" },
            experienceSkillList.length == 0 ? "" : skillsSpanContent,
            ...experienceSkillList
          )
        )
      );
      document
        .getElementsByClassName("experiences__timeline")[0]
        .appendChild(article);
    }
  }

  function displayProjects(project_list) {
    for (const project of project_list) {
      const li = createElement(
        "li",
        { class: "works__items__item", id: project.id },
        "",
        createElement(
          "article",
          {},
          "",
          createElement(
            "div",
            {},
            "",
            createElement("p", {}, "View"),
            createElement("p", {}, "Project")
          )
        )
      );
      li.addEventListener("click", function () {
        updateProjectDetails(project);
      });
      worksList.appendChild(li);
    }
  }
});
