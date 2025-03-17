/* CONSTANTS */
const ADVANCED = "advanced";
const BEGINNER = "beginner";

let _quizData = null;
let _chosenQuizId = ''; // ID of the chosen quiz
let _chosenQuizData = null; // Object containing the data for the chosen quiz
let _questionCounter = 0; // Counter for the current question
let _isAnswerSubmitted = false; // Boolean if the user chose an answer
let _answerId = -1; // ID of the chosen answer
let _correctAnswersCounter = 0;
let _activeLanguageCode = null;
let _isInitPageActive = false; // Boolean flag if initial page should be shown
let _isQuestionsPageActive = false; // Boolean flag if questions page should be shown
let _isResultsPageActive = false; // Boolean flag if results page should be shown
let _isEmailSubmitted = false; // Boolean flag if email to get the results is submitted

// 🔹 New variable to store user answers
let _userAnswers = []; 

/**
 * Click callback, where the quiz topic is chosen
 */
const onQuizTopicClick = (e) => {
  _chosenQuizId = e.currentTarget.dataset.topicId;
  _chosenQuizData = _quizData.find(quiz => quiz.title === _chosenQuizId);
  _isQuestionsPageActive = true;
  render();
};

/**
 * Callback for when an answer is chosen
 */
const onAnswerChosen = (e) => {
  _answerId = parseInt(e.currentTarget.dataset.answerId);
  _isQuestionsPageActive = true;
  render();
};

/**
 * Returns the correct status of the answer
 * @param {Number} currentAnswerId: Numerical id of the answer 
 * @returns 
 */
const getAnswerStatus = (currentAnswerId) => {
  if(_answerId < 0){
    return "";
  }
  
  const chosenAnswer = _chosenQuizData.questions[_questionCounter].options[currentAnswerId].id;
  const correctAnswer = _chosenQuizData.questions[_questionCounter].answer;
  
  const isAnswerCorrect = chosenAnswer === correctAnswer;
  const isAnswerChosen = _answerId === currentAnswerId;


  if(isAnswerCorrect && isAnswerChosen){
    _correctAnswersCounter++;
    return "quiz__answer--correct";
  }else if(!isAnswerCorrect && isAnswerChosen){
    return "quiz__answer--wrong";
  }else if(isAnswerCorrect && !isAnswerChosen){
    return "quiz__answer--is-correct";
  }else{
    return "";
  }
}

/**
 * Renders the current question
 * 
 */
const renderQuestionsPage = () => {
  const quizMeta = document.querySelector(".quiz__meta");
  const isAdvanced = _chosenQuizId.toLowerCase() === ADVANCED;
  const icon = isAdvanced ? 'school' : 'eco';
  quizMeta.innerHTML = `
    <span class="topic__icon material-icons topic__icon--${_chosenQuizId.toLowerCase()}">${icon}</span>
    <h3 class="quiz__result-title">${_chosenQuizData.title}</h3>
    `
  
  const quizMain = document.querySelector(".german-quiz__main");
  quizMain.innerHTML = `
      <div class="quiz__question">
          <h4 class="question__counter">
            Question
            <span class="question__number">${_questionCounter + 1}</span>
            of
            <span class="question__total">${_chosenQuizData.questions.length}</span>
          </h4>
          <p class="question__text">
            ${_chosenQuizData.questions[_questionCounter].question}
          </p>
          <div class="progress">
            <div class="progress__percentage"></div>
          </div>
        </div>

        <div class="quiz__answers-container">
          <ul class="quiz__answers">
            ${_chosenQuizData.questions[_questionCounter].options.map((option, index) => {
              /*
              if(_isAnswerSubmitted){
                getAnswerStatus(index);
              }
              */

              return `
                <li class="quiz__answer quiz__answer--${index}  
                ${index === _answerId ? "quiz__answer--chosen" : ""}"
                data-answer-id = "${index}">
                  <span class="quiz-answer__icon">${index}</span>
                  <span class="quiz-answer__text">${option.text}</span>
                </li>
              `
            }).join('')}
          </ul>
          

          <button class="btn btn--submit-answer">Submit Answer</button>
          

            

         
              
          ${_isAnswerSubmitted 
            ? (_answerId < 0 
                ? `<p class="error--select-an-answer">
                     <span class="icon--error"></span>
                     Please select an answer
                   </p>` 
                : ``) 
            : ``}
          </div>`;

          // TODO move the error--select-an-answer to the first isAnswerSubmitted
    
          if(!_isAnswerSubmitted || _answerId < 0){
            const answers = quizMain.querySelectorAll(".quiz__answer");
            answers.forEach(answer => {
              answer.addEventListener("click", onAnswerChosen);
            });
          }

    const progress = quizMain.querySelector(".progress__percentage");
    const progressPercentage = (_questionCounter/_chosenQuizData.questions.length)*100;
    progress.style.width = `${progressPercentage}%`;

    const btnSubmitAnswer = quizMain.querySelector(".btn--submit-answer");
    if(btnSubmitAnswer){
      btnSubmitAnswer.addEventListener("click", onSubmitAnswer2);
    }

    /*
    const btnNextQuestion = quizMain.querySelector(".btn--next-question");
    if(btnNextQuestion){
      btnNextQuestion.addEventListener("click", onNextQuestion);
    }
    */
}


