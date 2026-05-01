import HeroSecImg from "../MainShowCompts/HeroSecImg";
import CardsImg from "../MainShowCompts/CardsImg";
import ServicesSec from "../MainShowCompts/ServicesSec";
import Testimonials from "../MainShowCompts/Testimonial";
function Home(){
  return(
    <>
    <HeroSecImg/>
    <CardsImg/>
    <ServicesSec/>
    <div className="bg-gray-300 h-0.5 mt-30 z-0"></div>
    <Testimonials/>
    </>
  );
}

export default Home;