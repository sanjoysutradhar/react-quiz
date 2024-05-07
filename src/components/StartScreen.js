function StartScreen({ numQuestions, dispatch }) {
  //   console.log(numQuestions);
  return (
    <div className="app">
      <h2>Welcome to the react Quiz!</h2>
      <h3>{numQuestions} question to test your react mastery</h3>
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "start" })}
      >
        Let's start
      </button>
    </div>
  );
}

export default StartScreen;