/**
 * Renders the initial page
 * 
 */
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
        const isAdvanced = quiz.title.toLowerCase() === ADVANCED;
        const icon = isAdvanced ? 'school' : 'eco';
        const quizClass = isAdvanced ? ADVANCED : BEGINNER;
        return `
          <li class="quiz__topic quiz__topic--${quiz.title.toLowerCase()}" data-topic-id="${quiz.title}">
            <span class="topic__icon material-icons topic__icon--${quizClass}">${icon}</span>
            <span class="topic__text">${quiz.title}</span>
          </li>
        `;
    }).join('')}
  </ul>`
  
  const quizTopicsLi = quizMain.querySelectorAll('.quiz__topic');
  quizTopicsLi.forEach(quizTopic => {
    quizTopic.addEventListener("click", onQuizTopicClick);
  });
}

/**
 * Callback for the submit answer button
 */


const onSubmitAnswer2 = (e) => {
  _isAnswerSubmitted = true;
  _isQuestionsPageActive = true;


  // Error no answer chosen
  if(_answerId < 0){
    render();
    return;
  }


  // 🔹 Store user's answer
  
  if(_answerId >= 0){
    const currentQuestion = _chosenQuizData.questions[_questionCounter];
    _userAnswers.push({
      "question-id": currentQuestion.id,
      "answer-id": currentQuestion.options[_answerId].id
    });

    _answerId = -1;
    _isAnswerSubmitted = false;
    _questionCounter++;
    if (_questionCounter >= _chosenQuizData.questions.length) {
      _isQuestionsPageActive = false;
      _isResultsPageActive = true;
    }

    render()
  }


 
}


/*
const onSubmitAnswer = (e) => {
  _isAnswerSubmitted = true;
  _isQuestionsPageActive = true;
  // 🔹 Store user's answer
  const currentQuestion = _chosenQuizData.questions[_questionCounter];

  if(_answerId >= 0){
    _userAnswers.push({
      "question-id": currentQuestion.id,
      "answer-id": currentQuestion.options[_answerId].id
    });
  }


  render();
  _isAnswerSubmitted = false;
};
*/

/**
 * Callback for the next question button
 */
const onNextQuestion = (e) => {
  _isAnswerSubmitted = false;
  _answerId = -1;
  _questionCounter++;

  if (_questionCounter >= _chosenQuizData.questions.length) {
    _isResultsPageActive = true;
    render();
    return;
  }

  _isQuestionsPageActive = true;
  render();
};



/**
 * Sends user data to the backend
 */
const onGetResults = async (e) => {
  // Collect form data
  const userEmail = document.querySelector(".user-data__email").value.trim();
  const emailError = document.querySelector(".error--email");
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!userEmail || !emailRegex.test(userEmail)) {
    e.preventDefault();
    emailError.classList.add("error--email--active");
    return;
  }

  emailError.classList.remove("error--email--active");

  // 🔹 Construct JSON payload
  const payload = {
    "quiz-id": _chosenQuizId.toLowerCase() === ADVANCED ? 1 : 0,
    "user": {
      "name": "Sotiris",
      "email": userEmail
    },
    "answers": _userAnswers
  };

  try {
    // Send POST request
    const response = await fetch('https://7xhxexjtvb.execute-api.eu-central-1.amazonaws.com/default/quizResults', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      const responseData = await response.json();
      alert(responseData.message); // Show success message
      _isEmailSubmitted = true;
      _isResultsPageActive = true;
      render();
    } else {
      const errorData = await response.json();
      alert(`Error: ${errorData.error}`); // Show error message
    }
  } catch (error) {
    console.error('Error sending data:', error);
    alert('An unexpected error occurred. Please try again.');
  }
};

/**
 * Renders the result page
 */
const renderResultsPage = () => {
  const isAdvanced = _chosenQuizId.toLowerCase() === ADVANCED;
  const icon = isAdvanced ? 'school' : 'eco';
  const quizMain = document.querySelector(".german-quiz__main");
  quizMain.innerHTML = `
        <div class="quiz__intro">
          <div class="hero-text">
            <h1 class="intro__text"> Quiz completed</h1>
            <h1 class="intro__text intro__text--bold">You scored...</h1>
          </div>
        </div>

        <div class="quiz__results-container">
          <div class="quiz__results">
            <header class="quiz__meta">
              <span class="topic__icon material-icons topic__icon--${_chosenQuizData.title.toLowerCase()}">${icon}</span>
              <h3 class="quiz__result-title">${_chosenQuizData.title}</h3>
            </header>
            <p class="quiz__result">
              <span class="result__counter">?</span>
              out of <span class="result__questions-amount">${_chosenQuizData.questions.length}</span>
            </p>

            <div class="quiz__result-email">
              <p class="quiz__result-text">Ready to see your results?</p>
              <p class="quiz__result-explanation">
                Enter your email to get a detailed report with your results
                together with an explanation of your errors.
              </p>
              <div class="user-data">
                <input class="user-data__email" type="email" placeholder="Email Address"/>
                <button class="btn btn--get-results"> Get results </button>
                <p class="error--email">Please provide a valid email</p>
              </div>
            </div>
          </div>
          ${_isEmailSubmitted
            ?  `<button class="btn btn--play-again">Play again</button>` 
            : ``}
        </div>
  `;

  const btnPlayAgain = quizMain.querySelector(".btn--play-again");
  if (btnPlayAgain) {
    btnPlayAgain.addEventListener("click", onPlayAgain);
  }

  const btnGetResults = quizMain.querySelector(".btn--get-results");
  if (btnGetResults) {
    btnGetResults.addEventListener("click", onGetResults);
  }
};

/**
 * Render function
 */
const render = () => {
  if(_isInitPageActive){
    renderInitialPage();
    _isInitPageActive = false;
    return;
  }

  if(_isQuestionsPageActive){
    renderQuestionsPage();
    _isQuestionsPageActive = false;
    return;
  }

  if(_isResultsPageActive){
    renderResultsPage();
    _isResultsPageActive = false;
    return;
  }
}

/**
 * Starts a new game
 */
const onPlayAgain = (e) => {
  _questionCounter = 0;
  _isAnswerSubmitted = false;
  _answerId = -1;
  _correctAnswersCounter = 0;
  _userAnswers = []; // Reset answers
  _isResultsPageActive = false;
  _isInitPageActive = true;
  render();
};

/**
 * Fetch quiz data and initialize the quiz
 */
fetch('./js/data.json')
.then(response => response.json())
.then(data => {
  _quizData = data.quizzes;
  _isInitPageActive = true;
  render();
})
.catch(error => {
  console.error('Error fetching the JSON file');
});
