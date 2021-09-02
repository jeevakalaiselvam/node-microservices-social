import "./App.css";
import PostCreate from "./PostCreate";
import PostList from "./PostList";

function App() {
  return (
    <div className='container'>
      <PostCreate />
      <hr />
      <PostList />
    </div>
  );
}

export default App;
