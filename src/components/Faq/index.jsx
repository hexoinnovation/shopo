import Accodion from "../Helpers/Accodion";
import InputCom from "../Helpers/InputCom";
import PageTitle from "../Helpers/PageTitle";
import Layout from "../Partials/Layout";

export default function Faq() {
  return (
    <Layout childrenClasses="pt-0 pb-0">
      <div className="faq-page-wrapper w-full mb-10">
        <div className="page-title w-full">
          <PageTitle
            title="Frequently Asked Questions"
            breadcrumb={[
              { name: "home", path: "/" },
              { name: "FAQ", path: "/faq" },
            ]}
          />
        </div>
      </div>
      <div className="contact-wrapper w-full mb-10">
        <div className="container-x mx-auto">
          <div className="main-wrapper w-full lg:flex lg:space-x-[30px]">
            <div className="lg:w-1/2 w-full mb-10 lg:mb-0">
              <h1 className="text-qblack font-bold text-[22px] mb-4">
                Frequently asked questions
              </h1>
              <div className="flex flex-col space-y-7 justify-between">
                <Accodion
                  title="01. What types of mobile apps do you develop?"
                  des="We develop a wide range of mobile apps, including native apps for iOS and Android, cross-platform apps using frameworks like Flutter and React Native, and progressive web apps (PWAs). Whether you need a consumer-facing app, an enterprise solution, or a specialized tool, we have the expertise to bring your vision to life."
                />
                <Accodion
                  init
                  title="02. How do you ensure the app meets our specific requirements?"
                  des="We start every project with a detailed discovery phase where we gather your requirements, understand your goals, and define the app’s functionality. Our team then creates wireframes and prototypes to visualize the app’s design and features. We work closely with you throughout the process, incorporating your feedback to ensure the final product aligns perfectly with your needs."
                />
                <Accodion
                  title="03. What platforms do you support for mobile app development?"
                  des="We support development for both iOS and Android platforms, as well as cross-platform development that allows your app to run seamlessly on multiple devices. Our developers are skilled in the latest tools and technologies to deliver high-quality apps tailored to your target audience."
                />
                <Accodion
                  title="04. How do you handle app design and user experience (UX)?"
                  des="User experience is a top priority in our mobile app development process. Our designers create intuitive, user-friendly interfaces that are both visually appealing and easy to navigate. We conduct user testing and gather feedback to refine the design and ensure a seamless and enjoyable user experience."
                />
                <Accodion
                  title="05. Can you integrate the app with our existing systems or third-party services? "
                  des="Yes, we specialize in integrating mobile apps with existing systems, databases, and third-party services. Whether you need integration with payment gateways, social media platforms, CRM systems, or custom APIs, we ensure smooth and secure connectivity to enhance the app’s functionality."
                />
              </div>
            </div>
            <div className="flex-1">
              <div className="bg-white sm:p-10 p-5">
                <div className="title flex flex-col items-center">
                  <h1 className="lg:text-[34px] text-xl font-bold text-qblack">
                    Have Any Qustion
                  </h1>
                  <span className="-mt-5 block">
                    <svg
                      width="354"
                      height="30"
                      viewBox="0 0 354 30"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1 28.8027C17.6508 20.3626 63.9476 8.17089 113.509 17.8802C166.729 28.3062 341.329 42.704 353 1"
                        stroke="#FFBB38"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </div>
                <div className="inputs mt-5">
                  <div className="mb-4">
                    <InputCom
                      label="Frist Name*"
                      placeholder="Demo Name"
                      name="first_name"
                      inputClasses="h-[50px]"
                    />
                  </div>
                  <div className="mb-4">
                    <InputCom
                      label="Email Address*"
                      placeholder="info@quomodosoft.com"
                      name="email"
                      inputClasses="h-[50px]"
                    />
                  </div>
                  <div className="mb-5">
                    <h6 className="input-label text-qgray capitalize text-[13px] font-normal block mb-2 ">
                      Message*
                    </h6>
                    <textarea
                      placeholder="Type your message here"
                      className="w-full h-[105px] focus:ring-0 focus:outline-none p-3 border border-qgray-border placeholder:text-sm"
                    ></textarea>
                  </div>
                  <div>
                    <a href="#">
                      <div className="black-btn text-sm font-semibold w-full h-[50px] flex justify-center items-center">
                        <span>Send Now</span>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
