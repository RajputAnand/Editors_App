import { FC, Fragment, useEffect } from "react";
import { IWithRouter } from "../../../Hoc/WithRouter.tsx";
import lottie from "lottie-web";
import AnimationData from "../../../Assets/Lottie/you-are-in.json";
import Typography from "../../../Components/Typography/Typography.tsx";
import Button from "../../../Components/Buttons/Button.tsx";

const YouAreInPage: FC<IWithRouter> = (props) => {
  useEffect(() => {
    if (typeof document !== "undefined") {
      const element = document.getElementById("publicLayout");
      if (element) {
        element.classList.add("!bg-white");
      } else {
        console.error("Element with ID publicLayout not found.");
      }
      if (document.getElementById("lottie")) {
        const instance = lottie.loadAnimation({
          container: document.getElementById("lottie")!,
          animationData: AnimationData,
          loop: true,
          renderer: "svg",
          autoplay: true,
          rendererSettings: {
            progressiveLoad: false,
            preserveAspectRatio: "xMaxYMax slice",
          },
        });
        return () => instance.destroy();
      }
    }
  }, []);

  const { navigate, paths } = props;

  const handleButton = () => navigate(paths.Home);

  return (
    <Fragment>
      <div
        id="lottie"
        className="fixed left-0 right-0 top-0 tablet:w-[50%] h-full mx-auto z-0"
      />
      <section className="flex-grow inline-flex items-center justify-center flex-col responsiveContainer">
        <Typography
          variant="headline"
          size="large"
          className="mb-2 text-primary-100 tablet:!text-[2.8125rem] tablet:!leading-[3.25rem] laptop:!text-[3.5625rem] laptop:!leading-[4rem] "
        >
          You are in!
        </Typography>
        <Typography
          variant="body"
          size="large"
          className="text-surface-10 text-center tablet:!text-[1.75rem] tablet:leading-[2.25rem] laptop:!text-[2rem] laptop:leading-[2.5rem]"
        >
          Registration complete, now you can check Updates from around the
          world.
        </Typography>

        <Button
          variant="outline"
          className="!border-primary !text-[1.375rem] !leading-[1.75rem] !font-normal mt-4 tablet:mt-6 z-10"
          onClick={handleButton}
        >
          Let’s go
        </Button>
      </section>
    </Fragment>
  );
};

export default YouAreInPage;
