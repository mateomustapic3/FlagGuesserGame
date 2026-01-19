$(document).ready(function () {
    let flags = [];
    let currentFlag = {};
    let score = 0;
    let questionCount = 0;
    const totalQuestions = 20;
    let maxQuestions = totalQuestions;
    let lives = 3;
    let timerInterval;
    let timeLeft = 10;
    let usedFlagNames = new Set();
    let remainingFlags = [];
    let isDataLoaded = false;
    let questionToken = 0;

    
    $("#start-button").click(function () {
        if (!isDataLoaded) {
            alert("Flag data is still loading. Please try again.");
            return;
        }
        startGame();
    });

    $.getJSON("flags.json")
        .done(function(data) {
            flags = data.flags;
            maxQuestions = Math.min(totalQuestions, flags.length);
            isDataLoaded = true;
        })
        .fail(function() {
            alert("Failed to load flag data.");
        });

    function startGame() {
        score = 0;
        lives = 3;
        questionCount = 0;
        usedFlagNames = new Set();
        remainingFlags = shuffleArray(flags.slice());
        $("#result-container").hide();
        $("#name-entry-container").hide();
        $(".quiz-container").show();
        updateLives();
        $(".quiz-container button").prop("disabled", false);
        generateQuestion();
    }

    function generateQuestion() {
        if (questionCount >= maxQuestions || lives <= 0 || remainingFlags.length === 0) {
            endQuiz();
            return;
        }

        questionCount++;
        $("#score").text(score);
        updateLives();
        $("#progress-bar").css("width", (questionCount / maxQuestions) * 100 + "%");

        currentFlag = remainingFlags.shift();
        if (currentFlag && usedFlagNames.has(currentFlag.name)) {
            const fallback = remainingFlags.find(flag => !usedFlagNames.has(flag.name));
            if (!fallback) {
                endQuiz();
                return;
            }
            currentFlag = fallback;
            remainingFlags = remainingFlags.filter(flag => flag.name !== currentFlag.name);
        }
        usedFlagNames.add(currentFlag.name);

        questionToken += 1;
        const token = questionToken;

        
        const flagImage = "flags/" + currentFlag.file;
        const img = new Image();
        img.src = flagImage;
        img.onload = function() {
            if (token !== questionToken) {
                return;
            }
            $("#flag").attr("src", flagImage).fadeIn(700);
        };
        img.onerror = function() {
            if (token !== questionToken) {
                return;
            }
            alert("Error loading flag image: " + flagImage); 
        };

        
        const otherFlags = flags.filter(flag => flag.name !== currentFlag.name);
        const randomOptions = shuffleArray(otherFlags).slice(0, 3);

        
        randomOptions.push(currentFlag);

        
        const shuffledOptions = shuffleArray(randomOptions);

        
        $("#options-container").empty();
        shuffledOptions.forEach(option => {
            const button = $("<button>")
                .text(option.name)
                .click(() => checkAnswer(option.name, button));
            $("#options-container").append(button);
        });

        $("#flag").hide().attr("src", "");

        startTimer();

        $("#next-button").hide();
        $("#message").hide();
    }

    function checkAnswer(selected, button) {
        stopTimer();

        let message = "";
        let messageClass = "";

        if (selected === currentFlag.name) {
            button.addClass("correct");
            score++;
            $("#score").text(score);
            message = "Correct!";
            messageClass = "correct";
        } else {
            button.addClass("wrong");
            lives--;
            updateLives();
            message = "Wrong! The correct answer is " + currentFlag.name;
            messageClass = "wrong";
        }

        $("#message").text(message).removeClass("correct wrong").addClass(messageClass).show();

        if (lives <= 0) {
            endQuiz();
        } else {
            $("#next-button").prop("disabled", false).show();
        }
    }

    $("#next-button").click(function () {
        $("#next-button").prop("disabled", true);
        generateQuestion();
    });

    function startTimer() {
        timeLeft = 10;
        $("#timer").text(timeLeft);

        timerInterval = setInterval(function () {
            timeLeft--;
            $("#timer").text(timeLeft);
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                $("#message").text("Time's up! The correct answer is " + currentFlag.name).addClass("wrong").show();
                lives--;
                updateLives(); 
                if (lives <= 0) {
                    endQuiz();
                } else {
                    $("#next-button").prop("disabled", false).show();
                }
            }
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timerInterval);
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function updateLives() {
        const heartsContainer = $("#lives");
        heartsContainer.empty();

        for (let i = 0; i < lives; i++) {
            heartsContainer.append('<img src="heart.png" alt="Heart" class="life-icon">');
        }
    }

    function endQuiz() {
        $("#result-container").show();
        if (lives <= 0) {
            $("#result-message").text("Game Over! You lost.");
        } else {
            $("#result-message").text("Congratulations! You completed the quiz.");
        }
    
        $("#next-button").hide();
        $("#retry-button").show();
    
        
        $(".quiz-container button").prop("disabled", true);
        $("#retry-button").prop("disabled", false);
    }


    $("#retry-button").click(function () {
        startGame();
    });
});
