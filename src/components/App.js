// import DateCounter from "./DateCounter";
import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import FinishScreen from "./FinishScreen";
import NextButton from "./NextButton";
import Progress from "./Progress";
import Footer from "./Footer";
import Timer from "./Timer";
import { useQuiz } from "../contexts/QuizContext";

export default function App() {
  // console.log(questions);
  const { status } = useQuiz();
  return (
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <>
            {/* <p>1/15</p>
            <p>Questions?</p> */}
            <StartScreen
            // numQuestions={numQuestions}
            // dispatch={dispatch}
            // secondRemaining={secondRemaining}
            />
          </>
        )}
        {status === "active" && (
          <>
            <Progress
            // index={index}
            // numQuestions={numQuestions}
            // points={points}
            // maxPossiblePoints={maxPossiblePoints}
            // answer={answer}
            />
            <Question
            // question={questions[index]}
            // dispatch={dispatch}
            // answer={answer}
            />
            <Footer>
              <Timer
              // dispatch={dispatch} secondRemaining={secondRemaining}
              />
              <NextButton
              // dispatch={dispatch}
              // answer={answer}
              // index={index}
              // numQuestions={numQuestions}
              />
            </Footer>
          </>
        )}
        {status === "finished" && (
          <FinishScreen
          // points={points}
          // maxPossiblePoints={maxPossiblePoints}
          // highscore={highscore}
          // dispatch={dispatch}
          />
        )}
      </Main>
      {/* <DateCounter /> */}
    </div>
  );
}
