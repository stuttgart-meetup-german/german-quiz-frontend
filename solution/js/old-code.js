const temp = `<header class="german-quiz__header">
    <div class="quiz__meta">
    </div>
    <div class="quiz__settings">
        <div class="setting--language">
        <span class="language--chosen">Deutsch</span>
        <ul class="languages">
            <li class="language language--german" data-language="DE">Deutsch</li>
            <li class="language language--english" data-language="EN">English</li>
        </ul>
        </div>
    </div>
</header>`;

/**
 * Callback for the choose language event
 * @param {*} e 
 */
const onLanguageChosen = (e) => {
    _activeLanguageCode = e.currentTarget.dataset.language;
    const language = e.currentTarget.innerText;
  
    const languageChosen = document.querySelector(".language--chosen");
    languageChosen.innerText = language;
  }


  const renderInitialPage = () => {
    const quizMain = document.querySelector(".german-quiz__main");
    quizMain.innerHTML = `<div class="quiz__intro">
        <div class="hero-text">
          <h1 class="intro__text">Willkommen beim</h1>
          <h1 class="intro__text intro__text--bold">Deutsch-Quiz!</h1>
        </div>
        <p class="intro__instructions">Wähle ein Niveau, um zu beginnen</p>
      </div>
      <ul class="quiz__topics">
        ${_quizData.map((quiz, i) => {
          return `
            <li class="quiz__topic quiz__topic--${quiz.title.toLowerCase()}" data-topic-id="${quiz.title}">
              <span class="topic__icon"></span>
              <span class="topic__text">${quiz.title}</span>
            </li>
          `;
        }).join('')}
      </ul>`;
    const quizTopicsLi = quizMain.querySelectorAll('.quiz__topic');
    quizTopicsLi.forEach(quizTopic => {
      quizTopic.addEventListener("click", onQuizTopicClick);
    });
  
    const languageSetting = document.querySelector(".setting--language");
    languageSetting.addEventListener("click", onLanguageSettingClick);
  
    const languages = languageSetting.querySelectorAll(".language");
    languages.forEach(language => {
      language.addEventListener("click", onLanguageChosen);
    })
  }

  /**
 * Callback for the choose language click event
 * It shows/hides the language menu
 * @param {*} e 
 */
const onLanguageSettingClick = (e) => {
    const languageSetting = e.currentTarget;
    languageSetting.classList.toggle("setting--active");
  }