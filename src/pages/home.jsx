import Posts from "../components/Posts";
import Share from "../components/Share";

const Home = () => {
  return (
    <div className="place-items-center">
      <Share />
      <Posts component={(props) => <Posts userId={props.match?.params?.userId} />} />
    </div>
  );
};

export default Home;
